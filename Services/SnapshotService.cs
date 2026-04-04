using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;
using RosraApp.Models.Enums;
using RosraApp.Models.ViewModels;

namespace RosraApp.Services
{
    public class SnapshotService
    {
        private readonly ApplicationDbContext _context;
        private readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNamingPolicy = null,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        public SnapshotService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateSnapshot(int reportId, SnapshotType type, string userId)
        {
            var report = await _context.RosraReports.FindAsync(reportId);
            if (report == null)
                return 0;

            var formData = BuildFormViewModelFromReport(report);
            var json = JsonSerializer.Serialize(formData, _jsonOptions);

            var label = type switch
            {
                SnapshotType.Submission => $"Submitted on {DateTime.UtcNow:yyyy-MM-dd HH:mm}",
                SnapshotType.Validation => $"Validated on {DateTime.UtcNow:yyyy-MM-dd HH:mm}",
                SnapshotType.PreEditBackup => $"Pre-edit backup on {DateTime.UtcNow:yyyy-MM-dd HH:mm}",
                _ => null
            };

            var snapshot = new AnalysisSnapshot
            {
                ReportId = reportId,
                SnapshotType = (int)type,
                FormDataJson = json,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = userId,
                Label = label
            };

            _context.AnalysisSnapshots.Add(snapshot);
            await _context.SaveChangesAsync();
            return snapshot.Id;
        }

        public async Task<RosraFormViewModel?> GetSnapshot(int snapshotId)
        {
            var snapshot = await _context.AnalysisSnapshots.FindAsync(snapshotId);
            if (snapshot == null)
                return null;

            return JsonSerializer.Deserialize<RosraFormViewModel>(snapshot.FormDataJson, _jsonOptions);
        }

        public async Task<List<AnalysisSnapshot>> GetSnapshotsForReport(int reportId)
        {
            return await _context.AnalysisSnapshots
                .Where(s => s.ReportId == reportId)
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new AnalysisSnapshot
                {
                    Id = s.Id,
                    ReportId = s.ReportId,
                    SnapshotType = s.SnapshotType,
                    CreatedAt = s.CreatedAt,
                    CreatedByUserId = s.CreatedByUserId,
                    Label = s.Label,
                    FormDataJson = string.Empty // Don't load the large JSON for list views
                })
                .ToListAsync();
        }

        /// <summary>
        /// Builds a RosraFormViewModel from a RosraReport entity.
        /// Reuses the same deserialization logic as RosraController.Edit/View actions.
        /// </summary>
        public RosraFormViewModel BuildFormViewModelFromReport(RosraReport report)
        {
            return new RosraFormViewModel
            {
                Id = report.Id,
                Title = report.Title,
                Country = report.Country,
                Region = report.Region,
                City = report.City,
                GovUnitLevel3 = report.GovUnitLevel3,
                FinalUnitLevel = report.FinalUnitLevel,
                Currency = report.Currency,
                CurrencySymbol = report.CurrencySymbol,
                FinancialYear = report.FinancialYear,
                ActualOsr = report.ActualOsr,
                BudgetedOsr = report.BudgetedOsr,
                Population = report.Population,
                GdpPerCapita = report.GdpPerCapita,
                ProjectName = report.ProjectName,
                EstimatedBudget = report.EstimatedBudget,
                ProjectDescription = report.ProjectDescription,
                KeyObjectives = report.KeyObjectives,
                StartDate = report.StartDate,
                EndDate = report.EndDate,
                GovernmentType = report.GovernmentType,
                IncomeLevel = report.IncomeLevel,
                OtherRevenue = report.OtherRevenue,
                ProblemStatement = report.ProblemStatement,
                RecommendationSummary = report.RecommendationSummary,
                PrioritizationData = report.PrioritizationData,
                SelectedSolutionsData = report.SelectedSolutionsData,
                ImplementationProgressData = report.ImplementationProgressData,
                PeerSNGData = report.PeerSNGData,
                RowVersion = report.RowVersion != null ? Convert.ToBase64String(report.RowVersion) : null,

                // Deserialize JSON fields
                PropertyTax = DeserializeOrDefault<GapAnalysisPropertyTaxViewModel>(report.PropertyTaxData),
                License = DeserializeOrDefault<GapAnalysisLicenseViewModel>(report.LicenseData),
                ShortTermUserCharge = DeserializeOrDefault<GapAnalysisShortTermViewModel>(report.ShortTermUserChargeData),
                LongTermUserCharge = DeserializeOrDefault<GapAnalysisLongTermViewModel>(report.LongTermUserChargeData),
                MixedUserCharge = DeserializeOrDefault<GapAnalysisMixedViewModel>(report.MixedUserChargeData),
                TotalEstimate = DeserializeOrDefault<GapAnalysisTotalViewModel>(report.TotalEstimateData),
                RootCauses = DeserializeOrDefault<List<string>>(report.RootCauses) ?? new List<string>(),
                ActionItems = DeserializeOrDefault<List<ActionItemViewModel>>(report.ActionItems) ?? new List<ActionItemViewModel>(),
                TopOsrConfig = DeserializeOrDefault<List<TopOsrViewModel>>(report.TopOsrConfigData) ?? new List<TopOsrViewModel>(),
                GenericStreams = DeserializeOrDefault<List<GenericStreamViewModel>>(report.GenericStreamsData) ?? new List<GenericStreamViewModel>()
            };
        }

        private T DeserializeOrDefault<T>(string? json) where T : new()
        {
            if (string.IsNullOrEmpty(json))
                return new T();

            try
            {
                return JsonSerializer.Deserialize<T>(json, _jsonOptions) ?? new T();
            }
            catch
            {
                return new T();
            }
        }
    }
}
