using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models
{
    public class AnalysisSnapshot
    {
        [Key]
        public int Id { get; set; }

        public int ReportId { get; set; }

        [ForeignKey("ReportId")]
        public virtual RosraReport? Report { get; set; }

        public int SnapshotType { get; set; } = 0; // SnapshotType enum

        /// <summary>
        /// Full serialized RosraFormViewModel as JSON.
        /// Immutable once created — snapshots are never updated.
        /// </summary>
        public string FormDataJson { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? CreatedByUserId { get; set; }

        [MaxLength(200)]
        public string? Label { get; set; }
    }
}
