using System;
using System.ComponentModel.DataAnnotations;

namespace RosraApp.Models
{
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }

        public string? UserId { get; set; }
        public string? UserEmail { get; set; }

        [Required]
        [MaxLength(50)]
        public string Action { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string EntityType { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? EntityId { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string? Details { get; set; }

        [MaxLength(50)]
        public string? IpAddress { get; set; }

        // Status transition tracking
        [MaxLength(50)]
        public string? StatusFrom { get; set; }

        [MaxLength(50)]
        public string? StatusTo { get; set; }

        [MaxLength(500)]
        public string? Reason { get; set; }
    }
}
