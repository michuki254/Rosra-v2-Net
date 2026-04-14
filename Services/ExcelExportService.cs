using ClosedXML.Excel;
using Microsoft.Extensions.Localization;
using RosraApp.Models.ViewModels;
// ExportResources marker class is in RosraApp namespace
using System.Text.Json;

namespace RosraApp.Services
{
    public class ExcelExportService
    {
        private readonly IStringLocalizer<ExportResources> _l;
        private string _currencySymbol = "$";

        public ExcelExportService(IStringLocalizer<ExportResources> localizer)
        {
            _l = localizer;
        }

        public byte[] GenerateExcelReport(RosraFormViewModel model, string title = "ROSRA Analysis Report")
        {
            _currencySymbol = model.CurrencySymbol ?? "$";

            using var workbook = new XLWorkbook();

            // Sheet 1: Summary
            ComposeSummarySheet(workbook, model, title);

            // Sheet 2: Top-Down Analysis
            ComposeTopDownSheet(workbook, model);

            // Sheet 3+: Gap Analysis per stream
            ComposeGapAnalysisSheets(workbook, model);

            // Prioritization
            if (!string.IsNullOrEmpty(model.PrioritizationData))
                ComposePrioritizationSheet(workbook, model);

            // Selected Solutions
            if (!string.IsNullOrEmpty(model.SelectedSolutionsData))
                ComposeSolutionsSheet(workbook, model);

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        private void StyleHeader(IXLWorksheet ws, int row, int colCount)
        {
            var range = ws.Range(row, 1, row, colCount);
            range.Style.Font.Bold = true;
            range.Style.Fill.BackgroundColor = XLColor.FromHtml("#00689D");
            range.Style.Font.FontColor = XLColor.White;
            range.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }

        private void AutoFitColumns(IXLWorksheet ws)
        {
            ws.Columns().AdjustToContents(5.0, 60.0);
        }

        private void ComposeSummarySheet(XLWorkbook workbook, RosraFormViewModel model, string title)
        {
            var ws = workbook.Worksheets.Add("Summary");

            // Title
            ws.Cell(1, 1).Value = title;
            ws.Cell(1, 1).Style.Font.Bold = true;
            ws.Cell(1, 1).Style.Font.FontSize = 16;
            ws.Range(1, 1, 1, 4).Merge();

            // Location Info
            int row = 3;
            ws.Cell(row, 1).Value = "Location Information";
            ws.Cell(row, 1).Style.Font.Bold = true;
            row++;
            ws.Cell(row, 1).Value = "Country"; ws.Cell(row, 2).Value = model.Country ?? "N/A"; row++;
            ws.Cell(row, 1).Value = "Region/State"; ws.Cell(row, 2).Value = model.Region ?? "N/A"; row++;
            ws.Cell(row, 1).Value = "City"; ws.Cell(row, 2).Value = model.City ?? "N/A"; row++;

            row++;
            ws.Cell(row, 1).Value = "Financial Details";
            ws.Cell(row, 1).Style.Font.Bold = true;
            row++;
            ws.Cell(row, 1).Value = "Currency"; ws.Cell(row, 2).Value = $"{model.Currency ?? "N/A"} ({_currencySymbol})"; row++;
            ws.Cell(row, 1).Value = "Financial Year"; ws.Cell(row, 2).Value = model.FinancialYear ?? "N/A"; row++;
            ws.Cell(row, 1).Value = "Income Level"; ws.Cell(row, 2).Value = model.IncomeLevel ?? "N/A"; row++;
            ws.Cell(row, 1).Value = "Government Type"; ws.Cell(row, 2).Value = model.GovernmentType ?? "N/A"; row++;

            // Revenue Overview
            row += 2;
            ws.Cell(row, 1).Value = "Revenue Overview";
            ws.Cell(row, 1).Style.Font.Bold = true;
            row++;
            ws.Cell(row, 1).Value = "Metric"; ws.Cell(row, 2).Value = $"Amount ({_currencySymbol})";
            StyleHeader(ws, row, 2);
            row++;

            decimal totalCurrent = 0, totalPotential = 0, totalGap = 0;
            totalCurrent += model.PropertyTax.RevenueToDate ?? 0;
            totalCurrent += model.License.RevenueToDate ?? 0;
            foreach (var s in model.GenericStreams ?? new List<GenericStreamViewModel>())
            {
                totalCurrent += s.RevenueToDate ?? 0;
                totalPotential += s.TotalPotentialRevenue ?? 0;
                totalGap += s.TotalFunctionalGap ?? 0;
            }

            ws.Cell(row, 1).Value = "Total Current Revenue"; ws.Cell(row, 2).Value = (double)totalCurrent; ws.Cell(row, 2).Style.NumberFormat.Format = "#,##0"; row++;
            ws.Cell(row, 1).Value = "Estimated Total Potential"; ws.Cell(row, 2).Value = (double)totalPotential; ws.Cell(row, 2).Style.NumberFormat.Format = "#,##0"; row++;
            ws.Cell(row, 1).Value = "Total Estimated Gap"; ws.Cell(row, 2).Value = (double)totalGap; ws.Cell(row, 2).Style.NumberFormat.Format = "#,##0";
            ws.Cell(row, 1).Style.Font.Bold = true; ws.Cell(row, 2).Style.Font.Bold = true;
            ws.Cell(row, 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#FFF3E0");
            ws.Cell(row, 2).Style.Fill.BackgroundColor = XLColor.FromHtml("#FFF3E0");

            ws.SheetView.FreezeRows(1);
            AutoFitColumns(ws);
        }

        private void ComposeTopDownSheet(XLWorkbook workbook, RosraFormViewModel model)
        {
            var ws = workbook.Worksheets.Add("Top-Down Analysis");

            ws.Cell(1, 1).Value = "Within-Country OSR Frontier (Peer SNGs)";
            ws.Cell(1, 1).Style.Font.Bold = true;
            ws.Cell(1, 1).Style.Font.FontSize = 14;
            ws.Range(1, 1, 1, 2).Merge();

            if (string.IsNullOrEmpty(model.PeerSNGData))
            {
                ws.Cell(3, 1).Value = "No frontier analysis data available.";
                AutoFitColumns(ws);
                return;
            }

            try
            {
                var data = JsonSerializer.Deserialize<JsonElement>(model.PeerSNGData);

                int row = 3;
                ws.Cell(row, 1).Value = "Metric"; ws.Cell(row, 2).Value = "Value";
                StyleHeader(ws, row, 2);
                row++;

                if (data.TryGetProperty("analysisResults", out var results))
                {
                    AddExcelMetricRow(ws, ref row, "Own Source Revenues (OSR)", results, "actualOSR", true);
                    AddExcelMetricRow(ws, ref row, "Subnational GDP", results, "subnationalGDP", true);
                    AddExcelMetricRow(ws, ref row, "Peer frontier multiplier", results, "frontierMultiplier", false);
                    AddExcelMetricRow(ws, ref row, "Subject multiplier", results, "subjectMultiplier", false);
                    AddExcelMetricRow(ws, ref row, "Frontier benchmark (OSR potential)", results, "osrPotential", true);
                    AddExcelMetricRow(ws, ref row, "Gap to frontier benchmark", results, "osrGap", true);
                    AddExcelMetricRow(ws, ref row, "Performance Index", results, "performanceIndex", false);
                    AddExcelMetricRow(ws, ref row, "OSR per capita", results, "osrPerCapita", true);
                    AddExcelMetricRow(ws, ref row, "Frontier-implied OSR per capita", results, "potentialOSRPerCapita", true);
                    AddExcelMetricRow(ws, ref row, "Per capita gap to frontier", results, "perCapitaGap", true);
                }

                // Cross-Country Fiscal Analysis
                if (data.TryGetProperty("crossCountry", out var cc))
                {
                    row += 2;
                    ws.Cell(row, 1).Value = "Cross-Country Fiscal Analysis";
                    ws.Cell(row, 1).Style.Font.Bold = true;
                    ws.Cell(row, 1).Style.Font.FontSize = 13;
                    row++;
                    ws.Cell(row, 1).Value = "Metric"; ws.Cell(row, 2).Value = "Value";
                    StyleHeader(ws, row, 2);
                    row++;

                    AddExcelMetricRow(ws, ref row, "SNG revenue per capita", cc, "sngRevenuePerCapita", true);
                    AddExcelMetricRow(ws, ref row, "Peer benchmark (top-20% avg)", cc, "peerBenchmark", true);
                    AddExcelMetricRow(ws, ref row, "Funding index", cc, "fundingIndex", false);
                    AddExcelMetricRow(ws, ref row, "Funding headroom (USD per capita)", cc, "fundingHeadroom", true);
                    AddExcelMetricRow(ws, ref row, "Non-grants share (%)", cc, "nonGrantsShare", false);
                    AddExcelMetricRow(ws, ref row, "Autonomy index", cc, "autonomyIndex", false);
                }

                // Peer SNGs data table
                if (data.TryGetProperty("peers", out var peers) && peers.ValueKind == JsonValueKind.Array)
                {
                    row += 2;
                    ws.Cell(row, 1).Value = "Peer SNGs Data";
                    ws.Cell(row, 1).Style.Font.Bold = true;
                    row++;
                    ws.Cell(row, 1).Value = "SNG Name"; ws.Cell(row, 2).Value = "OSR"; ws.Cell(row, 3).Value = "GCP";
                    StyleHeader(ws, row, 3);
                    row++;

                    foreach (var peer in peers.EnumerateArray())
                    {
                        ws.Cell(row, 1).Value = peer.TryGetProperty("sng", out var sng) ? sng.GetString() ?? "" : "";
                        ws.Cell(row, 2).Value = peer.TryGetProperty("osr", out var osr) ? osr.GetDouble() : 0;
                        ws.Cell(row, 3).Value = peer.TryGetProperty("gcp", out var gcp) ? gcp.GetDouble() : 0;
                        ws.Cell(row, 2).Style.NumberFormat.Format = "#,##0";
                        ws.Cell(row, 3).Style.NumberFormat.Format = "#,##0";
                        row++;
                    }
                }
            }
            catch { ws.Cell(3, 1).Value = "Could not parse frontier analysis data."; }

            ws.SheetView.FreezeRows(3);
            AutoFitColumns(ws);
        }

        private void AddExcelMetricRow(IXLWorksheet ws, ref int row, string label, JsonElement parent, string prop, bool isCurrency)
        {
            ws.Cell(row, 1).Value = label;
            if (parent.TryGetProperty(prop, out var val) && val.ValueKind == JsonValueKind.Number)
            {
                ws.Cell(row, 2).Value = val.GetDouble();
                ws.Cell(row, 2).Style.NumberFormat.Format = isCurrency ? "#,##0" : "0.######";
            }
            else
            {
                ws.Cell(row, 2).Value = "-";
            }
            row++;
        }

        private void ComposeGapAnalysisSheets(XLWorkbook workbook, RosraFormViewModel model)
        {
            // Property Tax
            AddGapSheet(workbook, model.PropertyTaxDisplayName ?? "Property Tax",
                model.PropertyTax.RevenueToDate ?? 0, model.PropertyTax.OutstandingAmount ?? 0, 0, 0, 0, 0);

            // Business License
            AddGapSheet(workbook, model.BusinessLicenseDisplayName ?? "Business License",
                model.License.RevenueToDate ?? 0, model.License.OutstandingAmount ?? 0, 0, 0, 0, 0);

            // Generic Streams (non-property revenue)
            foreach (var stream in model.GenericStreams ?? new List<GenericStreamViewModel>())
            {
                var streamLabel = stream.StreamName ?? "Stream";
                if (!string.IsNullOrEmpty(stream.Subgroup))
                {
                    var sgLabel = stream.Subgroup switch { "A" => "Licences", "B" => "Svc Fees", "C" => "Daily", _ => "" };
                    if (!string.IsNullOrEmpty(sgLabel)) streamLabel = $"{streamLabel} ({sgLabel})";
                }
                AddGapSheet(workbook, streamLabel,
                    stream.RevenueToDate ?? 0, stream.ComplianceGap ?? 0, stream.CoverageGap ?? 0,
                    stream.LiabilityGap ?? 0, stream.MixedGapCompliance ?? 0, stream.MixedGapCoverage ?? 0);
            }
        }

        private void AddGapSheet(XLWorkbook workbook, string streamName,
            decimal revenue, decimal compliance, decimal coverage, decimal liability, decimal mixedComp, decimal mixedCov)
        {
            // Sanitize sheet name (max 31 chars, no special chars)
            var sheetName = "Gap - " + new string(streamName.Take(24).Where(c => c != '/' && c != '\\' && c != '*' && c != '?' && c != '[' && c != ']').ToArray());
            if (workbook.Worksheets.Any(w => w.Name == sheetName))
                sheetName = sheetName[..Math.Min(sheetName.Length, 28)] + " " + (workbook.Worksheets.Count + 1);

            var ws = workbook.Worksheets.Add(sheetName);
            var total = revenue + compliance + coverage + liability + mixedComp + mixedCov;

            ws.Cell(1, 1).Value = streamName + " - Gap Analysis";
            ws.Cell(1, 1).Style.Font.Bold = true;
            ws.Cell(1, 1).Style.Font.FontSize = 14;
            ws.Range(1, 1, 1, 3).Merge();

            int row = 3;
            ws.Cell(row, 1).Value = "Component"; ws.Cell(row, 2).Value = $"Amount ({_currencySymbol})"; ws.Cell(row, 3).Value = "Share %";
            StyleHeader(ws, row, 3);
            row++;

            void AddRow(string label, decimal val, string bgHex)
            {
                var pct = total > 0 ? (double)(val / total * 100) : 0;
                ws.Cell(row, 1).Value = label;
                ws.Cell(row, 2).Value = (double)val; ws.Cell(row, 2).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, 3).Value = pct; ws.Cell(row, 3).Style.NumberFormat.Format = "0.0\"%\"";
                ws.Range(row, 1, row, 3).Style.Fill.BackgroundColor = XLColor.FromHtml(bgHex);
                row++;
            }

            AddRow("Revenue to Date", revenue, "#E8F5E9");
            AddRow("Compliance Gap", compliance, "#FFEBEE");
            AddRow("Coverage Gap", coverage, "#FFF3E0");
            AddRow("Liability Gap", liability, "#E3F2FD");
            AddRow("Mixed (Comp.+Liab.)", mixedComp, "#F3E5F5");
            AddRow("Mixed (Cov.+Liab.)", mixedCov, "#FCE4EC");

            ws.Cell(row, 1).Value = "TOTAL POTENTIAL";
            ws.Cell(row, 2).Value = (double)total; ws.Cell(row, 2).Style.NumberFormat.Format = "#,##0";
            ws.Cell(row, 3).Value = 100.0; ws.Cell(row, 3).Style.NumberFormat.Format = "0.0\"%\"";
            ws.Range(row, 1, row, 3).Style.Font.Bold = true;
            ws.Range(row, 1, row, 3).Style.Fill.BackgroundColor = XLColor.FromHtml("#EEEEEE");

            ws.SheetView.FreezeRows(3);
            AutoFitColumns(ws);
        }

        private void ComposePrioritizationSheet(XLWorkbook workbook, RosraFormViewModel model)
        {
            var ws = workbook.Worksheets.Add("Prioritization");
            ws.Cell(1, 1).Value = "Stream Prioritization";
            ws.Cell(1, 1).Style.Font.Bold = true;
            ws.Cell(1, 1).Style.Font.FontSize = 14;

            try
            {
                var data = JsonSerializer.Deserialize<JsonElement>(model.PrioritizationData!);

                int row = 3;
                ws.Cell(row, 1).Value = "Rank"; ws.Cell(row, 2).Value = "Revenue Stream";
                ws.Cell(row, 3).Value = $"Total Gap ({_currencySymbol})"; ws.Cell(row, 4).Value = "Share %";
                StyleHeader(ws, row, 4);
                row++;

                if (data.TryGetProperty("streams", out var streams) && streams.ValueKind == JsonValueKind.Array)
                {
                    foreach (var s in streams.EnumerateArray())
                    {
                        ws.Cell(row, 1).Value = s.TryGetProperty("rank", out var r) ? r.ToString() : "-";
                        ws.Cell(row, 2).Value = s.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "";
                        if (s.TryGetProperty("gap", out var g)) { ws.Cell(row, 3).Value = g.GetDouble(); ws.Cell(row, 3).Style.NumberFormat.Format = "#,##0"; }
                        if (s.TryGetProperty("share", out var sh)) { ws.Cell(row, 4).Value = sh.GetDouble(); ws.Cell(row, 4).Style.NumberFormat.Format = "0.0\"%\""; }
                        row++;
                    }
                }
            }
            catch { ws.Cell(3, 1).Value = "Could not parse prioritization data."; }

            ws.SheetView.FreezeRows(3);
            AutoFitColumns(ws);
        }

        private void ComposeSolutionsSheet(XLWorkbook workbook, RosraFormViewModel model)
        {
            var ws = workbook.Worksheets.Add("Selected Solutions");
            ws.Cell(1, 1).Value = "Selected Solutions";
            ws.Cell(1, 1).Style.Font.Bold = true;
            ws.Cell(1, 1).Style.Font.FontSize = 14;

            try
            {
                var data = JsonSerializer.Deserialize<JsonElement>(model.SelectedSolutionsData!);

                int row = 3;
                ws.Cell(row, 1).Value = "ID"; ws.Cell(row, 2).Value = "Solution";
                ws.Cell(row, 3).Value = "Revenue Stream"; ws.Cell(row, 4).Value = "Gap Type";
                ws.Cell(row, 5).Value = "Stream Type"; ws.Cell(row, 6).Value = "Timeline";
                StyleHeader(ws, row, 6);
                row++;

                if (data.TryGetProperty("selectedSolutions", out var solutions) && solutions.ValueKind == JsonValueKind.Array)
                {
                    foreach (var sol in solutions.EnumerateArray())
                    {
                        ws.Cell(row, 1).Value = sol.TryGetProperty("solutionId", out var id) ? id.GetString() ?? "" : "";
                        ws.Cell(row, 2).Value = sol.TryGetProperty("title", out var t) ? t.GetString() ?? "" : "";
                        ws.Cell(row, 3).Value = sol.TryGetProperty("streamName", out var sn) ? sn.GetString() ?? "" : "";
                        ws.Cell(row, 4).Value = sol.TryGetProperty("gapType", out var gt) ? gt.GetString() ?? "" : "";
                        var subgroup = sol.TryGetProperty("subgroup", out var sg) ? sg.GetString() ?? "" : "";
                        ws.Cell(row, 5).Value = subgroup switch
                        {
                            "A" => "Business Licences & Permits",
                            "B" => "Service Fees & Billed Charges",
                            "C" => "Daily / Point-of-Collection",
                            _ => sol.TryGetProperty("streamName", out var sn2) && sn2.GetString() == "Property Tax" ? "Property Tax" : ""
                        };
                        ws.Cell(row, 6).Value = sol.TryGetProperty("timeline", out var tl) ? tl.GetString() ?? "" : "";
                        row++;
                    }
                }
            }
            catch { ws.Cell(3, 1).Value = "Could not parse solutions data."; }

            ws.SheetView.FreezeRows(3);
            AutoFitColumns(ws);
        }
    }
}
