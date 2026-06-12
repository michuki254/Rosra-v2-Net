using System.Reflection;
using System.Text.Json;
using RosraApp.Models.Wofi;

namespace RosraApp.Services
{
    /// <summary>
    /// Top-down OSR potential estimator backed by the SNG-WOFI peer-country
    /// frontier. Implements the v13 global quick OSR mechanism specified in
    /// "ROSRA updated quick osr assessment_global.xlsx" (2026-06): a staged
    /// GNI-similarity peer selection (stages A–D) and a robust P80 frontier
    /// of the selected peers' strict OSR proxy, adjusted by the
    /// internal-dispersion factor (1.25) and total-OSR uplift (1.10).
    ///
    /// Loads five JSON seed files once at construction (singleton). The files
    /// are shipped as <c>EmbeddedResource</c> (see RosraApp.csproj) so they
    /// travel with the assembly to any host — no filesystem path concerns on
    /// Azure App Service or local dev:
    ///   Data/Wofi/wofi_country_proxy.json
    ///   Data/Wofi/wofi_gni_atlas.json
    ///   Data/Wofi/wofi_assumptions.json
    ///   Data/Wofi/wofi_premium_rules.json
    ///   Data/Wofi/wofi_national_data.json
    /// </summary>
    public class WofiPotentialEstimator
    {
        private readonly Dictionary<string, WofiCountryProxy> _countryByName;
        private readonly Dictionary<string, WofiCountryProxy> _countryByIso;
        private readonly Dictionary<string, WofiGniAtlas> _gniByIso;
        private readonly Dictionary<string, WofiPremiumRule> _ruleByProfile;
        private readonly Dictionary<string, WofiNationalData> _nationalByName;
        private readonly Dictionary<string, WofiNationalData> _nationalByIso;
        private readonly WofiAssumptions _assumptions;

        public IReadOnlyList<WofiCountryProxy> Countries { get; }
        public IReadOnlyList<WofiPremiumRule> EconomicProfiles { get; }
        public WofiAssumptions Assumptions => _assumptions;

        public WofiPotentialEstimator()
        {
            var proxies = LoadEmbeddedJson<List<WofiCountryProxy>>("wofi_country_proxy.json");
            var gnis = LoadEmbeddedJson<List<WofiGniAtlas>>("wofi_gni_atlas.json");
            _assumptions = LoadEmbeddedJson<WofiAssumptions>("wofi_assumptions.json");
            var rules = LoadEmbeddedJson<List<WofiPremiumRule>>("wofi_premium_rules.json");
            var nationals = LoadEmbeddedJson<List<WofiNationalData>>("wofi_national_data.json");

            Countries = proxies;
            EconomicProfiles = rules;

            _countryByName = proxies.ToDictionary(c => Normalize(c.Country), c => c, StringComparer.OrdinalIgnoreCase);
            _countryByIso = proxies.ToDictionary(c => c.Iso3, c => c, StringComparer.OrdinalIgnoreCase);
            _gniByIso = gnis.ToDictionary(g => g.Iso3, g => g, StringComparer.OrdinalIgnoreCase);
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

        /// <summary>
        /// v13 staged peer selection + P80 frontier for one target country.
        /// Mirrors the workbook's Frontier_Calculation / GNI_Filter_Data sheets:
        ///   Stage A: same income group, proxy &gt; 0, peer GNI within 0.67×–1.50× of target GNI
        ///   Stage B: same income group, proxy &gt; 0, peer GNI within 0.50×–2.00×
        ///   Stage C: same income group, proxy &gt; 0
        ///   Stage D: nearest 15 countries by |ln(peer GNI / target GNI)|, proxy &gt; 0
        /// First stage with at least MinPeerCount (12) peers wins; the target
        /// country itself is part of the universe (the workbook includes it).
        /// Base frontier = true P80 (PERCENTILE.INC) of the selected peers, per
        /// the methodological note (v11 TESTED) §5 and its worked example
        /// (Kenya base 1.1195509% → final 1.5393826%). The standalone Excel
        /// approximates this with LARGE(…, ROUNDUP(0.2n)) only because v13
        /// removed dynamic-function dependencies — the note is authoritative.
        /// Final ratio = base/100 × 1.25 × 1.10.
        /// Returns null when no peer set can be built (e.g. target has no
        /// usable proxy/GNI data and the income group is too thin).
        /// </summary>
        public WofiBenchmark? ComputeBenchmark(WofiCountryProxy target)
        {
            var targetGni = _gniByIso.TryGetValue(target.Iso3, out var g) ? g.GniPerCapitaAtlasUsd : null;

            // Universe: countries with a positive strict OSR proxy.
            var universe = Countries
                .Where(c => (c.StrictOsrProxyPctGdp ?? 0m) > 0m)
                .Select(c => new
                {
                    Proxy = c,
                    Gni = _gniByIso.TryGetValue(c.Iso3, out var pg) ? pg.GniPerCapitaAtlasUsd : null,
                })
                .ToList();

            List<WofiCountryProxy> peers;
            string stage;

            List<WofiCountryProxy> GniBand(decimal lower, decimal upper) => universe
                .Where(u => u.Proxy.IncomeGroup == target.IncomeGroup
                            && u.Gni.HasValue && targetGni.HasValue
                            && u.Gni.Value >= lower * targetGni.Value
                            && u.Gni.Value <= upper * targetGni.Value)
                .Select(u => u.Proxy)
                .ToList();

            var stageA = GniBand(_assumptions.StageAGniLower, _assumptions.StageAGniUpper);
            var stageB = GniBand(_assumptions.StageBGniLower, _assumptions.StageBGniUpper);
            var stageC = universe.Where(u => u.Proxy.IncomeGroup == target.IncomeGroup)
                                 .Select(u => u.Proxy).ToList();

            if (stageA.Count >= _assumptions.MinPeerCount) { peers = stageA; stage = "A"; }
            else if (stageB.Count >= _assumptions.MinPeerCount) { peers = stageB; stage = "B"; }
            else if (stageC.Count >= _assumptions.MinPeerCount) { peers = stageC; stage = "C"; }
            else if (targetGni.HasValue)
            {
                peers = universe
                    .Where(u => u.Gni.HasValue)
                    .OrderBy(u => Math.Abs(Math.Log((double)(u.Gni!.Value / targetGni.Value))))
                    .Take(_assumptions.StageDNearestN)
                    .Select(u => u.Proxy)
                    .ToList();
                stage = "D";
            }
            else
            {
                // No GNI for the target and the income group is too thin: fall
                // back to the (small) same-income set if it has any members.
                peers = stageC;
                stage = "C";
            }

            if (peers.Count == 0) return null;

            // True P80 via PERCENTILE.INC interpolation (same convention as the
            // domestic P90 frontier in PerformPeerSNGAnalysis).
            var sortedAsc = peers
                .Select(p => p.StrictOsrProxyPctGdp!.Value)
                .OrderBy(v => v)
                .ToList();
            var pct = 1m - _assumptions.BaseFrontierTopShare; // top 20% share → P80
            decimal baseFrontier;
            if (sortedAsc.Count == 1)
            {
                baseFrontier = sortedAsc[0];
            }
            else
            {
                var index = (double)pct * (sortedAsc.Count - 1);
                var lower = (int)Math.Floor(index);
                var upper = (int)Math.Ceiling(index);
                baseFrontier = lower == upper
                    ? sortedAsc[lower]
                    : sortedAsc[lower] + (sortedAsc[upper] - sortedAsc[lower]) * ((decimal)index - lower);
            }

            var finalPct = baseFrontier * _assumptions.InternalDispersionFactor * (1m + _assumptions.TotalOsrUplift);

            return new WofiBenchmark
            {
                PeerStage = stage,
                PeerCount = peers.Count,
                BaseFrontierPctGdp = baseFrontier,
                FinalHeadlineFrontierPctGdp = finalPct,
                FinalBenchmarkRatio = finalPct / 100m,
                TargetGniPerCapitaAtlasUsd = targetGni,
                TopPeers = peers
                    .OrderByDescending(p => p.StrictOsrProxyPctGdp!.Value)
                    .Select(p => new WofiPeerInfo
                    {
                        Iso3 = p.Iso3,
                        Country = p.Country,
                        StrictOsrProxyPctGdp = p.StrictOsrProxyPctGdp!.Value,
                        GniPerCapitaAtlasUsd = _gniByIso.TryGetValue(p.Iso3, out var pg) ? pg.GniPerCapitaAtlasUsd : null,
                    })
                    .ToList(),
            };
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

            var benchmark = ComputeBenchmark(country);
            if (benchmark == null)
            {
                result.IsValid = false;
                result.ValidationMessage = $"No peer-country benchmark could be built for '{country.Country}'.";
                return result;
            }
            result.PeerStage = benchmark.PeerStage;
            result.PeerCount = benchmark.PeerCount;
            if (benchmark.PeerCount < _assumptions.MinPeerCount)
            {
                result.PeerSetWarning = "Peer set is small. Treat as indicative.";
            }
            result.BaseFrontierPctGdp = benchmark.BaseFrontierPctGdp;
            result.GniPerCapitaAtlasUsd = benchmark.TargetGniPerCapitaAtlasUsd;
            result.TopPeers = benchmark.TopPeers;
            result.FinalHeadlineFrontierPctGdp = benchmark.FinalHeadlineFrontierPctGdp;
            result.FinalBenchmarkRatio = benchmark.FinalBenchmarkRatio;

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
