using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models
{
    public class RosraReport
    {
        [Key]
        public int Id { get; set; }

        public Guid PublicId { get; set; } = Guid.NewGuid();

        public string Title { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public string? LastModifiedByUserId { get; set; }

        public string? UserId { get; set; }
        
        [ForeignKey("UserId")]
        public virtual ApplicationUser? User { get; set; }
        
        // Location Information
        public string? Country { get; set; }
        public string? Region { get; set; }
        public string? City { get; set; }
        public string? GovUnitLevel3 { get; set; }
        public int? FinalUnitLevel { get; set; }
        public string? Currency { get; set; }
        public string? CurrencySymbol { get; set; }
        public string? FinancialYear { get; set; }
        
        // Financial Data
        [Column(TypeName = "decimal(18,2)")]
        public decimal? ActualOsr { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? BudgetedOsr { get; set; }
        
        public int? Population { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? GdpPerCapita { get; set; }
        
        // Potential Estimates Tab
        public string? ProjectName { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? EstimatedBudget { get; set; }
        
        public string? ProjectDescription { get; set; }
        public string? KeyObjectives { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        // Gap Analysis Sub-Tabs (stored as JSON)
        public string? PropertyTaxData { get; set; }
        public string? LicenseData { get; set; }
        public string? ShortTermUserChargeData { get; set; }
        public string? LongTermUserChargeData { get; set; }
        public string? MixedUserChargeData { get; set; }
        public string? TotalEstimateData { get; set; }
        
        // Causes Analysis Tab
        public string? ProblemStatement { get; set; }
        public string? RootCauses { get; set; } // Stored as JSON
        
        // Recommendations Tab
        public string? RecommendationSummary { get; set; }
        public string? ActionItems { get; set; } // Stored as JSON
        
        // Top 5 OSR Configuration
        public string? TopOsrConfigData { get; set; } // Stored as JSON

        // Dynamic Generic Streams (stored as JSON)
        public string? GenericStreamsData { get; set; }

        // Additional fields
        public string? GovernmentType { get; set; }
        public string? IncomeLevel { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? OtherRevenue { get; set; }

        // Prioritization Tab Data (stored as JSON)
        public string? PrioritizationData { get; set; }

        // Overview Selection Tab Data (stored as JSON)
        public string? SelectedSolutionsData { get; set; }

        // Implementation Progress Data (stored as JSON)
        public string? ImplementationProgressData { get; set; }

        /// <summary>
        /// Peer SNG data for Within-Country OSR Frontier analysis (stored as JSON)
        /// Contains: selected peer SNGs, their OSR/GCP values, analysis results
        /// </summary>
        public string? PeerSNGData { get; set; }

        // Assessment Review & Validation Workflow
        public int Status { get; set; } = 0; // ReportStatus enum: Draft=0
        public int CompletionLevel { get; set; } = 0; // CompletionLevel enum: Metadata=0
        public int SubmissionVersion { get; set; } = 0; // Incremented each time report is submitted
        public DateTime? SubmittedAt { get; set; }
        public DateTime? ValidatedAt { get; set; }
        public string? ValidatedByUserId { get; set; }
        public string? ReviewerUserId { get; set; }
        public DateTime? ReviewStartedAt { get; set; }
        public string? RevisionReason { get; set; }

        // Soft Delete
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }
        public string? DeletedByUserId { get; set; }

        // Archiving
        public bool IsArchived { get; set; } = false;
        public DateTime? ArchivedAt { get; set; }

        // Concurrency Token
        [Timestamp]
        public byte[]? RowVersion { get; set; }

        // Navigation properties
        public virtual ICollection<ReviewNote> ReviewNotes { get; set; } = new List<ReviewNote>();
        public virtual ICollection<AnalysisSnapshot> Snapshots { get; set; } = new List<AnalysisSnapshot>();
        public virtual ICollection<ReportArtifact> Artifacts { get; set; } = new List<ReportArtifact>();
    }
}
