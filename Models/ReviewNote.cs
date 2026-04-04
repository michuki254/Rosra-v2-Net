using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models
{
    public class ReviewNote
    {
        [Key]
        public int Id { get; set; }

        public int ReportId { get; set; }

        [ForeignKey("ReportId")]
        public virtual RosraReport? Report { get; set; }

        [Required]
        public string AuthorUserId { get; set; } = string.Empty;

        [ForeignKey("AuthorUserId")]
        public virtual ApplicationUser? Author { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Content { get; set; } = string.Empty;

        public int NoteType { get; set; } = 0; // NoteType enum

        [MaxLength(100)]
        public string? StreamReference { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsInternal { get; set; } = false;
    }
}
