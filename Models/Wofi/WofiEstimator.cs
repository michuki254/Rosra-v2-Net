namespace RosraApp.Models.Wofi
{
    /// <summary>Inputs the user supplies on the LG Profile card.</summary>
    public class WofiEstimatorInputs
    {
        public string? Country { get; set; }
        public string? EconomicProfile { get; set; }
        public decimal ActualOsr { get; set; }
        public decimal LocalPopulation { get; set; }
        public string? LocalGovernmentName { get; set; }
        public string? OsrYear { get; set; }
    }

    /// <summary>Top-down potential estimate plus diagnostics for display.</summary>
    public class WofiEstimatorResult
    {
        public bool IsValid { get; set; }
        public string? ValidationMessage { get; set; }

        // Echo of inputs and looked-up reference data
        public string Country { get; set; } = "";
        public string? Iso3 { get; set; }
        public string IncomeGroup { get; set; } = "";
        public string EconomicProfile { get; set; } = "";
        public decimal EconomicProfileFactor { get; set; }
        public decimal NationalGdpPerCapita { get; set; }
        public decimal NationalPopulation { get; set; }
        public int? NationalDataYear { get; set; }
        public string? NationalDataSource { get; set; }
        public decimal LocalPopulation { get; set; }
        public decimal ActualOsr { get; set; }

        // Computed outputs
        public decimal EstimatedLocalGdp { get; set; }
        public decimal FinalBenchmarkRatio { get; set; }
        public decimal FinalHeadlineFrontierPctGdp { get; set; }
        public decimal PotentialOsr { get; set; }
        public decimal OsrGap { get; set; }
        public decimal FrontierIndex { get; set; }
        public decimal PotentialActualRatio { get; set; }
        public decimal GdpShareNational { get; set; }

        // Diagnostics
        public string WarningLevel { get; set; } = "OK";        // OK | AMBER | RED | SEVERE
        public string? WarningMessage { get; set; }
        public string FrontierInterpretation { get; set; } = ""; // Strong | Moderate | Significant | Large
    }
}
