using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models
{
    public class ReportArtifact
    {
        [Key]
        public int Id { get; set; }

        public int ReportId { get; set; }

        [ForeignKey("ReportId")]
        public virtual RosraReport? Report { get; set; }

        public int? SnapshotId { get; set; }

        [ForeignKey("SnapshotId")]
        public virtual AnalysisSnapshot? Snapshot { get; set; }

        [Required]
        [MaxLength(255)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string FilePath { get; set; } = string.Empty;

        public int FileType { get; set; } = 0; // ArtifactFileType enum

        public long FileSizeBytes { get; set; }

        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        public string? GeneratedByUserId { get; set; }
    }
}
