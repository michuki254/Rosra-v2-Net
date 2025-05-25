using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RosraApp.Models.ViewModels
{
    public class RosraFormViewModel
    {
        // Report identifier (0 for new reports)
        public int Id { get; set; }

        [Required(ErrorMessage = "Report Title is required.")]
        [StringLength(200, ErrorMessage = "Report Title cannot exceed 200 characters.")]
        public string Title { get; set; } = "Rosra Analysis Report";

        // Location Information
        [Required(ErrorMessage = "Country is required.")]
        [StringLength(100, ErrorMessage = "Country name cannot exceed 100 characters.")]
        public string? Country { get; set; }

        [StringLength(100, ErrorMessage = "Region name cannot exceed 100 characters.")]
        public string? Region { get; set; }

        [StringLength(100, ErrorMessage = "City name cannot exceed 100 characters.")]
        public string? City { get; set; }

        [StringLength(10, ErrorMessage = "Currency code cannot exceed 10 characters.")] // E.g., USD, EUR
        public string? Currency { get; set; }

        [StringLength(5, ErrorMessage = "Currency symbol cannot exceed 5 characters.")] // E.g., $, €
        public string? CurrencySymbol { get; set; }

        [StringLength(20, ErrorMessage = "Financial Year cannot exceed 20 characters.")] // E.g., "2023/2024" or "FY24"
        public string? FinancialYear { get; set; }

        // Financial Data
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Actual OSR must be a non-negative value.")]
        public decimal? ActualOsr { get; set; }

        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Budgeted OSR must be a non-negative value.")]
        public decimal? BudgetedOsr { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Population must be a non-negative number.")]
        public int? Population { get; set; }

        [Range(0, (double)decimal.MaxValue, ErrorMessage = "GDP per Capita must be a non-negative value.")]
        public decimal? GdpPerCapita { get; set; }

        // Potential Estimates Tab (Project Details in UI)
        [Required(ErrorMessage = "Project Name is required.")]
        [StringLength(200, ErrorMessage = "Project Name cannot exceed 200 characters.")]
        public string? ProjectName { get; set; }

        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Estimated Budget must be a non-negative value.")]
        public decimal? EstimatedBudget { get; set; } // This was marked as removed from UI but kept in DB

        [StringLength(2000, ErrorMessage = "Project Description cannot exceed 2000 characters.")]
        public string? ProjectDescription { get; set; }

        [StringLength(2000, ErrorMessage = "Key Objectives cannot exceed 2000 characters.")]
        public string? KeyObjectives { get; set; }

        [DataType(DataType.Date)]
        public DateTime? StartDate { get; set; }

        [DataType(DataType.Date)]
        // Future: Add custom validation [DateGreaterThan("StartDate")]
        public DateTime? EndDate { get; set; }

        // Gap Analysis Sub-Tabs - Assuming these complex types will have their own validation
        // For the properties holding these view models, [ValidateNever] could be used if we don't want them to be validated as part of RosraFormViewModel
        // or we ensure they are valid by themselves. For now, we'll let them be validated if their classes have annotations.
        public GapAnalysisPropertyTaxViewModel PropertyTax { get; set; } = new GapAnalysisPropertyTaxViewModel();
        public GapAnalysisLicenseViewModel License { get; set; } = new GapAnalysisLicenseViewModel();
        public GapAnalysisShortTermViewModel ShortTermUserCharge { get; set; } = new GapAnalysisShortTermViewModel();
        public GapAnalysisLongTermViewModel LongTermUserCharge { get; set; } = new GapAnalysisLongTermViewModel();
        public GapAnalysisMixedViewModel MixedUserCharge { get; set; } = new GapAnalysisMixedViewModel();
        public GapAnalysisTotalViewModel TotalEstimate { get; set; } = new GapAnalysisTotalViewModel();

        // Causes Analysis Tab
        [StringLength(4000, ErrorMessage = "Problem Statement cannot exceed 4000 characters.")]
        public string? ProblemStatement { get; set; }
        public List<string> RootCauses { get; set; } = new List<string>(); // Individual strings could be validated if submitted via a form element for each

        // Recommendations Tab
        [StringLength(4000, ErrorMessage = "Recommendation Summary cannot exceed 4000 characters.")]
        public string? RecommendationSummary { get; set; }
        public List<ActionItemViewModel> ActionItems { get; set; } = new List<ActionItemViewModel>();
    }

    public class ActionItemViewModel
    {
        [Required(ErrorMessage = "Action Item Description is required.")]
        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Priority is required.")]
        [StringLength(50, ErrorMessage = "Priority cannot exceed 50 characters.")]
        public string Priority { get; set; } = "medium"; // Could be enum or specific values "low", "medium", "high"
    }

    // Base class for all Gap Analysis sub-tabs
    public class GapAnalysisBaseViewModel
    {
        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        public string? Description { get; set; }

        [StringLength(2000, ErrorMessage = "Notes cannot exceed 2000 characters.")]
        public string? Notes { get; set; }

        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Current Value must be a non-negative value.")]
        public decimal? CurrentValue { get; set; }

        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Potential Value must be a non-negative value.")]
        public decimal? PotentialValue { get; set; }

        [Range(-(double)decimal.MaxValue, (double)decimal.MaxValue, ErrorMessage = "Gap value is out of range.")] // Gap can be negative
        public decimal? Gap { get; set; }
    }

    // Property Tax tab
    public class GapAnalysisPropertyTaxViewModel : GapAnalysisBaseViewModel
    {
        [Range(0, int.MaxValue, ErrorMessage = "Total Property Tax Payers must be a non-negative number.")]
        public int? TotalPropertyTaxPayers { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Registered Property Tax Payers must be a non-negative number.")]
        public int? RegisteredPropertyTaxPayers { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? RegisteredTaxpayersCategoryA { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? RegisteredTaxpayersCategoryB { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? RegisteredTaxpayersCategoryC { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? CompliantTaxpayersCategoryA { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? CompliantTaxpayersCategoryB { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? CompliantTaxpayersCategoryC { get; set; }

        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? AveragePropertyValueCategoryA { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? AveragePropertyValueCategoryB { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? AveragePropertyValueCategoryC { get; set; }

        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? EstimatedAveragePropertyValueCategoryA { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? EstimatedAveragePropertyValueCategoryB { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? EstimatedAveragePropertyValueCategoryC { get; set; }

        [Range(0, 100, ErrorMessage = "Tax Rate must be between 0 and 100 (if percentage). Adjust if it's a factor.")] // Assuming rate is a percentage.
        public decimal? TaxRateCategoryA { get; set; }
        [Range(0, 100, ErrorMessage = "Tax Rate must be between 0 and 100. Adjust if it's a factor.")]
        public decimal? TaxRateCategoryB { get; set; }
        [Range(0, 100, ErrorMessage = "Tax Rate must be between 0 and 100. Adjust if it's a factor.")]
        public decimal? TaxRateCategoryC { get; set; }

        public List<PropertyTaxCategory> DynamicCategories { get; set; } = new List<PropertyTaxCategory>();
    }

    public class PropertyTaxCategory
    {
        [StringLength(100, ErrorMessage = "Category Name cannot exceed 100 characters.")]
        public string? Name { get; set; } = "New Category";
        [Range(0, int.MaxValue, ErrorMessage = "Registered Taxpayers must be a non-negative number.")]
        public int? RegisteredTaxpayers { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Compliant Taxpayers must be a non-negative number.")]
        public int? CompliantTaxpayers { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Average Property Value must be a non-negative value.")]
        public decimal? AveragePropertyValue { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Estimated Average Property Value must be a non-negative value.")]
        public decimal? EstimatedAveragePropertyValue { get; set; }
        [Range(0, 100, ErrorMessage = "Tax Rate must be between 0 and 100. Adjust if it's a factor.")]
        public decimal? TaxRate { get; set; }
    }

    public class GapAnalysisLicenseViewModel : GapAnalysisBaseViewModel
    {
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? TotalEstimatedNoOfLicensees { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedLicenseesResidentialProperties { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? RegisteredLicenseesResidentialProperties { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? CompliantLicenseesResidentialProperties { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? LicenseFeeResidentialProperties { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? LicenseFeeAveragePaidResidentialProperties { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedLicenseesCommercialProperties { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? RegisteredLicenseesCommercialProperties { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? CompliantLicenseesCommercialProperties { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? LicenseFeeCommercialProperties { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? LicenseFeeAveragePaidCommercialProperties { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedLicenseesIndustrialProperties { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? RegisteredLicenseesIndustrialProperties { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? CompliantLicenseesIndustrialProperties { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? LicenseFeeIndustrialProperties { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? LicenseFeeAveragePaidIndustrialProperties { get; set; }

        public List<LicenseCategory> DynamicCategories { get; set; } = new List<LicenseCategory>();
    }

    public class LicenseCategory
    {
        [StringLength(100, ErrorMessage = "Category Name cannot exceed 100 characters.")]
        public string? Name { get; set; } = "New Category";
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedLicensees { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? RegisteredLicensees { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? CompliantLicensees { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? LicenseFee { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? LicenseFeeAveragePaid { get; set; }
    }

    public class GapAnalysisShortTermViewModel : GapAnalysisBaseViewModel
    {
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedDailyFees { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualDailyFees { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedDailyFeesCategoryA { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualDailyFeesCategoryA { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? PotentialRatePayableByCategoryA { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? ActualRatePaidByCategoryA { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedDailyFeesCategoryB { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualDailyFeesCategoryB { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? PotentialRatePayableByCategoryB { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? ActualRatePaidByCategoryB { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedDailyFeesCategoryC { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualDailyFeesCategoryC { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? PotentialRatePayableByCategoryC { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? ActualRatePaidByCategoryC { get; set; }

        public List<ShortTermCategory> DynamicCategories { get; set; } = new List<ShortTermCategory>();
    }

    public class ShortTermCategory
    {
        [Required(ErrorMessage = "Category Name is required.")]
        [StringLength(100, ErrorMessage = "Category Name cannot exceed 100 characters.")]
        public string Name { get; set; } = "New Category";
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedDailyFees { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualDailyFees { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? PotentialRatePayable { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? ActualRatePaid { get; set; }
    }

    public class GapAnalysisLongTermViewModel : GapAnalysisBaseViewModel
    {
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedMonthlyLeasees { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualMonthlyLeasees { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedMonthlyLeaseesCategoryA { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualMonthlyLeaseesCategoryA { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? PotentialRatePayableByCategoryA { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? ActualRatePaidByCategoryA { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedMonthlyLeaseesCategoryB { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualMonthlyLeaseesCategoryB { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? PotentialRatePayableByCategoryB { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? ActualRatePaidByCategoryB { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedMonthlyLeaseesCategoryC { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualMonthlyLeaseesCategoryC { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? PotentialRatePayableByCategoryC { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? ActualRatePaidByCategoryC { get; set; }

        public List<LongTermCategory> DynamicCategories { get; set; } = new List<LongTermCategory>();
    }

    public class LongTermCategory
    {
        [Required(ErrorMessage = "Category Name is required.")]
        [StringLength(100, ErrorMessage = "Category Name cannot exceed 100 characters.")]
        public string Name { get; set; } = "New Category";
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedMonthlyLeasees { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualMonthlyLeasees { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? PotentialRatePayable { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? ActualRatePaid { get; set; }
    }

    public class GapAnalysisMixedViewModel : GapAnalysisBaseViewModel
    {
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? EstimatedDailyUsers { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? ActualDailyUsers { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? AverageDailyUserFee { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? ActualDailyUserFee { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? NumberOfAvailableMonthlyUsers { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? NumberOfPayingMonthlyUsers { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? AverageMonthlyRate { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? ActualMonthlyRate { get; set; }

        // Legacy fields
        [Range(0, int.MaxValue, ErrorMessage = "Value must be a non-negative number.")]
        public int? NumberOfMixedUsers { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Value must be a non-negative value.")]
        public decimal? AverageMixedFee { get; set; }
    }

    public class GapAnalysisTotalViewModel : GapAnalysisBaseViewModel
    {
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Total Current Revenue must be a non-negative value.")]
        public decimal? TotalCurrentRevenue { get; set; }
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Total Potential Revenue must be a non-negative value.")]
        public decimal? TotalPotentialRevenue { get; set; }
        [Range(-(double)decimal.MaxValue, (double)decimal.MaxValue, ErrorMessage = "Total Revenue Gap value is out of range.")] // Gap can be negative
        public decimal? TotalRevenueGap { get; set; }
    }
}
