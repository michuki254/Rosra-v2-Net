namespace RosraApp.Services
{
    /// <summary>
    /// Server-side gap calculation and validation service.
    /// Mirrors the client-side formulas for validation on save.
    /// </summary>
    public class GapCalculationService
    {
        /// <summary>
        /// Validate and calculate gaps for a generic (non-property) stream.
        /// </summary>
        public GapCalculationResult CalculateGenericStreamGaps(GenericStreamInput input)
        {
            var errors = ValidateGenericInput(input);
            if (errors.Count > 0)
                return GapCalculationResult.Invalid(errors);

            var registeredUnits = input.RegisteredUnits;
            var estUnregisteredPct = input.EstimatedUnregisteredPercent;
            var billedAmount = input.BilledAmount;
            var outstandingAmount = input.OutstandingAmount;
            var statutoryAvgBilled = input.StatutoryAverageBilled;
            var realisticImprovementPct = input.RealisticImprovementPercent;

            // Core calculations (matching client-side formulas)
            var totalEstimatedUnits = registeredUnits * (1m + estUnregisteredPct / 100m);
            var revenueToDate = billedAmount - outstandingAmount;
            var compliantUnits = billedAmount > 0 ? registeredUnits * (revenueToDate / billedAmount) : 0m;
            var nonCompliantUnits = registeredUnits - compliantUnits;
            var unregisteredUnits = totalEstimatedUnits - registeredUnits;
            var avgBilledAmount = registeredUnits > 0 ? billedAmount / registeredUnits : 0m;
            var deltaA = (realisticImprovementPct / 100m) * Math.Max(0, statutoryAvgBilled - avgBilledAmount);
            var achievableAvgBill = avgBilledAmount + deltaA;

            // Gap amounts
            var complianceGap = outstandingAmount;
            var coverageGap = unregisteredUnits * avgBilledAmount;
            var liabilityGap = compliantUnits * deltaA;
            var mixedGapCompliance = nonCompliantUnits * deltaA;
            var mixedGapCoverage = unregisteredUnits * deltaA;

            var totalPotentialRevenue = revenueToDate + complianceGap + coverageGap + liabilityGap + mixedGapCompliance + mixedGapCoverage;
            var totalFunctionalGap = complianceGap + coverageGap + liabilityGap + mixedGapCompliance + mixedGapCoverage;

            // KPI Ratios
            var complianceRatio = billedAmount > 0 ? (revenueToDate / billedAmount) * 100m : 0m;
            var coverageRatio = totalEstimatedUnits > 0 ? (registeredUnits / totalEstimatedUnits) * 100m : 0m;

            return GapCalculationResult.Valid(new GapValues
            {
                TotalEstimatedUnits = Math.Round(totalEstimatedUnits, 2),
                RevenueToDate = Math.Round(revenueToDate, 2),
                CompliantUnits = Math.Round(compliantUnits, 2),
                NonCompliantUnits = Math.Round(nonCompliantUnits, 2),
                UnregisteredUnits = Math.Round(unregisteredUnits, 2),
                AvgBilledAmount = Math.Round(avgBilledAmount, 2),
                AchievableAvgBill = Math.Round(achievableAvgBill, 2),
                DeltaA = Math.Round(deltaA, 2),
                ComplianceGap = Math.Round(complianceGap, 2),
                CoverageGap = Math.Round(coverageGap, 2),
                LiabilityGap = Math.Round(liabilityGap, 2),
                MixedGapCompliance = Math.Round(mixedGapCompliance, 2),
                MixedGapCoverage = Math.Round(mixedGapCoverage, 2),
                TotalPotentialRevenue = Math.Round(totalPotentialRevenue, 2),
                TotalFunctionalGap = Math.Round(totalFunctionalGap, 2),
                ComplianceRatio = Math.Round(complianceRatio, 2),
                CoverageRatio = Math.Round(coverageRatio, 2)
            });
        }

        /// <summary>
        /// Validate generic stream inputs.
        /// </summary>
        private static List<string> ValidateGenericInput(GenericStreamInput input)
        {
            var errors = new List<string>();

            if (input.RegisteredUnits < 0)
                errors.Add("Registered units cannot be negative.");
            if (input.EstimatedUnregisteredPercent < 0 || input.EstimatedUnregisteredPercent > 100)
                errors.Add("Estimated unregistered percent must be between 0 and 100.");
            if (input.BilledAmount < 0)
                errors.Add("Billed amount cannot be negative.");
            if (input.OutstandingAmount < 0)
                errors.Add("Outstanding amount cannot be negative.");
            if (input.OutstandingAmount > input.BilledAmount)
                errors.Add("Outstanding amount cannot exceed billed amount.");
            if (input.StatutoryAverageBilled < 0)
                errors.Add("Statutory average billed cannot be negative.");
            if (input.RealisticImprovementPercent < 0 || input.RealisticImprovementPercent > 100)
                errors.Add("Realistic improvement percent must be between 0 and 100.");

            return errors;
        }
    }

    // Input/output DTOs

    public class GenericStreamInput
    {
        public decimal RegisteredUnits { get; set; }
        public decimal EstimatedUnregisteredPercent { get; set; }
        public decimal BilledAmount { get; set; }
        public decimal OutstandingAmount { get; set; }
        public decimal StatutoryAverageBilled { get; set; }
        public decimal RealisticImprovementPercent { get; set; }
    }

    public class GapValues
    {
        public decimal TotalEstimatedUnits { get; set; }
        public decimal RevenueToDate { get; set; }
        public decimal CompliantUnits { get; set; }
        public decimal NonCompliantUnits { get; set; }
        public decimal UnregisteredUnits { get; set; }
        public decimal AvgBilledAmount { get; set; }
        public decimal AchievableAvgBill { get; set; }
        public decimal DeltaA { get; set; }
        public decimal ComplianceGap { get; set; }
        public decimal CoverageGap { get; set; }
        public decimal LiabilityGap { get; set; }
        public decimal MixedGapCompliance { get; set; }
        public decimal MixedGapCoverage { get; set; }
        public decimal TotalPotentialRevenue { get; set; }
        public decimal TotalFunctionalGap { get; set; }
        public decimal ComplianceRatio { get; set; }
        public decimal CoverageRatio { get; set; }
    }

    public class GapCalculationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new();
        public GapValues? Values { get; set; }

        public static GapCalculationResult Valid(GapValues values) =>
            new() { IsValid = true, Values = values };

        public static GapCalculationResult Invalid(List<string> errors) =>
            new() { IsValid = false, Errors = errors };
    }
}
