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

        /// <summary>Analysis mode identifier per the methodological note §13.</summary>
        public string Mode { get; set; } = "wofi_country_system_fallback";

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

        // Staged peer selection (v13 global mechanism)
        public string PeerStage { get; set; } = "";              // A | B | C | D
        public int PeerCount { get; set; }
        /// <summary>"Peer set is small. Treat as indicative." when below the minimum (note §11).</summary>
        public string? PeerSetWarning { get; set; }
        public decimal BaseFrontierPctGdp { get; set; }          // P80 of selected peers
        public decimal? GniPerCapitaAtlasUsd { get; set; }       // target country, peer-filter variable
        public List<WofiPeerInfo> TopPeers { get; set; } = new();

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

    /// <summary>One peer country in the staged-GNI peer set (diagnostic, mirrors the workbook's Top_Peers sheet).</summary>
    public class WofiPeerInfo
    {
        public string Iso3 { get; set; } = "";
        public string Country { get; set; } = "";
        public decimal StrictOsrProxyPctGdp { get; set; }
        public decimal? GniPerCapitaAtlasUsd { get; set; }
    }

    /// <summary>
    /// Per-country benchmark computed by the v13 staged peer selection:
    /// stage A/B/C/D peer set, P80 base frontier, and the final ratio
    /// (base × internal-dispersion 1.25 × total-OSR uplift 1.10).
    /// </summary>
    public class WofiBenchmark
    {
        public string PeerStage { get; set; } = "";
        public int PeerCount { get; set; }
        public decimal BaseFrontierPctGdp { get; set; }
        public decimal FinalHeadlineFrontierPctGdp { get; set; }
        public decimal FinalBenchmarkRatio { get; set; }
        public decimal? TargetGniPerCapitaAtlasUsd { get; set; }
        public List<WofiPeerInfo> TopPeers { get; set; } = new();
    }
}
