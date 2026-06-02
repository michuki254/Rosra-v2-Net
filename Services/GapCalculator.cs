using RosraApp.Models.ViewModels;

namespace RosraApp.Services;

// =============================================================================
// GapCalculator
//
// Server-side replication of the ROSRA gap-math formulas used by the gap-analysis
// UI partials. Only the raw user-input fields are persisted to the DB; the
// derived gaps (Compliance / Coverage / Valuation / Liability / Mixed / Total
// Functional / Total Potential Revenue) are computed on demand.
//
// SOURCE OF TRUTH: the ROSRA v4 workbook is canonical. Two implementations
// must stay in sync with it:
//   - JS:  Views/Shared/_GapAnalysisPropertyTaxFixed.cshtml::calculatePropertyTaxGaps()
//          Views/Shared/_GapAnalysisLicense.cshtml::calculateBusinessLicenseGaps()
//   - C#:  this file.
//
// If you change a formula here, change it in the matching JS too (and re-check
// against the v4 workbook). Otherwise the admin Data Management view will drift
// from what the analyst sees in the Edit page.
// =============================================================================

public static class GapCalculator
{
    public readonly struct PropertyTaxGaps
    {
        public decimal RevenueToDate { get; init; }
        public decimal CompliantProperties { get; init; }
        public decimal ComplianceGap { get; init; }
        public decimal CoverageGap { get; init; }
        public decimal ValuationGap { get; init; }
        public decimal MixedGapRegistered { get; init; }
        public decimal MixedGapUnregistered { get; init; }
        public decimal TotalPotentialRevenue { get; init; }
        public decimal TotalFunctionalGap { get; init; }
    }

    public readonly struct BusinessLicenseGaps
    {
        public decimal RevenueToDate { get; init; }
        public decimal CompliantBusinesses { get; init; }
        public decimal ComplianceGap { get; init; }
        public decimal CoverageGap { get; init; }
        public decimal LiabilityGap { get; init; }
        public decimal MixedGapCompliance { get; init; }
        public decimal MixedGapCoverage { get; init; }
        public decimal TotalPotentialRevenue { get; init; }
        public decimal TotalFunctionalGap { get; init; }
    }

    // Mirrors _GapAnalysisPropertyTaxFixed.cshtml ::calculatePropertyTaxGaps (line 1214).
    public static PropertyTaxGaps ComputePropertyTaxGaps(GapAnalysisPropertyTaxViewModel pt)
    {
        decimal registeredProperties    = pt.RegisteredProperties ?? 0;
        decimal nonRegisteredProperties = pt.NonRegisteredProperties ?? 0;
        decimal totalFiscalBase         = pt.TotalFiscalBase ?? 0;
        decimal totalMarketValue        = pt.TotalMarketValue ?? 0;
        decimal billedAmount            = pt.BilledAmount ?? 0;
        decimal outstandingAmount       = pt.OutstandingAmount ?? 0;

        // Revenue to Date = Billed - Outstanding (the JS auto-calculates this and
        // overwrites whatever the user typed; we follow suit so saved data with a
        // stale RevenueToDate doesn't poison the derived metrics).
        decimal revenueToDate = billedAmount - outstandingAmount;

        decimal estimatedProperties = registeredProperties + nonRegisteredProperties;

        // Compliant Properties = Registered × (Revenue / Billed)
        decimal compliantProperties = billedAmount > 0
            ? registeredProperties * (revenueToDate / billedAmount)
            : 0m;

        decimal avgTaxableValue = registeredProperties > 0 ? totalFiscalBase / registeredProperties : 0m;
        decimal avgMarketValue  = registeredProperties > 0 ? totalMarketValue / registeredProperties : 0m;

        // Effective Tax Rate = Revenue / (AvgTaxable × Compliant)
        decimal effectiveTaxRateDecimal = (avgTaxableValue * compliantProperties) > 0
            ? revenueToDate / (avgTaxableValue * compliantProperties)
            : 0m;

        decimal avgBilledAmount  = effectiveTaxRateDecimal * avgTaxableValue;
        decimal potentialBilling = effectiveTaxRateDecimal * avgMarketValue;

        decimal complianceGap  = outstandingAmount;
        decimal coverageGap    = (estimatedProperties - registeredProperties) * avgBilledAmount;
        decimal valuationGap   = compliantProperties * (potentialBilling - avgBilledAmount);
        decimal mixedGapReg    = (registeredProperties - compliantProperties) * (potentialBilling - avgBilledAmount);
        decimal mixedGapUnreg  = (estimatedProperties - registeredProperties) * (potentialBilling - avgBilledAmount);

        decimal totalPotentialRevenue = revenueToDate + complianceGap + coverageGap + valuationGap + mixedGapReg + mixedGapUnreg;
        decimal totalFunctionalGap    = complianceGap + coverageGap + valuationGap + mixedGapReg + mixedGapUnreg;

        return new PropertyTaxGaps
        {
            RevenueToDate         = revenueToDate,
            CompliantProperties   = compliantProperties,
            ComplianceGap         = complianceGap,
            CoverageGap           = coverageGap,
            ValuationGap          = valuationGap,
            MixedGapRegistered    = mixedGapReg,
            MixedGapUnregistered  = mixedGapUnreg,
            TotalPotentialRevenue = totalPotentialRevenue,
            TotalFunctionalGap    = totalFunctionalGap,
        };
    }

    // Mirrors _GapAnalysisLicense.cshtml ::calculateBusinessLicenseGaps (line 1087).
    // Note: all gap values are clamped to >= 0 in the JS; we do the same.
    public static BusinessLicenseGaps ComputeBusinessLicenseGaps(GapAnalysisLicenseViewModel bl)
    {
        decimal registeredBusinesses         = bl.RegisteredBusinesses ?? 0;
        decimal estimatedUnregisteredPercent = bl.EstimatedUnregisteredPercent ?? 0;
        decimal billedAmount                 = bl.BilledAmount ?? 0;
        decimal outstandingAmount            = bl.OutstandingAmount ?? 0;
        decimal statutoryAverageBilled       = bl.StatutoryAverageBilled ?? 0;
        decimal realisticImprovementPercent  = bl.RealisticImprovementPercent ?? 0;

        decimal totalEstimatedBusinesses = Math.Max(0m, registeredBusinesses * (1m + estimatedUnregisteredPercent / 100m));
        decimal revenueToDate            = Math.Max(0m, billedAmount - outstandingAmount);

        // Compliant Businesses: clamped between 0 and registered
        decimal compliantBusinesses;
        if (billedAmount > 0)
        {
            decimal raw = registeredBusinesses * (revenueToDate / billedAmount);
            compliantBusinesses = Math.Max(0m, Math.Min(registeredBusinesses, raw));
        }
        else
        {
            compliantBusinesses = 0m;
        }

        decimal avgBilledAmount = registeredBusinesses > 0
            ? Math.Max(0m, billedAmount / registeredBusinesses)
            : 0m;

        decimal deltaA = (realisticImprovementPercent / 100m) * Math.Max(0m, statutoryAverageBilled - avgBilledAmount);

        decimal complianceGap       = Math.Max(0m, outstandingAmount);
        decimal coverageGap         = Math.Max(0m, (totalEstimatedBusinesses - registeredBusinesses) * avgBilledAmount);
        decimal liabilityGap        = Math.Max(0m, compliantBusinesses * deltaA);
        decimal mixedGapCompliance  = Math.Max(0m, (registeredBusinesses - compliantBusinesses) * deltaA);
        decimal mixedGapCoverage    = Math.Max(0m, (totalEstimatedBusinesses - registeredBusinesses) * deltaA);

        decimal totalPotentialRevenue = revenueToDate + complianceGap + coverageGap + liabilityGap + mixedGapCompliance + mixedGapCoverage;
        decimal totalFunctionalGap    = complianceGap + coverageGap + liabilityGap + mixedGapCompliance + mixedGapCoverage;

        return new BusinessLicenseGaps
        {
            RevenueToDate         = revenueToDate,
            CompliantBusinesses   = compliantBusinesses,
            ComplianceGap         = complianceGap,
            CoverageGap           = coverageGap,
            LiabilityGap          = liabilityGap,
            MixedGapCompliance    = mixedGapCompliance,
            MixedGapCoverage      = mixedGapCoverage,
            TotalPotentialRevenue = totalPotentialRevenue,
            TotalFunctionalGap    = totalFunctionalGap,
        };
    }
}
