using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using RosraApp.Models.ViewModels;
using System.Text.Json;

namespace RosraApp.Services
{
    public class ReportExportService
    {
        private Dictionary<string, byte[]> _chartImages = new();
        private string _currencySymbol = "$";

        public byte[] GeneratePdfReport(RosraFormViewModel model, string title = "ROSRA Analysis Report")
        {
            QuestPDF.Settings.License = LicenseType.Community;

            _currencySymbol = model.CurrencySymbol ?? "$";
            _chartImages = ParseChartImages(model.ChartImagesData);

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(40);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header().Element(c => ComposeHeader(c, model, title));
                    page.Content().Element(c => ComposeContent(c, model));
                    page.Footer().Element(ComposeFooter);
                });
            });

            return document.GeneratePdf();
        }

        private Dictionary<string, byte[]> ParseChartImages(string? chartImagesJson)
        {
            var images = new Dictionary<string, byte[]>();
            if (string.IsNullOrEmpty(chartImagesJson)) return images;

            try
            {
                var dict = JsonSerializer.Deserialize<Dictionary<string, string>>(chartImagesJson);
                if (dict == null) return images;

                foreach (var kvp in dict)
                {
                    try
                    {
                        images[kvp.Key] = Convert.FromBase64String(kvp.Value);
                    }
                    catch { /* skip invalid base64 */ }
                }
            }
            catch { /* skip invalid JSON */ }

            return images;
        }

        private void EmbedChart(IContainer container, string canvasId, string fallbackText = "Chart not available")
        {
            if (_chartImages.TryGetValue(canvasId, out var imageBytes))
            {
                container.Image(imageBytes).FitWidth();
            }
            else
            {
                container.Background(Colors.Grey.Lighten4).Padding(20).AlignCenter()
                    .Text(fallbackText).FontSize(9).FontColor(Colors.Grey.Medium).Italic();
            }
        }

        private void ComposeHeader(IContainer container, RosraFormViewModel model, string title)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text(title).FontSize(20).Bold().FontColor(Colors.Blue.Darken2);

                    var location = string.Join(", ", new[] { model.City, model.Region, model.Country }
                        .Where(s => !string.IsNullOrEmpty(s)));
                    column.Item().Text(location).FontSize(12).FontColor(Colors.Grey.Darken1);
                    column.Item().Text($"Financial Year: {model.FinancialYear ?? "N/A"}")
                        .FontSize(10).FontColor(Colors.Grey.Medium);
                    column.Item().PaddingTop(10).LineHorizontal(2).LineColor(Colors.Blue.Lighten2);
                });
            });
        }

        private void ComposeContent(IContainer container, RosraFormViewModel model)
        {
            container.PaddingTop(20).Column(column =>
            {
                // Section 1: Executive Summary
                column.Item().Element(c => ComposeExecutiveSummary(c, model));
                column.Item().PaddingVertical(15);

                // Section 2: Top-Down Frontier Analysis
                column.Item().Element(c => ComposeTopDownAnalysis(c, model));
                column.Item().PaddingVertical(15);

                // Section 3: Gap Analysis Per Stream
                column.Item().Element(c => ComposeGapAnalysis(c, model));
                column.Item().PaddingVertical(15);

                // Section 4: Prioritization Results
                if (!string.IsNullOrEmpty(model.PrioritizationData))
                {
                    column.Item().Element(c => ComposePrioritization(c, model));
                    column.Item().PaddingVertical(15);
                }

                // Section 5: Selected Solutions
                if (!string.IsNullOrEmpty(model.SelectedSolutionsData))
                {
                    column.Item().Element(c => ComposeSelectedSolutions(c, model));
                    column.Item().PaddingVertical(15);
                }

                // Section 6: Recommendations
                column.Item().Element(c => ComposeRecommendations(c, model));
            });
        }

        private void ComposeExecutiveSummary(IContainer container, RosraFormViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Executive Summary").FontSize(16).Bold().FontColor(Colors.Blue.Darken2);

                column.Item().PaddingTop(10).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(15).Column(inner =>
                {
                    // Location and Financial Info
                    inner.Item().Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Location Information").Bold();
                            c.Item().Text($"Country: {model.Country ?? "N/A"}");
                            c.Item().Text($"Region/State: {model.Region ?? "N/A"}");
                            c.Item().Text($"City: {model.City ?? "N/A"}");
                        });
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Financial Details").Bold();
                            c.Item().Text($"Currency: {model.Currency ?? "N/A"} ({_currencySymbol})");
                            c.Item().Text($"Financial Year: {model.FinancialYear ?? "N/A"}");
                            c.Item().Text($"Income Level: {model.IncomeLevel ?? "N/A"}");
                        });
                    });

                    inner.Item().PaddingTop(15);

                    // Revenue Summary
                    inner.Item().Text("Revenue Overview").Bold();
                    decimal totalCurrent = 0, totalPotential = 0, totalGap = 0;

                    if (model.PropertyTax.RevenueToDate.HasValue)
                        totalCurrent += model.PropertyTax.RevenueToDate.Value;
                    if (model.License.RevenueToDate.HasValue)
                        totalCurrent += model.License.RevenueToDate.Value;

                    foreach (var stream in model.GenericStreams ?? new List<GenericStreamViewModel>())
                    {
                        totalCurrent += stream.RevenueToDate ?? 0;
                        totalPotential += stream.TotalPotentialRevenue ?? 0;
                        totalGap += stream.TotalFunctionalGap ?? 0;
                    }

                    inner.Item().Table(table =>
                    {
                        table.ColumnsDefinition(cols => { cols.RelativeColumn(2); cols.RelativeColumn(1); });
                        table.Cell().Text("Metric").Bold();
                        table.Cell().Text("Value").Bold();
                        table.Cell().Text("Total Current Revenue");
                        table.Cell().Text($"{_currencySymbol} {totalCurrent:N0}");
                        table.Cell().Text("Estimated Total Potential");
                        table.Cell().Text($"{_currencySymbol} {totalPotential:N0}");
                        table.Cell().Background(Colors.Orange.Lighten4).Text("Total Estimated Gap").Bold();
                        table.Cell().Background(Colors.Orange.Lighten4).Text($"{_currencySymbol} {totalGap:N0}").Bold();
                    });
                });
            });
        }

        private void ComposeTopDownAnalysis(IContainer container, RosraFormViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Top-Down Frontier Analysis").FontSize(16).Bold().FontColor(Colors.Blue.Darken2);

                // Intro text (matches the page intro box)
                column.Item().PaddingTop(10).Background("#F0F9FF").Padding(12).Column(intro =>
                {
                    intro.Item().Text("A quick snapshot comparing the SNG's own-source revenues with similar domestic or international peers. Even if the snapshot looks strong (or suggests limited room), the bottom-up analysis remains the main reference because it measures gaps directly by revenue stream.")
                        .FontSize(9).FontColor("#334155");
                });

                // Data Input Summary
                column.Item().PaddingTop(15).Text("Data Input Block").FontSize(13).Bold().FontColor("#00689D");
                column.Item().PaddingTop(5).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Table(table =>
                {
                    table.ColumnsDefinition(cols => { cols.RelativeColumn(1); cols.RelativeColumn(1); cols.RelativeColumn(1); cols.RelativeColumn(1); });

                    table.Cell().Text("Country").Bold().FontSize(8).FontColor(Colors.Grey.Darken1);
                    table.Cell().Text("Financial Year").Bold().FontSize(8).FontColor(Colors.Grey.Darken1);
                    table.Cell().Text("Currency").Bold().FontSize(8).FontColor(Colors.Grey.Darken1);
                    table.Cell().Text("Income Level").Bold().FontSize(8).FontColor(Colors.Grey.Darken1);

                    table.Cell().Text(model.Country ?? "-").FontSize(9);
                    table.Cell().Text(model.FinancialYear ?? "-").FontSize(9);
                    table.Cell().Text($"{model.Currency ?? "-"} ({_currencySymbol})").FontSize(9);
                    table.Cell().Text(model.IncomeLevel ?? "-").FontSize(9);

                    table.Cell().Text("Region/State").Bold().FontSize(8).FontColor(Colors.Grey.Darken1);
                    table.Cell().Text("City/Municipality").Bold().FontSize(8).FontColor(Colors.Grey.Darken1);
                    table.Cell().Text("Government Type").Bold().FontSize(8).FontColor(Colors.Grey.Darken1);
                    table.Cell().Text("").FontSize(8);

                    table.Cell().Text(model.Region ?? "-").FontSize(9);
                    table.Cell().Text(model.City ?? "-").FontSize(9);
                    table.Cell().Text(model.GovernmentType ?? "-").FontSize(9);
                    table.Cell().Text("").FontSize(9);
                });

                // Parse PeerSNGData for frontier metrics
                if (string.IsNullOrEmpty(model.PeerSNGData))
                {
                    column.Item().PaddingTop(15).Background(Colors.Grey.Lighten4).Padding(20).AlignCenter()
                        .Text("No frontier analysis data available. Select a country and subnational government to generate this analysis.")
                        .FontColor(Colors.Grey.Medium).Italic();
                    return;
                }

                try
                {
                    var peerData = JsonSerializer.Deserialize<JsonElement>(model.PeerSNGData);

                    // === Within-Country OSR Frontier (Peer SNGs) ===
                    column.Item().PaddingTop(20).Background("#00b2e3").Padding(12).Column(header =>
                    {
                        header.Item().Text("Within-Country OSR Frontier (Peer SNGs)")
                            .FontSize(14).Bold().FontColor(Colors.White);
                        header.Item().Text("Compare against domestic peer subnational governments")
                            .FontSize(9).FontColor("rgba(255,255,255,0.85)");
                    });

                    if (peerData.TryGetProperty("analysisResults", out var results))
                    {
                        // Metrics table — matches the exact metric rows on the page
                        column.Item().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(12).Column(metrics =>
                        {
                            void AddRow(string label, string propName, string? bg = null, bool bold = false, bool isGap = false)
                            {
                                var bgColor = bg ?? Colors.White;
                                var val = GetJsonString(results, propName);
                                metrics.Item().Background(bgColor).PaddingVertical(4).PaddingHorizontal(8).Row(row =>
                                {
                                    var labelText = row.RelativeItem(2).Text(label).FontSize(9);
                                    if (bold) labelText.Bold();
                                    var valText = row.RelativeItem(1).AlignRight().Text(val).FontSize(9);
                                    if (bold) valText.Bold();
                                    if (isGap) valText.FontColor(Colors.Orange.Darken2);
                                });
                            }

                            AddRow("Own Source Revenues (OSRs) per capita", "actualOSR");
                            AddRow("Subnational GDP per capita", "subnationalGDP");
                            AddRow("Peer frontier multiplier (Top-20% avg OSR/GDP per capita)", "frontierMultiplier", Colors.Blue.Lighten5);
                            AddRow("Subject multiplier", "subjectMultiplier");
                            AddRow("Frontier benchmark per capita", "osrPotential", Colors.Blue.Lighten4, bold: true);
                            AddRow("Gap to frontier benchmark", "osrGap", Colors.Orange.Lighten4, bold: true, isGap: true);
                            AddRow("Performance Index", "performanceIndex", Colors.Teal.Lighten4);
                        });
                    }

                    // Scatter chart — OSR/GDP per capita Multiplier Comparison
                    column.Item().PaddingTop(15).Text("OSR/GDP per capita Multiplier Comparison")
                        .FontSize(11).Bold().FontColor("#333");
                    column.Item().PaddingTop(5).Element(c => EmbedChart(c, "peerSngChartTop",
                        "Peer SNG scatter chart — visit the Top-Down tab to generate this chart"));

                    // Bar chart — Current OSR vs Frontier Benchmark per capita
                    column.Item().PaddingTop(15).Text("Current OSR vs Frontier Benchmark per capita")
                        .FontSize(11).Bold().FontColor("#333");
                    column.Item().PaddingTop(5).Element(c => EmbedChart(c, "actualVsPotentialChart",
                        "Actual vs Benchmark bar chart — visit the Top-Down tab to generate this chart"));

                    // Analysis result text box
                    if (peerData.TryGetProperty("resultText", out var resultText) && !string.IsNullOrEmpty(resultText.GetString()))
                    {
                        column.Item().PaddingTop(15).Background("#FFF8E1").Border(1).BorderColor("#FFE082").Padding(12).Column(rc =>
                        {
                            rc.Item().Text("Within-Country OSR Frontier (Peer SNGs) Result:")
                                .Bold().FontSize(10).FontColor("#E65100");
                            rc.Item().PaddingTop(5).Text(resultText.GetString() ?? "").FontSize(9).LineHeight(1.4f);
                        });
                    }

                    // === Optional: Cross-Country Fiscal Analysis ===
                    if (peerData.TryGetProperty("crossCountry", out var cc) && HasAnyValue(cc))
                    {
                        column.Item().PaddingTop(25).Text("Optional: Cross-Country Fiscal Analysis")
                            .FontSize(14).Bold().FontColor(Colors.Blue.Darken2);
                        column.Item().PaddingTop(3).Text("The following analyses compare your country's position in the global fiscal decentralisation space.")
                            .FontSize(9).FontColor(Colors.Grey.Darken1);

                        // A. Funding Decentralization Frontier
                        column.Item().PaddingTop(15).Background("#00b2e3").Padding(10).Row(hdr =>
                        {
                            hdr.ConstantItem(25).AlignCenter().Text("A").FontSize(10).Bold().FontColor(Colors.White);
                            hdr.RelativeItem().Text("Funding Decentralization Frontier").FontSize(12).Bold().FontColor(Colors.White);
                        });

                        column.Item().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(fundingMetrics =>
                        {
                            AddCrossCountryRow(fundingMetrics, "SNG revenue per capita", GetJsonString(cc, "sngRevenuePerCapita"));
                            AddCrossCountryRow(fundingMetrics, "Peer benchmark (top-20% avg)", GetJsonString(cc, "peerBenchmarkFunding"), Colors.Blue.Lighten5);
                            AddCrossCountryRow(fundingMetrics, "Funding index", GetJsonString(cc, "fundingIndex"), Colors.Teal.Lighten4);
                            AddCrossCountryRow(fundingMetrics, "Funding headroom (USD per capita)", GetJsonString(cc, "fundingHeadroom"), Colors.Blue.Lighten4, bold: true);
                        });

                        // B. Subnational Revenue Autonomy
                        column.Item().PaddingTop(15).Background("#00b2e3").Padding(10).Row(hdr =>
                        {
                            hdr.ConstantItem(25).AlignCenter().Text("B").FontSize(10).Bold().FontColor(Colors.White);
                            hdr.RelativeItem().Text("Subnational Revenue Autonomy").FontSize(12).Bold().FontColor(Colors.White);
                        });

                        column.Item().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(autoMetrics =>
                        {
                            AddCrossCountryRow(autoMetrics, "Non-grants share of SNG revenue (%)", GetJsonString(cc, "nonGrantsShare"));
                            AddCrossCountryRow(autoMetrics, "Peer benchmark (top-20% avg)", GetJsonString(cc, "peerBenchmarkAutonomy"), Colors.Blue.Lighten5);
                            AddCrossCountryRow(autoMetrics, "Autonomy index", GetJsonString(cc, "autonomyIndex"), Colors.Teal.Lighten4);
                            AddCrossCountryRow(autoMetrics, "Distance from peer benchmark (% points)", GetJsonString(cc, "distanceFromBenchmark"));
                            AddCrossCountryRow(autoMetrics, "Position relative to peer benchmark", GetJsonString(cc, "positionRelative"), Colors.Orange.Lighten4, bold: true);
                        });

                        // Fiscal Decentralisation Chart
                        column.Item().PaddingTop(15).Text("Position in fiscal decentralisation space")
                            .FontSize(11).Bold().FontColor("#333");
                        column.Item().PaddingTop(5).Element(c => EmbedChart(c, "fiscalDecentralisationChart",
                            "Fiscal decentralisation chart — visit the Top-Down tab to generate this chart"));

                        // Cross-Country Result Text
                        if (peerData.TryGetProperty("crossCountryResultText", out var ccResult) && !string.IsNullOrEmpty(ccResult.GetString()))
                        {
                            column.Item().PaddingTop(15).Background("#FFF8E1").Border(1).BorderColor("#FFE082").Padding(12).Column(rc =>
                            {
                                rc.Item().Text("Cross-Country Fiscal Analysis Result:")
                                    .Bold().FontSize(10).FontColor("#E65100");
                                rc.Item().PaddingTop(5).Text(ccResult.GetString() ?? "").FontSize(9).LineHeight(1.4f);
                            });
                        }
                    }
                }
                catch
                {
                    column.Item().PaddingTop(10).Text("Could not parse frontier analysis data.")
                        .FontColor(Colors.Grey.Medium).Italic();
                }
            });
        }

        private string GetJsonString(JsonElement parent, string propertyName)
        {
            if (parent.TryGetProperty(propertyName, out var prop))
            {
                if (prop.ValueKind == JsonValueKind.String)
                    return prop.GetString() ?? "-";
                if (prop.ValueKind == JsonValueKind.Number)
                    return prop.ToString();
            }
            return "-";
        }

        private bool HasAnyValue(JsonElement element)
        {
            foreach (var prop in element.EnumerateObject())
            {
                if (prop.Value.ValueKind == JsonValueKind.String && !string.IsNullOrEmpty(prop.Value.GetString()) && prop.Value.GetString() != "-")
                    return true;
                if (prop.Value.ValueKind == JsonValueKind.Number)
                    return true;
            }
            return false;
        }

        private void AddCrossCountryRow(ColumnDescriptor column, string label, string value, string? bgColor = null, bool bold = false)
        {
            var bg = bgColor ?? Colors.White;
            column.Item().Background(bg).PaddingVertical(4).PaddingHorizontal(8).Row(row =>
            {
                var labelText = row.RelativeItem(2).Text(label).FontSize(9);
                if (bold) labelText.Bold();
                var valText = row.RelativeItem(1).AlignRight().Text(value).FontSize(9);
                if (bold) valText.Bold();
            });
        }

        private void ComposeGapAnalysis(IContainer container, RosraFormViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Gap Analysis by Revenue Stream").FontSize(16).Bold().FontColor(Colors.Blue.Darken2);

                // Property Tax
                column.Item().PaddingTop(15).Element(c => ComposeStreamGapTable(c,
                    model.PropertyTaxDisplayName ?? "Property Tax",
                    model.PropertyTax.RevenueToDate ?? 0,
                    model.PropertyTax.OutstandingAmount ?? 0, 0, 0, 0, 0));
                column.Item().PaddingTop(5).Row(row =>
                {
                    row.RelativeItem().Element(c => EmbedChart(c, "potentialRevenueChart", ""));
                    row.ConstantItem(10);
                    row.RelativeItem().Element(c => EmbedChart(c, "adminGapChart", ""));
                });

                // Business License
                column.Item().PaddingTop(15).Element(c => ComposeStreamGapTable(c,
                    model.BusinessLicenseDisplayName ?? "Business License",
                    model.License.RevenueToDate ?? 0,
                    model.License.OutstandingAmount ?? 0, 0, 0, 0, 0));
                column.Item().PaddingTop(5).Row(row =>
                {
                    row.RelativeItem().Element(c => EmbedChart(c, "blPotentialRevenueChart", ""));
                    row.ConstantItem(10);
                    row.RelativeItem().Element(c => EmbedChart(c, "blGapBreakdownChart", ""));
                });

                // Generic Streams
                int streamIndex = 0;
                foreach (var stream in model.GenericStreams ?? new List<GenericStreamViewModel>())
                {
                    column.Item().PaddingTop(15).Element(c => ComposeStreamGapTable(c,
                        stream.StreamName ?? "Revenue Stream",
                        stream.RevenueToDate ?? 0,
                        stream.ComplianceGap ?? 0,
                        stream.CoverageGap ?? 0,
                        stream.LiabilityGap ?? 0,
                        stream.MixedGapCompliance ?? 0,
                        stream.MixedGapCoverage ?? 0));

                    var sid = $"stream{streamIndex}";
                    column.Item().PaddingTop(5).Row(row =>
                    {
                        row.RelativeItem().Element(c => EmbedChart(c, $"{sid}PotentialRevenueChart", ""));
                        row.ConstantItem(10);
                        row.RelativeItem().Element(c => EmbedChart(c, $"{sid}GapBreakdownChart", ""));
                    });
                    streamIndex++;
                }

                // Total gap charts
                if (_chartImages.ContainsKey("totalGapChart") || _chartImages.ContainsKey("gapBreakdownChart"))
                {
                    column.Item().PaddingTop(15).Text("Total Gap Summary").FontSize(13).Bold().FontColor("#00689D");
                    column.Item().PaddingTop(5).Row(row =>
                    {
                        row.RelativeItem().Element(c => EmbedChart(c, "totalGapChart", ""));
                        row.ConstantItem(10);
                        row.RelativeItem().Element(c => EmbedChart(c, "gapBreakdownChart", ""));
                    });
                }
            });
        }

        private void ComposeStreamGapTable(IContainer container, string streamName,
            decimal revenue, decimal complianceGap, decimal coverageGap, decimal liabilityGap,
            decimal mixedComplianceGap, decimal mixedCoverageGap)
        {
            var total = revenue + complianceGap + coverageGap + liabilityGap + mixedComplianceGap + mixedCoverageGap;

            container.Border(1).BorderColor(Colors.Grey.Lighten2).Column(column =>
            {
                column.Item().Background(Colors.Blue.Lighten4).Padding(8).Text(streamName).FontSize(12).Bold();
                column.Item().Padding(10).Table(table =>
                {
                    table.ColumnsDefinition(cols => { cols.RelativeColumn(2); cols.RelativeColumn(1); cols.RelativeColumn(1); });

                    table.Cell().Text("Component").Bold().FontSize(9);
                    table.Cell().AlignRight().Text("Amount").Bold().FontSize(9);
                    table.Cell().AlignRight().Text("Share %").Bold().FontSize(9);

                    AddGapRow(table, "Revenue to Date", revenue, total, Colors.Green.Lighten4);
                    AddGapRow(table, "Compliance Gap", complianceGap, total, Colors.Red.Lighten5);
                    AddGapRow(table, "Coverage Gap", coverageGap, total, Colors.Orange.Lighten5);
                    AddGapRow(table, "Liability Gap", liabilityGap, total, Colors.Blue.Lighten5);
                    AddGapRow(table, "Mixed (Comp.+Liab.)", mixedComplianceGap, total, Colors.Purple.Lighten5);
                    AddGapRow(table, "Mixed (Cov.+Liab.)", mixedCoverageGap, total, Colors.Pink.Lighten5);

                    table.Cell().Background(Colors.Grey.Lighten3).Text("TOTAL POTENTIAL").Bold().FontSize(9);
                    table.Cell().Background(Colors.Grey.Lighten3).AlignRight().Text($"{_currencySymbol} {total:N0}").Bold().FontSize(9);
                    table.Cell().Background(Colors.Grey.Lighten3).AlignRight().Text("100%").Bold().FontSize(9);
                });
            });
        }

        private void AddGapRow(TableDescriptor table, string label, decimal value, decimal total, string backgroundColor)
        {
            var percentage = total > 0 ? (value / total * 100) : 0;
            table.Cell().Background(backgroundColor).Text(label).FontSize(9);
            table.Cell().Background(backgroundColor).AlignRight().Text($"{_currencySymbol} {value:N0}").FontSize(9);
            table.Cell().Background(backgroundColor).AlignRight().Text($"{percentage:N1}%").FontSize(9);
        }

        private void ComposePrioritization(IContainer container, RosraFormViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Prioritization Results").FontSize(16).Bold().FontColor(Colors.Blue.Darken2);

                try
                {
                    var data = JsonSerializer.Deserialize<JsonElement>(model.PrioritizationData!);

                    // Try to extract stream prioritization table
                    if (data.TryGetProperty("streams", out var streams) && streams.ValueKind == JsonValueKind.Array)
                    {
                        column.Item().PaddingTop(10).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Table(table =>
                        {
                            table.ColumnsDefinition(cols =>
                            {
                                cols.ConstantColumn(40);
                                cols.RelativeColumn(2);
                                cols.RelativeColumn(1);
                                cols.RelativeColumn(1);
                            });

                            table.Cell().Background(Colors.Blue.Lighten4).Text("Rank").Bold().FontSize(9);
                            table.Cell().Background(Colors.Blue.Lighten4).Text("Revenue Stream").Bold().FontSize(9);
                            table.Cell().Background(Colors.Blue.Lighten4).AlignRight().Text("Total Gap").Bold().FontSize(9);
                            table.Cell().Background(Colors.Blue.Lighten4).AlignRight().Text("Share %").Bold().FontSize(9);

                            foreach (var stream in streams.EnumerateArray())
                            {
                                var rank = stream.TryGetProperty("rank", out var r) ? r.ToString() : "-";
                                var name = stream.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "";
                                var gap = stream.TryGetProperty("gap", out var g) ? g.GetDouble() : 0;
                                var share = stream.TryGetProperty("share", out var s) ? s.GetDouble() : 0;

                                table.Cell().Text(rank).FontSize(9);
                                table.Cell().Text(name).FontSize(9);
                                table.Cell().AlignRight().Text($"{_currencySymbol} {gap:N0}").FontSize(9);
                                table.Cell().AlignRight().Text($"{share:N1}%").FontSize(9);
                            }
                        });
                    }
                    else
                    {
                        column.Item().PaddingTop(10).Text("Prioritization data has been captured.")
                            .FontColor(Colors.Grey.Darken1);
                    }
                }
                catch
                {
                    column.Item().PaddingTop(10).Text("Prioritization data is available in the application.")
                        .FontColor(Colors.Grey.Medium);
                }

                // Prioritization charts
                if (_chartImages.ContainsKey("gapBarChart") || _chartImages.ContainsKey("gapPieChart"))
                {
                    column.Item().PaddingTop(10).Row(row =>
                    {
                        row.RelativeItem().Element(c => EmbedChart(c, "gapBarChart", ""));
                        row.ConstantItem(10);
                        row.RelativeItem().Element(c => EmbedChart(c, "gapPieChart", ""));
                    });
                }
            });
        }

        private void ComposeSelectedSolutions(IContainer container, RosraFormViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Selected Solutions").FontSize(16).Bold().FontColor(Colors.Blue.Darken2);

                try
                {
                    var data = JsonSerializer.Deserialize<JsonElement>(model.SelectedSolutionsData!);

                    if (data.TryGetProperty("selectedSolutions", out var solutions) && solutions.ValueKind == JsonValueKind.Array)
                    {
                        int count = 0;
                        column.Item().PaddingTop(10).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Table(table =>
                        {
                            table.ColumnsDefinition(cols =>
                            {
                                cols.ConstantColumn(60);
                                cols.RelativeColumn(2);
                                cols.RelativeColumn(1);
                                cols.RelativeColumn(1);
                            });

                            table.Cell().Background(Colors.Blue.Lighten4).Text("ID").Bold().FontSize(9);
                            table.Cell().Background(Colors.Blue.Lighten4).Text("Solution").Bold().FontSize(9);
                            table.Cell().Background(Colors.Blue.Lighten4).Text("Stream / Gap").Bold().FontSize(9);
                            table.Cell().Background(Colors.Blue.Lighten4).Text("Timeline").Bold().FontSize(9);

                            foreach (var sol in solutions.EnumerateArray())
                            {
                                var id = sol.TryGetProperty("solutionId", out var sid) ? sid.GetString() ?? "" : "";
                                var title = sol.TryGetProperty("title", out var t) ? t.GetString() ?? "" : id;
                                var stream = sol.TryGetProperty("streamName", out var sn) ? sn.GetString() ?? "" : "";
                                var gap = sol.TryGetProperty("gapType", out var gt) ? gt.GetString() ?? "" : "";
                                var timeline = sol.TryGetProperty("timeline", out var tl) ? tl.GetString() ?? "" : "";

                                table.Cell().Text(id).FontSize(8);
                                table.Cell().Text(title).FontSize(8);
                                table.Cell().Text($"{stream} / {gap}").FontSize(8);
                                table.Cell().Text(timeline).FontSize(8);
                                count++;
                            }
                        });

                        column.Item().PaddingTop(5).Text($"Total: {count} solutions selected").FontSize(9).Bold();
                    }
                    else
                    {
                        column.Item().PaddingTop(10).Text("No solutions have been selected yet.")
                            .FontColor(Colors.Grey.Medium);
                    }
                }
                catch
                {
                    column.Item().PaddingTop(10).Text("Solution data could not be parsed.")
                        .FontColor(Colors.Grey.Medium);
                }
            });
        }

        private void ComposeRecommendations(IContainer container, RosraFormViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Recommendations & Action Plan").FontSize(16).Bold().FontColor(Colors.Blue.Darken2);

                column.Item().PaddingTop(10).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(15).Column(inner =>
                {
                    if (!string.IsNullOrEmpty(model.RecommendationSummary))
                    {
                        inner.Item().Text("Summary").Bold();
                        inner.Item().Text(model.RecommendationSummary);
                    }

                    if (model.ActionItems != null && model.ActionItems.Any())
                    {
                        inner.Item().PaddingTop(10).Text("Action Items").Bold();
                        foreach (var item in model.ActionItems)
                        {
                            var priorityColor = item.Priority?.ToLower() switch
                            {
                                "high" => Colors.Red.Darken1,
                                "medium" => Colors.Orange.Darken1,
                                "low" => Colors.Green.Darken1,
                                _ => Colors.Grey.Darken1
                            };
                            inner.Item().Row(row =>
                            {
                                row.ConstantItem(60).Text($"[{item.Priority?.ToUpper() ?? "MEDIUM"}]")
                                    .FontColor(priorityColor).FontSize(8).Bold();
                                row.RelativeItem().Text(item.Description ?? "").FontSize(9);
                            });
                        }
                    }

                    // Implementation progress
                    if (!string.IsNullOrEmpty(model.ImplementationProgressData))
                    {
                        try
                        {
                            var progress = JsonSerializer.Deserialize<JsonElement>(model.ImplementationProgressData);
                            inner.Item().PaddingTop(10).Text("Implementation Progress").Bold();
                            inner.Item().Text("Implementation progress data has been captured and is available in the application dashboard.")
                                .FontSize(9).FontColor(Colors.Grey.Darken1);
                        }
                        catch { }
                    }

                    if (string.IsNullOrEmpty(model.RecommendationSummary) &&
                        (model.ActionItems == null || !model.ActionItems.Any()) &&
                        string.IsNullOrEmpty(model.SelectedSolutionsData))
                    {
                        inner.Item().Text("No recommendations have been entered yet.")
                            .FontColor(Colors.Grey.Medium);
                        inner.Item().PaddingTop(5).Text("Complete the analysis workflow to generate recommendations.");
                    }
                });
            });
        }

        private void ComposeFooter(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeItem().AlignLeft().Text(text =>
                {
                    text.Span("Generated by ROSRA Application - UN-Habitat").FontSize(8).FontColor(Colors.Grey.Medium);
                });
                row.RelativeItem().AlignCenter().Text(text =>
                {
                    text.Span("Page ").FontSize(8).FontColor(Colors.Grey.Medium);
                    text.CurrentPageNumber().FontSize(8).FontColor(Colors.Grey.Medium);
                    text.Span(" of ").FontSize(8).FontColor(Colors.Grey.Medium);
                    text.TotalPages().FontSize(8).FontColor(Colors.Grey.Medium);
                });
                row.RelativeItem().AlignRight().Text(text =>
                {
                    text.Span(DateTime.Now.ToString("yyyy-MM-dd HH:mm")).FontSize(8).FontColor(Colors.Grey.Medium);
                });
            });
        }
    }
}
