using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;
using RosraApp.Models.Enums;

namespace RosraApp.Services
{
    public class ValidationService
    {
        private readonly ApplicationDbContext _context;
        private readonly SnapshotService _snapshotService;
        private readonly ArtifactService _artifactService;

        public ValidationService(
            ApplicationDbContext context,
            SnapshotService snapshotService,
            ArtifactService artifactService)
        {
            _context = context;
            _snapshotService = snapshotService;
            _artifactService = artifactService;
        }

        public async Task<(bool Success, string Message)> ValidateReport(int reportId, string reviewerUserId, string? comment = null)
        {
            var report = await _context.RosraReports.FindAsync(reportId);
            if (report == null)
                return (false, "Report not found");

            if (report.Status != (int)ReportStatus.UnderReview)
                return (false, "Only reports under review can be validated");

            report.Status = (int)ReportStatus.Validated;
            report.ValidatedAt = DateTime.UtcNow;
            report.ValidatedByUserId = reviewerUserId;
            report.LastModifiedByUserId = reviewerUserId;

            await _context.SaveChangesAsync();

            // Create validation snapshot
            var snapshotId = await _snapshotService.CreateSnapshot(reportId, SnapshotType.Validation, reviewerUserId);

            // Generate PDF artifact
            if (snapshotId > 0)
            {
                await _artifactService.GeneratePdfArtifact(reportId, snapshotId, reviewerUserId);
            }

            // Add validation comment if provided
            if (!string.IsNullOrWhiteSpace(comment))
            {
                _context.ReviewNotes.Add(new ReviewNote
                {
                    ReportId = reportId,
                    AuthorUserId = reviewerUserId,
                    Content = comment,
                    NoteType = (int)NoteType.ValidationComment,
                    IsInternal = false
                });
                await _context.SaveChangesAsync();
            }

            return (true, "Report validated successfully");
        }

        public async Task<(bool Success, string Message)> RejectReport(int reportId, string reviewerUserId, string reason)
        {
            if (string.IsNullOrWhiteSpace(reason))
                return (false, "A reason is required when requesting revision");

            var report = await _context.RosraReports.FindAsync(reportId);
            if (report == null)
                return (false, "Report not found");

            if (report.Status != (int)ReportStatus.UnderReview)
                return (false, "Only reports under review can be sent back for revision");

            report.Status = (int)ReportStatus.NeedsRevision;
            report.RevisionReason = reason;
            report.LastModifiedByUserId = reviewerUserId;

            // Add revision reason as a review note
            _context.ReviewNotes.Add(new ReviewNote
            {
                ReportId = reportId,
                AuthorUserId = reviewerUserId,
                Content = reason,
                NoteType = (int)NoteType.RevisionReason,
                IsInternal = false
            });

            await _context.SaveChangesAsync();
            return (true, "Report sent back for revision");
        }

        public async Task<(bool Success, string Message)> UnlockForRevision(int reportId, string adminUserId, string reason)
        {
            if (string.IsNullOrWhiteSpace(reason))
                return (false, "A reason is required to unlock a validated report");

            var report = await _context.RosraReports.FindAsync(reportId);
            if (report == null)
                return (false, "Report not found");

            if (report.Status != (int)ReportStatus.Validated)
                return (false, "Only validated reports can be unlocked");

            // Create a pre-edit backup snapshot before unlocking
            await _snapshotService.CreateSnapshot(reportId, SnapshotType.PreEditBackup, adminUserId);

            report.Status = (int)ReportStatus.NeedsRevision;
            report.RevisionReason = $"Unlocked by admin: {reason}";
            report.LastModifiedByUserId = adminUserId;

            // Log the unlock reason
            _context.ReviewNotes.Add(new ReviewNote
            {
                ReportId = reportId,
                AuthorUserId = adminUserId,
                Content = $"Validated report unlocked for revision. Reason: {reason}",
                NoteType = (int)NoteType.General,
                IsInternal = true
            });

            await _context.SaveChangesAsync();
            return (true, "Report unlocked for revision");
        }

        public async Task<(int Succeeded, int Failed, List<string> Errors)> BulkValidate(int[] reportIds, string reviewerUserId)
        {
            int succeeded = 0;
            int failed = 0;
            var errors = new List<string>();

            foreach (var id in reportIds)
            {
                var result = await ValidateReport(id, reviewerUserId);
                if (result.Success)
                    succeeded++;
                else
                {
                    failed++;
                    errors.Add($"Report {id}: {result.Message}");
                }
            }

            return (succeeded, failed, errors);
        }
    }
}
