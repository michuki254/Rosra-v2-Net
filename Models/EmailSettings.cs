using System.ComponentModel.DataAnnotations;

namespace RosraApp.Models
{
    public class EmailSettings
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(255)]
        public string SmtpServer { get; set; } = "smtp.gmail.com";

        public int SmtpPort { get; set; } = 587;

        [MaxLength(255)]
        public string? SmtpUsername { get; set; }

        [MaxLength(500)]
        public string? SmtpPassword { get; set; }

        public bool UseSsl { get; set; } = true;

        [MaxLength(255)]
        public string SenderEmail { get; set; } = "noreply@rosra.org";

        [MaxLength(100)]
        public string SenderDisplayName { get; set; } = "ROSRA UN-Habitat";

        // Global kill switch
        public bool IsEnabled { get; set; } = false;

        // Per-notification toggles
        public bool EnableReportSubmitted { get; set; } = true;
        public bool EnableReportClaimed { get; set; } = false;
        public bool EnableReportValidated { get; set; } = true;
        public bool EnableReportRejected { get; set; } = true;
        public bool EnableReportUnlocked { get; set; } = true;
        public bool EnableWelcomeEmail { get; set; } = true;

        // Retry configuration
        public int MaxRetries { get; set; } = 3;
        public int RetryDelaySeconds { get; set; } = 30;

        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedByUserId { get; set; }
    }
}
