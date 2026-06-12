using System.Text.Json.Serialization;

namespace RosraApp.Models.Wofi
{
    // Shapes of the four JSON seed files under Data/Wofi/.
    // Field names match the JSON keys (snake_case) via [JsonPropertyName].

    public class WofiCountryProxy
    {
        [JsonPropertyName("iso3")] public string Iso3 { get; set; } = "";
        [JsonPropertyName("country")] public string Country { get; set; } = "";
        [JsonPropertyName("income_group")] public string IncomeGroup { get; set; } = "";
        [JsonPropertyName("strict_osr_proxy_pct_gdp")] public decimal? StrictOsrProxyPctGdp { get; set; }
        [JsonPropertyName("components_available")] public int? ComponentsAvailable { get; set; }
        [JsonPropertyName("property_tax_missing_flag")] public int? PropertyTaxMissingFlag { get; set; }
        [JsonPropertyName("recurrent_property_tax_pct_gdp")] public decimal? RecurrentPropertyTaxPctGdp { get; set; }
        [JsonPropertyName("tariffs_fees_pct_gdp")] public decimal? TariffsFeesPctGdp { get; set; }
        [JsonPropertyName("property_income_pct_gdp")] public decimal? PropertyIncomePctGdp { get; set; }
        [JsonPropertyName("source_note")] public string? SourceNote { get; set; }
    }

    public class WofiGniAtlas
    {
        [JsonPropertyName("iso3")] public string Iso3 { get; set; } = "";
        [JsonPropertyName("country")] public string Country { get; set; } = "";
        [JsonPropertyName("gni_per_capita_atlas_usd")] public decimal? GniPerCapitaAtlasUsd { get; set; }
        [JsonPropertyName("data_year")] public int? DataYear { get; set; }
        [JsonPropertyName("source")] public string? Source { get; set; }
    }

    /// <summary>
    /// Staged peer-selection and frontier constants from the v13 workbook's
    /// Assumptions sheet ("ROSRA updated quick osr assessment_global.xlsx").
    /// </summary>
    public class WofiAssumptions
    {
        [JsonPropertyName("min_peer_count")] public int MinPeerCount { get; set; } = 12;
        [JsonPropertyName("stage_a_gni_lower")] public decimal StageAGniLower { get; set; } = 0.67m;
        [JsonPropertyName("stage_a_gni_upper")] public decimal StageAGniUpper { get; set; } = 1.5m;
        [JsonPropertyName("stage_b_gni_lower")] public decimal StageBGniLower { get; set; } = 0.5m;
        [JsonPropertyName("stage_b_gni_upper")] public decimal StageBGniUpper { get; set; } = 2m;
        [JsonPropertyName("stage_d_nearest_n")] public int StageDNearestN { get; set; } = 15;
        [JsonPropertyName("base_frontier_top_share")] public decimal BaseFrontierTopShare { get; set; } = 0.2m;
        [JsonPropertyName("internal_dispersion_factor")] public decimal InternalDispersionFactor { get; set; } = 1.25m;
        [JsonPropertyName("total_osr_uplift")] public decimal TotalOsrUplift { get; set; } = 0.1m;
        [JsonPropertyName("source")] public string? Source { get; set; }
    }

    public class WofiPremiumRule
    {
        [JsonPropertyName("profile_name")] public string ProfileName { get; set; } = "";
        [JsonPropertyName("when_to_use")] public string WhenToUse { get; set; } = "";
        [JsonPropertyName("factor")] public decimal Factor { get; set; }
        [JsonPropertyName("observed_band")] public string? ObservedBand { get; set; }
        [JsonPropertyName("calibration_note")] public string? CalibrationNote { get; set; }
    }

    public class WofiNationalData
    {
        [JsonPropertyName("country")] public string Country { get; set; } = "";
        [JsonPropertyName("iso3")] public string Iso3 { get; set; } = "";
        [JsonPropertyName("wb_iso3")] public string WbIso3 { get; set; } = "";
        [JsonPropertyName("income_group")] public string IncomeGroup { get; set; } = "";
        [JsonPropertyName("gdp_per_capita_lcu")] public decimal? GdpPerCapitaLcu { get; set; }
        [JsonPropertyName("national_population")] public decimal? NationalPopulation { get; set; }
        [JsonPropertyName("data_year")] public int? DataYear { get; set; }
        [JsonPropertyName("source")] public string? Source { get; set; }
    }
}
