using System;
using System.Collections.Generic;

namespace RosraApp.Models.ViewModels
{
    public class RosraFormViewModel
    {
        // Report identifier (0 for new reports)
        public int Id { get; set; }
        public Guid PublicId { get; set; }
        
        // Location Information
        public string? Country { get; set; }
        public string? Region { get; set; }
        public string? City { get; set; }
        public string? GovUnitLevel3 { get; set; }
        public int? FinalUnitLevel { get; set; }
        public string? Currency { get; set; }
        public string? CurrencySymbol { get; set; }
        public string? FinancialYear { get; set; }
        public string? GovernmentType { get; set; }
        public string? IncomeLevel { get; set; }
        
        // Financial Data
        public decimal? ActualOsr { get; set; }
        public decimal? BudgetedOsr { get; set; }
        public int? Population { get; set; }
        public decimal? GdpPerCapita { get; set; }
        
        // Potential Estimates Tab
        public string? ProjectName { get; set; }
        public decimal? EstimatedBudget { get; set; }
        public string? ProjectDescription { get; set; }
        public string? KeyObjectives { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        // Gap Analysis Sub-Tabs
        public GapAnalysisPropertyTaxViewModel PropertyTax { get; set; } = new GapAnalysisPropertyTaxViewModel();
        public GapAnalysisLicenseViewModel License { get; set; } = new GapAnalysisLicenseViewModel();

        // Custom Display Names for Fixed Streams (allows renaming)
        public string PropertyTaxDisplayName { get; set; } = "Property Tax";
        public string BusinessLicenseDisplayName { get; set; } = "Business License";
        public GapAnalysisShortTermViewModel ShortTermUserCharge { get; set; } = new GapAnalysisShortTermViewModel();
        public GapAnalysisLongTermViewModel LongTermUserCharge { get; set; } = new GapAnalysisLongTermViewModel();
        public GapAnalysisMixedViewModel MixedUserCharge { get; set; } = new GapAnalysisMixedViewModel();
        public GapAnalysisTotalViewModel TotalEstimate { get; set; } = new GapAnalysisTotalViewModel();

        // Dynamic Generic Streams (for additional non-property revenue streams)
        public List<GenericStreamViewModel> GenericStreams { get; set; } = new List<GenericStreamViewModel>();
        
        // Causes Analysis Tab
        public string? ProblemStatement { get; set; }
        public List<string> RootCauses { get; set; } = new List<string>();
        
        // Recommendations Tab
        public string? RecommendationSummary { get; set; }
        public List<ActionItemViewModel> ActionItems { get; set; } = new List<ActionItemViewModel>();
        
        // Report metadata
        public string Title { get; set; } = "Rosra Analysis Report";
        
        // Top OSR Configuration
        public List<TopOsrViewModel> TopOsrConfig { get; set; } = new List<TopOsrViewModel>();
        public decimal? OtherRevenue { get; set; }

        // Prioritization Tab Data (stored as JSON)
        public string? PrioritizationData { get; set; }

        // Overview Selection Tab Data (stored as JSON)
        public string? SelectedSolutionsData { get; set; }

        // Implementation Progress Data (stored as JSON)
        public string? ImplementationProgressData { get; set; }

        // Peer SNG Data for Within-Country OSR Frontier analysis (stored as JSON)
        public string? PeerSNGData { get; set; }

        // Chart images captured client-side as base64 PNG (not persisted to DB, used only for export)
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public string? ChartImagesData { get; set; }

        // Concurrency token (Base64 encoded)
        public string? RowVersion { get; set; }
    }
    
    public class ActionItemViewModel
    {
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = "medium";
    }
    
    // Base class for all Gap Analysis sub-tabs
    public class GapAnalysisBaseViewModel
    {
        public string? Description { get; set; }
        public string? Notes { get; set; }
        public decimal? CurrentValue { get; set; }
        public decimal? PotentialValue { get; set; }
        public decimal? Gap { get; set; }
    }
    
    // Property Tax tab - ROSRA Gap Analysis Framework
    public class GapAnalysisPropertyTaxViewModel : GapAnalysisBaseViewModel
    {
        // User Input Fields (Required - 8 fields)
        public int? RegisteredProperties { get; set; }
        public int? NonRegisteredProperties { get; set; }
        public int? CompliantProperties { get; set; }
        public decimal? TotalFiscalBase { get; set; }
        public decimal? TotalMarketValue { get; set; }
        public decimal? BilledAmount { get; set; }
        public decimal? OutstandingAmount { get; set; }
        public decimal? RevenueToDate { get; set; }

        // Legacy fields (kept for backward compatibility with existing data)
        public int? TotalPropertyTaxPayers { get; set; }
        public int? RegisteredPropertyTaxPayers { get; set; }
        public int? RegisteredTaxpayersCategoryA { get; set; }
        public int? RegisteredTaxpayersCategoryB { get; set; }
        public int? RegisteredTaxpayersCategoryC { get; set; }
        public int? CompliantTaxpayersCategoryA { get; set; }
        public int? CompliantTaxpayersCategoryB { get; set; }
        public int? CompliantTaxpayersCategoryC { get; set; }
        public decimal? AveragePropertyValueCategoryA { get; set; }
        public decimal? AveragePropertyValueCategoryB { get; set; }
        public decimal? AveragePropertyValueCategoryC { get; set; }
        public decimal? EstimatedAveragePropertyValueCategoryA { get; set; }
        public decimal? EstimatedAveragePropertyValueCategoryB { get; set; }
        public decimal? EstimatedAveragePropertyValueCategoryC { get; set; }
        public decimal? TaxRateCategoryA { get; set; }
        public decimal? TaxRateCategoryB { get; set; }
        public decimal? TaxRateCategoryC { get; set; }
        public List<PropertyTaxCategory> DynamicCategories { get; set; } = new List<PropertyTaxCategory>();
    }

    // Class to represent a dynamic property tax category (kept for backward compatibility)
    public class PropertyTaxCategory
    {
        public string? Name { get; set; } = "New Category";
        public int? RegisteredTaxpayers { get; set; }
        public int? CompliantTaxpayers { get; set; }
        public decimal? AveragePropertyValue { get; set; }
        public decimal? EstimatedAveragePropertyValue { get; set; }
        public decimal? TaxRate { get; set; }
    }
    
    // Business License tab - ROSRA Gap Analysis Framework
    public class GapAnalysisLicenseViewModel : GapAnalysisBaseViewModel
    {
        // NEW: Business License User Input Fields (6 inputs per spec)
        public int? RegisteredBusinesses { get; set; }
        public decimal? EstimatedUnregisteredPercent { get; set; }
        public decimal? BilledAmount { get; set; }
        public decimal? OutstandingAmount { get; set; }
        public decimal? StatutoryAverageBilled { get; set; }
        public decimal? RealisticImprovementPercent { get; set; }

        // NEW: Auto-calculated fields (read-only in UI)
        public decimal? TotalEstimatedBusinesses { get; set; }
        public decimal? RevenueToDate { get; set; }
        public decimal? CompliantBusinesses { get; set; }
        public decimal? AvgBilledAmount { get; set; }
        public decimal? AchievableAvgBill { get; set; }
        public decimal? DeltaA { get; set; }

        // Legacy fields (kept for backward compatibility with existing data)
        public int? TotalEstimatedNoOfLicensees { get; set; }

        // Residential Properties (legacy)
        public int? EstimatedLicenseesResidentialProperties { get; set; }
        public int? RegisteredLicenseesResidentialProperties { get; set; }
        public int? CompliantLicenseesResidentialProperties { get; set; }
        public decimal? LicenseFeeResidentialProperties { get; set; }
        public decimal? LicenseFeeAveragePaidResidentialProperties { get; set; }

        // Commercial Properties (legacy)
        public int? EstimatedLicenseesCommercialProperties { get; set; }
        public int? RegisteredLicenseesCommercialProperties { get; set; }
        public int? CompliantLicenseesCommercialProperties { get; set; }
        public decimal? LicenseFeeCommercialProperties { get; set; }
        public decimal? LicenseFeeAveragePaidCommercialProperties { get; set; }

        // Industrial Properties (legacy)
        public int? EstimatedLicenseesIndustrialProperties { get; set; }
        public int? RegisteredLicenseesIndustrialProperties { get; set; }
        public int? CompliantLicenseesIndustrialProperties { get; set; }
        public decimal? LicenseFeeIndustrialProperties { get; set; }
        public decimal? LicenseFeeAveragePaidIndustrialProperties { get; set; }

        // Dynamic categories (for future expansion)
        public List<LicenseCategory> DynamicCategories { get; set; } = new List<LicenseCategory>();
    }
    
    // Class to represent a dynamic license category
    public class LicenseCategory
    {
        public string? Name { get; set; } = "New Category";
        public int? EstimatedLicensees { get; set; }
        public int? RegisteredLicensees { get; set; }
        public int? CompliantLicensees { get; set; }
        public decimal? LicenseFee { get; set; }
        public decimal? LicenseFeeAveragePaid { get; set; }
    }
    
    // Short Term User Charge tab
    public class GapAnalysisShortTermViewModel : GapAnalysisBaseViewModel
    {
        // Original fields
        public int? EstimatedDailyFees { get; set; }
        public int? ActualDailyFees { get; set; }
        
        // Category A
        public int? EstimatedDailyFeesCategoryA { get; set; }
        public int? ActualDailyFeesCategoryA { get; set; }
        public decimal? PotentialRatePayableByCategoryA { get; set; }
        public decimal? ActualRatePaidByCategoryA { get; set; }
        
        // Category B
        public int? EstimatedDailyFeesCategoryB { get; set; }
        public int? ActualDailyFeesCategoryB { get; set; }
        public decimal? PotentialRatePayableByCategoryB { get; set; }
        public decimal? ActualRatePaidByCategoryB { get; set; }
        
        // Category C
        public int? EstimatedDailyFeesCategoryC { get; set; }
        public int? ActualDailyFeesCategoryC { get; set; }
        public decimal? PotentialRatePayableByCategoryC { get; set; }
        public decimal? ActualRatePaidByCategoryC { get; set; }
        
        // Dynamic categories for future expansion
        public List<ShortTermCategory> DynamicCategories { get; set; } = new List<ShortTermCategory>();
    }
    
    // Class to represent a dynamic short term category
    public class ShortTermCategory
    {
        public string Name { get; set; } = "New Category";
        public int? EstimatedDailyFees { get; set; }
        public int? ActualDailyFees { get; set; }
        public decimal? PotentialRatePayable { get; set; }
        public decimal? ActualRatePaid { get; set; }
    }
    
    // Long Term User Charge tab
    public class GapAnalysisLongTermViewModel : GapAnalysisBaseViewModel
    {
        // General fields
        public int? EstimatedMonthlyLeasees { get; set; }
        public int? ActualMonthlyLeasees { get; set; }
        
        // Category A
        public int? EstimatedMonthlyLeaseesCategoryA { get; set; }
        public int? ActualMonthlyLeaseesCategoryA { get; set; }
        public decimal? PotentialRatePayableByCategoryA { get; set; }
        public decimal? ActualRatePaidByCategoryA { get; set; }
        
        // Category B
        public int? EstimatedMonthlyLeaseesCategoryB { get; set; }
        public int? ActualMonthlyLeaseesCategoryB { get; set; }
        public decimal? PotentialRatePayableByCategoryB { get; set; }
        public decimal? ActualRatePaidByCategoryB { get; set; }
        
        // Category C
        public int? EstimatedMonthlyLeaseesCategoryC { get; set; }
        public int? ActualMonthlyLeaseesCategoryC { get; set; }
        public decimal? PotentialRatePayableByCategoryC { get; set; }
        public decimal? ActualRatePaidByCategoryC { get; set; }
        
        // Dynamic categories for future expansion
        public List<LongTermCategory> DynamicCategories { get; set; } = new List<LongTermCategory>();
    }
    
    // Class to represent a dynamic long term category
    public class LongTermCategory
    {
        public string Name { get; set; } = "New Category";
        public int? EstimatedMonthlyLeasees { get; set; }
        public int? ActualMonthlyLeasees { get; set; }
        public decimal? PotentialRatePayable { get; set; }
        public decimal? ActualRatePaid { get; set; }
    }
    
    // Mixed User Charge tab
    public class GapAnalysisMixedViewModel : GapAnalysisBaseViewModel
    {
        // Daily Users
        public int? EstimatedDailyUsers { get; set; }
        public int? ActualDailyUsers { get; set; }
        public decimal? AverageDailyUserFee { get; set; }
        public decimal? ActualDailyUserFee { get; set; }
        
        // Monthly Users
        public int? NumberOfAvailableMonthlyUsers { get; set; }
        public int? NumberOfPayingMonthlyUsers { get; set; }
        public decimal? AverageMonthlyRate { get; set; }
        public decimal? ActualMonthlyRate { get; set; }
        
        // Legacy fields (kept for backward compatibility)
        public int? NumberOfMixedUsers { get; set; }
        public decimal? AverageMixedFee { get; set; }
    }
    
    // Total Estimate tab
    public class GapAnalysisTotalViewModel : GapAnalysisBaseViewModel
    {
        public decimal? TotalCurrentRevenue { get; set; }
        public decimal? TotalPotentialRevenue { get; set; }
        public decimal? TotalRevenueGap { get; set; }
    }
    
    public class TopOsrViewModel
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    // Generic Non-Property Stream ViewModel (for dynamically added revenue streams)
    public class GenericStreamViewModel : GapAnalysisBaseViewModel
    {
        // Stream Configuration
        public int StreamIndex { get; set; }
        public string StreamId { get; set; } = string.Empty;
        public string StreamName { get; set; } = "New Stream";
        public string AnalysisYear { get; set; } = DateTime.Now.Year.ToString();

        // Stream Classification (non-property subgroup system)
        public string? Subgroup { get; set; }        // "A" = Business licences, "B" = Service fees, "C" = Daily/point-of-collection
        public string? Subtype { get; set; }         // Specific revenue type within subgroup
        public string? LocalStreamName { get; set; } // Municipality's own name for the stream

        // User Input Fields (6 inputs per spec)
        public int? RegisteredUnits { get; set; }
        public decimal? EstimatedUnregisteredPercent { get; set; }
        public decimal? BilledAmount { get; set; }
        public decimal? OutstandingAmount { get; set; }
        public decimal? StatutoryAverageBilled { get; set; }
        public decimal? RealisticImprovementPercent { get; set; }

        // Auto-calculated fields (read-only in UI)
        public decimal? TotalEstimatedUnits { get; set; }
        public decimal? RevenueToDate { get; set; }
        public decimal? CompliantUnits { get; set; }
        public decimal? NonCompliantUnits { get; set; }
        public decimal? UnregisteredUnits { get; set; }
        public decimal? AvgBilledAmount { get; set; }
        public decimal? AchievableAvgBill { get; set; }
        public decimal? DeltaA { get; set; }

        // Gap calculations
        public decimal? ComplianceGap { get; set; }
        public decimal? CoverageGap { get; set; }
        public decimal? LiabilityGap { get; set; }
        public decimal? MixedGapCompliance { get; set; }
        public decimal? MixedGapCoverage { get; set; }
        public decimal? TotalPotentialRevenue { get; set; }
        public decimal? TotalFunctionalGap { get; set; }

        // KPI Ratios
        public decimal? ComplianceRatio { get; set; }
        public decimal? CoverageRatio { get; set; }
    }
}
