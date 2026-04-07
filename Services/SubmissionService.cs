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

        public SubmissionService(ApplicationDbContext context, SnapshotService snapshotService)
        {
            _context = context;
            _snapshotService = snapshotService;
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

            report.Status = (int)ReportStatus.Submitted;
            report.SubmissionVersion += 1;
            report.SubmittedAt = DateTime.UtcNow;
            report.LastModifiedByUserId = userId;

            await _context.SaveChangesAsync();

            // Create submission snapshot
            await _snapshotService.CreateSnapshot(reportId, SnapshotType.Submission, userId);

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
    }
}
