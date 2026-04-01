using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using RosraApp.Models.ViewModels;
using System.Text.Json;

namespace RosraApp.Services
{
    public class ReportExportService
    {
        public byte[] GeneratePdfReport(RosraFormViewModel model, string title = "ROSRA Analysis Report")
        {
            // Set QuestPDF license (Community license for open source)
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(40);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header()
                        .Element(c => ComposeHeader(c, model, title));

                    page.Content()
                        .Element(c => ComposeContent(c, model));

                    page.Footer()
                        .Element(ComposeFooter);
                });
            });

            return document.GeneratePdf();
        }

        private void ComposeHeader(IContainer container, RosraFormViewModel model, string title)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text(title)
                        .FontSize(20)
                        .Bold()
                        .FontColor(Colors.Blue.Darken2);

                    column.Item().Text($"{model.City ?? "Unknown City"}, {model.Region ?? ""}, {model.Country ?? ""}")
                        .FontSize(12)
                        .FontColor(Colors.Grey.Darken1);

                    column.Item().Text($"Financial Year: {model.FinancialYear ?? "N/A"}")
                        .FontSize(10)
                        .FontColor(Colors.Grey.Medium);

                    column.Item().PaddingTop(10).LineHorizontal(2).LineColor(Colors.Blue.Lighten2);
                });
            });
        }

        private void ComposeContent(IContainer container, RosraFormViewModel model)
        {
            container.PaddingTop(20).Column(column =>
            {
                // Executive Summary Section
                column.Item().Element(c => ComposeExecutiveSummary(c, model));

                column.Item().PaddingVertical(15);

                // Gap Analysis Per Stream
                column.Item().Element(c => ComposeGapAnalysis(c, model));

                column.Item().PaddingVertical(15);

                // Prioritization Results (if available)
                if (!string.IsNullOrEmpty(model.PrioritizationData))
                {
                    column.Item().Element(c => ComposePrioritization(c, model));
                    column.Item().PaddingVertical(15);
                }

                // Selected Solutions and Recommendations
                column.Item().Element(c => ComposeRecommendations(c, model));
            });
        }

        private void ComposeExecutiveSummary(IContainer container, RosraFormViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Executive Summary")
                    .FontSize(16)
                    .Bold()
                    .FontColor(Colors.Blue.Darken2);

                column.Item().PaddingTop(10).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(15).Column(innerColumn =>
                {
                    var currencySymbol = model.CurrencySymbol ?? "$";

                    // Location and Basic Info
                    innerColumn.Item().Row(row =>
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
                            c.Item().Text($"Currency: {model.Currency ?? "N/A"} ({currencySymbol})");
                            c.Item().Text($"Financial Year: {model.FinancialYear ?? "N/A"}");
                            c.Item().Text($"Income Level: {model.IncomeLevel ?? "N/A"}");
                        });
                    });

                    innerColumn.Item().PaddingTop(15);

                    // Revenue Summary
                    innerColumn.Item().Text("Revenue Overview").Bold();

                    // Calculate totals from gap analysis data
                    decimal totalCurrentRevenue = 0;
                    decimal totalPotentialRevenue = 0;
                    decimal totalGap = 0;

                    // Property Tax
                    if (model.PropertyTax.RevenueToDate.HasValue)
                    {
                        totalCurrentRevenue += model.PropertyTax.RevenueToDate.Value;
                    }

                    // Business License
                    if (model.License.RevenueToDate.HasValue)
                    {
                        totalCurrentRevenue += model.License.RevenueToDate.Value;
                    }

                    // Generic Streams
                    foreach (var stream in model.GenericStreams ?? new List<GenericStreamViewModel>())
                    {
                        if (stream.RevenueToDate.HasValue)
                        {
                            totalCurrentRevenue += stream.RevenueToDate.Value;
                        }
                        if (stream.TotalPotentialRevenue.HasValue)
                        {
                            totalPotentialRevenue += stream.TotalPotentialRevenue.Value;
                        }
                        if (stream.TotalFunctionalGap.HasValue)
                        {
                            totalGap += stream.TotalFunctionalGap.Value;
                        }
                    }

                    innerColumn.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(1);
                        });

                        table.Cell().Text("Metric").Bold();
                        table.Cell().Text("Value").Bold();

                        table.Cell().Text("Total Current Revenue");
                        table.Cell().Text($"{currencySymbol} {totalCurrentRevenue:N0}");

                        table.Cell().Text("Estimated Total Potential");
                        table.Cell().Text($"{currencySymbol} {totalPotentialRevenue:N0}");

                        table.Cell().Background(Colors.Orange.Lighten4).Text("Total Estimated Gap").Bold();
                        table.Cell().Background(Colors.Orange.Lighten4).Text($"{currencySymbol} {totalGap:N0}").Bold();
                    });
                });
            });
        }

        private void ComposeGapAnalysis(IContainer container, RosraFormViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Gap Analysis by Revenue Stream")
                    .FontSize(16)
                    .Bold()
                    .FontColor(Colors.Blue.Darken2);

                var currencySymbol = model.CurrencySymbol ?? "$";

                // Property Tax
                column.Item().PaddingTop(15).Element(c => ComposeStreamGapTable(c,
                    model.PropertyTaxDisplayName ?? "Property Tax",
                    currencySymbol,
                    model.PropertyTax.RevenueToDate ?? 0,
                    model.PropertyTax.OutstandingAmount ?? 0, // Compliance Gap
                    0, // Coverage Gap - calculate if data available
                    0, // Liability Gap
                    0, 0)); // Mixed Gaps

                // Business License
                column.Item().PaddingTop(15).Element(c => ComposeStreamGapTable(c,
                    model.BusinessLicenseDisplayName ?? "Business License",
                    currencySymbol,
                    model.License.RevenueToDate ?? 0,
                    model.License.OutstandingAmount ?? 0, // Compliance Gap
                    0, // Coverage Gap
                    0, // Liability Gap
                    0, 0)); // Mixed Gaps

                // Generic Streams
                foreach (var stream in model.GenericStreams ?? new List<GenericStreamViewModel>())
                {
                    column.Item().PaddingTop(15).Element(c => ComposeStreamGapTable(c,
                        stream.StreamName ?? "Revenue Stream",
                        currencySymbol,
                        stream.RevenueToDate ?? 0,
                        stream.ComplianceGap ?? 0,
                        stream.CoverageGap ?? 0,
                        stream.LiabilityGap ?? 0,
                        stream.MixedGapCompliance ?? 0,
                        stream.MixedGapCoverage ?? 0));
                }
            });
        }

        private void ComposeStreamGapTable(IContainer container, string streamName, string currencySymbol,
            decimal revenue, decimal complianceGap, decimal coverageGap, decimal liabilityGap,
            decimal mixedComplianceGap, decimal mixedCoverageGap)
        {
            var total = revenue + complianceGap + coverageGap + liabilityGap + mixedComplianceGap + mixedCoverageGap;

            container.Border(1).BorderColor(Colors.Grey.Lighten2).Column(column =>
            {
                column.Item().Background(Colors.Blue.Lighten4).Padding(8).Text(streamName)
                    .FontSize(12).Bold();

                column.Item().Padding(10).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(2);
                        columns.RelativeColumn(1);
                        columns.RelativeColumn(1);
                    });

                    // Header
                    table.Cell().Text("Component").Bold().FontSize(9);
                    table.Cell().AlignRight().Text("Amount").Bold().FontSize(9);
                    table.Cell().AlignRight().Text("Share %").Bold().FontSize(9);

                    // Rows
                    AddGapRow(table, "Revenue to Date", currencySymbol, revenue, total, Colors.Green.Lighten4);
                    AddGapRow(table, "Compliance Gap", currencySymbol, complianceGap, total, Colors.Red.Lighten5);
                    AddGapRow(table, "Coverage Gap", currencySymbol, coverageGap, total, Colors.Orange.Lighten5);
                    AddGapRow(table, "Liability Gap", currencySymbol, liabilityGap, total, Colors.Blue.Lighten5);
                    AddGapRow(table, "Mixed (Comp.+Liab.)", currencySymbol, mixedComplianceGap, total, Colors.Purple.Lighten5);
                    AddGapRow(table, "Mixed (Cov.+Liab.)", currencySymbol, mixedCoverageGap, total, Colors.Pink.Lighten5);

                    // Total
                    table.Cell().Background(Colors.Grey.Lighten3).Text("TOTAL POTENTIAL").Bold().FontSize(9);
                    table.Cell().Background(Colors.Grey.Lighten3).AlignRight().Text($"{currencySymbol} {total:N0}").Bold().FontSize(9);
                    table.Cell().Background(Colors.Grey.Lighten3).AlignRight().Text("100%").Bold().FontSize(9);
                });
            });
        }

        private void AddGapRow(TableDescriptor table, string label, string currencySymbol, decimal value, decimal total, string backgroundColor)
        {
            var percentage = total > 0 ? (value / total * 100) : 0;
            table.Cell().Background(backgroundColor).Text(label).FontSize(9);
            table.Cell().Background(backgroundColor).AlignRight().Text($"{currencySymbol} {value:N0}").FontSize(9);
            table.Cell().Background(backgroundColor).AlignRight().Text($"{percentage:N1}%").FontSize(9);
        }

        private void ComposePrioritization(IContainer container, RosraFormViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Prioritization Results")
                    .FontSize(16)
                    .Bold()
                    .FontColor(Colors.Blue.Darken2);

                column.Item().PaddingTop(10).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(15).Column(innerColumn =>
                {
                    try
                    {
                        if (!string.IsNullOrEmpty(model.PrioritizationData))
                        {
                            var prioritizationData = JsonSerializer.Deserialize<JsonElement>(model.PrioritizationData);
                            innerColumn.Item().Text("Prioritization data has been captured and stored.")
                                .FontColor(Colors.Grey.Darken1);
                            innerColumn.Item().Text("Please refer to the application dashboard for interactive prioritization matrix.");
                        }
                        else
                        {
                            innerColumn.Item().Text("No prioritization data available.")
                                .FontColor(Colors.Grey.Medium);
                        }
                    }
                    catch
                    {
                        innerColumn.Item().Text("Prioritization data is available in the application dashboard.")
                            .FontColor(Colors.Grey.Medium);
                    }
                });
            });
        }

        private void ComposeRecommendations(IContainer container, RosraFormViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Recommendations")
                    .FontSize(16)
                    .Bold()
                    .FontColor(Colors.Blue.Darken2);

                column.Item().PaddingTop(10).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(15).Column(innerColumn =>
                {
                    if (!string.IsNullOrEmpty(model.RecommendationSummary))
                    {
                        innerColumn.Item().Text("Summary").Bold();
                        innerColumn.Item().Text(model.RecommendationSummary);
                    }

                    if (model.ActionItems != null && model.ActionItems.Any())
                    {
                        innerColumn.Item().PaddingTop(10).Text("Action Items").Bold();

                        foreach (var item in model.ActionItems)
                        {
                            var priorityColor = item.Priority?.ToLower() switch
                            {
                                "high" => Colors.Red.Darken1,
                                "medium" => Colors.Orange.Darken1,
                                "low" => Colors.Green.Darken1,
                                _ => Colors.Grey.Darken1
                            };

                            innerColumn.Item().Row(row =>
                            {
                                row.ConstantItem(60).Text($"[{item.Priority?.ToUpper() ?? "MEDIUM"}]")
                                    .FontColor(priorityColor)
                                    .FontSize(8)
                                    .Bold();
                                row.RelativeItem().Text(item.Description ?? "").FontSize(9);
                            });
                        }
                    }

                    if (string.IsNullOrEmpty(model.RecommendationSummary) && (model.ActionItems == null || !model.ActionItems.Any()))
                    {
                        innerColumn.Item().Text("No recommendations have been entered yet.")
                            .FontColor(Colors.Grey.Medium);
                        innerColumn.Item().PaddingTop(5).Text("Complete the analysis workflow to generate recommendations based on the gap analysis results.");
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
                    text.Span("Generated by ROSRA Application - UN-Habitat")
                        .FontSize(8)
                        .FontColor(Colors.Grey.Medium);
                });

                row.RelativeItem().AlignCenter().Text(text =>
                {
                    text.Span("Page ")
                        .FontSize(8)
                        .FontColor(Colors.Grey.Medium);
                    text.CurrentPageNumber()
                        .FontSize(8)
                        .FontColor(Colors.Grey.Medium);
                    text.Span(" of ")
                        .FontSize(8)
                        .FontColor(Colors.Grey.Medium);
                    text.TotalPages()
                        .FontSize(8)
                        .FontColor(Colors.Grey.Medium);
                });

                row.RelativeItem().AlignRight().Text(text =>
                {
                    text.Span(DateTime.Now.ToString("yyyy-MM-dd HH:mm"))
                        .FontSize(8)
                        .FontColor(Colors.Grey.Medium);
                });
            });
        }
    }
}
