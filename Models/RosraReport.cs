using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models
{
    public class RosraReport
    {
        [Key]
        public int Id { get; set; }
        
        public string Title { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public string? UserId { get; set; }
        
        [ForeignKey("UserId")]
        public virtual ApplicationUser? User { get; set; }
        
        // Location Information
        public string? Country { get; set; }
        public string? Region { get; set; }
        public string? City { get; set; }
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
    }
}
