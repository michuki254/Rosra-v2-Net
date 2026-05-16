using System.Reflection;
using System.Text.Json;
using RosraApp.Models.Wofi;

namespace RosraApp.Services
{
    /// <summary>
    /// Top-down OSR potential estimator backed by the SNG-WOFI peer-country
    /// frontier. Implements the formulas specified in the
    /// "ROSRA WoFi LocalGov Calibrated Estimator v5" workbook.
    ///
    /// Loads four JSON seed files once at construction (singleton). The files
    /// are shipped as <c>EmbeddedResource</c> (see RosraApp.csproj) so they
    /// travel with the assembly to any host — no filesystem path concerns on
    /// Azure App Service, Railway, or local dev:
    ///   Data/Wofi/wofi_country_proxy.json
    ///   Data/Wofi/wofi_frontier_stats.json
    ///   Data/Wofi/wofi_premium_rules.json
    ///   Data/Wofi/wofi_national_data.json
    /// </summary>
    public class WofiPotentialEstimator
    {
        private readonly Dictionary<string, WofiCountryProxy> _countryByName;
        private readonly Dictionary<string, WofiCountryProxy> _countryByIso;
        private readonly Dictionary<string, WofiFrontierStat> _frontierByIncomeGroup;
        private readonly Dictionary<string, WofiPremiumRule> _ruleByProfile;
        private readonly Dictionary<string, WofiNationalData> _nationalByName;
        private readonly Dictionary<string, WofiNationalData> _nationalByIso;

        public IReadOnlyList<WofiCountryProxy> Countries { get; }
        public IReadOnlyList<WofiPremiumRule> EconomicProfiles { get; }
        public IReadOnlyList<WofiFrontierStat> FrontierStats { get; }

        public WofiPotentialEstimator()
        {
            var proxies = LoadEmbeddedJson<List<WofiCountryProxy>>("wofi_country_proxy.json");
            var fronts = LoadEmbeddedJson<List<WofiFrontierStat>>("wofi_frontier_stats.json");
            var rules = LoadEmbeddedJson<List<WofiPremiumRule>>("wofi_premium_rules.json");
            var nationals = LoadEmbeddedJson<List<WofiNationalData>>("wofi_national_data.json");

            Countries = proxies;
            EconomicProfiles = rules;
            FrontierStats = fronts;

            _countryByName = proxies.ToDictionary(c => Normalize(c.Country), c => c, StringComparer.OrdinalIgnoreCase);
            _countryByIso = proxies.ToDictionary(c => c.Iso3, c => c, StringComparer.OrdinalIgnoreCase);
            _frontierByIncomeGroup = fronts.ToDictionary(f => Normalize(f.IncomeGroup), f => f, StringComparer.OrdinalIgnoreCase);
            _ruleByProfile = rules.ToDictionary(r => Normalize(r.ProfileName), r => r, StringComparer.OrdinalIgnoreCase);
            _nationalByName = nationals.ToDictionary(n => Normalize(n.Country), n => n, StringComparer.OrdinalIgnoreCase);
            _nationalByIso = nationals.ToDictionary(n => n.Iso3, n => n, StringComparer.OrdinalIgnoreCase);
        }

        // ---------- Lookups exposed to controllers/views ----------

        public WofiCountryProxy? FindCountry(string? countryOrIso)
        {
            if (string.IsNullOrWhiteSpace(countryOrIso)) return null;
            var key = Normalize(countryOrIso);
            if (_countryByName.TryGetValue(key, out var byName)) return byName;
            if (_countryByIso.TryGetValue(countryOrIso, out var byIso)) return byIso;
            return null;
        }

        public WofiNationalData? FindNationalData(string? countryOrIso)
        {
            if (string.IsNullOrWhiteSpace(countryOrIso)) return null;
            var key = Normalize(countryOrIso);
            if (_nationalByName.TryGetValue(key, out var byName)) return byName;
            if (_nationalByIso.TryGetValue(countryOrIso, out var byIso)) return byIso;
            return null;
        }

        public WofiFrontierStat? FindFrontier(string? incomeGroup)
        {
            if (string.IsNullOrWhiteSpace(incomeGroup)) return null;
            return _frontierByIncomeGroup.TryGetValue(Normalize(incomeGroup), out var f) ? f : null;
        }

        public WofiPremiumRule? FindEconomicProfile(string? profileName)
        {
            if (string.IsNullOrWhiteSpace(profileName)) return null;
            return _ruleByProfile.TryGetValue(Normalize(profileName), out var r) ? r : null;
        }

        // ---------- Core calculation ----------

        public WofiEstimatorResult Calculate(WofiEstimatorInputs inputs)
        {
            var result = new WofiEstimatorResult
            {
                Country = inputs.Country ?? "",
                EconomicProfile = inputs.EconomicProfile ?? "",
                ActualOsr = inputs.ActualOsr,
                LocalPopulation = inputs.LocalPopulation,
            };

            var country = FindCountry(inputs.Country);
            if (country == null)
            {
                result.IsValid = false;
                result.ValidationMessage = $"Country '{inputs.Country}' is not in the WoFi reference table.";
                return result;
            }
            result.Iso3 = country.Iso3;
            result.IncomeGroup = country.IncomeGroup;

            var national = FindNationalData(country.Iso3);
            if (national == null || !national.GdpPerCapitaLcu.HasValue || national.GdpPerCapitaLcu.Value <= 0)
            {
                result.IsValid = false;
                result.ValidationMessage = "National GDP per capita is not available for the selected country.";
                return result;
            }
            result.NationalGdpPerCapita = national.GdpPerCapitaLcu.Value;
            result.NationalPopulation = national.NationalPopulation ?? 0m;
            result.NationalDataYear = national.DataYear;
            result.NationalDataSource = national.Source;

            var rule = FindEconomicProfile(inputs.EconomicProfile);
            if (rule == null)
            {
                result.IsValid = false;
                result.ValidationMessage = "Select a local economic profile to continue.";
                return result;
            }
            result.EconomicProfileFactor = rule.Factor;

            var frontier = FindFrontier(country.IncomeGroup);
            if (frontier == null)
            {
                result.IsValid = false;
                result.ValidationMessage = $"No frontier benchmark for income group '{country.IncomeGroup}'.";
                return result;
            }
            result.FinalHeadlineFrontierPctGdp = frontier.FinalHeadlineFrontierPctGdp;
            result.FinalBenchmarkRatio = frontier.FinalHeadlineFrontierPctGdp / 100m;

            if (inputs.LocalPopulation <= 0)
            {
                result.IsValid = false;
                result.ValidationMessage = "Enter the local population to estimate potential.";
                return result;
            }

            // Core formulas (from LG_Input_Output sheet).
            result.EstimatedLocalGdp = inputs.LocalPopulation * result.NationalGdpPerCapita * result.EconomicProfileFactor;
            result.PotentialOsr = result.EstimatedLocalGdp * result.FinalBenchmarkRatio;
            result.OsrGap = Math.Max(result.PotentialOsr - inputs.ActualOsr, 0m);

            if (result.PotentialOsr > 0)
            {
                result.FrontierIndex = inputs.ActualOsr / result.PotentialOsr;
                result.PotentialActualRatio = inputs.ActualOsr > 0 ? result.PotentialOsr / inputs.ActualOsr : 0m;
            }

            if (result.NationalPopulation > 0)
            {
                var nationalGdp = result.NationalGdpPerCapita * result.NationalPopulation;
                if (nationalGdp > 0)
                {
                    result.GdpShareNational = result.EstimatedLocalGdp / nationalGdp;
                }
            }

            (result.WarningLevel, result.WarningMessage) = BuildWarning(result.GdpShareNational, result.FrontierIndex);
            result.FrontierInterpretation = InterpretFrontier(result.FrontierIndex);

            result.IsValid = true;
            return result;
        }

        // ---------- Helpers ----------

        private static (string Level, string? Message) BuildWarning(decimal gdpShare, decimal frontierIdx)
        {
            if (gdpShare > 0.50m)
                return ("SEVERE", "The selected economic profile implies a very large share of national GDP — re-check the population boundary and the profile choice.");
            if (gdpShare > 0.30m)
                return ("RED", "The selected economic profile implies a high share of national GDP — re-check that the profile fits this jurisdiction.");
            if (gdpShare > 0.15m)
                return ("AMBER", "The selected economic profile implies a noticeable share of national GDP — sanity-check the profile choice.");
            if (frontierIdx > 0 && frontierIdx < 0.10m)
                return ("RED", "Current revenue is far below the benchmark level — large room to improve.");
            if (frontierIdx > 0 && frontierIdx < 0.30m)
                return ("AMBER", "Current revenue is below the benchmark level — meaningful room to improve.");
            return ("OK", null);
        }

        private static string InterpretFrontier(decimal idx)
        {
            if (idx >= 0.70m) return "Strong";
            if (idx >= 0.40m) return "Moderate";
            if (idx >= 0.20m) return "Significant";
            return "Large";
        }

        private static string Normalize(string s) => s.Trim().ToLowerInvariant();

        private static T LoadEmbeddedJson<T>(string fileName)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceName = assembly.GetManifestResourceNames()
                .FirstOrDefault(n => n.EndsWith("." + fileName, StringComparison.OrdinalIgnoreCase));
            if (resourceName == null)
            {
                throw new InvalidOperationException(
                    $"WoFi seed resource '{fileName}' is not embedded in the assembly. " +
                    $"Check the <EmbeddedResource> entries in RosraApp.csproj.");
            }
            using var stream = assembly.GetManifestResourceStream(resourceName)!;
            var data = JsonSerializer.Deserialize<T>(stream, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString,
            });
            return data ?? throw new InvalidOperationException(
                $"Failed to deserialise WoFi seed resource '{fileName}'.");
        }
    }
}
