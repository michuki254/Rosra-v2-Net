using RosraApp.Models.Enums;

namespace RosraApp.Services
{
    public static class EmailTemplateService
    {
        private const string PrimaryColor = "#009EDB"; // UN Blue
        private const string AccentColor = "#00b2e3";
        private const string GreenColor = "#10b981";
        private const string RedColor = "#ef4444";
        private const string AmberColor = "#f59e0b";

        private static string WrapInLayout(string title, string preheader, string bodyContent)
        {
            return $@"
<!DOCTYPE html>
<html>
<head><meta charset=""utf-8""><meta name=""viewport"" content=""width=device-width,initial-scale=1""></head>
<body style=""margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"">
<div style=""display:none;max-height:0;overflow:hidden;"">{preheader}</div>
<table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background:#f4f5f7;padding:32px 16px;"">
<tr><td align=""center"">
<table width=""600"" cellpadding=""0"" cellspacing=""0"" style=""background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);"">
  <!-- Header -->
  <tr><td style=""background:{PrimaryColor};padding:28px 32px;text-align:center;"">
    <div style=""font-size:24px;font-weight:700;color:#ffffff;letter-spacing:0.5px;"">ROSRA</div>
    <div style=""font-size:11px;color:rgba(255,255,255,0.8);margin-top:4px;letter-spacing:1px;text-transform:uppercase;"">UN-Habitat Revenue Optimization</div>
  </td></tr>
  <!-- Title Bar -->
  <tr><td style=""background:#f8fafc;padding:16px 32px;border-bottom:1px solid #e5e7eb;"">
    <div style=""font-size:16px;font-weight:600;color:#222;"">{title}</div>
  </td></tr>
  <!-- Body -->
  <tr><td style=""padding:28px 32px;"">
    {bodyContent}
  </td></tr>
  <!-- Footer -->
  <tr><td style=""background:#f8fafc;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;"">
    <div style=""font-size:11px;color:#9ca3af;"">
      ROSRA | UN-Habitat &mdash; Own Source Revenue Assessment<br>
      This is an automated notification. Please do not reply to this email.
    </div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>";
        }

        private static string Button(string text, string url, string color = "#00689D")
        {
            return $@"<table cellpadding=""0"" cellspacing=""0"" style=""margin:20px 0;""><tr><td>
<a href=""{url}"" style=""display:inline-block;padding:12px 28px;background:{color};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;"">{text}</a>
</td></tr></table>";
        }

        private static string InfoRow(string label, string value)
        {
            return $@"<tr><td style=""padding:6px 0;color:#6b7280;font-size:13px;width:140px;vertical-align:top;"">{label}</td><td style=""padding:6px 0;color:#222;font-size:13px;font-weight:500;"">{value}</td></tr>";
        }

        public static string ReportSubmitted(string reviewerName, string authorName, string reportTitle, string country, string reportUrl)
        {
            return WrapInLayout("New Assessment Submitted for Review", $"{authorName} submitted {reportTitle} for review", $@"
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;"">
  Hi {reviewerName},
</p>
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;"">
  A new ROSRA assessment has been submitted and is awaiting review.
</p>
<table cellpadding=""0"" cellspacing=""0"" style=""width:100%;background:#f0f9ff;border-radius:8px;padding:16px;margin-bottom:20px;"">
  {InfoRow("Report", reportTitle)}
  {InfoRow("Author", authorName)}
  {InfoRow("Country", country)}
</table>
{Button("Review Assessment", reportUrl)}
<p style=""color:#9ca3af;font-size:12px;margin-top:16px;"">You are receiving this because you have reviewer permissions in ROSRA.</p>");
        }

        public static string ReportClaimed(string userName, string reportTitle, string reviewerName)
        {
            return WrapInLayout("Your Assessment Is Being Reviewed", $"{reviewerName} has started reviewing {reportTitle}", $@"
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;"">
  Hi {userName},
</p>
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;"">
  Your assessment <strong>{reportTitle}</strong> has been claimed for review by <strong>{reviewerName}</strong>.
</p>
<div style=""background:#dbeafe;border-radius:8px;padding:16px;text-align:center;margin:20px 0;"">
  <div style=""font-size:14px;color:#1e40af;font-weight:600;"">Status: Under Review</div>
</div>
<p style=""color:#6b7280;font-size:13px;"">You will be notified when the review is complete.</p>");
        }

        public static string ReportValidated(string userName, string reportTitle, string reportUrl)
        {
            return WrapInLayout("Assessment Validated Successfully", $"{reportTitle} has been validated", $@"
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;"">
  Hi {userName},
</p>
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;"">
  Great news! Your assessment <strong>{reportTitle}</strong> has been reviewed and <strong>validated</strong>.
</p>
<div style=""background:#d1fae5;border-radius:8px;padding:16px;text-align:center;margin:20px 0;"">
  <div style=""font-size:14px;color:#065f46;font-weight:600;"">Status: Validated</div>
</div>
{Button("View Report", reportUrl, GreenColor)}
<p style=""color:#6b7280;font-size:13px;"">Your validated report is now available in the ROSRA Validated Library.</p>");
        }

        public static string ReportRejected(string userName, string reportTitle, string reason, string reportUrl)
        {
            return WrapInLayout("Assessment Needs Revision", $"{reportTitle} has been returned for revision", $@"
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;"">
  Hi {userName},
</p>
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;"">
  Your assessment <strong>{reportTitle}</strong> has been reviewed and requires some revisions before it can be validated.
</p>
<div style=""background:#fef2f2;border-radius:8px;padding:16px;margin:20px 0;"">
  <div style=""font-size:12px;font-weight:600;color:#991b1b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;"">Revision Reason</div>
  <div style=""font-size:14px;color:#374151;line-height:1.5;"">{reason}</div>
</div>
{Button("Edit & Resubmit", reportUrl, AmberColor)}
<p style=""color:#6b7280;font-size:13px;"">Please address the feedback and resubmit when ready.</p>");
        }

        public static string ReportUnlocked(string userName, string reportTitle, string reason)
        {
            return WrapInLayout("Validated Assessment Unlocked", $"{reportTitle} has been unlocked for revision", $@"
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;"">
  Hi {userName},
</p>
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;"">
  A previously validated assessment <strong>{reportTitle}</strong> has been unlocked by an administrator for further revision.
</p>
<div style=""background:#fef3c7;border-radius:8px;padding:16px;margin:20px 0;"">
  <div style=""font-size:12px;font-weight:600;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;"">Reason for Unlock</div>
  <div style=""font-size:14px;color:#374151;line-height:1.5;"">{reason}</div>
</div>
<p style=""color:#6b7280;font-size:13px;"">Please review and resubmit the assessment when revisions are complete.</p>");
        }

        public static string WelcomeEmail(string userName, string loginUrl)
        {
            return WrapInLayout("Welcome to ROSRA", $"Welcome {userName} to ROSRA UN-Habitat", $@"
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;"">
  Hi {userName},
</p>
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;"">
  Welcome to <strong>ROSRA</strong> — the Revenue Optimization for Subnational Revenue Assessment tool by UN-Habitat.
</p>
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;"">
  You can now create revenue assessments, analyze own-source revenue gaps, and submit reports for review.
</p>
{Button("Get Started", loginUrl)}
<p style=""color:#6b7280;font-size:13px;"">If you didn't create this account, please ignore this email.</p>");
        }

        public static string TestEmail(string adminName)
        {
            return WrapInLayout("ROSRA Email Test", "This is a test email from ROSRA", $@"
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;"">
  Hi {adminName},
</p>
<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;"">
  This is a test email from the ROSRA notification system. If you're reading this, email delivery is working correctly.
</p>
<div style=""background:#d1fae5;border-radius:8px;padding:16px;text-align:center;margin:20px 0;"">
  <div style=""font-size:14px;color:#065f46;font-weight:600;"">Email Configuration Verified</div>
</div>
<p style=""color:#6b7280;font-size:13px;"">Sent at: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC</p>");
        }

        public static Dictionary<string, string> GetAllTemplatePreviews()
        {
            return new Dictionary<string, string>
            {
                ["Report Submitted"] = ReportSubmitted("Reviewer", "John Doe", "ROSRA Report - Kenya - Nakuru", "Kenya", "#"),
                ["Report Claimed"] = ReportClaimed("John Doe", "ROSRA Report - Kenya - Nakuru", "Jane Smith"),
                ["Report Validated"] = ReportValidated("John Doe", "ROSRA Report - Kenya - Nakuru", "#"),
                ["Report Rejected"] = ReportRejected("John Doe", "ROSRA Report - Kenya - Nakuru", "The property tax data needs to be updated with 2024 figures. Please also verify the business license registration numbers.", "#"),
                ["Report Unlocked"] = ReportUnlocked("John Doe", "ROSRA Report - Kenya - Nakuru", "New fiscal year data available — please update the assessment with latest figures."),
                ["Welcome Email"] = WelcomeEmail("John Doe", "#"),
                ["Test Email"] = TestEmail("Admin"),
            };
        }
    }
}
