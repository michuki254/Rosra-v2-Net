using System.ComponentModel.DataAnnotations;

namespace RosraApp.Models
{
    public class EmailLog
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(255)]
        public string ToEmail { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? ToName { get; set; }

        [Required, MaxLength(500)]
        public string Subject { get; set; } = string.Empty;

        public int NotificationType { get; set; } // NotificationType enum

        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Sent, Failed

        public string? ErrorMessage { get; set; }

        public int RetryCount { get; set; } = 0;

        [MaxLength(100)]
        public string? RelatedEntityType { get; set; }

        [MaxLength(50)]
        public string? RelatedEntityId { get; set; }

        public DateTime? SentAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
