using Microsoft.AspNetCore.Identity.UI.Services;
using RosraApp.Models.Enums;

namespace RosraApp.Services
{
    public class IdentityEmailSender : IEmailSender
    {
        private readonly IEmailService _emailService;

        public IdentityEmailSender(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var type = subject.Contains("confirm", StringComparison.OrdinalIgnoreCase)
                ? NotificationType.EmailConfirmation
                : NotificationType.PasswordReset;

            return _emailService.SendEmailAsync(
                email,
                email,
                subject,
                htmlMessage,
                type,
                relatedEntityType: "Identity",
                relatedEntityId: email);
        }
    }
}
