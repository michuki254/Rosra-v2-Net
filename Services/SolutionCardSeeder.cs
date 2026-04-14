using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace RosraApp.Services
{
    /// <summary>
    /// Seeds solution cards from existing JS data files into the database.
    /// Runs once on startup if the SolutionCards table is empty.
    /// </summary>
    public static class SolutionCardSeeder
    {
        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public static async Task SeedFromJsFiles(ApplicationDbContext context, ILogger logger, string webRootPath)
        {
            // Skip if cards already exist
            if (await context.SolutionCards.IgnoreQueryFilters().AnyAsync())
            {
                logger.LogInformation("SolutionCards already seeded, skipping");
                return;
            }

            logger.LogInformation("Seeding SolutionCards from JS data files...");

            var jsDir = Path.Combine(webRootPath, "js");
            var files = new Dictionary<string, string>
            {
                { "solutionsData-PT-Coverage.js", "SolutionsDataPTCoverage" },
                { "solutionsData-PT-Compliance.js", "SolutionsDataPTCompliance" },
                { "solutionsData-PT-Valuation.js", "SolutionsDataPTValuation" },
                { "solutionsData-NP-A.js", "SolutionsDataNP_A" },
                { "solutionsData-NP-B.js", "SolutionsDataNP_B" },
                { "solutionsData-NP-C.js", "SolutionsDataNP_C" },
            };

            int totalCards = 0;

            foreach (var (fileName, globalName) in files)
            {
                var filePath = Path.Combine(jsDir, fileName);
                if (!File.Exists(filePath))
                {
                    logger.LogWarning("JS file not found: {FilePath}", filePath);
                    continue;
                }

                try
                {
                    var jsContent = await File.ReadAllTextAsync(filePath);
                    var cards = ExtractCardsFromJs(jsContent, globalName);

                    foreach (var card in cards)
                    {
                        context.SolutionCards.Add(card);
                        totalCards++;
                    }

                    logger.LogInformation("Parsed {Count} cards from {File}", cards.Count, fileName);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error parsing JS file: {File}", fileName);
                }
            }

            if (totalCards > 0)
            {
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded {Total} solution cards into database", totalCards);
            }
        }

        /// <summary>
        /// Extract the JSON array from a JS IIFE that assigns to a window global.
        /// Pattern: window.GlobalName = [ ... ];
        /// </summary>
        private static List<SolutionCard> ExtractCardsFromJs(string jsContent, string globalName)
        {
            var cards = new List<SolutionCard>();

            // Find the array assignment: window.GlobalName = [ ... ];
            var pattern = $@"window\.{Regex.Escape(globalName)}\s*=\s*\[";
            var match = Regex.Match(jsContent, pattern);
            if (!match.Success)
                return cards;

            // Extract the array content by bracket matching
            int startIdx = match.Index + match.Length - 1; // position of '['
            var jsonArray = ExtractBalancedBrackets(jsContent, startIdx);
            if (string.IsNullOrEmpty(jsonArray))
                return cards;

            // Parse as JSON array of objects
            try
            {
                using var doc = JsonDocument.Parse(jsonArray);
                foreach (var element in doc.RootElement.EnumerateArray())
                {
                    var card = JsonElementToSolutionCard(element);
                    if (card != null)
                        cards.Add(card);
                }
            }
            catch (JsonException)
            {
                // JS objects may have unquoted keys or trailing commas — try cleanup
                var cleaned = CleanJsObjectToJson(jsonArray);
                try
                {
                    using var doc = JsonDocument.Parse(cleaned);
                    foreach (var element in doc.RootElement.EnumerateArray())
                    {
                        var card = JsonElementToSolutionCard(element);
                        if (card != null)
                            cards.Add(card);
                    }
                }
                catch { /* If cleanup also fails, skip this file */ }
            }

            return cards;
        }

        /// <summary>
        /// Extract balanced brackets starting from a '[' character.
        /// </summary>
        private static string ExtractBalancedBrackets(string content, int startIdx)
        {
            if (startIdx >= content.Length || content[startIdx] != '[')
                return string.Empty;

            int depth = 0;
            bool inString = false;
            char stringChar = '"';

            for (int i = startIdx; i < content.Length; i++)
            {
                char c = content[i];

                if (inString)
                {
                    if (c == '\\') { i++; continue; } // skip escaped char
                    if (c == stringChar) inString = false;
                    continue;
                }

                if (c == '"' || c == '\'' || c == '`')
                {
                    inString = true;
                    stringChar = c;
                    continue;
                }

                if (c == '[') depth++;
                else if (c == ']') depth--;

                if (depth == 0)
                    return content.Substring(startIdx, i - startIdx + 1);
            }

            return string.Empty;
        }

        /// <summary>
        /// Clean JS object notation to valid JSON (handle unquoted keys, trailing commas, single quotes).
        /// </summary>
        private static string CleanJsObjectToJson(string js)
        {
            // Replace single quotes with double quotes (simple heuristic)
            var result = js;

            // Quote unquoted keys: word: → "word":
            result = Regex.Replace(result, @"(?<=[\{,\n])\s*(\w+)\s*:", " \"$1\":");

            // Remove trailing commas before } or ]
            result = Regex.Replace(result, @",\s*([}\]])", "$1");

            // Replace single-quoted strings with double-quoted
            // This is approximate — handles most cases
            result = Regex.Replace(result, @"'([^']*)'", "\"$1\"");

            return result;
        }

        /// <summary>
        /// Convert a JsonElement to a SolutionCard entity.
        /// </summary>
        private static SolutionCard? JsonElementToSolutionCard(JsonElement element)
        {
            try
            {
                var card = new SolutionCard
                {
                    SolutionId = GetStringProp(element, "solutionId") ?? "",
                    Stream = GetStringProp(element, "stream") ?? "",
                    StreamType = GetStringProp(element, "streamType") ?? "",
                    Subgroup = GetStringProp(element, "subgroup"),
                    Gap = GetStringProp(element, "gap") ?? "",
                    Title = GetStringProp(element, "title") ?? "",
                    ShortTitle = GetStringProp(element, "shortTitle"),
                    Timeline = GetStringProp(element, "timeline"),
                    DeliveryDifficulty = GetStringProp(element, "deliveryDifficulty"),
                    PoliticalSensitivity = GetStringProp(element, "politicalSensitivity"),
                    Category = GetStringProp(element, "category"),
                    SortOrder = element.TryGetProperty("sortOrder", out var so) && so.ValueKind == JsonValueKind.Number ? so.GetInt32() : 0,
                    IsActive = element.TryGetProperty("isActive", out var ia) ? ia.GetBoolean() : true,
                    CreatedAt = DateTime.UtcNow
                };

                // Store overview and fullDetails as JSON strings
                if (element.TryGetProperty("overview", out var ov))
                    card.OverviewData = ov.GetRawText();

                if (element.TryGetProperty("fullDetails", out var fd))
                    card.FullDetailsData = fd.GetRawText();

                if (string.IsNullOrEmpty(card.SolutionId))
                    return null;

                return card;
            }
            catch
            {
                return null;
            }
        }

        private static string? GetStringProp(JsonElement element, string propertyName)
        {
            if (element.TryGetProperty(propertyName, out var prop))
            {
                if (prop.ValueKind == JsonValueKind.String)
                    return prop.GetString();
                if (prop.ValueKind == JsonValueKind.Null)
                    return null;
            }
            return null;
        }
    }
}
