using System.ComponentModel.DataAnnotations;

namespace RosraApp.Models
{
    public class DataUploadHistory
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string DatasetType { get; set; } = ""; // "PeerSNG", "CountryData"

        [MaxLength(100)]
        public string? CountryCode { get; set; } // For PeerSNG: which country

        public int RecordCount { get; set; }

        public int Version { get; set; } = 1;

        [MaxLength(500)]
        public string? FileName { get; set; }

        public string? UploadedByUserId { get; set; }

        [MaxLength(255)]
        public string? UploadedByEmail { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }
}
