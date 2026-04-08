using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using RosraApp.Data;
using RosraApp.Models;
using RosraApp.Models.Enums;

namespace RosraApp.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody,
            NotificationType type, string? relatedEntityType = null, string? relatedEntityId = null);

        void SendEmailInBackground(string toEmail, string toName, string subject, string htmlBody,
            NotificationType type, string? relatedEntityType = null, string? relatedEntityId = null);

        Task<(bool Success, string Message)> SendTestEmailAsync(string toEmail, string adminName);
        Task<EmailSettings?> GetSettingsAsync();
        Task SaveSettingsAsync(EmailSettings settings);
        bool IsNotificationEnabled(EmailSettings settings, NotificationType type);
        string EncryptPassword(string plainText);
        string DecryptPassword(string encrypted);
    }

    public class EmailService : IEmailService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IDataProtector _protector;

        public EmailService(
            ApplicationDbContext context,
            IConfiguration config,
            ILogger<EmailService> logger,
            IServiceScopeFactory scopeFactory,
            IDataProtectionProvider dataProtectionProvider)
        {
            _context = context;
            _config = config;
            _logger = logger;
            _scopeFactory = scopeFactory;
            _protector = dataProtectionProvider.CreateProtector("RosraApp.SmtpCredentials");
        }

        public string EncryptPassword(string plainText)
        {
            if (string.IsNullOrEmpty(plainText)) return plainText;
            try { return _protector.Protect(plainText); } catch { return plainText; }
        }

        public string DecryptPassword(string encrypted)
        {
            if (string.IsNullOrEmpty(encrypted)) return encrypted;
            try { return _protector.Unprotect(encrypted); } catch { return encrypted; /* fallback: treat as plaintext */ }
        }

        public async Task<EmailSettings?> GetSettingsAsync()
        {
            return await _context.EmailSettings.FirstOrDefaultAsync();
        }

        public async Task SaveSettingsAsync(EmailSettings settings)
        {
            settings.UpdatedAt = DateTime.UtcNow;
            _context.EmailSettings.Update(settings);
            await _context.SaveChangesAsync();
        }

        public bool IsNotificationEnabled(EmailSettings settings, NotificationType type)
        {
            if (!settings.IsEnabled) return false;
            return type switch
            {
                NotificationType.ReportSubmitted => settings.EnableReportSubmitted,
                NotificationType.ReportClaimed => settings.EnableReportClaimed,
                NotificationType.ReportValidated => settings.EnableReportValidated,
                NotificationType.ReportRejected => settings.EnableReportRejected,
                NotificationType.ReportUnlocked => settings.EnableReportUnlocked,
                NotificationType.WelcomeEmail => settings.EnableWelcomeEmail,
                NotificationType.TestEmail => true, // always allow test
                _ => false
            };
        }

        /// <summary>
        /// Resolve SMTP config with priority: ENV vars > appsettings > DB settings
        /// </summary>
        private (string Server, int Port, string? Username, string? Password, bool UseSsl, string SenderEmail, string SenderName) ResolveSmtpConfig(EmailSettings? dbSettings)
        {
            var server = Environment.GetEnvironmentVariable("SMTP_SERVER")
                ?? _config["EmailSettings:SmtpServer"]
                ?? dbSettings?.SmtpServer ?? "smtp.gmail.com";

            var portStr = Environment.GetEnvironmentVariable("SMTP_PORT")
                ?? _config["EmailSettings:SmtpPort"];
            var port = int.TryParse(portStr, out var p) ? p : dbSettings?.SmtpPort ?? 587;

            var username = Environment.GetEnvironmentVariable("SMTP_USERNAME")
                ?? _config["EmailSettings:SmtpUsername"]
                ?? dbSettings?.SmtpUsername;

            var password = Environment.GetEnvironmentVariable("SMTP_PASSWORD")
                ?? _config["EmailSettings:SmtpPassword"]
                ?? (dbSettings?.SmtpPassword != null ? DecryptPassword(dbSettings.SmtpPassword) : null);

            var sslStr = Environment.GetEnvironmentVariable("SMTP_USE_SSL");
            var useSsl = sslStr != null ? bool.TryParse(sslStr, out var ssl) && ssl : dbSettings?.UseSsl ?? true;

            var senderEmail = Environment.GetEnvironmentVariable("SMTP_SENDER_EMAIL")
                ?? _config["EmailSettings:SenderEmail"]
                ?? dbSettings?.SenderEmail ?? "noreply@rosra.org";

            var senderName = dbSettings?.SenderDisplayName ?? "ROSRA UN-Habitat";

            return (server, port, username, password, useSsl, senderEmail, senderName);
        }

        public async Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody,
            NotificationType type, string? relatedEntityType = null, string? relatedEntityId = null)
        {
            var dbSettings = await GetSettingsAsync();
            var smtp = ResolveSmtpConfig(dbSettings);

            // Create email log entry
            var log = new EmailLog
            {
                ToEmail = toEmail,
                ToName = toName,
                Subject = subject,
                NotificationType = (int)type,
                Status = "Pending",
                RelatedEntityType = relatedEntityType,
                RelatedEntityId = relatedEntityId
            };
            _context.EmailLogs.Add(log);
            await _context.SaveChangesAsync();

            var maxRetries = dbSettings?.MaxRetries ?? 3;
            var retryDelay = dbSettings?.RetryDelaySeconds ?? 30;

            for (int attempt = 0; attempt <= maxRetries; attempt++)
            {
                try
                {
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress(smtp.SenderName, smtp.SenderEmail));
                    message.To.Add(new MailboxAddress(toName ?? toEmail, toEmail));
                    message.Subject = subject;
                    message.Body = new TextPart("html") { Text = htmlBody };

                    using var client = new SmtpClient();

                    var secureOption = smtp.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto;
                    await client.ConnectAsync(smtp.Server, smtp.Port, secureOption);

                    if (!string.IsNullOrEmpty(smtp.Username) && !string.IsNullOrEmpty(smtp.Password))
                    {
                        await client.AuthenticateAsync(smtp.Username, smtp.Password);
                    }

                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);

                    // Update log to sent
                    log.Status = "Sent";
                    log.SentAt = DateTime.UtcNow;
                    log.RetryCount = attempt;
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Email sent to {Email}: {Subject}", toEmail, subject);
                    return;
                }
                catch (Exception ex)
                {
                    log.RetryCount = attempt;
                    log.ErrorMessage = ex.Message;

                    if (attempt < maxRetries)
                    {
                        _logger.LogWarning("Email send attempt {Attempt} failed for {Email}: {Error}. Retrying in {Delay}s",
                            attempt + 1, toEmail, ex.Message, retryDelay);
                        await Task.Delay(TimeSpan.FromSeconds(retryDelay));
                    }
                    else
                    {
                        log.Status = "Failed";
                        _logger.LogError(ex, "Email permanently failed for {Email} after {Attempts} attempts", toEmail, maxRetries + 1);
                    }
                    await _context.SaveChangesAsync();
                }
            }
        }

        /// <summary>
        /// Fire-and-forget email send. Uses a new DI scope so the request can complete.
        /// </summary>
        public void SendEmailInBackground(string toEmail, string toName, string subject, string htmlBody,
            NotificationType type, string? relatedEntityType = null, string? relatedEntityId = null)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                    await emailService.SendEmailAsync(toEmail, toName, subject, htmlBody, type, relatedEntityType, relatedEntityId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Background email send failed for {Email}", toEmail);
                }
            });
        }

        public async Task<(bool Success, string Message)> SendTestEmailAsync(string toEmail, string adminName)
        {
            try
            {
                var html = EmailTemplateService.TestEmail(adminName);
                await SendEmailAsync(toEmail, adminName, "ROSRA Email Test", html, NotificationType.TestEmail);
                return (true, "Test email sent successfully");
            }
            catch (Exception ex)
            {
                return (false, $"Failed to send test email: {ex.Message}");
            }
        }
    }
}
