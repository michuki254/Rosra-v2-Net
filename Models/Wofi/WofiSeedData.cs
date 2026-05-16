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

    public class WofiFrontierStat
    {
        [JsonPropertyName("income_group")] public string IncomeGroup { get; set; } = "";
        [JsonPropertyName("peer_count")] public int PeerCount { get; set; }
        [JsonPropertyName("top20_count")] public int Top20Count { get; set; }
        [JsonPropertyName("base_top20_frontier_pct_gdp")] public decimal BaseTop20FrontierPctGdp { get; set; }
        [JsonPropertyName("local_admin_pooled_sng_factor")] public decimal LocalAdminPooledSngFactor { get; set; }
        [JsonPropertyName("option2_shrinkage")] public decimal Option2Shrinkage { get; set; }
        [JsonPropertyName("option2_half_factor")] public decimal Option2HalfFactor { get; set; }
        [JsonPropertyName("total_osr_proxy_uplift")] public decimal TotalOsrProxyUplift { get; set; }
        [JsonPropertyName("final_benchmark_factor")] public decimal FinalBenchmarkFactor { get; set; }
        [JsonPropertyName("final_headline_frontier_pct_gdp")] public decimal FinalHeadlineFrontierPctGdp { get; set; }
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
