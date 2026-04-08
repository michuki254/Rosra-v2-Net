using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;
using RosraApp.Models.Enums;

namespace RosraApp.Services
{
    public class SubmissionService
    {
        private readonly ApplicationDbContext _context;
        private readonly SnapshotService _snapshotService;
        private readonly IEmailService _emailService;
        private readonly UserManager<ApplicationUser> _userManager;

        public SubmissionService(ApplicationDbContext context, SnapshotService snapshotService,
            IEmailService emailService, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _snapshotService = snapshotService;
            _emailService = emailService;
            _userManager = userManager;
        }

        public async Task<(bool Success, string Message)> SubmitForReview(int reportId, string userId)
        {
            var report = await _context.RosraReports.FindAsync(reportId);
            if (report == null)
                return (false, "Report not found");

            if (report.UserId != userId)
                return (false, "You can only submit your own reports");

            if (report.Status != (int)ReportStatus.Draft && report.Status != (int)ReportStatus.NeedsRevision)
                return (false, "Only draft or revised reports can be submitted");

            // Compute completion level and enforce minimum
            report.CompletionLevel = (int)ComputeCompletionLevel(report);
            if (report.CompletionLevel == (int)CompletionLevel.Metadata)
                return (false, "Cannot submit: at least one revenue stream must have data. Please complete a gap analysis tab before submitting.");

            // Server-side validation of computed values
            var warnings = ValidateComputedValues(report);
            if (warnings.Count > 0)
            {
                // Log warnings but don't block submission — data integrity issues are flagged, not blocking
                foreach (var w in warnings)
                    System.Diagnostics.Debug.WriteLine($"[ROSRA Validation] Report {reportId}: {w}");
            }

            report.Status = (int)ReportStatus.Submitted;
            report.SubmissionVersion += 1;
            report.SubmittedAt = DateTime.UtcNow;
            report.LastModifiedByUserId = userId;

            await _context.SaveChangesAsync();

            // Create submission snapshot
            await _snapshotService.CreateSnapshot(reportId, SnapshotType.Submission, userId);

            // Notify reviewers and admins
            await NotifyReviewersAsync(report);

            return (true, "Report submitted for review");
        }

        public async Task<(bool Success, string Message)> WithdrawSubmission(int reportId, string userId)
        {
            var report = await _context.RosraReports.FindAsync(reportId);
            if (report == null)
                return (false, "Report not found");

            if (report.UserId != userId)
                return (false, "You can only withdraw your own submissions");

            if (report.Status != (int)ReportStatus.Submitted)
                return (false, "Only submitted reports (not yet claimed) can be withdrawn");

            report.Status = (int)ReportStatus.Draft;
            report.SubmittedAt = null;
            report.LastModifiedByUserId = userId;

            await _context.SaveChangesAsync();
            return (true, "Submission withdrawn");
        }

        public async Task<(bool Success, string Message)> ClaimForReview(int reportId, string reviewerUserId)
        {
            var report = await _context.RosraReports.FindAsync(reportId);
            if (report == null)
                return (false, "Report not found");

            if (report.Status != (int)ReportStatus.Submitted)
                return (false, "Only submitted reports can be claimed for review");

            // Separation of duties: cannot review your own report
            if (report.UserId == reviewerUserId)
                return (false, "You cannot review your own report");

            report.Status = (int)ReportStatus.UnderReview;
            report.ReviewerUserId = reviewerUserId;
            report.ReviewStartedAt = DateTime.UtcNow;
            report.LastModifiedByUserId = reviewerUserId;

            await _context.SaveChangesAsync();

            // Notify report owner that review has started
            await NotifyOwnerClaimedAsync(report, reviewerUserId);

            return (true, "Report claimed for review");
        }

        public async Task<(bool Success, string Message)> UnclaimReview(int reportId, string reviewerUserId)
        {
            var report = await _context.RosraReports.FindAsync(reportId);
            if (report == null)
                return (false, "Report not found");

            if (report.Status != (int)ReportStatus.UnderReview)
                return (false, "Report is not under review");

            if (report.ReviewerUserId != reviewerUserId)
                return (false, "You can only unclaim your own reviews");

            report.Status = (int)ReportStatus.Submitted;
            report.ReviewerUserId = null;
            report.ReviewStartedAt = null;
            report.LastModifiedByUserId = reviewerUserId;

            await _context.SaveChangesAsync();
            return (true, "Review unclaimed — report returned to queue");
        }

        public async Task<(bool Success, string Message)> AssignReviewer(int reportId, string reviewerUserId, string adminUserId)
        {
            var report = await _context.RosraReports.FindAsync(reportId);
            if (report == null)
                return (false, "Report not found");

            if (report.Status != (int)ReportStatus.Submitted && report.Status != (int)ReportStatus.UnderReview)
                return (false, "Report must be submitted or under review to assign a reviewer");

            report.ReviewerUserId = reviewerUserId;
            report.Status = (int)ReportStatus.UnderReview;
            report.ReviewStartedAt ??= DateTime.UtcNow;
            report.LastModifiedByUserId = adminUserId;

            await _context.SaveChangesAsync();
            return (true, "Reviewer assigned");
        }

        public static CompletionLevel ComputeCompletionLevel(RosraReport report)
        {
            // Check if any analysis streams have data
            bool hasPropertyTax = !string.IsNullOrEmpty(report.PropertyTaxData);
            bool hasLicense = !string.IsNullOrEmpty(report.LicenseData);
            bool hasShortTerm = !string.IsNullOrEmpty(report.ShortTermUserChargeData);
            bool hasLongTerm = !string.IsNullOrEmpty(report.LongTermUserChargeData);
            bool hasMixed = !string.IsNullOrEmpty(report.MixedUserChargeData);
            bool hasGeneric = !string.IsNullOrEmpty(report.GenericStreamsData);
            bool hasPeerSNG = !string.IsNullOrEmpty(report.PeerSNGData);

            bool hasAnyStream = hasPropertyTax || hasLicense || hasShortTerm || hasLongTerm || hasMixed || hasGeneric || hasPeerSNG;
            bool hasCauses = !string.IsNullOrEmpty(report.ProblemStatement);
            bool hasRecommendations = !string.IsNullOrEmpty(report.RecommendationSummary);
            bool hasPrioritization = !string.IsNullOrEmpty(report.PrioritizationData);

            if (hasAnyStream && hasCauses && hasRecommendations && hasPrioritization)
                return Models.Enums.CompletionLevel.Full;

            if (hasAnyStream)
                return Models.Enums.CompletionLevel.Partial;

            return Models.Enums.CompletionLevel.Metadata;
        }

        /// <summary>
        /// Validates client-computed gap analysis values for consistency.
        /// Returns a list of warnings (does not block submission).
        /// </summary>
        private static List<string> ValidateComputedValues(RosraReport report)
        {
            var warnings = new List<string>();
            var jsonOpts = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            // Validate Business License
            if (!string.IsNullOrEmpty(report.LicenseData))
            {
                try
                {
                    var bl = System.Text.Json.JsonSerializer.Deserialize<Models.ViewModels.GapAnalysisLicenseViewModel>(report.LicenseData, jsonOpts);
                    if (bl != null)
                    {
                        if (bl.BilledAmount.HasValue && bl.OutstandingAmount.HasValue && bl.OutstandingAmount > bl.BilledAmount)
                            warnings.Add("Business License: Outstanding amount exceeds billed amount");
                        if (bl.RevenueToDate.HasValue && bl.BilledAmount.HasValue && bl.RevenueToDate > bl.BilledAmount)
                            warnings.Add("Business License: Revenue to date exceeds billed amount");
                    }
                }
                catch { }
            }

            // Validate Property Tax
            if (!string.IsNullOrEmpty(report.PropertyTaxData))
            {
                try
                {
                    var pt = System.Text.Json.JsonSerializer.Deserialize<Models.ViewModels.GapAnalysisPropertyTaxViewModel>(report.PropertyTaxData, jsonOpts);
                    if (pt != null)
                    {
                        if (pt.BilledAmount.HasValue && pt.OutstandingAmount.HasValue && pt.OutstandingAmount > pt.BilledAmount)
                            warnings.Add("Property Tax: Outstanding amount exceeds billed amount");
                        if (pt.RevenueToDate.HasValue && pt.BilledAmount.HasValue && pt.RevenueToDate > pt.BilledAmount)
                            warnings.Add("Property Tax: Revenue to date exceeds billed amount");
                    }
                }
                catch { }
            }

            // Validate Generic Streams
            if (!string.IsNullOrEmpty(report.GenericStreamsData))
            {
                try
                {
                    var streams = System.Text.Json.JsonSerializer.Deserialize<List<Models.ViewModels.GenericStreamViewModel>>(report.GenericStreamsData, jsonOpts);
                    if (streams != null)
                    {
                        foreach (var s in streams)
                        {
                            if (s.BilledAmount.HasValue && s.OutstandingAmount.HasValue && s.OutstandingAmount > s.BilledAmount)
                                warnings.Add($"Stream '{s.StreamName}': Outstanding exceeds billed");
                            if (s.TotalPotentialRevenue.HasValue && s.RevenueToDate.HasValue && s.TotalPotentialRevenue < s.RevenueToDate)
                                warnings.Add($"Stream '{s.StreamName}': Potential revenue is less than current revenue");
                        }
                    }
                }
                catch { }
            }

            // Validate financial totals
            if (report.ActualOsr.HasValue && report.BudgetedOsr.HasValue && report.ActualOsr > report.BudgetedOsr * 2)
                warnings.Add("Actual OSR is more than 2x the budgeted OSR — please verify");

            return warnings;
        }

        private async Task NotifyReviewersAsync(RosraReport report)
        {
            try
            {
                var settings = await _emailService.GetSettingsAsync();
                if (settings == null || !_emailService.IsNotificationEnabled(settings, NotificationType.ReportSubmitted)) return;

                var author = await _userManager.FindByIdAsync(report.UserId ?? "");
                var authorName = author != null ? $"{author.FirstName} {author.LastName}" : "Unknown";
                var reviewers = await _userManager.GetUsersInRoleAsync("Reviewer");
                var admins = await _userManager.GetUsersInRoleAsync("Admin");
                var recipients = reviewers.Concat(admins).DistinctBy(u => u.Id).Where(u => u.Id != report.UserId);

                foreach (var r in recipients)
                {
                    var html = EmailTemplateService.ReportSubmitted(
                        r.FirstName ?? "Reviewer", authorName, report.Title ?? "ROSRA Report",
                        report.Country ?? "", $"/Submission/Review/{report.PublicId}");
                    _emailService.SendEmailInBackground(r.Email ?? "", r.FirstName, "New Assessment Submitted: " + (report.Title ?? ""),
                        html, NotificationType.ReportSubmitted, "RosraReport", report.Id.ToString());
                }
            }
            catch { /* never fail the main operation */ }
        }

        private async Task NotifyOwnerClaimedAsync(RosraReport report, string reviewerUserId)
        {
            try
            {
                var settings = await _emailService.GetSettingsAsync();
                if (settings == null || !_emailService.IsNotificationEnabled(settings, NotificationType.ReportClaimed)) return;

                var owner = await _userManager.FindByIdAsync(report.UserId ?? "");
                var reviewer = await _userManager.FindByIdAsync(reviewerUserId);
                if (owner?.Email == null) return;

                var html = EmailTemplateService.ReportClaimed(
                    owner.FirstName ?? "User", report.Title ?? "ROSRA Report",
                    reviewer != null ? $"{reviewer.FirstName} {reviewer.LastName}" : "A reviewer");
                _emailService.SendEmailInBackground(owner.Email, owner.FirstName, "Your Assessment Is Being Reviewed",
                    html, NotificationType.ReportClaimed, "RosraReport", report.Id.ToString());
            }
            catch { }
        }
    }
}
