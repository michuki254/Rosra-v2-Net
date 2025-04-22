using System;
using System.Collections.Generic;

namespace RosraApp.Models.ViewModels
{
    public class RosraFormViewModel
    {
        // Report identifier (0 for new reports)
        public int Id { get; set; }
        
        // Location Information
        public string? Country { get; set; }
        public string? Region { get; set; }
        public string? City { get; set; }
        public string? Currency { get; set; }
        public string? CurrencySymbol { get; set; }
        public string? FinancialYear { get; set; }
        
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
        public GapAnalysisShortTermViewModel ShortTermUserCharge { get; set; } = new GapAnalysisShortTermViewModel();
        public GapAnalysisLongTermViewModel LongTermUserCharge { get; set; } = new GapAnalysisLongTermViewModel();
        public GapAnalysisMixedViewModel MixedUserCharge { get; set; } = new GapAnalysisMixedViewModel();
        public GapAnalysisTotalViewModel TotalEstimate { get; set; } = new GapAnalysisTotalViewModel();
        
        // Causes Analysis Tab
        public string? ProblemStatement { get; set; }
        public List<string> RootCauses { get; set; } = new List<string>();
        
        // Recommendations Tab
        public string? RecommendationSummary { get; set; }
        public List<ActionItemViewModel> ActionItems { get; set; } = new List<ActionItemViewModel>();
        
        // Report metadata
        public string Title { get; set; } = "Rosra Analysis Report";
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
    
    // Property Tax tab
    public class GapAnalysisPropertyTaxViewModel : GapAnalysisBaseViewModel
    {
        // Basic property tax payers fields
        public int? TotalPropertyTaxPayers { get; set; }
        public int? RegisteredPropertyTaxPayers { get; set; }
        
        // Registered taxpayers by category
        public int? RegisteredTaxpayersCategoryA { get; set; }
        public int? RegisteredTaxpayersCategoryB { get; set; }
        public int? RegisteredTaxpayersCategoryC { get; set; }
        
        // Compliant taxpayers by category
        public int? CompliantTaxpayersCategoryA { get; set; }
        public int? CompliantTaxpayersCategoryB { get; set; }
        public int? CompliantTaxpayersCategoryC { get; set; }
        
        // Average property values by category
        public decimal? AveragePropertyValueCategoryA { get; set; }
        public decimal? AveragePropertyValueCategoryB { get; set; }
        public decimal? AveragePropertyValueCategoryC { get; set; }
        
        // Estimated average property values by category
        public decimal? EstimatedAveragePropertyValueCategoryA { get; set; }
        public decimal? EstimatedAveragePropertyValueCategoryB { get; set; }
        public decimal? EstimatedAveragePropertyValueCategoryC { get; set; }
        
        // Tax rates by category
        public decimal? TaxRateCategoryA { get; set; }
        public decimal? TaxRateCategoryB { get; set; }
        public decimal? TaxRateCategoryC { get; set; }
        
        // Dynamic categories
        public List<PropertyTaxCategory> DynamicCategories { get; set; } = new List<PropertyTaxCategory>();
    }
    
    // Class to represent a dynamic property tax category
    public class PropertyTaxCategory
    {
        public string? Name { get; set; } = "New Category";
        public int? RegisteredTaxpayers { get; set; }
        public int? CompliantTaxpayers { get; set; }
        public decimal? AveragePropertyValue { get; set; }
        public decimal? EstimatedAveragePropertyValue { get; set; }
        public decimal? TaxRate { get; set; }
    }
    
    // License tab
    public class GapAnalysisLicenseViewModel : GapAnalysisBaseViewModel
    {
        public int? TotalEstimatedNoOfLicensees { get; set; }
        
        // Residential Properties
        public int? EstimatedLicenseesResidentialProperties { get; set; }
        public int? RegisteredLicenseesResidentialProperties { get; set; }
        public int? CompliantLicenseesResidentialProperties { get; set; }
        public decimal? LicenseFeeResidentialProperties { get; set; }
        public decimal? LicenseFeeAveragePaidResidentialProperties { get; set; }
        
        // Commercial Properties
        public int? EstimatedLicenseesCommercialProperties { get; set; }
        public int? RegisteredLicenseesCommercialProperties { get; set; }
        public int? CompliantLicenseesCommercialProperties { get; set; }
        public decimal? LicenseFeeCommercialProperties { get; set; }
        public decimal? LicenseFeeAveragePaidCommercialProperties { get; set; }
        
        // Industrial Properties
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
}
