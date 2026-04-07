using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;
using RosraApp.Models.Enums;
using RosraApp.Models.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RosraApp.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public DashboardController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task<IActionResult> Index(int page = 1, int pageSize = 12, string? search = null, string? tab = null)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            // Get user information for the dashboard
            ViewData["UserName"] = $"{user.FirstName} {user.LastName}";
            ViewData["Email"] = user.Email;
            ViewData["Organization"] = user.Organization ?? "Not specified";
            ViewData["PhoneNumber"] = user.PhoneNumber ?? "Not specified";

            var isArchiveTab = tab == "archived";

            // Build query for the current user's reports
            IQueryable<RosraReport> query = _context.RosraReports
                .Where(r => r.UserId == user.Id);

            // Filter by archive status
            if (isArchiveTab)
            {
                query = query.Where(r => r.IsArchived);
            }
            else
            {
                query = query.Where(r => !r.IsArchived);
            }

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(r =>
                    (r.Title != null && r.Title.ToLower().Contains(term)) ||
                    (r.Country != null && r.Country.ToLower().Contains(term)) ||
                    (r.Region != null && r.Region.ToLower().Contains(term)) ||
                    (r.City != null && r.City.ToLower().Contains(term)) ||
                    (r.ProjectName != null && r.ProjectName.ToLower().Contains(term)) ||
                    (r.FinancialYear != null && r.FinancialYear.ToLower().Contains(term)));
            }

            // Get total count for pagination
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            page = Math.Max(1, Math.Min(page, Math.Max(1, totalPages)));

            // Apply pagination
            var reports = await query
                .Include(r => r.User)
                .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Create view model
            var viewModel = new DashboardViewModel
            {
                Reports = reports.Select(RosraReportViewModel.FromRosraReport).ToList(),
                PageNumber = page,
                TotalPages = totalPages,
                TotalCount = totalCount,
                SearchTerm = search,
                CurrentTab = tab ?? "active"
            };

            return View(viewModel);
        }

        public async Task<IActionResult> ViewReport(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            // Get the report by PublicId
            var report = await _context.RosraReports
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.PublicId == id);

            if (report == null)
            {
                return NotFound();
            }

            // Check if the report belongs to the current user
            if (report.UserId != user.Id && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            // Redirect to Rosra controller with view mode
            return RedirectToAction("View", "Rosra", new { id = report.PublicId });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Json(new { success = false, message = "User not authenticated" });
            }

            var report = await _context.RosraReports.FindAsync(id);
            if (report == null)
            {
                return Json(new { success = false, message = "Report not found" });
            }

            if (report.UserId != user.Id && !User.IsInRole("Admin"))
            {
                return Json(new { success = false, message = "You don't have permission to delete this report" });
            }

            // Block deletion of reports in active review
            var status = (ReportStatus)report.Status;
            if (status == ReportStatus.Submitted || status == ReportStatus.UnderReview)
            {
                return Json(new { success = false, message = "Cannot delete a report that is submitted or under review. Please withdraw it first." });
            }

            try
            {
                // Soft delete — mark as deleted instead of removing
                report.IsDeleted = true;
                report.DeletedAt = DateTime.UtcNow;
                report.DeletedByUserId = user.Id;
                report.LastModifiedByUserId = user.Id;
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Report moved to trash successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RestoreReport(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Json(new { success = false, message = "User not authenticated" });
            }

            // Use IgnoreQueryFilters to find soft-deleted reports
            var report = await _context.RosraReports
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(r => r.Id == id && r.IsDeleted);

            if (report == null)
            {
                return Json(new { success = false, message = "Report not found in trash" });
            }

            if (report.UserId != user.Id && !User.IsInRole("Admin"))
            {
                return Json(new { success = false, message = "You don't have permission to restore this report" });
            }

            try
            {
                report.IsDeleted = false;
                report.DeletedAt = null;
                report.DeletedByUserId = null;
                report.LastModifiedByUserId = user.Id;
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Report restored successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ArchiveReport(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Json(new { success = false, message = "User not authenticated" });
            }

            var report = await _context.RosraReports.FindAsync(id);
            if (report == null)
            {
                return Json(new { success = false, message = "Report not found" });
            }

            if (report.UserId != user.Id && !User.IsInRole("Admin"))
            {
                return Json(new { success = false, message = "You don't have permission to archive this report" });
            }

            // Block archiving reports in active review
            var archiveStatus = (ReportStatus)report.Status;
            if (!report.IsArchived && (archiveStatus == ReportStatus.Submitted || archiveStatus == ReportStatus.UnderReview))
            {
                return Json(new { success = false, message = "Cannot archive a report that is submitted or under review. Please withdraw it first." });
            }

            try
            {
                report.IsArchived = !report.IsArchived;
                report.ArchivedAt = report.IsArchived ? DateTime.UtcNow : null;
                report.LastModifiedByUserId = user.Id;
                await _context.SaveChangesAsync();

                var action = report.IsArchived ? "archived" : "unarchived";
                return Json(new { success = true, message = $"Report {action} successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> BulkDelete(int[] ids)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Json(new { success = false, message = "User not authenticated" });
            }

            var reports = await _context.RosraReports
                .Where(r => ids.Contains(r.Id) && (r.UserId == user.Id || User.IsInRole("Admin")))
                .ToListAsync();

            if (!reports.Any())
            {
                return Json(new { success = false, message = "No reports found" });
            }

            // Filter out reports in active review
            var activeStatuses = new[] { (int)ReportStatus.Submitted, (int)ReportStatus.UnderReview };
            var blocked = reports.Where(r => activeStatuses.Contains(r.Status)).ToList();
            var deletable = reports.Where(r => !activeStatuses.Contains(r.Status)).ToList();

            foreach (var report in deletable)
            {
                report.IsDeleted = true;
                report.DeletedAt = DateTime.UtcNow;
                report.DeletedByUserId = user.Id;
                report.LastModifiedByUserId = user.Id;
            }

            await _context.SaveChangesAsync();

            var msg = $"{deletable.Count} report(s) moved to trash";
            if (blocked.Any())
                msg += $". {blocked.Count} report(s) skipped (submitted or under review — withdraw first).";

            return Json(new { success = true, message = msg });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> BulkArchive(int[] ids)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Json(new { success = false, message = "User not authenticated" });
            }

            var reports = await _context.RosraReports
                .Where(r => ids.Contains(r.Id) && (r.UserId == user.Id || User.IsInRole("Admin")))
                .ToListAsync();

            if (!reports.Any())
            {
                return Json(new { success = false, message = "No reports found" });
            }

            foreach (var report in reports)
            {
                report.IsArchived = true;
                report.ArchivedAt = DateTime.UtcNow;
                report.LastModifiedByUserId = user.Id;
            }

            await _context.SaveChangesAsync();
            return Json(new { success = true, message = $"{reports.Count} report(s) archived" });
        }
    }
}
