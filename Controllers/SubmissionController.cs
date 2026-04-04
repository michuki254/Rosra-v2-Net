using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;
using RosraApp.Models.Enums;
using RosraApp.Models.ViewModels;
using RosraApp.Services;

namespace RosraApp.Controllers
{
    [Authorize]
    public class SubmissionController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SubmissionService _submissionService;
        private readonly ValidationService _validationService;
        private readonly SnapshotService _snapshotService;
        private readonly ArtifactService _artifactService;

        public SubmissionController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            SubmissionService submissionService,
            ValidationService validationService,
            SnapshotService snapshotService,
            ArtifactService artifactService)
        {
            _context = context;
            _userManager = userManager;
            _submissionService = submissionService;
            _validationService = validationService;
            _snapshotService = snapshotService;
            _artifactService = artifactService;
        }

        // --- User Actions ---

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Submit(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Json(new { success = false, message = "Not authenticated" });

            var result = await _submissionService.SubmitForReview(id, user.Id);
            return Json(new { success = result.Success, message = result.Message });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Withdraw(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Json(new { success = false, message = "Not authenticated" });

            var result = await _submissionService.WithdrawSubmission(id, user.Id);
            return Json(new { success = result.Success, message = result.Message });
        }

        // --- Reviewer/Admin Actions ---

        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> Queue(int page = 1, int pageSize = 25, string? tab = null, string? search = null, string? completion = null)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return RedirectToAction("Login", "Account");

            // Base query: only non-draft reports
            IQueryable<RosraReport> query = _context.RosraReports
                .Where(r => r.Status != (int)ReportStatus.Draft);

            // Tab filtering
            var activeTab = tab ?? "pending";
            query = activeTab switch
            {
                "pending" => query.Where(r => r.Status == (int)ReportStatus.Submitted),
                "my-reviews" => query.Where(r => r.Status == (int)ReportStatus.UnderReview && r.ReviewerUserId == user.Id),
                "revision" => query.Where(r => r.Status == (int)ReportStatus.NeedsRevision),
                "all" => query,
                _ => query.Where(r => r.Status == (int)ReportStatus.Submitted)
            };

            // Completion filter
            if (!string.IsNullOrEmpty(completion) && int.TryParse(completion, out var compLevel))
            {
                query = query.Where(r => r.CompletionLevel == compLevel);
            }

            // Search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(r =>
                    (r.Title != null && r.Title.ToLower().Contains(term)) ||
                    (r.Country != null && r.Country.ToLower().Contains(term)) ||
                    (r.City != null && r.City.ToLower().Contains(term)) ||
                    (r.User != null && r.User.Email != null && r.User.Email.ToLower().Contains(term)));
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            page = Math.Max(1, Math.Min(page, Math.Max(1, totalPages)));

            var reports = await query
                .Include(r => r.User)
                .OrderByDescending(r => r.SubmittedAt ?? r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewData["CurrentTab"] = activeTab;
            ViewData["SearchTerm"] = search;
            ViewData["CompletionFilter"] = completion;
            ViewData["PageNumber"] = page;
            ViewData["TotalPages"] = totalPages;
            ViewData["TotalCount"] = totalCount;

            return View(reports);
        }

        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> Review(Guid id)
        {
            var report = await _context.RosraReports
                .Include(r => r.User)
                .Include(r => r.ReviewNotes)
                .FirstOrDefaultAsync(r => r.PublicId == id);

            if (report == null) return NotFound();

            // Only show non-draft reports to reviewers
            if (report.Status == (int)ReportStatus.Draft)
                return Forbid();

            var snapshots = await _snapshotService.GetSnapshotsForReport(report.Id);
            var artifacts = await _artifactService.GetArtifactsForReport(report.Id);
            var notes = await _context.ReviewNotes
                .Where(n => n.ReportId == report.Id)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            // Get reviewer info for notes
            var reviewerIds = notes.Select(n => n.AuthorUserId).Distinct().ToList();
            var reviewers = await _userManager.Users
                .Where(u => reviewerIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => $"{u.FirstName} {u.LastName}");

            // Build form data for report preview
            var formData = _snapshotService.BuildFormViewModelFromReport(report);

            ViewData["Report"] = report;
            ViewData["FormData"] = formData;
            ViewData["Snapshots"] = snapshots;
            ViewData["Artifacts"] = artifacts;
            ViewData["Notes"] = notes;
            ViewData["ReviewerNames"] = reviewers;
            ViewData["StatusName"] = ((ReportStatus)report.Status).ToString();
            ViewData["CompletionName"] = ((CompletionLevel)report.CompletionLevel).ToString();

            // Stream completeness indicators
            ViewData["StreamStatus"] = new Dictionary<string, bool>
            {
                ["Property Tax"] = !string.IsNullOrEmpty(report.PropertyTaxData),
                ["Business License"] = !string.IsNullOrEmpty(report.LicenseData),
                ["Short-Term Charges"] = !string.IsNullOrEmpty(report.ShortTermUserChargeData),
                ["Long-Term Charges"] = !string.IsNullOrEmpty(report.LongTermUserChargeData),
                ["Mixed Charges"] = !string.IsNullOrEmpty(report.MixedUserChargeData),
                ["Generic Streams"] = !string.IsNullOrEmpty(report.GenericStreamsData),
                ["Peer SNG Analysis"] = !string.IsNullOrEmpty(report.PeerSNGData),
                ["Causes Analysis"] = !string.IsNullOrEmpty(report.ProblemStatement),
                ["Recommendations"] = !string.IsNullOrEmpty(report.RecommendationSummary),
                ["Prioritization"] = !string.IsNullOrEmpty(report.PrioritizationData),
                ["Solutions"] = !string.IsNullOrEmpty(report.SelectedSolutionsData)
            };

            return View(report);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> Claim(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Json(new { success = false, message = "Not authenticated" });

            var result = await _submissionService.ClaimForReview(id, user.Id);
            return Json(new { success = result.Success, message = result.Message });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> Unclaim(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Json(new { success = false, message = "Not authenticated" });

            var result = await _submissionService.UnclaimReview(id, user.Id);
            return Json(new { success = result.Success, message = result.Message });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> Validate(int id, string? comment)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Json(new { success = false, message = "Not authenticated" });

            var result = await _validationService.ValidateReport(id, user.Id, comment);
            return Json(new { success = result.Success, message = result.Message });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> Reject(int id, string reason)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Json(new { success = false, message = "Not authenticated" });

            var result = await _validationService.RejectReport(id, user.Id, reason);
            return Json(new { success = result.Success, message = result.Message });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Unlock(int id, string reason)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Json(new { success = false, message = "Not authenticated" });

            var result = await _validationService.UnlockForRevision(id, user.Id, reason);
            return Json(new { success = result.Success, message = result.Message });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> AddNote(int reportId, string content, int noteType = 0, string? streamReference = null, bool isInternal = false)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Json(new { success = false, message = "Not authenticated" });

            if (string.IsNullOrWhiteSpace(content))
                return Json(new { success = false, message = "Note content is required" });

            var note = new ReviewNote
            {
                ReportId = reportId,
                AuthorUserId = user.Id,
                Content = content.Trim(),
                NoteType = noteType,
                StreamReference = streamReference,
                IsInternal = isInternal
            };

            _context.ReviewNotes.Add(note);
            await _context.SaveChangesAsync();

            return Json(new
            {
                success = true,
                message = "Note added",
                note = new
                {
                    id = note.Id,
                    author = $"{user.FirstName} {user.LastName}",
                    content = note.Content,
                    createdAt = note.CreatedAt.ToString("dd MMM yyyy HH:mm"),
                    noteType = note.NoteType,
                    isInternal = note.IsInternal
                }
            });
        }

        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> Notes(int reportId)
        {
            var notes = await _context.ReviewNotes
                .Where(n => n.ReportId == reportId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            var authorIds = notes.Select(n => n.AuthorUserId).Distinct().ToList();
            var authors = await _userManager.Users
                .Where(u => authorIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => $"{u.FirstName} {u.LastName}");

            var result = notes.Select(n => new
            {
                id = n.Id,
                author = authors.GetValueOrDefault(n.AuthorUserId, "Unknown"),
                content = n.Content,
                noteType = n.NoteType,
                streamReference = n.StreamReference,
                createdAt = n.CreatedAt.ToString("dd MMM yyyy HH:mm"),
                isInternal = n.IsInternal
            });

            return Json(result);
        }

        // --- Validated Library ---

        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> Validated(int page = 1, int pageSize = 25, string? search = null)
        {
            IQueryable<RosraReport> query = _context.RosraReports
                .Where(r => r.Status == (int)ReportStatus.Validated);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(r =>
                    (r.Title != null && r.Title.ToLower().Contains(term)) ||
                    (r.Country != null && r.Country.ToLower().Contains(term)) ||
                    (r.City != null && r.City.ToLower().Contains(term)));
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            page = Math.Max(1, Math.Min(page, Math.Max(1, totalPages)));

            var reports = await query
                .Include(r => r.User)
                .Include(r => r.Artifacts)
                .OrderByDescending(r => r.ValidatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewData["SearchTerm"] = search;
            ViewData["PageNumber"] = page;
            ViewData["TotalPages"] = totalPages;
            ViewData["TotalCount"] = totalCount;

            return View(reports);
        }

        // --- Snapshots & Artifacts ---

        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> Snapshot(int id)
        {
            var formData = await _snapshotService.GetSnapshot(id);
            if (formData == null) return NotFound();

            var snapshot = await _context.AnalysisSnapshots.FindAsync(id);

            ViewData["SnapshotLabel"] = snapshot?.Label ?? "Snapshot";
            ViewData["SnapshotDate"] = snapshot?.CreatedAt.ToString("dd MMM yyyy HH:mm");
            ViewData["ViewMode"] = true;

            return View("SnapshotView", formData);
        }

        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> Artifact(int id)
        {
            var (stream, fileName, contentType) = await _artifactService.GetArtifactStream(id);
            if (stream == null || fileName == null || contentType == null)
                return NotFound();

            return File(stream, contentType, fileName);
        }

        // --- Bulk Actions ---

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Reviewer")]
        public async Task<IActionResult> BulkValidate(int[] ids)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Json(new { success = false, message = "Not authenticated" });

            var result = await _validationService.BulkValidate(ids, user.Id);
            return Json(new
            {
                success = result.Failed == 0,
                message = $"{result.Succeeded} validated, {result.Failed} failed",
                errors = result.Errors
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BulkAssign(int[] ids, string reviewerUserId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Json(new { success = false, message = "Not authenticated" });

            int count = 0;
            foreach (var id in ids)
            {
                var result = await _submissionService.AssignReviewer(id, reviewerUserId, user.Id);
                if (result.Success) count++;
            }

            return Json(new { success = true, message = $"{count} report(s) assigned" });
        }
    }
}
