using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models
{
    public class SolutionCard
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string SolutionId { get; set; } = string.Empty; // e.g., "PT-COV-01", "NP-A-COM-01"

        [Required]
        [MaxLength(50)]
        public string Stream { get; set; } = string.Empty; // "Property Tax" or "Non-Property"

        [Required]
        [MaxLength(20)]
        public string StreamType { get; set; } = string.Empty; // "property-based" or "non-property"

        [MaxLength(5)]
        public string? Subgroup { get; set; } // "A", "B", "C" or null for PT

        [Required]
        [MaxLength(30)]
        public string Gap { get; set; } = string.Empty; // "Coverage", "Compliance", "Valuation", "Liability"

        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? ShortTitle { get; set; }

        [MaxLength(20)]
        public string? Timeline { get; set; } // "<1 year", "1-3 years", "2-4 years", "3+ years"

        [MaxLength(20)]
        public string? DeliveryDifficulty { get; set; } // "Low", "Medium", "High", etc.

        [MaxLength(20)]
        public string? PoliticalSensitivity { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        public int SortOrder { get; set; }

        public bool IsActive { get; set; } = true;

        // Overview card content stored as JSON
        [Column(TypeName = "nvarchar(max)")]
        public string? OverviewData { get; set; }

        // Full card details stored as JSON
        [Column(TypeName = "nvarchar(max)")]
        public string? FullDetailsData { get; set; }

        // Audit fields
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(450)]
        public string? CreatedByUserId { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [MaxLength(450)]
        public string? UpdatedByUserId { get; set; }

        // Soft delete
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }

        // Navigation properties
        [ForeignKey("CreatedByUserId")]
        public ApplicationUser? CreatedBy { get; set; }

        [ForeignKey("UpdatedByUserId")]
        public ApplicationUser? UpdatedBy { get; set; }
    }

    public class SolutionCardHistory
    {
        [Key]
        public int Id { get; set; }

        public int SolutionCardId { get; set; }

        [Required]
        [MaxLength(20)]
        public string ChangeType { get; set; } = string.Empty; // "Created", "Updated", "Deleted", "Restored"

        // Snapshot of the card data before the change
        [Column(TypeName = "nvarchar(max)")]
        public string? PreviousData { get; set; }

        [MaxLength(450)]
        public string? ChangedByUserId { get; set; }

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("SolutionCardId")]
        public SolutionCard? SolutionCard { get; set; }

        [ForeignKey("ChangedByUserId")]
        public ApplicationUser? ChangedBy { get; set; }
    }

    public class SystemSetting
    {
        [Key]
        [MaxLength(100)]
        public string Key { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Value { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(450)]
        public string? UpdatedByUserId { get; set; }
    }

    public class CardSet
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? TargetContext { get; set; } // e.g., "African city, low capacity, PT focus"

        // JSON array of SolutionId strings
        [Column(TypeName = "nvarchar(max)")]
        public string? CardIds { get; set; }

        [MaxLength(450)]
        public string? CreatedByUserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        // Navigation
        [ForeignKey("CreatedByUserId")]
        public ApplicationUser? CreatedBy { get; set; }
    }
}
