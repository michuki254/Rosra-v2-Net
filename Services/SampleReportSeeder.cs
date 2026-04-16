using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;

namespace RosraApp.Services
{
    public static class SampleReportSeeder
    {
        // Fixed GUIDs so sample report URLs are stable
        private static readonly Guid NairobiId = Guid.Parse("a0000001-0001-0001-0001-000000000001");
        private static readonly Guid KampalaId = Guid.Parse("a0000001-0001-0001-0001-000000000002");
        private static readonly Guid DarId = Guid.Parse("a0000001-0001-0001-0001-000000000003");
        private static readonly Guid AccraId = Guid.Parse("a0000001-0001-0001-0001-000000000004");
        private static readonly Guid AddisId = Guid.Parse("a0000001-0001-0001-0001-000000000005");

        public static Guid[] PublicIds => new[] { NairobiId, KampalaId, DarId, AccraId, AddisId };

        public static async Task SeedSampleReports(ApplicationDbContext context, ILogger logger)
        {
            if (await context.RosraReports.IgnoreQueryFilters().AnyAsync(r => r.PublicId == NairobiId))
            {
                logger.LogInformation("Sample reports already seeded, skipping");
                return;
            }

            logger.LogInformation("Seeding 5 sample reports...");

            var reports = new List<RosraReport>
            {
                CreateNairobiReport(),
                CreateKampalaReport(),
                CreateDarReport(),
                CreateAccraReport(),
                CreateAddisReport()
            };

            context.RosraReports.AddRange(reports);
            await context.SaveChangesAsync();
            logger.LogInformation("Seeded 5 sample reports");
        }

        private static RosraReport CreateNairobiReport()
        {
            return new RosraReport
            {
                PublicId = NairobiId,
                Title = "Nairobi City County — ROSRA Sample Analysis",
                Country = "Kenya",
                Region = "Nairobi",
                City = "Nairobi City",
                Currency = "KES",
                CurrencySymbol = "KES",
                FinancialYear = "2024/25",
                GovernmentType = "County Government",
                IncomeLevel = "Lower-middle income",
                ActualOsr = 18200000000m,
                BudgetedOsr = 24500000000m,
                Population = 4400000,
                GdpPerCapita = 2100m,
                Status = 4, // Validated
                CompletionLevel = 2, // Full
                PropertyTaxData = @"{""RegisteredProperties"":285000,""NonRegisteredProperties"":95000,""EstimatedProperties"":380000,""CompliantProperties"":198000,""TotalFiscalBase"":450000000000,""TotalMarketValue"":1200000000000,""BilledAmount"":8500000000,""OutstandingAmount"":3200000000,""RevenueToDate"":5300000000}",
                LicenseData = @"{""RegisteredBusinesses"":145000,""EstimatedUnregisteredPercent"":25,""BilledAmount"":4200000000,""OutstandingAmount"":1800000000,""StatutoryAverageBilled"":38000,""RealisticImprovementPercent"":40,""TotalEstimatedBusinesses"":181250,""RevenueToDate"":2400000000,""CompliantUnits"":82857,""NonCompliantUnits"":62143,""UnregisteredUnits"":36250,""AvgBilledAmount"":28966,""AchievableAvgBill"":32580,""DeltaA"":3614,""ComplianceGap"":1800000000,""CoverageGap"":1049017500,""LiabilityGap"":299478198,""MixedGapCompliance"":224613718,""MixedGapCoverage"":131007500,""TotalPotentialRevenue"":5904116916,""TotalFunctionalGap"":3504116916,""ComplianceRatio"":57.14,""CoverageRatio"":80.0}",
                GenericStreamsData = @"[{""StreamIndex"":0,""StreamId"":""stream0"",""StreamName"":""Parking Fee"",""Subgroup"":""C"",""Subtype"":""Parking fee"",""LocalStreamName"":""Parking Fee"",""RegisteredUnits"":45000,""EstimatedUnregisteredPercent"":30,""BilledAmount"":1200000000,""OutstandingAmount"":480000000,""StatutoryAverageBilled"":35000,""RealisticImprovementPercent"":35,""TotalEstimatedUnits"":58500,""RevenueToDate"":720000000,""CompliantUnits"":27000,""NonCompliantUnits"":18000,""UnregisteredUnits"":13500,""AvgBilledAmount"":26667,""AchievableAvgBill"":29584,""DeltaA"":2917,""ComplianceGap"":480000000,""CoverageGap"":360000000,""LiabilityGap"":78750000,""MixedGapCompliance"":52500000,""MixedGapCoverage"":39375000,""TotalPotentialRevenue"":1730625000,""TotalFunctionalGap"":1010625000,""ComplianceRatio"":60.0,""CoverageRatio"":76.92},{""StreamIndex"":1,""StreamId"":""stream1"",""StreamName"":""Solid Waste Fee"",""Subgroup"":""B"",""Subtype"":""Solid waste fee"",""LocalStreamName"":""Waste Management Charge"",""RegisteredUnits"":320000,""EstimatedUnregisteredPercent"":20,""BilledAmount"":2800000000,""OutstandingAmount"":1120000000,""StatutoryAverageBilled"":12000,""RealisticImprovementPercent"":30,""TotalEstimatedUnits"":384000,""RevenueToDate"":1680000000,""CompliantUnits"":192000,""NonCompliantUnits"":128000,""UnregisteredUnits"":64000,""AvgBilledAmount"":8750,""AchievableAvgBill"":9725,""DeltaA"":975,""ComplianceGap"":1120000000,""CoverageGap"":560000000,""LiabilityGap"":187200000,""MixedGapCompliance"":124800000,""MixedGapCoverage"":62400000,""TotalPotentialRevenue"":3734400000,""TotalFunctionalGap"":2054400000,""ComplianceRatio"":60.0,""CoverageRatio"":83.33}]",
                PrioritizationData = @"{""streams"":[{""rank"":1,""name"":""Property Tax"",""gap"":7900000000,""share"":45.5},{""rank"":2,""name"":""Business License"",""gap"":3504116916,""share"":20.2},{""rank"":3,""name"":""Solid Waste Fee"",""gap"":2054400000,""share"":11.8},{""rank"":4,""name"":""Parking Fee"",""gap"":1010625000,""share"":5.8}]}",
                SelectedSolutionsData = @"{""selectedSolutions"":[{""solutionId"":""PT-COM-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""1-3 years"",""title"":""Send bills people can understand""},{""solutionId"":""PT-COM-02"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Make sure bills actually reach taxpayers""},{""solutionId"":""PT-COM-03"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Use reminder messages before and after due dates""},{""solutionId"":""PT-COV-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Run a quick property self-registration drive""},{""solutionId"":""PT-COV-02"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Cross-match with permits, utilities, and land records""},{""solutionId"":""PT-VAL-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Valuation"",""gapPriority"":3,""timeline"":""1-3 years"",""title"":""Start with an assessment method the city can actually keep current""},{""solutionId"":""PT-VAL-02"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Valuation"",""gapPriority"":3,""timeline"":""1-3 years"",""title"":""Use simple location and property bands to improve fairness quickly""},{""solutionId"":""A8"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Renewal Calendar with Automatic Notices and Bills"",""subgroup"":""A""},{""solutionId"":""A1"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Coverage"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Easy First-Time Business Registration and Licensing"",""subgroup"":""A""},{""solutionId"":""C6"",""streamName"":""Parking Fee"",""streamRank"":4,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Numbered Receipts and Tight Collector Controls"",""subgroup"":""C""},{""solutionId"":""B7"",""streamName"":""Solid Waste Fee"",""streamRank"":3,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Regular, Understandable Billing"",""subgroup"":""B""},{""solutionId"":""B9"",""streamName"":""Solid Waste Fee"",""streamRank"":3,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Reminder Calendar and Structured Arrears Follow-Up"",""subgroup"":""B""}]}",
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            };
        }

        private static RosraReport CreateKampalaReport()
        {
            return new RosraReport
            {
                PublicId = KampalaId,
                Title = "Kampala Capital City — ROSRA Sample Analysis",
                Country = "Uganda",
                Region = "Central",
                City = "Kampala",
                Currency = "UGX",
                CurrencySymbol = "UGX",
                FinancialYear = "2024/25",
                GovernmentType = "City Authority",
                IncomeLevel = "Low income",
                ActualOsr = 280000000000m,
                BudgetedOsr = 380000000000m,
                Population = 1700000,
                GdpPerCapita = 1100m,
                Status = 4,
                CompletionLevel = 2,
                PropertyTaxData = @"{""RegisteredProperties"":120000,""NonRegisteredProperties"":80000,""EstimatedProperties"":200000,""CompliantProperties"":72000,""TotalFiscalBase"":180000000000,""TotalMarketValue"":600000000000,""BilledAmount"":95000000000,""OutstandingAmount"":42000000000,""RevenueToDate"":53000000000}",
                LicenseData = @"{""RegisteredBusinesses"":85000,""EstimatedUnregisteredPercent"":35,""BilledAmount"":62000000000,""OutstandingAmount"":28000000000,""StatutoryAverageBilled"":900000,""RealisticImprovementPercent"":30,""TotalEstimatedBusinesses"":115000,""RevenueToDate"":34000000000,""CompliantUnits"":46613,""NonCompliantUnits"":38387,""UnregisteredUnits"":30000,""AvgBilledAmount"":729412,""AchievableAvgBill"":780589,""DeltaA"":51177,""ComplianceGap"":28000000000,""CoverageGap"":21882352941,""LiabilityGap"":2384900001,""TotalPotentialRevenue"":90267252942,""TotalFunctionalGap"":56267252942,""ComplianceRatio"":54.84,""CoverageRatio"":73.91}",
                GenericStreamsData = @"[{""StreamIndex"":0,""StreamId"":""stream0"",""StreamName"":""Daily Market Fee"",""Subgroup"":""C"",""Subtype"":""Daily market fee"",""LocalStreamName"":""Market Dues"",""RegisteredUnits"":28000,""EstimatedUnregisteredPercent"":40,""BilledAmount"":18000000000,""OutstandingAmount"":7200000000,""StatutoryAverageBilled"":800000,""RealisticImprovementPercent"":25,""TotalEstimatedUnits"":39200,""RevenueToDate"":10800000000,""CompliantUnits"":16800,""NonCompliantUnits"":11200,""UnregisteredUnits"":11200,""AvgBilledAmount"":642857,""AchievableAvgBill"":682143,""DeltaA"":39286,""ComplianceGap"":7200000000,""CoverageGap"":7200000000,""LiabilityGap"":660003600,""TotalPotentialRevenue"":27100003600,""TotalFunctionalGap"":16300003600,""ComplianceRatio"":60.0,""CoverageRatio"":71.43}]",
                PrioritizationData = @"{""streams"":[{""rank"":1,""name"":""Property Tax"",""gap"":108000000000,""share"":45.0},{""rank"":2,""name"":""Business License"",""gap"":56267252942,""share"":23.5},{""rank"":3,""name"":""Daily Market Fee"",""gap"":16300003600,""share"":6.8}]}",
                SelectedSolutionsData = @"{""selectedSolutions"":[{""solutionId"":""PT-COM-02"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Make sure bills actually reach taxpayers""},{""solutionId"":""PT-COM-04"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Add easy payment channels close to the taxpayer""},{""solutionId"":""PT-COV-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Run a quick property self-registration drive""},{""solutionId"":""PT-COV-03"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":2,""timeline"":""1-3 years"",""title"":""Carry out a targeted street and neighbourhood sweep""},{""solutionId"":""A1"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Easy First-Time Business Registration and Licensing"",""subgroup"":""A""},{""solutionId"":""A9"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Easy Renewal and Payment Channels"",""subgroup"":""A""},{""solutionId"":""C1"",""streamName"":""Daily Market Fee"",""streamRank"":3,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Register Stalls, Bays, Tables, Routes, and Operating Points"",""subgroup"":""C""},{""solutionId"":""C6"",""streamName"":""Daily Market Fee"",""streamRank"":3,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Numbered Receipts and Tight Collector Controls"",""subgroup"":""C""},{""solutionId"":""C7"",""streamName"":""Daily Market Fee"",""streamRank"":3,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Cash-Light Collection and Same-Day Reconciliation"",""subgroup"":""C""}]}",
                CreatedAt = DateTime.UtcNow.AddDays(-25)
            };
        }

        private static RosraReport CreateDarReport()
        {
            return new RosraReport
            {
                PublicId = DarId,
                Title = "Dar es Salaam — ROSRA Sample Analysis",
                Country = "Tanzania",
                Region = "Dar es Salaam",
                City = "Dar es Salaam",
                Currency = "TZS",
                CurrencySymbol = "TZS",
                FinancialYear = "2023/24",
                GovernmentType = "City Council",
                IncomeLevel = "Low income",
                ActualOsr = 145000000000m,
                BudgetedOsr = 210000000000m,
                Population = 5400000,
                GdpPerCapita = 1200m,
                Status = 4,
                CompletionLevel = 2,
                PropertyTaxData = @"{""RegisteredProperties"":180000,""NonRegisteredProperties"":220000,""EstimatedProperties"":400000,""CompliantProperties"":90000,""TotalFiscalBase"":300000000000,""TotalMarketValue"":1500000000000,""BilledAmount"":45000000000,""OutstandingAmount"":22000000000,""RevenueToDate"":23000000000}",
                LicenseData = @"{""RegisteredBusinesses"":95000,""EstimatedUnregisteredPercent"":40,""BilledAmount"":32000000000,""OutstandingAmount"":14000000000,""StatutoryAverageBilled"":450000,""RealisticImprovementPercent"":35,""TotalEstimatedBusinesses"":133000,""RevenueToDate"":18000000000,""CompliantUnits"":53438,""NonCompliantUnits"":41562,""UnregisteredUnits"":38000,""AvgBilledAmount"":336842,""AchievableAvgBill"":376448,""DeltaA"":39606,""ComplianceGap"":14000000000,""CoverageGap"":12800000000,""LiabilityGap"":2116836828,""TotalPotentialRevenue"":49916836828,""TotalFunctionalGap"":31916836828,""ComplianceRatio"":56.25,""CoverageRatio"":71.43}",
                GenericStreamsData = @"[{""StreamIndex"":0,""StreamId"":""stream0"",""StreamName"":""Water Charge"",""Subgroup"":""B"",""Subtype"":""Water charge"",""LocalStreamName"":""Water Service Charge"",""RegisteredUnits"":420000,""EstimatedUnregisteredPercent"":25,""BilledAmount"":38000000000,""OutstandingAmount"":16000000000,""StatutoryAverageBilled"":120000,""RealisticImprovementPercent"":30,""TotalEstimatedUnits"":525000,""RevenueToDate"":22000000000,""CompliantUnits"":243158,""ComplianceGap"":16000000000,""CoverageGap"":9500000000,""LiabilityGap"":2400000000,""TotalPotentialRevenue"":52900000000,""TotalFunctionalGap"":30900000000,""ComplianceRatio"":57.89,""CoverageRatio"":80.0},{""StreamIndex"":1,""StreamId"":""stream1"",""StreamName"":""Bus Stand Fee"",""Subgroup"":""C"",""Subtype"":""Bus, taxi, or transport stand fee"",""LocalStreamName"":""Daladala Stand Fee"",""RegisteredUnits"":8500,""EstimatedUnregisteredPercent"":35,""BilledAmount"":5200000000,""OutstandingAmount"":2100000000,""StatutoryAverageBilled"":750000,""RealisticImprovementPercent"":25,""TotalEstimatedUnits"":11475,""RevenueToDate"":3100000000,""CompliantUnits"":5065,""ComplianceGap"":2100000000,""CoverageGap"":1820000000,""LiabilityGap"":350000000,""TotalPotentialRevenue"":7720000000,""TotalFunctionalGap"":4620000000,""ComplianceRatio"":59.62,""CoverageRatio"":74.07},{""StreamIndex"":2,""StreamId"":""stream2"",""StreamName"":""Solid Waste Fee"",""Subgroup"":""B"",""Subtype"":""Solid waste fee"",""LocalStreamName"":""Waste Collection Charge"",""RegisteredUnits"":280000,""EstimatedUnregisteredPercent"":30,""BilledAmount"":15000000000,""OutstandingAmount"":6500000000,""StatutoryAverageBilled"":65000,""RealisticImprovementPercent"":25,""TotalEstimatedUnits"":364000,""RevenueToDate"":8500000000,""CompliantUnits"":158667,""ComplianceGap"":6500000000,""CoverageGap"":4500000000,""LiabilityGap"":1200000000,""TotalPotentialRevenue"":21900000000,""TotalFunctionalGap"":13400000000,""ComplianceRatio"":56.67,""CoverageRatio"":76.92}]",
                PrioritizationData = @"{""streams"":[{""rank"":1,""name"":""Property Tax"",""gap"":66000000000,""share"":30.0},{""rank"":2,""name"":""Business License"",""gap"":31916836828,""share"":14.5},{""rank"":3,""name"":""Water Charge"",""gap"":30900000000,""share"":14.0},{""rank"":4,""name"":""Solid Waste Fee"",""gap"":13400000000,""share"":6.1},{""rank"":5,""name"":""Bus Stand Fee"",""gap"":4620000000,""share"":2.1}]}",
                SelectedSolutionsData = @"{""selectedSolutions"":[{""solutionId"":""PT-COM-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""1-3 years"",""title"":""Send bills people can understand""},{""solutionId"":""PT-COM-03"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Use reminder messages before and after due dates""},{""solutionId"":""PT-COV-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Run a quick property self-registration drive""},{""solutionId"":""PT-COV-02"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Cross-match with permits, utilities, and land records""},{""solutionId"":""PT-COV-04"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":2,""timeline"":""1-3 years"",""title"":""Use imagery to spot new buildings and extensions""},{""solutionId"":""A1"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Easy First-Time Business Registration and Licensing"",""subgroup"":""A""},{""solutionId"":""A2"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Business Listing Through Data-Sharing and Street Verification"",""subgroup"":""A""},{""solutionId"":""B7"",""streamName"":""Water Charge"",""streamRank"":3,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Regular, Understandable Billing"",""subgroup"":""B""},{""solutionId"":""B9"",""streamName"":""Water Charge"",""streamRank"":3,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Reminder Calendar and Structured Arrears Follow-Up"",""subgroup"":""B""},{""solutionId"":""B1"",""streamName"":""Water Charge"",""streamRank"":3,""gapType"":""Coverage"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Customer Census and Account Clean-Up"",""subgroup"":""B""},{""solutionId"":""B10"",""streamName"":""Solid Waste Fee"",""streamRank"":4,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Receipts, Reconciliation, and Cash Controls"",""subgroup"":""B""},{""solutionId"":""C1"",""streamName"":""Bus Stand Fee"",""streamRank"":5,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Register Stalls, Bays, Tables, Routes, and Operating Points"",""subgroup"":""C""},{""solutionId"":""C6"",""streamName"":""Bus Stand Fee"",""streamRank"":5,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Numbered Receipts and Tight Collector Controls"",""subgroup"":""C""},{""solutionId"":""C8"",""streamName"":""Bus Stand Fee"",""streamRank"":5,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Shift-, Route-, and Site-Level Dashboards"",""subgroup"":""C""},{""solutionId"":""C9"",""streamName"":""Bus Stand Fee"",""streamRank"":5,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Supervisor Spot Checks, Rotation, and Exception Review"",""subgroup"":""C""}]}",
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            };
        }

        private static RosraReport CreateAccraReport()
        {
            return new RosraReport
            {
                PublicId = AccraId,
                Title = "Accra Metropolitan Assembly — ROSRA Sample Analysis",
                Country = "Ghana",
                Region = "Greater Accra",
                City = "Accra",
                Currency = "GHS",
                CurrencySymbol = "GHS",
                FinancialYear = "2024",
                GovernmentType = "Metropolitan Assembly",
                IncomeLevel = "Lower-middle income",
                ActualOsr = 85000000m,
                BudgetedOsr = 140000000m,
                Population = 2500000,
                GdpPerCapita = 2400m,
                Status = 4,
                CompletionLevel = 2,
                PropertyTaxData = @"{""RegisteredProperties"":95000,""NonRegisteredProperties"":105000,""EstimatedProperties"":200000,""CompliantProperties"":42000,""TotalFiscalBase"":12000000000,""TotalMarketValue"":50000000000,""BilledAmount"":38000000,""OutstandingAmount"":16000000,""RevenueToDate"":22000000}",
                LicenseData = @"{""RegisteredBusinesses"":48000,""EstimatedUnregisteredPercent"":45,""BilledAmount"":24000000,""OutstandingAmount"":9600000,""StatutoryAverageBilled"":650,""RealisticImprovementPercent"":35,""TotalEstimatedBusinesses"":69600,""RevenueToDate"":14400000,""CompliantUnits"":28800,""NonCompliantUnits"":19200,""UnregisteredUnits"":21600,""AvgBilledAmount"":500,""AchievableAvgBill"":553,""DeltaA"":53,""ComplianceGap"":9600000,""CoverageGap"":10800000,""LiabilityGap"":1518000,""TotalPotentialRevenue"":37918000,""TotalFunctionalGap"":23518000,""ComplianceRatio"":60.0,""CoverageRatio"":68.97}",
                GenericStreamsData = @"[{""StreamIndex"":0,""StreamId"":""stream0"",""StreamName"":""Parking Fee"",""Subgroup"":""C"",""Subtype"":""Parking fee"",""LocalStreamName"":""Street Parking Charge"",""RegisteredUnits"":12000,""EstimatedUnregisteredPercent"":30,""BilledAmount"":4800000,""OutstandingAmount"":1920000,""StatutoryAverageBilled"":500,""RealisticImprovementPercent"":30,""TotalEstimatedUnits"":15600,""RevenueToDate"":2880000,""CompliantUnits"":7200,""ComplianceGap"":1920000,""CoverageGap"":1440000,""LiabilityGap"":360000,""TotalPotentialRevenue"":7080000,""TotalFunctionalGap"":4200000,""ComplianceRatio"":60.0,""CoverageRatio"":76.92},{""StreamIndex"":1,""StreamId"":""stream1"",""StreamName"":""Market Toll"",""Subgroup"":""C"",""Subtype"":""Daily market fee"",""LocalStreamName"":""Market Toll Fee"",""RegisteredUnits"":35000,""EstimatedUnregisteredPercent"":25,""BilledAmount"":8400000,""OutstandingAmount"":3360000,""StatutoryAverageBilled"":300,""RealisticImprovementPercent"":25,""TotalEstimatedUnits"":43750,""RevenueToDate"":5040000,""CompliantUnits"":21000,""ComplianceGap"":3360000,""CoverageGap"":2100000,""LiabilityGap"":525000,""TotalPotentialRevenue"":11625000,""TotalFunctionalGap"":6585000,""ComplianceRatio"":60.0,""CoverageRatio"":80.0}]",
                PrioritizationData = @"{""streams"":[{""rank"":1,""name"":""Property Tax"",""gap"":44000000,""share"":35.2},{""rank"":2,""name"":""Business License"",""gap"":23518000,""share"":18.8},{""rank"":3,""name"":""Market Toll"",""gap"":6585000,""share"":5.3},{""rank"":4,""name"":""Parking Fee"",""gap"":4200000,""share"":3.4}]}",
                SelectedSolutionsData = @"{""selectedSolutions"":[{""solutionId"":""PT-COV-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Run a quick property self-registration drive""},{""solutionId"":""PT-COV-02"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Cross-match with permits, utilities, and land records""},{""solutionId"":""PT-COV-03"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""1-3 years"",""title"":""Carry out a targeted street and neighbourhood sweep""},{""solutionId"":""PT-COM-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""1-3 years"",""title"":""Send bills people can understand""},{""solutionId"":""PT-COM-04"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Add easy payment channels close to the taxpayer""},{""solutionId"":""A1"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Easy First-Time Business Registration and Licensing"",""subgroup"":""A""},{""solutionId"":""A3"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""6-12 months"",""title"":""Targeted Onboarding Drive with Time-Bound Regularisation"",""subgroup"":""A""},{""solutionId"":""A8"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Renewal Calendar with Automatic Notices and Bills"",""subgroup"":""A""},{""solutionId"":""C1"",""streamName"":""Market Toll"",""streamRank"":3,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Register Stalls, Bays, Tables, Routes, and Operating Points"",""subgroup"":""C""},{""solutionId"":""C7"",""streamName"":""Market Toll"",""streamRank"":3,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Cash-Light Collection and Same-Day Reconciliation"",""subgroup"":""C""},{""solutionId"":""C9"",""streamName"":""Parking Fee"",""streamRank"":4,""gapType"":""Compliance"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Supervisor Spot Checks, Rotation, and Exception Review"",""subgroup"":""C""}]}",
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            };
        }

        private static RosraReport CreateAddisReport()
        {
            return new RosraReport
            {
                PublicId = AddisId,
                Title = "Addis Ababa City Administration — ROSRA Sample Analysis",
                Country = "Ethiopia",
                Region = "Addis Ababa",
                City = "Addis Ababa",
                Currency = "ETB",
                CurrencySymbol = "ETB",
                FinancialYear = "2024/25",
                GovernmentType = "City Administration",
                IncomeLevel = "Low income",
                ActualOsr = 12500000000m,
                BudgetedOsr = 18000000000m,
                Population = 5500000,
                GdpPerCapita = 1300m,
                Status = 4,
                CompletionLevel = 2,
                PropertyTaxData = @"{""RegisteredProperties"":150000,""NonRegisteredProperties"":250000,""EstimatedProperties"":400000,""CompliantProperties"":75000,""TotalFiscalBase"":200000000000,""TotalMarketValue"":800000000000,""BilledAmount"":4500000000,""OutstandingAmount"":1800000000,""RevenueToDate"":2700000000}",
                LicenseData = @"{""RegisteredBusinesses"":110000,""EstimatedUnregisteredPercent"":35,""BilledAmount"":3200000000,""OutstandingAmount"":1280000000,""StatutoryAverageBilled"":38000,""RealisticImprovementPercent"":30,""TotalEstimatedBusinesses"":148500,""RevenueToDate"":1920000000,""CompliantUnits"":66000,""NonCompliantUnits"":44000,""UnregisteredUnits"":38500,""AvgBilledAmount"":29091,""AchievableAvgBill"":31764,""DeltaA"":2673,""ComplianceGap"":1280000000,""CoverageGap"":1120000000,""LiabilityGap"":176418000,""TotalPotentialRevenue"":4736418000,""TotalFunctionalGap"":2816418000,""ComplianceRatio"":60.0,""CoverageRatio"":74.07}",
                GenericStreamsData = @"[{""StreamIndex"":0,""StreamId"":""stream0"",""StreamName"":""Municipal Rent"",""Subgroup"":""B"",""Subtype"":""Municipal rent or lease charge"",""LocalStreamName"":""Government House Rent"",""RegisteredUnits"":18000,""EstimatedUnregisteredPercent"":20,""BilledAmount"":1800000000,""OutstandingAmount"":720000000,""StatutoryAverageBilled"":120000,""RealisticImprovementPercent"":25,""TotalEstimatedUnits"":21600,""RevenueToDate"":1080000000,""CompliantUnits"":10800,""ComplianceGap"":720000000,""CoverageGap"":360000000,""LiabilityGap"":270000000,""TotalPotentialRevenue"":2610000000,""TotalFunctionalGap"":1530000000,""ComplianceRatio"":60.0,""CoverageRatio"":83.33},{""StreamIndex"":1,""StreamId"":""stream1"",""StreamName"":""Market Fee"",""Subgroup"":""C"",""Subtype"":""Daily market fee"",""LocalStreamName"":""Gulit Market Fee"",""RegisteredUnits"":42000,""EstimatedUnregisteredPercent"":30,""BilledAmount"":2100000000,""OutstandingAmount"":840000000,""StatutoryAverageBilled"":60000,""RealisticImprovementPercent"":20,""TotalEstimatedUnits"":54600,""RevenueToDate"":1260000000,""CompliantUnits"":25200,""ComplianceGap"":840000000,""CoverageGap"":630000000,""LiabilityGap"":252000000,""TotalPotentialRevenue"":3222000000,""TotalFunctionalGap"":1962000000,""ComplianceRatio"":60.0,""CoverageRatio"":76.92},{""StreamIndex"":2,""StreamId"":""stream2"",""StreamName"":""Signage Permit"",""Subgroup"":""A"",""Subtype"":""Signage or advertising permit"",""LocalStreamName"":""Billboard Permit"",""RegisteredUnits"":3200,""EstimatedUnregisteredPercent"":40,""BilledAmount"":480000000,""OutstandingAmount"":192000000,""StatutoryAverageBilled"":180000,""RealisticImprovementPercent"":35,""TotalEstimatedUnits"":4480,""RevenueToDate"":288000000,""CompliantUnits"":1920,""ComplianceGap"":192000000,""CoverageGap"":192000000,""LiabilityGap"":57600000,""TotalPotentialRevenue"":777600000,""TotalFunctionalGap"":489600000,""ComplianceRatio"":60.0,""CoverageRatio"":71.43}]",
                PrioritizationData = @"{""streams"":[{""rank"":1,""name"":""Property Tax"",""gap"":7800000000,""share"":50.3},{""rank"":2,""name"":""Business License"",""gap"":2816418000,""share"":18.2},{""rank"":3,""name"":""Market Fee"",""gap"":1962000000,""share"":12.7},{""rank"":4,""name"":""Municipal Rent"",""gap"":1530000000,""share"":9.9},{""rank"":5,""name"":""Signage Permit"",""gap"":489600000,""share"":3.2}]}",
                SelectedSolutionsData = @"{""selectedSolutions"":[{""solutionId"":""PT-COV-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Run a quick property self-registration drive""},{""solutionId"":""PT-COV-02"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Cross-match with permits, utilities, and land records""},{""solutionId"":""PT-COV-04"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""1-3 years"",""title"":""Use imagery to spot new buildings and extensions""},{""solutionId"":""PT-COM-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""1-3 years"",""title"":""Send bills people can understand""},{""solutionId"":""PT-COM-02"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Make sure bills actually reach taxpayers""},{""solutionId"":""PT-COM-03"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Use reminder messages before and after due dates""},{""solutionId"":""PT-VAL-01"",""streamName"":""Property Tax"",""streamRank"":1,""gapType"":""Valuation"",""gapPriority"":3,""timeline"":""1-3 years"",""title"":""Start with an assessment method the city can actually keep current""},{""solutionId"":""A1"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Easy First-Time Business Registration and Licensing"",""subgroup"":""A""},{""solutionId"":""A2"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Business Listing Through Data-Sharing and Street Verification"",""subgroup"":""A""},{""solutionId"":""A8"",""streamName"":""Business License"",""streamRank"":2,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Renewal Calendar with Automatic Notices and Bills"",""subgroup"":""A""},{""solutionId"":""C1"",""streamName"":""Market Fee"",""streamRank"":3,""gapType"":""Coverage"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Register Stalls, Bays, Tables, Routes, and Operating Points"",""subgroup"":""C""},{""solutionId"":""C6"",""streamName"":""Market Fee"",""streamRank"":3,""gapType"":""Compliance"",""gapPriority"":2,""timeline"":""<1 year"",""title"":""Numbered Receipts and Tight Collector Controls"",""subgroup"":""C""},{""solutionId"":""B4"",""streamName"":""Municipal Rent"",""streamRank"":4,""gapType"":""Liability"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Tariff Application Clean-Up and Decision Rules"",""subgroup"":""B""},{""solutionId"":""A4"",""streamName"":""Signage Permit"",""streamRank"":5,""gapType"":""Liability"",""gapPriority"":1,""timeline"":""<1 year"",""title"":""Clear Activity Classification and Decision Rules"",""subgroup"":""A""}]}",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            };
        }
    }
}
