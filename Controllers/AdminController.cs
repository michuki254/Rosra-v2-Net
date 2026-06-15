using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using RosraApp.Data;
using RosraApp.Models;
using RosraApp.Models.Enums;
using RosraApp.Models.ViewModels;
using RosraApp.Services;
using System.Linq;
using System.Threading.Tasks;

namespace RosraApp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<AdminController> _logger;
        private readonly IMemoryCache _cache;

        public AdminController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context,
            IEmailService emailService,
            ILogger<AdminController> logger,
            IMemoryCache cache)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _emailService = emailService;
            _logger = logger;
            _cache = cache;
        }

        // Audit M-1: shared helper so exception details land in structured logs (correlatable
        // by reference ID) instead of being echoed back to clients. ex.Message can leak SQL
        // error text, file paths, internal class names — CWE-209.
        private string NewErrorRef(Exception ex, string operation)
        {
            var refId = Guid.NewGuid().ToString("N")[..8];
            _logger.LogError(ex, "{Operation} failed [ref {RefId}]", operation, refId);
            return refId;
        }

        private void InvalidatePermissionCacheForUsers(IEnumerable<ApplicationUser> users)
        {
            foreach (var user in users)
            {
                _cache.Remove($"user_permissions_{user.Id}");
            }
        }

        public async Task<IActionResult> Index(int page = 1, int pageSize = 25, string? search = null)
        {
            // Get statistics
            var totalUsers = await _userManager.Users.CountAsync();
            var activeUsers = await _userManager.Users.Where(u => !u.LockoutEnabled || u.LockoutEnd == null || u.LockoutEnd < DateTimeOffset.Now).CountAsync();
            var totalReports = await _context.RosraReports.CountAsync();

            // Build query with optional search
            IQueryable<RosraReport> query = _context.RosraReports.Include(r => r.User);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(r =>
                    (r.Title != null && r.Title.ToLower().Contains(term)) ||
                    (r.Country != null && r.Country.ToLower().Contains(term)) ||
                    (r.City != null && r.City.ToLower().Contains(term)) ||
                    (r.User != null && r.User.Email != null && r.User.Email.ToLower().Contains(term)) ||
                    (r.ProjectName != null && r.ProjectName.ToLower().Contains(term)));
            }

            // Get total count for pagination
            var filteredCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(filteredCount / (double)pageSize);
            page = Math.Max(1, Math.Min(page, Math.Max(1, totalPages)));

            // Apply pagination
            var allReports = await query
                .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ReportListItemViewModel
                {
                    Id = r.Id,
                    PublicId = r.PublicId,
                    Title = r.Title,
                    UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Unknown",
                    UserEmail = r.User != null ? r.User.Email ?? "" : "",
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    City = r.City,
                    Country = r.Country,
                    Status = r.Status
                })
                .ToListAsync();

            var model = new AdminDashboardViewModel
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                InactiveUsers = totalUsers - activeUsers,
                TotalReports = totalReports,
                AllReports = allReports,
                PageNumber = page,
                TotalPages = totalPages,
                TotalCount = filteredCount,
                SearchTerm = search
            };

            return View(model);
        }

        // Card-based view of all reports (same layout as user Dashboard)
        public async Task<IActionResult> AllReports(int page = 1, int pageSize = 12, string? search = null, string? tab = null)
        {
            var isArchiveTab = tab == "archived";

            IQueryable<RosraReport> query = _context.RosraReports;

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
                    (r.FinancialYear != null && r.FinancialYear.ToLower().Contains(term)) ||
                    (r.User != null && r.User.Email != null && r.User.Email.ToLower().Contains(term)));
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            page = Math.Max(1, Math.Min(page, Math.Max(1, totalPages)));

            var reports = await query
                .Include(r => r.User)
                .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

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

        // Admin view of deleted reports (trash)
        public async Task<IActionResult> DeletedReports(int page = 1, int pageSize = 25)
        {
            var query = _context.RosraReports
                .IgnoreQueryFilters()
                .Where(r => r.IsDeleted)
                .Include(r => r.User);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            page = Math.Max(1, Math.Min(page, Math.Max(1, totalPages)));

            var deletedReports = await query
                .OrderByDescending(r => r.DeletedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ReportListItemViewModel
                {
                    Id = r.Id,
                    PublicId = r.PublicId,
                    Title = r.Title,
                    UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Unknown",
                    UserEmail = r.User != null ? r.User.Email ?? "" : "",
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.DeletedAt,
                    City = r.City,
                    Country = r.Country
                })
                .ToListAsync();

            var model = new AdminDashboardViewModel
            {
                TotalReports = totalCount,
                AllReports = deletedReports,
                PageNumber = page,
                TotalPages = totalPages,
                TotalCount = totalCount
            };

            return View(model);
        }

        // Permanently delete a report (admin only)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> PermanentlyDeleteReport(int id)
        {
            var report = await _context.RosraReports
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(r => r.Id == id && r.IsDeleted);

            if (report == null)
            {
                return Json(new { success = false, message = "Report not found in trash" });
            }

            // Delete child records before removing report (FK Restrict would throw otherwise)
            var artifacts = await _context.ReportArtifacts.Where(a => a.ReportId == id).ToListAsync();
            foreach (var artifact in artifacts)
            {
                if (!string.IsNullOrEmpty(artifact.FilePath) && System.IO.File.Exists(artifact.FilePath))
                {
                    try { System.IO.File.Delete(artifact.FilePath); } catch { /* best-effort file cleanup */ }
                }
            }
            _context.ReportArtifacts.RemoveRange(artifacts);

            var snapshots = await _context.AnalysisSnapshots.Where(s => s.ReportId == id).ToListAsync();
            _context.AnalysisSnapshots.RemoveRange(snapshots);

            var notes = await _context.ReviewNotes.Where(n => n.ReportId == id).ToListAsync();
            _context.ReviewNotes.RemoveRange(notes);

            _context.RosraReports.Remove(report);
            await _context.SaveChangesAsync();

            // Clean up empty artifact directory
            var artifactsDir = Path.Combine(Directory.GetCurrentDirectory(), "App_Data", "artifacts", id.ToString());
            if (Directory.Exists(artifactsDir) && !Directory.EnumerateFileSystemEntries(artifactsDir).Any())
            {
                try { Directory.Delete(artifactsDir); } catch { }
            }

            return Json(new { success = true, message = "Report permanently deleted" });
        }

        // Restore a deleted report (admin)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RestoreReport(int id)
        {
            var report = await _context.RosraReports
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(r => r.Id == id && r.IsDeleted);

            if (report == null)
            {
                return Json(new { success = false, message = "Report not found in trash" });
            }

            report.IsDeleted = false;
            report.DeletedAt = null;
            report.DeletedByUserId = null;
            await _context.SaveChangesAsync();

            return Json(new { success = true, message = "Report restored successfully" });
        }

        // Audit Log view
        public async Task<IActionResult> AuditLog(int page = 1, int pageSize = 50, string? action = null, string? entityType = null)
        {
            IQueryable<Models.AuditLog> query = _context.AuditLogs;

            if (!string.IsNullOrWhiteSpace(action))
            {
                query = query.Where(a => a.Action == action);
            }
            if (!string.IsNullOrWhiteSpace(entityType))
            {
                query = query.Where(a => a.EntityType == entityType);
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            page = Math.Max(1, Math.Min(page, Math.Max(1, totalPages)));

            var logs = await query
                .OrderByDescending(a => a.Timestamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Get distinct values for filter dropdowns
            var allActions = await _context.AuditLogs.Select(a => a.Action).Distinct().OrderBy(a => a).ToListAsync();
            var allEntityTypes = await _context.AuditLogs.Select(a => a.EntityType).Distinct().OrderBy(a => a).ToListAsync();

            ViewData["PageNumber"] = page;
            ViewData["TotalPages"] = totalPages;
            ViewData["TotalCount"] = totalCount;
            ViewData["ActionFilter"] = action;
            ViewData["EntityTypeFilter"] = entityType;
            ViewData["AllActions"] = allActions;
            ViewData["AllEntityTypes"] = allEntityTypes;

            return View(logs);
        }

        public async Task<IActionResult> UserDetails(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var allRoles = await _roleManager.Roles.ToListAsync();
            var reportCount = await _context.RosraReports.CountAsync(r => r.UserId == user.Id);
            var isActive = !user.LockoutEnabled || user.LockoutEnd == null || user.LockoutEnd < DateTimeOffset.Now;

            ViewData["ReportCount"] = reportCount;
            ViewData["IsActive"] = isActive;

            var model = new UserDetailsViewModel
            {
                User = user,
                UserRoles = userRoles,
                AllRoles = allRoles
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddUserToRole(string userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null)
            {
                return NotFound();
            }

            var result = await _userManager.AddToRoleAsync(user, roleName);
            if (result.Succeeded)
            {
                _cache.Remove($"user_permissions_{user.Id}");
                await LogAuditAsync("RoleAssigned", "User", userId, $"Role '{roleName}' assigned to '{user.Email}'");
                return RedirectToAction(nameof(UserDetails), new { id = userId });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return RedirectToAction(nameof(UserDetails), new { id = userId });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RemoveUserFromRole(string userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.RemoveFromRoleAsync(user, roleName);
            if (result.Succeeded)
            {
                _cache.Remove($"user_permissions_{user.Id}");
                await LogAuditAsync("RoleRemoved", "User", userId, $"Role '{roleName}' removed from '{user.Email}'");
                return RedirectToAction(nameof(UserDetails), new { id = userId });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return RedirectToAction(nameof(UserDetails), new { id = userId });
        }

        public async Task<IActionResult> CreateRole()
        {
            var model = new CreateRoleViewModel();

            // Get all existing roles
            var roles = await _roleManager.Roles.ToListAsync();

            foreach (var role in roles)
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
                model.ExistingRoles.Add(new RoleInfoViewModel
                {
                    RoleId = role.Id,
                    RoleName = role.Name,
                    UserCount = usersInRole.Count
                });
            }

            // Load permissions grouped by category
            model.PermissionCategories = await GetPermissionCategoriesAsync();

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateRole(CreateRoleViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Check if role already exists
                var existingRole = await _roleManager.FindByNameAsync(model.RoleName);
                if (existingRole != null)
                {
                    ModelState.AddModelError("RoleName", "A role with this name already exists.");
                }
                else
                {
                    var role = new IdentityRole { Name = model.RoleName };
                    var result = await _roleManager.CreateAsync(role);

                    if (result.Succeeded)
                    {
                        // Assign selected permissions to the new role
                        if (model.SelectedPermissionIds != null && model.SelectedPermissionIds.Any())
                        {
                            var rolePermissions = model.SelectedPermissionIds.Select(permId => new RolePermission
                            {
                                RoleId = role.Id,
                                PermissionId = permId
                            }).ToList();

                            await _context.RolePermissions.AddRangeAsync(rolePermissions);
                            await _context.SaveChangesAsync();
                        }

                        await LogAuditAsync("RoleCreated", "Role", role.Id, $"Role '{model.RoleName}' created with {model.SelectedPermissionIds?.Count ?? 0} permissions");
                        TempData["Success"] = $"Role '{model.RoleName}' created successfully with {model.SelectedPermissionIds?.Count ?? 0} permissions!";
                        return RedirectToAction(nameof(CreateRole));
                    }

                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
            }

            // Reload existing roles and permissions
            var roles = await _roleManager.Roles.ToListAsync();
            model.ExistingRoles = new List<RoleInfoViewModel>();

            foreach (var role in roles)
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
                model.ExistingRoles.Add(new RoleInfoViewModel
                {
                    RoleId = role.Id,
                    RoleName = role.Name,
                    UserCount = usersInRole.Count
                });
            }

            model.PermissionCategories = await GetPermissionCategoriesAsync();

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteRole(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
            {
                return Json(new { success = false, message = "Role not found" });
            }

            // Check if role has users
            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
            if (usersInRole.Count > 0)
            {
                return Json(new { success = false, message = $"Cannot delete role '{role.Name}' because {usersInRole.Count} user(s) are assigned to it." });
            }

            // Prevent deletion of system roles
            if (role.Name == "Admin" || role.Name == "User")
            {
                return Json(new { success = false, message = "System roles (Admin, User) cannot be deleted." });
            }

            var result = await _roleManager.DeleteAsync(role);
            if (result.Succeeded)
            {
                await LogAuditAsync("RoleDeleted", "Role", roleId, $"Role '{role.Name}' deleted");
                return Json(new { success = true, message = $"Role '{role.Name}' deleted successfully." });
            }

            return Json(new { success = false, message = "Failed to delete role." });
        }

        // User Management Page
        public async Task<IActionResult> Users(string? search = null, string? role = null, string? status = null)
        {
            var users = await _userManager.Users.ToListAsync();
            var allRoles = await _roleManager.Roles.Select(r => r.Name).ToListAsync();
            var userViewModels = new List<UserManagementViewModel>();

            foreach (var user in users)
            {
                var reportCount = await _context.RosraReports.CountAsync(r => r.UserId == user.Id);
                var roles = await _userManager.GetRolesAsync(user);
                var isActive = !user.LockoutEnabled || user.LockoutEnd == null || user.LockoutEnd < DateTimeOffset.Now;

                userViewModels.Add(new UserManagementViewModel
                {
                    User = user,
                    ReportCount = reportCount,
                    Roles = roles.ToList(),
                    IsActive = isActive
                });
            }

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                userViewModels = userViewModels.Where(u =>
                    (u.User.FirstName?.ToLower().Contains(term) ?? false) ||
                    (u.User.LastName?.ToLower().Contains(term) ?? false) ||
                    (u.User.Email?.ToLower().Contains(term) ?? false) ||
                    (u.User.Organization?.ToLower().Contains(term) ?? false)
                ).ToList();
            }

            // Apply role filter
            if (!string.IsNullOrWhiteSpace(role))
            {
                userViewModels = userViewModels.Where(u => u.Roles.Contains(role)).ToList();
            }

            // Apply status filter
            if (status == "active")
                userViewModels = userViewModels.Where(u => u.IsActive).ToList();
            else if (status == "inactive")
                userViewModels = userViewModels.Where(u => !u.IsActive).ToList();

            ViewData["SearchTerm"] = search;
            ViewData["RoleFilter"] = role;
            ViewData["StatusFilter"] = status;
            ViewData["AllRoles"] = allRoles;
            ViewData["TotalUsers"] = users.Count;
            ViewData["ActiveCount"] = users.Count(u => !u.LockoutEnabled || u.LockoutEnd == null || u.LockoutEnd < DateTimeOffset.Now);
            ViewData["InactiveCount"] = users.Count - (int)ViewData["ActiveCount"];

            return View(userViewModels);
        }

        // Toggle User Active Status
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleUserStatus(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Json(new { success = false, message = "User not found" });
            }

            // Check if user is currently locked out
            var isCurrentlyLocked = user.LockoutEnabled && user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.Now;

            if (isCurrentlyLocked)
            {
                // Activate the user
                user.LockoutEnd = null;
                user.LockoutEnabled = false;
            }
            else
            {
                // Deactivate the user (lock them out until year 2100)
                user.LockoutEnabled = true;
                user.LockoutEnd = new DateTimeOffset(new DateTime(2100, 1, 1));
            }

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                var newStatus = !isCurrentlyLocked ? "deactivated" : "activated";
                await LogAuditAsync(
                    isCurrentlyLocked ? "UserActivated" : "UserDeactivated",
                    "User", userId,
                    $"User '{user.Email}' {newStatus}",
                    statusFrom: isCurrentlyLocked ? "Inactive" : "Active",
                    statusTo: isCurrentlyLocked ? "Active" : "Inactive");
                return Json(new { success = true, message = $"User {newStatus} successfully", isActive = isCurrentlyLocked });
            }

            return Json(new { success = false, message = "Failed to update user status" });
        }

        // Data Upload Page
        public IActionResult DataUpload()
        {
            return View();
        }

        // Upload PeerSNG reference Data (admin-managed within-country peer dataset).
        // Header-driven so the CSV can carry the full schema in any column order:
        //   SNG, OSR, GCP, Population, Include, Band, Watchlist, Currency
        // Legacy positional files (SNG,OSR,GCP,[Population],Include) still import.
        // Replaces all existing rows for the given country (no duplicates/stale rows).
        [HttpPost]
        [ValidateAntiForgeryToken]
        [RequestSizeLimit(5_000_000)]
        public async Task<IActionResult> UploadPeerSNGData(IFormFile file, string countryCode)
        {
            if (file == null || file.Length == 0)
            {
                return Json(new { success = false, message = "Please select a file" });
            }

            countryCode = (countryCode ?? "").Trim().ToUpperInvariant();
            if (!System.Text.RegularExpressions.Regex.IsMatch(countryCode, "^[A-Z]{3}$"))
            {
                return Json(new { success = false, message = "A valid 3-letter ISO country code is required (e.g. KEN)." });
            }

            try
            {
                using var reader = new StreamReader(file.OpenReadStream());
                var peers = new List<PeerSNG>();
                // Column-name → index, populated from the header row when present.
                Dictionary<string, int>? cols = null;

                static bool TruthyFlag(string v)
                {
                    v = (v ?? "").Trim().ToLowerInvariant();
                    return v == "1" || v == "true" || v == "yes" || v == "y";
                }

                while (!reader.EndOfStream)
                {
                    var line = await reader.ReadLineAsync();
                    if (string.IsNullOrWhiteSpace(line)) continue;
                    if (line.TrimStart().StartsWith("#")) continue; // template comments

                    var values = line.Split(',');
                    if (values.Length < 3) continue;

                    var first = values[0].Trim().ToUpperInvariant();

                    // First non-comment row: if it looks like a header, map columns by name.
                    if (cols == null)
                    {
                        if (first == "SNG" || first == "NAME")
                        {
                            cols = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                            for (int i = 0; i < values.Length; i++)
                            {
                                var key = values[i].Trim().ToLowerInvariant();
                                if (key == "name") key = "sng";
                                if (key == "gdp") key = "gcp";
                                if (key == "pop") key = "population";
                                if (key == "included") key = "include";
                                if (!cols.ContainsKey(key)) cols[key] = i;
                            }
                            continue; // header consumed
                        }
                        // No header → positional legacy layout.
                        cols = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
                        {
                            ["sng"] = 0, ["osr"] = 1, ["gcp"] = 2,
                            ["population"] = values.Length >= 5 ? 3 : -1,
                            ["include"] = values.Length >= 5 ? 4 : 3,
                        };
                    }

                    string Cell(string name)
                    {
                        return (cols!.TryGetValue(name, out var idx) && idx >= 0 && idx < values.Length)
                            ? values[idx].Trim() : "";
                    }

                    var name = Cell("sng");
                    if (string.IsNullOrWhiteSpace(name)) continue;
                    if (!decimal.TryParse(Cell("osr"), out var osr)) continue;
                    decimal.TryParse(Cell("gcp"), out var gcp);

                    var includeCell = Cell("include");
                    var peer = new PeerSNG
                    {
                        CountryCode = countryCode,
                        SNG = name,
                        OSR = osr,
                        GCP = gcp,
                        Population = long.TryParse(Cell("population"), out var pop) ? pop : 0,
                        // Default include to true when the column is absent/blank.
                        Include = string.IsNullOrEmpty(includeCell) ? true : TruthyFlag(includeCell),
                        Band = string.IsNullOrWhiteSpace(Cell("band")) ? null : Cell("band"),
                        Watchlist = TruthyFlag(Cell("watchlist")),
                        Currency = string.IsNullOrWhiteSpace(Cell("currency")) ? null : Cell("currency").ToUpperInvariant(),
                    };
                    peers.Add(peer);
                }

                if (peers.Count == 0)
                {
                    return Json(new { success = false, message = "No valid rows found. Each row needs at least a name and OSR." });
                }

                // Replace-per-country: drop existing rows for this country, then insert.
                var existing = await _context.Peers_SNG.Where(p => p.CountryCode == countryCode).ToListAsync();
                _context.Peers_SNG.RemoveRange(existing);
                await _context.Peers_SNG.AddRangeAsync(peers);
                await _context.SaveChangesAsync();

                // Log upload history (versioned per dataset type).
                var lastVersion = await _context.DataUploadHistory
                    .Where(h => h.DatasetType == "PeerSNG")
                    .OrderByDescending(h => h.Version).Select(h => h.Version).FirstOrDefaultAsync();
                var uploadUser = await _userManager.GetUserAsync(User);
                _context.DataUploadHistory.Add(new DataUploadHistory
                {
                    DatasetType = "PeerSNG",
                    CountryCode = countryCode,
                    RecordCount = peers.Count,
                    Version = lastVersion + 1,
                    FileName = file.FileName,
                    UploadedByUserId = uploadUser?.Id,
                    UploadedByEmail = uploadUser?.Email,
                    Notes = $"Replaced {existing.Count} existing {countryCode} rows"
                });
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = $"Imported {peers.Count} {countryCode} peer records (replaced {existing.Count}) — v{lastVersion + 1}" });
            }
            catch (Exception ex)
            {
                var refId = NewErrorRef(ex, "UploadPeerSNGData");
                return Json(new { success = false, message = $"Import failed. Reference: {refId}" });
            }
        }

        // Upload CountryData (16 columns including CurrencyCode and CurrencySymbol)
        [HttpPost]
        [ValidateAntiForgeryToken]
        [RequestSizeLimit(5_000_000)]
        public async Task<IActionResult> UploadCountryData(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return Json(new { success = false, message = "Please select a file" });
            }

            try
            {
                using var reader = new StreamReader(file.OpenReadStream());
                var header = await reader.ReadLineAsync(); // Skip header
                var importedCount = 0;

                while (!reader.EndOfStream)
                {
                    var line = await reader.ReadLineAsync();
                    if (string.IsNullOrWhiteSpace(line)) continue;

                    var values = line.Split(',');
                    if (values.Length < 3) continue; // At minimum need Country, CurrencyCode, CurrencySymbol

                    var country = new CountryData
                    {
                        // Column 1: Country (required)
                        Country = values[0].Trim(),
                        // Column 2: CurrencyCode (required)
                        CurrencyCode = values.Length > 1 ? values[1].Trim() : null,
                        // Column 3: CurrencySymbol (required)
                        CurrencySymbol = values.Length > 2 ? values[2].Trim() : null,
                        // Column 4: SNG Total Revenue % GDP
                        SNG_total_revenue_pct_gdp = values.Length > 3 && !string.IsNullOrWhiteSpace(values[3]) ? decimal.Parse(values[3].Trim()) : null,
                        // Column 5: SNG Grants/Subsidies % GDP
                        SNG_grants_subsidies_pct_gdp = values.Length > 4 && !string.IsNullOrWhiteSpace(values[4]) ? decimal.Parse(values[4].Trim()) : null,
                        // Column 6: OSR % GDP
                        OSR_pct_gdp = values.Length > 5 && !string.IsNullOrWhiteSpace(values[5]) ? decimal.Parse(values[5].Trim()) : null,
                        // Column 7: GDP Nominal USD
                        GDP_nominal_usd = values.Length > 6 && !string.IsNullOrWhiteSpace(values[6]) ? decimal.Parse(values[6].Trim()) : null,
                        // Column 8: Population Total
                        Population_total = values.Length > 7 && !string.IsNullOrWhiteSpace(values[7]) ? long.Parse(values[7].Trim()) : null,
                        // Column 9: OSR Per Capita Proxy USD
                        OSR_pc_proxy_usd = values.Length > 8 && !string.IsNullOrWhiteSpace(values[8]) ? decimal.Parse(values[8].Trim()) : null,
                        // Column 10: Government Type
                        Government_Type = values.Length > 9 ? values[9].Trim() : null,
                        // Column 11: OSR Data Complete
                        OSR_Data_Complete = values.Length > 10 ? values[10].Trim() : null,
                        // Column 12: Income Level
                        Income_Level = values.Length > 11 ? values[11].Trim() : null,
                        // Column 13: Income Group
                        Income_Group = values.Length > 12 ? values[12].Trim() : null,
                        // Column 14: SNG Total Rev Per Capita USD
                        SNG_total_rev_pc_usd = values.Length > 13 && !string.IsNullOrWhiteSpace(values[13]) ? decimal.Parse(values[13].Trim()) : null,
                        // Column 15: Revenue Autonomy
                        Revenue_Autonomy = values.Length > 14 && !string.IsNullOrWhiteSpace(values[14]) ? decimal.Parse(values[14].Trim()) : null,
                        // Column 16: OSR Per Capita Derived USD
                        OSR_pc_derived_usd = values.Length > 15 && !string.IsNullOrWhiteSpace(values[15]) ? decimal.Parse(values[15].Trim()) : null
                    };

                    _context.DB_Countries.Add(country);
                    importedCount++;
                }

                await _context.SaveChangesAsync();

                // Log upload history
                var lastCdVersion = await _context.DataUploadHistory
                    .Where(h => h.DatasetType == "CountryData")
                    .OrderByDescending(h => h.Version).Select(h => h.Version).FirstOrDefaultAsync();
                var cdUser = await _userManager.GetUserAsync(User);
                _context.DataUploadHistory.Add(new DataUploadHistory
                {
                    DatasetType = "CountryData",
                    RecordCount = importedCount,
                    Version = lastCdVersion + 1,
                    FileName = file.FileName,
                    UploadedByUserId = cdUser?.Id,
                    UploadedByEmail = cdUser?.Email
                });
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = $"Successfully imported {importedCount} Country records (v{lastCdVersion + 1})" });
            }
            catch (Exception ex)
            {
                var refId = NewErrorRef(ex, "UploadCountryData");
                return Json(new { success = false, message = $"Import failed. Reference: {refId}" });
            }
        }

        // Edit Role Permissions
        public async Task<IActionResult> EditRolePermissions(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
            {
                return NotFound();
            }

            var model = new EditRolePermissionsViewModel
            {
                RoleId = role.Id,
                RoleName = role.Name,
                PermissionCategories = await GetPermissionCategoriesAsync(role.Id)
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateRolePermissions(string roleId, List<int> selectedPermissionIds)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
            {
                return Json(new { success = false, message = "Role not found" });
            }

            // Remove all existing permissions for this role
            var existingPermissions = await _context.RolePermissions
                .Where(rp => rp.RoleId == roleId)
                .ToListAsync();

            _context.RolePermissions.RemoveRange(existingPermissions);

            // Add new permissions
            if (selectedPermissionIds != null && selectedPermissionIds.Any())
            {
                var newPermissions = selectedPermissionIds.Select(permId => new RolePermission
                {
                    RoleId = roleId,
                    PermissionId = permId
                }).ToList();

                await _context.RolePermissions.AddRangeAsync(newPermissions);
            }

            await _context.SaveChangesAsync();

            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
            InvalidatePermissionCacheForUsers(usersInRole);

            return Json(new { success = true, message = $"Permissions for role '{role.Name}' updated successfully!" });
        }

        // Helper method to get permissions grouped by category
        private async Task<List<PermissionCategoryViewModel>> GetPermissionCategoriesAsync(string? roleId = null)
        {
            var permissions = await _context.Permissions.OrderBy(p => p.Category).ThenBy(p => p.Name).ToListAsync();

            List<int> rolePermissionIds = new List<int>();
            if (!string.IsNullOrEmpty(roleId))
            {
                rolePermissionIds = await _context.RolePermissions
                    .Where(rp => rp.RoleId == roleId)
                    .Select(rp => rp.PermissionId)
                    .ToListAsync();
            }

            var categories = permissions
                .GroupBy(p => p.Category)
                .Select(g => new PermissionCategoryViewModel
                {
                    Category = g.Key,
                    Permissions = g.Select(p => new PermissionViewModel
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description ?? "",
                        Category = p.Category,
                        IsSelected = rolePermissionIds.Contains(p.Id)
                    }).ToList()
                }).ToList();

            return categories;
        }

        private async Task LogAuditAsync(string action, string entityType, string? entityId, string? details, string? statusFrom = null, string? statusTo = null, string? reason = null)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            var auditLog = new Models.AuditLog
            {
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Timestamp = DateTime.UtcNow,
                UserId = currentUser?.Id,
                UserEmail = currentUser?.Email,
                Details = details,
                StatusFrom = statusFrom,
                StatusTo = statusTo,
                Reason = reason,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
            };
            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
        }

        // ══════════════════════════════════════════════════
        //  DATA MANAGEMENT
        // ══════════════════════════════════════════════════

        public async Task<IActionResult> DataManagement(
            int page = 1, int pageSize = 25, string? search = null,
            string? country = null, string? status = null, string? completionLevel = null,
            string? author = null, string? financialYear = null,
            string? dateFrom = null, string? dateTo = null)
        {
            // Base query (include soft-deleted for full picture)
            IQueryable<RosraReport> query = _context.RosraReports
                .IgnoreQueryFilters()
                .Where(r => !r.IsDeleted)
                .Include(r => r.User);

            // Gather filter options from all data
            var allReports = _context.RosraReports.IgnoreQueryFilters().Where(r => !r.IsDeleted);
            var countries = await allReports.Where(r => r.Country != null).Select(r => r.Country!).Distinct().OrderBy(c => c).ToListAsync();
            var years = await allReports.Where(r => r.FinancialYear != null).Select(r => r.FinancialYear!).Distinct().OrderByDescending(y => y).ToListAsync();
            var authorList = await allReports.Include(r => r.User)
                .Where(r => r.User != null)
                .Select(r => r.User!.Email ?? "")
                .Distinct().OrderBy(a => a).ToListAsync();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(r =>
                    (r.Title != null && r.Title.ToLower().Contains(term)) ||
                    (r.Country != null && r.Country.ToLower().Contains(term)) ||
                    (r.Region != null && r.Region.ToLower().Contains(term)) ||
                    (r.City != null && r.City.ToLower().Contains(term)) ||
                    (r.User != null && r.User.Email != null && r.User.Email.ToLower().Contains(term)));
            }

            if (!string.IsNullOrWhiteSpace(country))
                query = query.Where(r => r.Country == country);

            if (!string.IsNullOrWhiteSpace(status) && int.TryParse(status, out var statusVal))
                query = query.Where(r => r.Status == statusVal);

            if (!string.IsNullOrWhiteSpace(completionLevel) && int.TryParse(completionLevel, out var compVal))
                query = query.Where(r => r.CompletionLevel == compVal);

            if (!string.IsNullOrWhiteSpace(author))
                query = query.Where(r => r.User != null && r.User.Email == author);

            if (!string.IsNullOrWhiteSpace(financialYear))
                query = query.Where(r => r.FinancialYear == financialYear);

            if (!string.IsNullOrWhiteSpace(dateFrom) && DateTime.TryParse(dateFrom, out var from))
                query = query.Where(r => r.CreatedAt >= from);

            if (!string.IsNullOrWhiteSpace(dateTo) && DateTime.TryParse(dateTo, out var to))
                query = query.Where(r => r.CreatedAt <= to.AddDays(1));

            // Stats (from filtered query)
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            page = Math.Max(1, Math.Min(page, Math.Max(1, totalPages)));

            // Status counts (from all non-deleted)
            var statusCounts = await allReports.GroupBy(r => r.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var rawReports = await query
                .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var jsonOpts = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var reports = rawReports.Select(r =>
            {
                var item = new DataManagementReportItem
                {
                    Id = r.Id,
                    PublicId = r.PublicId,
                    Title = r.Title ?? "",
                    Country = r.Country,
                    Region = r.Region,
                    City = r.City,
                    FinancialYear = r.FinancialYear,
                    Currency = r.Currency,
                    CurrencySymbol = r.CurrencySymbol,
                    ActualOsr = r.ActualOsr ?? 0,
                    BudgetedOsr = r.BudgetedOsr ?? 0,
                    Population = r.Population ?? 0,
                    GdpPerCapita = r.GdpPerCapita ?? 0,
                    OtherRevenue = r.OtherRevenue ?? 0,
                    Status = r.Status,
                    CompletionLevel = r.CompletionLevel,
                    SubmissionVersion = r.SubmissionVersion,
                    AuthorName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Unknown",
                    AuthorEmail = r.User != null ? r.User.Email ?? "" : "",
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    SubmittedAt = r.SubmittedAt,
                    ValidatedAt = r.ValidatedAt,
                    IsArchived = r.IsArchived,
                    HasPropertyTax = !string.IsNullOrEmpty(r.PropertyTaxData),
                    HasLicense = !string.IsNullOrEmpty(r.LicenseData),
                    HasShortTerm = !string.IsNullOrEmpty(r.ShortTermUserChargeData),
                    HasLongTerm = !string.IsNullOrEmpty(r.LongTermUserChargeData),
                    HasMixed = !string.IsNullOrEmpty(r.MixedUserChargeData),
                    HasGeneric = !string.IsNullOrEmpty(r.GenericStreamsData),
                    HasPeerSNG = !string.IsNullOrEmpty(r.PeerSNGData),
                    HasPrioritization = !string.IsNullOrEmpty(r.PrioritizationData),
                    HasSolutions = !string.IsNullOrEmpty(r.SelectedSolutionsData),
                    HasCauses = !string.IsNullOrEmpty(r.ProblemStatement),
                    HasRecommendations = !string.IsNullOrEmpty(r.RecommendationSummary),
                };

                // Parse Property Tax data
                if (!string.IsNullOrEmpty(r.PropertyTaxData))
                {
                    try
                    {
                        var pt = System.Text.Json.JsonSerializer.Deserialize<GapAnalysisPropertyTaxViewModel>(r.PropertyTaxData, jsonOpts);
                        if (pt != null)
                        {
                            item.PtRevenue = pt.RevenueToDate ?? 0;
                            item.PtBilled = pt.BilledAmount ?? 0;
                            item.PtOutstanding = pt.OutstandingAmount ?? 0;
                            item.PtRegistered = pt.RegisteredProperties ?? 0;
                            item.PtCompliant = pt.CompliantProperties ?? 0;
                            // Compute the derived gap breakdown server-side; same formula as the JS
                            // analyst sees in _GapAnalysisPropertyTaxFixed.cshtml. See GapCalculator.
                            var ptGaps = Services.GapCalculator.ComputePropertyTaxGaps(pt);
                            item.Streams.Add(new StreamDetailItem
                            {
                                StreamType = "Property Tax", StreamName = "Property Tax",
                                Revenue = ptGaps.RevenueToDate, Billed = pt.BilledAmount ?? 0,
                                Outstanding = pt.OutstandingAmount ?? 0,
                                RegisteredUnits = pt.RegisteredProperties ?? 0,
                                CompliantUnits = (int)Math.Round(ptGaps.CompliantProperties),
                                ComplianceGap = ptGaps.ComplianceGap,
                                CoverageGap = ptGaps.CoverageGap,
                                ValuationGap = ptGaps.ValuationGap,
                                MixedGapCompliance = ptGaps.MixedGapRegistered,
                                MixedGapCoverage = ptGaps.MixedGapUnregistered,
                                TotalPotentialRevenue = ptGaps.TotalPotentialRevenue,
                                TotalFunctionalGap = ptGaps.TotalFunctionalGap,
                            });
                        }
                    }
                    catch { }
                }

                // Parse Business License data
                if (!string.IsNullOrEmpty(r.LicenseData))
                {
                    try
                    {
                        var bl = System.Text.Json.JsonSerializer.Deserialize<GapAnalysisLicenseViewModel>(r.LicenseData, jsonOpts);
                        if (bl != null)
                        {
                            item.BlRevenue = bl.RevenueToDate ?? 0;
                            item.BlBilled = bl.BilledAmount ?? 0;
                            item.BlOutstanding = bl.OutstandingAmount ?? 0;
                            item.BlRegistered = bl.RegisteredBusinesses ?? 0;
                            // Compute derived gaps server-side (mirror of _GapAnalysisLicense.cshtml).
                            var blGaps = Services.GapCalculator.ComputeBusinessLicenseGaps(bl);
                            item.Streams.Add(new StreamDetailItem
                            {
                                StreamType = "Business License", StreamName = "Business License",
                                SubType = ComposeSubType(bl.Subgroup, bl.Subtype),
                                Revenue = blGaps.RevenueToDate, Billed = bl.BilledAmount ?? 0,
                                Outstanding = bl.OutstandingAmount ?? 0,
                                RegisteredUnits = bl.RegisteredBusinesses ?? 0,
                                CompliantUnits = (int)Math.Round(blGaps.CompliantBusinesses),
                                ComplianceGap = blGaps.ComplianceGap,
                                CoverageGap = blGaps.CoverageGap,
                                LiabilityGap = blGaps.LiabilityGap,
                                MixedGapCompliance = blGaps.MixedGapCompliance,
                                MixedGapCoverage = blGaps.MixedGapCoverage,
                                TotalPotentialRevenue = blGaps.TotalPotentialRevenue,
                                TotalFunctionalGap = blGaps.TotalFunctionalGap,
                            });
                        }
                    }
                    catch { }
                }

                // Parse Generic Streams data — each stream becomes its own row
                if (!string.IsNullOrEmpty(r.GenericStreamsData))
                {
                    try
                    {
                        var streams = System.Text.Json.JsonSerializer.Deserialize<List<GenericStreamViewModel>>(r.GenericStreamsData, jsonOpts);
                        if (streams != null && streams.Count > 0)
                        {
                            item.GenericStreamCount = streams.Count;
                            item.GenericStreamNames = string.Join(", ", streams.Select(s => s.StreamName));
                            item.GenericTotalRevenue = streams.Sum(s => s.RevenueToDate ?? 0);
                            item.GenericTotalBilled = streams.Sum(s => s.BilledAmount ?? 0);
                            foreach (var s in streams)
                            {
                                // Generic streams already carry their own pre-computed gap breakdown
                                // in the saved JSON (the JS writes them in). Use them directly; also
                                // backfill TotalFunctionalGap if the saved value is missing/zero.
                                decimal genCompliance = s.ComplianceGap ?? 0;
                                decimal genCoverage   = s.CoverageGap ?? 0;
                                decimal genLiability  = s.LiabilityGap ?? 0;
                                decimal genMixedComp  = s.MixedGapCompliance ?? 0;
                                decimal genMixedCov   = s.MixedGapCoverage ?? 0;
                                decimal genFuncGap    = s.TotalFunctionalGap ?? (genCompliance + genCoverage + genLiability + genMixedComp + genMixedCov);

                                item.Streams.Add(new StreamDetailItem
                                {
                                    StreamType = "Non-Property", StreamName = s.StreamName ?? "Unnamed",
                                    SubType = ComposeSubType(s.Subgroup, s.Subtype),
                                    Revenue = s.RevenueToDate ?? 0, Billed = s.BilledAmount ?? 0,
                                    Outstanding = s.OutstandingAmount ?? 0,
                                    RegisteredUnits = s.RegisteredUnits ?? 0,
                                    CompliantUnits = (int)Math.Round(s.CompliantUnits ?? 0),
                                    ComplianceGap = genCompliance,
                                    CoverageGap = genCoverage,
                                    LiabilityGap = genLiability,
                                    MixedGapCompliance = genMixedComp,
                                    MixedGapCoverage = genMixedCov,
                                    TotalPotentialRevenue = s.TotalPotentialRevenue ?? 0,
                                    TotalFunctionalGap = genFuncGap,
                                });
                            }
                        }
                    }
                    catch { }
                }

                // Parse workflow data
                item.ProblemStatement = r.ProblemStatement;
                item.RecommendationSummary = r.RecommendationSummary;

                if (!string.IsNullOrEmpty(r.RootCauses))
                {
                    try { item.RootCauses = System.Text.Json.JsonSerializer.Deserialize<List<string>>(r.RootCauses, jsonOpts) ?? new(); } catch { }
                }

                if (!string.IsNullOrEmpty(r.PrioritizationData))
                {
                    try
                    {
                        var priDoc = System.Text.Json.JsonDocument.Parse(r.PrioritizationData);
                        var root = priDoc.RootElement;

                        // Seeded/legacy shape: { "streams": [ { rank, name, gap, share } ] }
                        if (root.ValueKind == System.Text.Json.JsonValueKind.Object
                            && root.TryGetProperty("streams", out var seededStreams)
                            && seededStreams.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            foreach (var el in seededStreams.EnumerateArray())
                            {
                                int sRank = el.TryGetProperty("rank", out var rkEl) && rkEl.TryGetInt32(out var rkV) ? rkV : int.MaxValue;
                                var sName = el.TryGetProperty("name", out var nmEl) ? nmEl.GetString() ?? "" :
                                            el.TryGetProperty("streamName", out var snEl) ? snEl.GetString() ?? "" : "";
                                item.PrioritizationItems.Add(new PrioritizationItem
                                {
                                    StreamRank = sRank,
                                    StreamName = sName,
                                    StreamType = InferStreamType(sName),
                                    Included = true,
                                });
                            }
                            item.PrioritizationItems = item.PrioritizationItems.OrderBy(p => p.StreamRank).ToList();
                        }
                        // Live shape: object with streamCustomizations[] (rank, included) and gapPrioritization[] (per-stream gap sequence)
                        else if (root.ValueKind == System.Text.Json.JsonValueKind.Object
                            && root.TryGetProperty("streamCustomizations", out var customs)
                            && customs.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            // Build a streamId -> gap sequence map from gapPrioritization for quick lookup
                            var gapMap = new Dictionary<string, List<GapPriorityEntry>>(StringComparer.OrdinalIgnoreCase);
                            if (root.TryGetProperty("gapPrioritization", out var gapArr) && gapArr.ValueKind == System.Text.Json.JsonValueKind.Array)
                            {
                                foreach (var g in gapArr.EnumerateArray())
                                {
                                    var sid = g.TryGetProperty("streamId", out var sidEl) ? sidEl.GetString() ?? "" : "";
                                    if (string.IsNullOrEmpty(sid)) continue;
                                    var seq = new List<GapPriorityEntry>();
                                    if (g.TryGetProperty("currentSequence", out var curSeq) && curSeq.ValueKind == System.Text.Json.JsonValueKind.Array)
                                    {
                                        int gr = 1;
                                        foreach (var s in curSeq.EnumerateArray())
                                        {
                                            seq.Add(new GapPriorityEntry
                                            {
                                                Rank = gr++,
                                                Type = s.TryGetProperty("type", out var tEl) ? tEl.GetString() ?? "" : "",
                                                Removed = s.TryGetProperty("removed", out var rEl) && rEl.ValueKind == System.Text.Json.JsonValueKind.True,
                                                IsOverridden = s.TryGetProperty("isOverridden", out var oEl) && oEl.ValueKind == System.Text.Json.JsonValueKind.True,
                                            });
                                        }
                                    }
                                    gapMap[sid] = seq;
                                }
                            }

                            // Convert each streamCustomization into a PrioritizationItem
                            var raw = new List<PrioritizationItem>();
                            foreach (var el in customs.EnumerateArray())
                            {
                                var id = el.TryGetProperty("id", out var idEl) ? idEl.GetString() ?? "" : "";
                                if (string.IsNullOrEmpty(id)) continue;
                                int adj = el.TryGetProperty("adjustedRank", out var arEl) && arEl.TryGetInt32(out var arVal) ? arVal : int.MaxValue;
                                bool inc = !el.TryGetProperty("included", out var incEl) || incEl.ValueKind != System.Text.Json.JsonValueKind.False;

                                var pi = new PrioritizationItem
                                {
                                    StreamId = id,
                                    StreamRank = adj,
                                    Included = inc,
                                    StreamName = FriendlyStreamName(id, item.Streams),
                                    StreamType = FriendlyStreamType(id, item.Streams),
                                    GapSequence = gapMap.TryGetValue(id, out var seqOut) ? seqOut : new()
                                };
                                raw.Add(pi);
                            }

                            // Sort: included streams by adjustedRank, then excluded streams at the end
                            item.PrioritizationItems = raw
                                .OrderBy(p => p.Included ? 0 : 1)
                                .ThenBy(p => p.StreamRank)
                                .ToList();
                        }
                        else if (root.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            // Legacy shape: flat array of {rank, streamName, ...}
                            int rank = 1;
                            foreach (var el in root.EnumerateArray())
                            {
                                item.PrioritizationItems.Add(new PrioritizationItem
                                {
                                    StreamRank = rank++,
                                    StreamName = el.TryGetProperty("streamName", out var sn) ? sn.GetString() ?? "" :
                                                 el.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "",
                                    Included = true,
                                });
                            }
                        }
                    }
                    catch { }
                }

                if (!string.IsNullOrEmpty(r.SelectedSolutionsData))
                {
                    try
                    {
                        var solDoc = System.Text.Json.JsonDocument.Parse(r.SelectedSolutionsData);
                        // Try "selectedSolutions" sub-key or root array
                        System.Text.Json.JsonElement solArray;
                        if (solDoc.RootElement.TryGetProperty("selectedSolutions", out solArray) && solArray.ValueKind == System.Text.Json.JsonValueKind.Array)
                        { }
                        else if (solDoc.RootElement.ValueKind == System.Text.Json.JsonValueKind.Array)
                        { solArray = solDoc.RootElement; }
                        else { solArray = default; }

                        if (solArray.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            foreach (var el in solArray.EnumerateArray())
                            {
                                item.SolutionItems.Add(new SolutionItem
                                {
                                    Title = el.TryGetProperty("title", out var t) ? t.GetString() ?? "" :
                                            el.TryGetProperty("name", out var nm) ? nm.GetString() ?? "" : "",
                                    Stream = el.TryGetProperty("stream", out var s) ? s.GetString() ?? "" :
                                             el.TryGetProperty("revenueStream", out var rs) ? rs.GetString() ?? "" : "",
                                    GapType = el.TryGetProperty("gapType", out var g) ? g.GetString() ?? "" : "",
                                    Timeline = el.TryGetProperty("timeline", out var tl) ? tl.GetString() ?? "" : "",
                                });
                            }
                        }
                    }
                    catch { }
                }

                // Parse per-report peer SNG data (top-down within-country analysis).
                // Shape: { dataSource|tier, currency, selectedSNG, customPeers:[{sng,osr,gcp,population,include}] }
                if (!string.IsNullOrEmpty(r.PeerSNGData))
                {
                    try
                    {
                        var peerDoc = System.Text.Json.JsonDocument.Parse(r.PeerSNGData);
                        var root = peerDoc.RootElement;
                        if (root.ValueKind == System.Text.Json.JsonValueKind.Object)
                        {
                            item.PeerDataSource = root.TryGetProperty("tier", out var tierEl) && tierEl.ValueKind == System.Text.Json.JsonValueKind.String
                                ? tierEl.GetString() ?? ""
                                : (root.TryGetProperty("dataSource", out var dsEl) ? dsEl.GetString() ?? "" : "");
                            if (root.TryGetProperty("currency", out var curEl) && curEl.ValueKind == System.Text.Json.JsonValueKind.String)
                                item.PeerCurrency = curEl.GetString() ?? "";
                            if (root.TryGetProperty("selectedSNG", out var selEl) && selEl.ValueKind == System.Text.Json.JsonValueKind.String)
                                item.PeerSelectedSNG = selEl.GetString() ?? "";

                            if (root.TryGetProperty("customPeers", out var peersEl) && peersEl.ValueKind == System.Text.Json.JsonValueKind.Array)
                            {
                                foreach (var p in peersEl.EnumerateArray())
                                {
                                    decimal GetDec(string n) => p.TryGetProperty(n, out var v) && v.TryGetDecimal(out var d) ? d : 0m;
                                    item.PeerSNGItems.Add(new PeerSngItem
                                    {
                                        Sng = p.TryGetProperty("sng", out var sv) ? sv.GetString() ?? "" : "",
                                        Osr = GetDec("osr"),
                                        Gcp = GetDec("gcp"),
                                        Population = p.TryGetProperty("population", out var pv) && pv.TryGetInt64(out var pl) ? pl : 0L,
                                        Include = !p.TryGetProperty("include", out var iv) || iv.ValueKind != System.Text.Json.JsonValueKind.False,
                                    });
                                }
                            }
                        }
                    }
                    catch { }
                }

                return item;
            }).ToList();

            var model = new DataManagementViewModel
            {
                Reports = reports,
                PageNumber = page,
                TotalPages = totalPages,
                TotalCount = totalCount,
                PageSize = pageSize,
                Search = search,
                Country = country,
                Status = status,
                CompletionLevel = completionLevel,
                Author = author,
                FinancialYear = financialYear,
                DateFrom = dateFrom,
                DateTo = dateTo,
                Countries = countries,
                Authors = authorList,
                FinancialYears = years,
                TotalReports = await allReports.CountAsync(),
                DraftCount = statusCounts.FirstOrDefault(s => s.Status == 0)?.Count ?? 0,
                SubmittedCount = statusCounts.FirstOrDefault(s => s.Status == 1)?.Count ?? 0,
                UnderReviewCount = statusCounts.FirstOrDefault(s => s.Status == 2)?.Count ?? 0,
                NeedsRevisionCount = statusCounts.FirstOrDefault(s => s.Status == 3)?.Count ?? 0,
                ValidatedCount = statusCounts.FirstOrDefault(s => s.Status == 4)?.Count ?? 0,
            };

            // Admin reference-dataset summaries (latest version per type + current live counts).
            try
            {
                var history = await _context.DataUploadHistory
                    .GroupBy(h => h.DatasetType)
                    .Select(g => new
                    {
                        DatasetType = g.Key,
                        LatestVersion = g.Max(h => h.Version),
                        Last = g.OrderByDescending(h => h.UploadedAt).FirstOrDefault(),
                    })
                    .ToListAsync();

                int peerRows = 0, peerCountries = 0, countryRows = 0;
                try { peerRows = await _context.Peers_SNG.CountAsync(); } catch { }
                try { peerCountries = await _context.Peers_SNG.Select(p => p.CountryCode).Distinct().CountAsync(); } catch { }
                try { countryRows = await _context.DB_Countries.CountAsync(); } catch { }

                string DisplayName(string t) => t switch
                {
                    "PeerSNG" => "Peer SNG reference data",
                    "CountryData" => "Country data",
                    _ => t
                };

                model.DatasetSummaries = history.Select(h => new DatasetSummary
                {
                    DatasetType = h.DatasetType,
                    DisplayName = DisplayName(h.DatasetType),
                    LatestVersion = h.LatestVersion,
                    RecordCount = h.Last?.RecordCount ?? 0,
                    TotalRows = h.DatasetType == "PeerSNG" ? peerRows : (h.DatasetType == "CountryData" ? countryRows : 0),
                    CountriesCovered = h.DatasetType == "PeerSNG" ? peerCountries : 0,
                    LastUploadedAt = h.Last?.UploadedAt,
                    LastUploadedBy = h.Last?.UploadedByEmail,
                }).OrderBy(d => d.DisplayName).ToList();
            }
            catch { /* upload history table optional — panel just renders empty */ }

            return View(model);
        }

        // Maps a prioritization streamId (e.g. "property-tax", "business-license",
        // "generic-stream-0") to a human-readable name. Falls back to the report's
        // parsed Streams collection for generic streams whose ID indexes into that list.
        private static string FriendlyStreamName(string streamId, List<StreamDetailItem> streams)
        {
            if (string.IsNullOrEmpty(streamId)) return "";

            // Canonical IDs used by the prioritization tab
            switch (streamId.ToLowerInvariant())
            {
                case "property-tax": return "Property Tax";
                case "business-license": return "Business License";
                case "short-term": return "Short-Term User Charges";
                case "long-term": return "Long-Term User Charges";
                case "mixed": return "Mixed User Charges";
            }

            // Generic streams: try to match by index into the report's Streams list,
            // restricting to entries that look like generic streams (not the canonical types).
            if (streamId.StartsWith("generic-stream-", StringComparison.OrdinalIgnoreCase)
                && int.TryParse(streamId.AsSpan("generic-stream-".Length), out var idx))
            {
                var generics = streams
                    .Where(s => s.StreamType != "Property Tax"
                             && s.StreamType != "Business License"
                             && s.StreamType != "Short-Term"
                             && s.StreamType != "Long-Term"
                             && s.StreamType != "Mixed")
                    .ToList();
                if (idx >= 0 && idx < generics.Count) return generics[idx].StreamName;
            }

            // Fallback: prettify the slug
            return string.Join(" ", streamId.Split('-').Select(s => s.Length > 0 ? char.ToUpper(s[0]) + s.Substring(1) : s));
        }

        private static string FriendlyStreamType(string streamId, List<StreamDetailItem> streams)
        {
            if (string.IsNullOrEmpty(streamId)) return "";
            switch (streamId.ToLowerInvariant())
            {
                case "property-tax": return "Property Tax";
                case "business-license": return "Business License";
                case "short-term": return "Short-Term";
                case "long-term": return "Long-Term";
                case "mixed": return "Mixed";
            }
            return "Non-Property";
        }

        // Combines a non-property subgroup letter (A/B/C) and the free-text
        // subtype into a single display string. Returns "" when both are empty.
        // Examples:
        //   ("A", "Business licence fee") → "A — Business licence fee"
        //   ("B", null)                   → "B"
        //   (null, "Permit fee")          → "Permit fee"
        //   (null, null)                  → ""
        private static string ComposeSubType(string? subgroup, string? subtype)
        {
            var sg = string.IsNullOrWhiteSpace(subgroup) ? null : subgroup.Trim();
            var st = string.IsNullOrWhiteSpace(subtype)  ? null : subtype.Trim();
            if (sg != null && st != null) return $"{sg} — {st}";
            return sg ?? st ?? "";
        }

        // Given a free-text stream name (e.g. from seeded data), guess its canonical type
        // so the admin row can show a category label next to the name.
        private static string InferStreamType(string streamName)
        {
            if (string.IsNullOrEmpty(streamName)) return "";
            var s = streamName.ToLowerInvariant();
            if (s.Contains("property")) return "Property Tax";
            if (s.Contains("license") || s.Contains("licence") || s.Contains("permit")) return "Business License";
            return "Other";
        }

        [HttpGet]
        public async Task<IActionResult> ExportDataExcel(
            string? search = null, string? country = null, string? status = null,
            string? completionLevel = null, string? author = null,
            string? financialYear = null, string? dateFrom = null, string? dateTo = null,
            // Column-picker selections forwarded from the Data Management UI.
            // `cols` is a comma-separated list of column IDs (col-title, col-country, …)
            // that mirror the Show/Hide column-picker check-boxes.
            // `sheets` is a comma-separated list of sheet IDs (main, streams,
            // prioritization, recommendations). Either omitted ⇒ include everything,
            // matching the prior behaviour for any caller that doesn't pass them.
            string? cols = null,
            string? sheets = null)
        {
            // `null` selectedCols/selectedSheets ⇒ include everything. An EMPTY
            // set (e.g. when the UI sends the `__none__` sentinel because the
            // user un-checked everything) ⇒ include nothing.
            HashSet<string>? selectedCols, selectedSheets;
            if (string.IsNullOrWhiteSpace(cols)) selectedCols = null;
            else if (cols == "__none__") selectedCols = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            else selectedCols = new HashSet<string>(
                cols.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()),
                StringComparer.OrdinalIgnoreCase);

            if (string.IsNullOrWhiteSpace(sheets)) selectedSheets = null;
            else if (sheets == "__none__") selectedSheets = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            else selectedSheets = new HashSet<string>(
                sheets.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()),
                StringComparer.OrdinalIgnoreCase);

            bool IncludeCol(string id)   => selectedCols   == null || selectedCols.Contains(id);
            bool IncludeSheet(string id) => selectedSheets == null || selectedSheets.Contains(id);

            IQueryable<RosraReport> query = _context.RosraReports
                .IgnoreQueryFilters()
                .Where(r => !r.IsDeleted)
                .Include(r => r.User);

            // Apply same filters as the page
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(r =>
                    (r.Title != null && r.Title.ToLower().Contains(term)) ||
                    (r.Country != null && r.Country.ToLower().Contains(term)) ||
                    (r.City != null && r.City.ToLower().Contains(term)) ||
                    (r.User != null && r.User.Email != null && r.User.Email.ToLower().Contains(term)));
            }
            if (!string.IsNullOrWhiteSpace(country))
                query = query.Where(r => r.Country == country);
            if (!string.IsNullOrWhiteSpace(status) && int.TryParse(status, out var sv))
                query = query.Where(r => r.Status == sv);
            if (!string.IsNullOrWhiteSpace(completionLevel) && int.TryParse(completionLevel, out var cv))
                query = query.Where(r => r.CompletionLevel == cv);
            if (!string.IsNullOrWhiteSpace(author))
                query = query.Where(r => r.User != null && r.User.Email == author);
            if (!string.IsNullOrWhiteSpace(financialYear))
                query = query.Where(r => r.FinancialYear == financialYear);
            if (!string.IsNullOrWhiteSpace(dateFrom) && DateTime.TryParse(dateFrom, out var from))
                query = query.Where(r => r.CreatedAt >= from);
            if (!string.IsNullOrWhiteSpace(dateTo) && DateTime.TryParse(dateTo, out var to))
                query = query.Where(r => r.CreatedAt <= to.AddDays(1));

            var reports = await query.OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt).ToListAsync();

            using var workbook = new XLWorkbook();
            var jsonOpts = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            // ── Sheet 1: Main report list (ROSRA Data) ──
            // Each column is described as (colId, header, group). colId maps to the
            // data-col attribute used by the Columns picker in DataManagement.cshtml
            // so the on-page check-box selection drives the export 1-to-1. "id"
            // (the synthetic ID) and "currency" always export — they aren't
            // toggleable in the picker.
            int row = 1; // used after the main sheet so it stays referenced for autofilter range
            int headerCount = 0;
            if (IncludeSheet("main"))
            {
                var ws = workbook.Worksheets.Add("ROSRA Data");

                // Group is used to colour-code the header cell.
                var columnSpecs = new List<(string ColId, string Header, string Group)>
                {
                    ("__always",        "ID",                 "core"),
                    ("col-title",       "Title",              "core"),
                    ("col-country",     "Country",            "core"),
                    ("col-location",    "Region",             "core"),
                    ("col-location",    "City",               "core"),
                    ("col-year",        "Financial Year",     "core"),
                    ("__always",        "Currency",           "core"),
                    ("col-osr",         "Actual OSR",         "core"),
                    ("col-budgeted",    "Budgeted OSR",       "core"),
                    ("col-pop",         "Population",         "core"),
                    ("col-gdp",         "GDP per Capita",     "core"),
                    ("col-other",       "Other Revenue",      "core"),
                    ("col-status",      "Status",             "core"),
                    ("col-comp",        "Completion",         "core"),
                    ("col-version",     "Version",            "core"),
                    ("col-author",      "Author",             "core"),
                    ("col-author",      "Email",              "core"),
                    ("col-created",     "Created",            "core"),
                    ("col-submitted",   "Submitted",          "core"),
                    ("col-validated",   "Validated",          "core"),
                    ("col-pt-rev",      "PT Revenue",         "PT"),
                    ("col-pt-billed",   "PT Billed",          "PT"),
                    ("col-pt-outstanding","PT Outstanding",   "PT"),
                    ("col-pt-registered","PT Registered",     "PT"),
                    ("col-pt-compliant","PT Compliant",       "PT"),
                    ("col-bl-rev",      "BL Revenue",         "BL"),
                    ("col-bl-billed",   "BL Billed",          "BL"),
                    ("col-bl-outstanding","BL Outstanding",   "BL"),
                    ("col-bl-registered","BL Registered",     "BL"),
                    ("col-gen-count",   "Non-Property Count",      "Generic"),
                    ("col-gen-names",   "Non-Property Names",      "Generic"),
                    ("col-gen-rev",     "Non-Property Total Revenue","Generic"),
                    ("col-streams",     "Has Property Tax",   "Has"),
                    ("col-streams",     "Has License",        "Has"),
                    ("col-streams",     "Has Short-Term",     "Has"),
                    ("col-streams",     "Has Long-Term",      "Has"),
                    ("col-streams",     "Has Mixed",          "Has"),
                    ("col-streams",     "Has Non-Property",   "Has"),
                    ("col-streams",     "Has Peer SNG",       "Has"),
                };

                // The "__always" entries are forced in (ID and Currency aren't toggleable).
                var includedColumns = columnSpecs
                    .Select((spec, idx) => (spec, idx))
                    .Where(x => x.spec.ColId == "__always" || IncludeCol(x.spec.ColId))
                    .ToList();

                // Render headers
                for (int i = 0; i < includedColumns.Count; i++)
                {
                    var (spec, _) = includedColumns[i];
                    var cell = ws.Cell(1, i + 1);
                    cell.Value = spec.Header;
                    cell.Style.Font.Bold = true;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    switch (spec.Group)
                    {
                        case "PT":      cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#FEF3C7"); cell.Style.Font.FontColor = XLColor.FromHtml("#92400E"); break;
                        case "BL":      cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#EDE9FE"); cell.Style.Font.FontColor = XLColor.FromHtml("#5B21B6"); break;
                        case "Generic": cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#CFFAFE"); cell.Style.Font.FontColor = XLColor.FromHtml("#155E75"); break;
                        case "Has":     cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#F3F4F6"); cell.Style.Font.FontColor = XLColor.FromHtml("#374151"); break;
                        default:        cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#00689D"); cell.Style.Font.FontColor = XLColor.White; break;
                    }
                }
                headerCount = includedColumns.Count;

                row = 2;
                foreach (var r in reports)
                {
                    var statusName = ((ReportStatus)r.Status).ToString();
                    var compName = ((Models.Enums.CompletionLevel)r.CompletionLevel).ToString();
                    var authorName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Unknown";
                    var authorEmail = r.User?.Email ?? "";

                    // Parse Property Tax once for this row
                    decimal ptRev = 0, ptBill = 0, ptOut = 0; int ptReg = 0, ptComp = 0;
                    if (!string.IsNullOrEmpty(r.PropertyTaxData))
                    {
                        try { var pt = System.Text.Json.JsonSerializer.Deserialize<GapAnalysisPropertyTaxViewModel>(r.PropertyTaxData, jsonOpts);
                            if (pt != null) { ptRev = pt.RevenueToDate ?? 0; ptBill = pt.BilledAmount ?? 0; ptOut = pt.OutstandingAmount ?? 0; ptReg = pt.RegisteredProperties ?? 0; ptComp = pt.CompliantProperties ?? 0; }
                        } catch { }
                    }
                    decimal blRev = 0, blBill = 0, blOut = 0; int blReg = 0;
                    if (!string.IsNullOrEmpty(r.LicenseData))
                    {
                        try { var bl = System.Text.Json.JsonSerializer.Deserialize<GapAnalysisLicenseViewModel>(r.LicenseData, jsonOpts);
                            if (bl != null) { blRev = bl.RevenueToDate ?? 0; blBill = bl.BilledAmount ?? 0; blOut = bl.OutstandingAmount ?? 0; blReg = bl.RegisteredBusinesses ?? 0; }
                        } catch { }
                    }
                    int genCount = 0; string genNames = ""; decimal genRev = 0;
                    if (!string.IsNullOrEmpty(r.GenericStreamsData))
                    {
                        try { var streamsParsed = System.Text.Json.JsonSerializer.Deserialize<List<GenericStreamViewModel>>(r.GenericStreamsData, jsonOpts);
                            if (streamsParsed != null) { genCount = streamsParsed.Count; genNames = string.Join(", ", streamsParsed.Select(s => s.StreamName)); genRev = streamsParsed.Sum(s => s.RevenueToDate ?? 0); }
                        } catch { }
                    }

                    // Values aligned by index to columnSpecs above.
                    var allValues = new (Action<IXLCell> Set, bool IsNumber)[]
                    {
                        (c => c.Value = r.Id, false),
                        (c => c.Value = r.Title ?? "", false),
                        (c => c.Value = r.Country ?? "", false),
                        (c => c.Value = r.Region ?? "", false),
                        (c => c.Value = r.City ?? "", false),
                        (c => c.Value = r.FinancialYear ?? "", false),
                        (c => c.Value = r.Currency ?? "", false),
                        (c => c.Value = r.ActualOsr ?? 0,   true),
                        (c => c.Value = r.BudgetedOsr ?? 0, true),
                        (c => c.Value = r.Population ?? 0,  true),
                        (c => c.Value = r.GdpPerCapita ?? 0,true),
                        (c => c.Value = r.OtherRevenue ?? 0,true),
                        (c => c.Value = statusName, false),
                        (c => c.Value = compName, false),
                        (c => c.Value = r.SubmissionVersion, false),
                        (c => c.Value = authorName, false),
                        (c => c.Value = authorEmail, false),
                        (c => c.Value = r.CreatedAt.ToString("yyyy-MM-dd HH:mm"), false),
                        (c => c.Value = r.SubmittedAt?.ToString("yyyy-MM-dd HH:mm") ?? "", false),
                        (c => c.Value = r.ValidatedAt?.ToString("yyyy-MM-dd HH:mm") ?? "", false),
                        (c => c.Value = ptRev,  true),
                        (c => c.Value = ptBill, true),
                        (c => c.Value = ptOut,  true),
                        (c => c.Value = ptReg,  false),
                        (c => c.Value = ptComp, false),
                        (c => c.Value = blRev,  true),
                        (c => c.Value = blBill, true),
                        (c => c.Value = blOut,  true),
                        (c => c.Value = blReg,  false),
                        (c => c.Value = genCount, false),
                        (c => c.Value = genNames, false),
                        (c => c.Value = genRev, true),
                        (c => c.Value = !string.IsNullOrEmpty(r.PropertyTaxData) ? "Yes" : "No", false),
                        (c => c.Value = !string.IsNullOrEmpty(r.LicenseData) ? "Yes" : "No", false),
                        (c => c.Value = !string.IsNullOrEmpty(r.ShortTermUserChargeData) ? "Yes" : "No", false),
                        (c => c.Value = !string.IsNullOrEmpty(r.LongTermUserChargeData) ? "Yes" : "No", false),
                        (c => c.Value = !string.IsNullOrEmpty(r.MixedUserChargeData) ? "Yes" : "No", false),
                        (c => c.Value = !string.IsNullOrEmpty(r.GenericStreamsData) ? "Yes" : "No", false),
                        (c => c.Value = !string.IsNullOrEmpty(r.PeerSNGData) ? "Yes" : "No", false),
                    };

                    for (int i = 0; i < includedColumns.Count; i++)
                    {
                        var (_, idx) = includedColumns[i];
                        var cell = ws.Cell(row, i + 1);
                        allValues[idx].Set(cell);
                        if (allValues[idx].IsNumber) cell.Style.NumberFormat.Format = "#,##0";
                    }
                    row++;
                }

                ws.Columns().AdjustToContents();
                if (reports.Count > 0 && headerCount > 0)
                    ws.Range(1, 1, row - 1, headerCount).SetAutoFilter();
            }

            // ── Sheet 2: Stream Details (one row per stream per report) ──
            // Now uses the same GapCalculator as the admin view so the
            // exported numbers match what the on-page detail rows show.
            if (IncludeSheet("streams"))
            {
                var sd = workbook.Worksheets.Add("Stream Details");
                var sdHeaders = new[] { "Report ID", "Title", "Country", "City", "Financial Year",
                    "Stream Name", "Stream Type", "Sub Type", "Revenue", "Billed", "Outstanding",
                    "Registered Units", "Compliant Units",
                    "Compliance Gap", "Coverage Gap", "Valuation Gap", "Liability Gap",
                    "Mixed Gap", "Total Functional Gap", "Total Potential Revenue" };

                for (int i = 0; i < sdHeaders.Length; i++)
                {
                    var cell = sd.Cell(1, i + 1);
                    cell.Value = sdHeaders[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#06B6D4");
                    cell.Style.Font.FontColor = XLColor.White;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }

                int sdRow = 2;
                foreach (var r in reports)
                {
                    // (name, type, subType, rev, bill, out, reg, comp, complianceGap, coverageGap, valuationGap, liabilityGap, mixedGap, funcGap, potential)
                    var streamItems = new List<(string Name, string Type, string SubType,
                                                decimal Rev, decimal Bill, decimal Out,
                                                int Reg, int Comp, decimal CG, decimal CovG, decimal VG, decimal LG,
                                                decimal MG, decimal FG, decimal TPR)>();

                    if (!string.IsNullOrEmpty(r.PropertyTaxData))
                    {
                        try { var pt = System.Text.Json.JsonSerializer.Deserialize<GapAnalysisPropertyTaxViewModel>(r.PropertyTaxData, jsonOpts);
                            if (pt != null)
                            {
                                var g = Services.GapCalculator.ComputePropertyTaxGaps(pt);
                                streamItems.Add(("Property Tax", "Property Tax", "",
                                    g.RevenueToDate, pt.BilledAmount ?? 0, pt.OutstandingAmount ?? 0,
                                    pt.RegisteredProperties ?? 0, (int)Math.Round(g.CompliantProperties),
                                    g.ComplianceGap, g.CoverageGap, g.ValuationGap, 0m,
                                    g.MixedGapRegistered + g.MixedGapUnregistered,
                                    g.TotalFunctionalGap, g.TotalPotentialRevenue));
                            }
                        } catch { }
                    }
                    if (!string.IsNullOrEmpty(r.LicenseData))
                    {
                        try { var bl = System.Text.Json.JsonSerializer.Deserialize<GapAnalysisLicenseViewModel>(r.LicenseData, jsonOpts);
                            if (bl != null)
                            {
                                var g = Services.GapCalculator.ComputeBusinessLicenseGaps(bl);
                                streamItems.Add(("Business License", "Business License", ComposeSubType(bl.Subgroup, bl.Subtype),
                                    g.RevenueToDate, bl.BilledAmount ?? 0, bl.OutstandingAmount ?? 0,
                                    bl.RegisteredBusinesses ?? 0, (int)Math.Round(g.CompliantBusinesses),
                                    g.ComplianceGap, g.CoverageGap, 0m, g.LiabilityGap,
                                    g.MixedGapCompliance + g.MixedGapCoverage,
                                    g.TotalFunctionalGap, g.TotalPotentialRevenue));
                            }
                        } catch { }
                    }
                    if (!string.IsNullOrEmpty(r.GenericStreamsData))
                    {
                        try { var streamsParsed = System.Text.Json.JsonSerializer.Deserialize<List<GenericStreamViewModel>>(r.GenericStreamsData, jsonOpts);
                            if (streamsParsed != null) foreach (var s in streamsParsed)
                            {
                                decimal mixed = (s.MixedGapCompliance ?? 0) + (s.MixedGapCoverage ?? 0);
                                decimal funcGap = s.TotalFunctionalGap ?? ((s.ComplianceGap ?? 0) + (s.CoverageGap ?? 0) + (s.LiabilityGap ?? 0) + mixed);
                                streamItems.Add((s.StreamName ?? "Unnamed", "Non-Property", ComposeSubType(s.Subgroup, s.Subtype),
                                    s.RevenueToDate ?? 0, s.BilledAmount ?? 0, s.OutstandingAmount ?? 0,
                                    s.RegisteredUnits ?? 0, (int)(s.CompliantUnits ?? 0),
                                    s.ComplianceGap ?? 0, s.CoverageGap ?? 0, 0m, s.LiabilityGap ?? 0,
                                    mixed, funcGap, s.TotalPotentialRevenue ?? 0));
                            }
                        } catch { }
                    }

                    foreach (var si in streamItems)
                    {
                        int c = 1;
                        sd.Cell(sdRow, c++).Value = r.Id;
                        sd.Cell(sdRow, c++).Value = r.Title ?? "";
                        sd.Cell(sdRow, c++).Value = r.Country ?? "";
                        sd.Cell(sdRow, c++).Value = r.City ?? "";
                        sd.Cell(sdRow, c++).Value = r.FinancialYear ?? "";
                        sd.Cell(sdRow, c++).Value = si.Name;
                        sd.Cell(sdRow, c++).Value = si.Type;
                        sd.Cell(sdRow, c++).Value = si.SubType;
                        sd.Cell(sdRow, c).Value = si.Rev;  sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                        sd.Cell(sdRow, c).Value = si.Bill; sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                        sd.Cell(sdRow, c).Value = si.Out;  sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                        sd.Cell(sdRow, c++).Value = si.Reg;
                        sd.Cell(sdRow, c++).Value = si.Comp;
                        sd.Cell(sdRow, c).Value = si.CG;   sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                        sd.Cell(sdRow, c).Value = si.CovG; sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                        sd.Cell(sdRow, c).Value = si.VG;   sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                        sd.Cell(sdRow, c).Value = si.LG;   sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                        sd.Cell(sdRow, c).Value = si.MG;   sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                        sd.Cell(sdRow, c).Value = si.FG;   sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                        sd.Cell(sdRow, c).Value = si.TPR;  sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                        sdRow++;
                    }
                }

                sd.Columns().AdjustToContents();
                if (sdRow > 2)
                    sd.Range(1, 1, sdRow - 1, sdHeaders.Length).SetAutoFilter();
            }

            // ── Sheet 3: Prioritization ──
            // One row per (report, stream-rank). Reads the three known shapes of
            // PrioritizationData (current `streamCustomizations + gapPrioritization`
            // object, legacy seeded `{streams:[…]}` object, and the original
            // flat array). The gap sequence column is formatted as
            // "1.Compliance → 2.Coverage → 3.Valuation" with strike-through-marker
            // for removed steps and a trailing * for user-overridden ones.
            if (IncludeSheet("prioritization"))
            {
                var pri = workbook.Worksheets.Add("Prioritization");
                var priHeaders = new[] { "Report ID", "Title", "Country", "City", "Financial Year",
                    "Stream Rank", "Stream ID", "Stream Name", "Stream Type", "Included",
                    "Gap Priority Sequence" };

                for (int i = 0; i < priHeaders.Length; i++)
                {
                    var cell = pri.Cell(1, i + 1);
                    cell.Value = priHeaders[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#F59E0B");
                    cell.Style.Font.FontColor = XLColor.White;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }

                int priRow = 2;
                foreach (var r in reports)
                {
                    var items = ParsePrioritizationItemsForExport(r.PrioritizationData);
                    foreach (var it in items)
                    {
                        int c = 1;
                        pri.Cell(priRow, c++).Value = r.Id;
                        pri.Cell(priRow, c++).Value = r.Title ?? "";
                        pri.Cell(priRow, c++).Value = r.Country ?? "";
                        pri.Cell(priRow, c++).Value = r.City ?? "";
                        pri.Cell(priRow, c++).Value = r.FinancialYear ?? "";
                        pri.Cell(priRow, c++).Value = it.StreamRank == int.MaxValue ? "" : it.StreamRank.ToString();
                        pri.Cell(priRow, c++).Value = it.StreamId ?? "";
                        pri.Cell(priRow, c++).Value = it.StreamName ?? "";
                        pri.Cell(priRow, c++).Value = it.StreamType ?? "";
                        pri.Cell(priRow, c++).Value = it.Included ? "Yes" : "No";
                        pri.Cell(priRow, c++).Value = FormatGapSequence(it.GapSequence);
                        priRow++;
                    }
                }

                pri.Columns().AdjustToContents();
                if (priRow > 2)
                    pri.Range(1, 1, priRow - 1, priHeaders.Length).SetAutoFilter();
            }

            // ── Sheet 4: Recommendations ──
            // One row per report with the problem statement, root causes,
            // recommendation summary, and selected-solutions list. Long text
            // columns get wrap-text styling so the workbook reads cleanly.
            if (IncludeSheet("recommendations"))
            {
                var rec = workbook.Worksheets.Add("Recommendations");
                var recHeaders = new[] { "Report ID", "Title", "Country", "City", "Financial Year",
                    "Status", "Problem Statement", "Root Causes",
                    "Recommendation Summary", "Solutions Selected", "Solutions List" };

                for (int i = 0; i < recHeaders.Length; i++)
                {
                    var cell = rec.Cell(1, i + 1);
                    cell.Value = recHeaders[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#10B981");
                    cell.Style.Font.FontColor = XLColor.White;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                }

                int recRow = 2;
                foreach (var r in reports)
                {
                    var statusName = ((ReportStatus)r.Status).ToString();
                    var (rootCausesJoined, solutionCount, solutionsList) = ParseRecommendationsExtras(r, jsonOpts);

                    int c = 1;
                    rec.Cell(recRow, c++).Value = r.Id;
                    rec.Cell(recRow, c++).Value = r.Title ?? "";
                    rec.Cell(recRow, c++).Value = r.Country ?? "";
                    rec.Cell(recRow, c++).Value = r.City ?? "";
                    rec.Cell(recRow, c++).Value = r.FinancialYear ?? "";
                    rec.Cell(recRow, c++).Value = statusName;
                    rec.Cell(recRow, c++).Value = r.ProblemStatement ?? "";
                    rec.Cell(recRow, c++).Value = rootCausesJoined;
                    rec.Cell(recRow, c++).Value = r.RecommendationSummary ?? "";
                    rec.Cell(recRow, c++).Value = solutionCount;
                    rec.Cell(recRow, c++).Value = solutionsList;
                    recRow++;
                }

                // Wrap the long-text columns
                for (int wi = 7; wi <= 11; wi++)
                {
                    rec.Column(wi).Width = 50;
                    rec.Column(wi).Style.Alignment.WrapText = true;
                }
                rec.Columns(1, 6).AdjustToContents();
                if (recRow > 2)
                    rec.Range(1, 1, recRow - 1, recHeaders.Length).SetAutoFilter();
            }

            // If the caller managed to deselect every sheet, ensure we still
            // ship a valid workbook with a placeholder so the download
            // doesn't 500.
            if (workbook.Worksheets.Count == 0)
            {
                var empty = workbook.Worksheets.Add("Empty");
                empty.Cell(1, 1).Value = "No sheets were selected for export.";
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var filename = $"ROSRA_Data_Export_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
            return File(stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename);
        }

        // ─── helpers used only by ExportDataExcel ───

        // Parses PrioritizationData JSON in all three shapes the codebase has
        // seen: (a) the live `_Prioritization.cshtml` shape with
        // `streamCustomizations` + `gapPrioritization`, (b) the seeded sample
        // `{streams:[…]}` shape, and (c) the original flat-array shape.
        private List<PrioritizationItem> ParsePrioritizationItemsForExport(string? json)
        {
            var items = new List<PrioritizationItem>();
            if (string.IsNullOrEmpty(json)) return items;

            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(json);
                var root = doc.RootElement;

                // Seeded shape: {"streams":[{rank,name,gap,share}]}
                if (root.ValueKind == System.Text.Json.JsonValueKind.Object
                    && root.TryGetProperty("streams", out var seededStreams)
                    && seededStreams.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    foreach (var el in seededStreams.EnumerateArray())
                    {
                        int rank = el.TryGetProperty("rank", out var rk) && rk.TryGetInt32(out var rv) ? rv : int.MaxValue;
                        var name = el.TryGetProperty("name", out var nm) ? nm.GetString() ?? "" :
                                   el.TryGetProperty("streamName", out var sn) ? sn.GetString() ?? "" : "";
                        items.Add(new PrioritizationItem
                        {
                            StreamRank = rank,
                            StreamName = name,
                            StreamType = InferStreamType(name),
                            Included = true,
                        });
                    }
                    return items.OrderBy(p => p.StreamRank).ToList();
                }

                // Current live shape
                if (root.ValueKind == System.Text.Json.JsonValueKind.Object
                    && root.TryGetProperty("streamCustomizations", out var customs)
                    && customs.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    var gapMap = new Dictionary<string, List<GapPriorityEntry>>(StringComparer.OrdinalIgnoreCase);
                    if (root.TryGetProperty("gapPrioritization", out var gapArr) && gapArr.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        foreach (var g in gapArr.EnumerateArray())
                        {
                            var sid = g.TryGetProperty("streamId", out var sidEl) ? sidEl.GetString() ?? "" : "";
                            if (string.IsNullOrEmpty(sid)) continue;
                            var seq = new List<GapPriorityEntry>();
                            if (g.TryGetProperty("currentSequence", out var cur) && cur.ValueKind == System.Text.Json.JsonValueKind.Array)
                            {
                                int rk = 1;
                                foreach (var s in cur.EnumerateArray())
                                {
                                    seq.Add(new GapPriorityEntry
                                    {
                                        Rank = rk++,
                                        Type = s.TryGetProperty("type", out var t) ? t.GetString() ?? "" : "",
                                        Removed = s.TryGetProperty("removed", out var rEl) && rEl.ValueKind == System.Text.Json.JsonValueKind.True,
                                        IsOverridden = s.TryGetProperty("isOverridden", out var oEl) && oEl.ValueKind == System.Text.Json.JsonValueKind.True,
                                    });
                                }
                            }
                            gapMap[sid] = seq;
                        }
                    }

                    foreach (var el in customs.EnumerateArray())
                    {
                        var id = el.TryGetProperty("id", out var idEl) ? idEl.GetString() ?? "" : "";
                        if (string.IsNullOrEmpty(id)) continue;
                        int adj = el.TryGetProperty("adjustedRank", out var arEl) && arEl.TryGetInt32(out var arVal) ? arVal : int.MaxValue;
                        bool inc = !el.TryGetProperty("included", out var incEl) || incEl.ValueKind != System.Text.Json.JsonValueKind.False;
                        items.Add(new PrioritizationItem
                        {
                            StreamId = id,
                            StreamRank = adj,
                            Included = inc,
                            StreamName = FriendlyStreamName(id, new List<StreamDetailItem>()),
                            StreamType = FriendlyStreamType(id, new List<StreamDetailItem>()),
                            GapSequence = gapMap.TryGetValue(id, out var seq) ? seq : new(),
                        });
                    }
                    return items.OrderBy(p => p.Included ? 0 : 1).ThenBy(p => p.StreamRank).ToList();
                }

                // Legacy flat array
                if (root.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    int rk = 1;
                    foreach (var el in root.EnumerateArray())
                    {
                        items.Add(new PrioritizationItem
                        {
                            StreamRank = rk++,
                            StreamName = el.TryGetProperty("streamName", out var sn) ? sn.GetString() ?? "" :
                                         el.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "",
                            Included = true,
                        });
                    }
                }
            }
            catch { /* swallow malformed JSON; the row just exports with empty priorities */ }

            return items;
        }

        private static string FormatGapSequence(List<GapPriorityEntry> seq)
        {
            if (seq == null || seq.Count == 0) return "";
            var parts = new List<string>();
            foreach (var g in seq)
            {
                var label = string.IsNullOrEmpty(g.Type) ? "—" : g.Type;
                if (g.Removed || string.Equals(g.Type, "Remove", StringComparison.OrdinalIgnoreCase))
                    parts.Add($"{g.Rank}.~~{label}~~");
                else
                    parts.Add($"{g.Rank}.{label}{(g.IsOverridden ? "*" : "")}");
            }
            return string.Join(" → ", parts);
        }

        private static (string RootCauses, int SolutionCount, string SolutionsList) ParseRecommendationsExtras(
            RosraReport r, System.Text.Json.JsonSerializerOptions jsonOpts)
        {
            string rootCauses = "";
            if (!string.IsNullOrEmpty(r.RootCauses))
            {
                try
                {
                    var list = System.Text.Json.JsonSerializer.Deserialize<List<string>>(r.RootCauses, jsonOpts);
                    if (list != null) rootCauses = string.Join("\n", list.Select((c, i) => $"{i + 1}. {c}"));
                }
                catch { rootCauses = r.RootCauses; }
            }

            int count = 0;
            string list2 = "";
            if (!string.IsNullOrEmpty(r.SelectedSolutionsData))
            {
                try
                {
                    using var doc = System.Text.Json.JsonDocument.Parse(r.SelectedSolutionsData);
                    System.Text.Json.JsonElement arr = default;
                    if (doc.RootElement.ValueKind == System.Text.Json.JsonValueKind.Object
                        && doc.RootElement.TryGetProperty("selectedSolutions", out var sel)
                        && sel.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        arr = sel;
                    }
                    else if (doc.RootElement.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        arr = doc.RootElement;
                    }

                    if (arr.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        var titles = new List<string>();
                        foreach (var el in arr.EnumerateArray())
                        {
                            var title = el.TryGetProperty("title", out var t) ? t.GetString() ?? "" :
                                        el.TryGetProperty("name",  out var nm) ? nm.GetString() ?? "" : "";
                            var stream = el.TryGetProperty("stream", out var s) ? s.GetString() ?? "" : "";
                            var gap = el.TryGetProperty("gapType", out var g) ? g.GetString() ?? "" : "";
                            var line = string.IsNullOrEmpty(stream) ? title : $"[{stream}{(string.IsNullOrEmpty(gap) ? "" : "/" + gap)}] {title}";
                            titles.Add(line);
                        }
                        count = titles.Count;
                        list2 = string.Join("\n", titles.Select((t, i) => $"{i + 1}. {t}"));
                    }
                }
                catch { /* leave blank on bad JSON */ }
            }
            return (rootCauses, count, list2);
        }

        // ══════════════════════════════════════════════════
        //  EMAIL SETTINGS
        // ══════════════════════════════════════════════════

        public async Task<IActionResult> EmailSettings(int logPage = 1, int logPageSize = 20)
        {
            var settings = await _emailService.GetSettingsAsync() ?? new EmailSettings();

            var logQuery = _context.EmailLogs.OrderByDescending(l => l.CreatedAt);
            var logCount = await logQuery.CountAsync();
            var logTotalPages = (int)Math.Ceiling(logCount / (double)logPageSize);
            logPage = Math.Max(1, Math.Min(logPage, Math.Max(1, logTotalPages)));

            var today = DateTime.UtcNow.Date;
            var model = new EmailManagementViewModel
            {
                Settings = settings,
                RecentLogs = await logQuery.Skip((logPage - 1) * logPageSize).Take(logPageSize).ToListAsync(),
                LogPageNumber = logPage,
                LogTotalPages = logTotalPages,
                LogTotalCount = logCount,
                TemplatePreviews = EmailTemplateService.GetAllTemplatePreviews(),
                TotalSent = await _context.EmailLogs.CountAsync(l => l.Status == "Sent"),
                TotalFailed = await _context.EmailLogs.CountAsync(l => l.Status == "Failed"),
                SentToday = await _context.EmailLogs.CountAsync(l => l.Status == "Sent" && l.SentAt >= today),
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateEmailSettings(
            string smtpServer, int smtpPort, string? smtpUsername, string? smtpPassword,
            bool useSsl, string senderEmail, string senderDisplayName, bool isEnabled,
            int maxRetries, int retryDelaySeconds)
        {
            var settings = await _emailService.GetSettingsAsync();
            if (settings == null)
                return Json(new { success = false, message = "Email settings not found" });

            settings.SmtpServer = smtpServer;
            settings.SmtpPort = smtpPort;
            settings.SmtpUsername = smtpUsername;
            // Only update password if a new one was provided
            if (!string.IsNullOrEmpty(smtpPassword) && smtpPassword != "••••••••")
                settings.SmtpPassword = _emailService.EncryptPassword(smtpPassword);
            settings.UseSsl = useSsl;
            settings.SenderEmail = senderEmail;
            settings.SenderDisplayName = senderDisplayName;
            settings.IsEnabled = isEnabled;
            settings.MaxRetries = maxRetries;
            settings.RetryDelaySeconds = retryDelaySeconds;

            var user = await _userManager.GetUserAsync(User);
            settings.UpdatedByUserId = user?.Id;

            await _emailService.SaveSettingsAsync(settings);
            return Json(new { success = true, message = "Email settings updated" });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleNotificationType(string type, bool enabled)
        {
            var settings = await _emailService.GetSettingsAsync();
            if (settings == null)
                return Json(new { success = false, message = "Settings not found" });

            switch (type)
            {
                case "ReportSubmitted": settings.EnableReportSubmitted = enabled; break;
                case "ReportClaimed": settings.EnableReportClaimed = enabled; break;
                case "ReportValidated": settings.EnableReportValidated = enabled; break;
                case "ReportRejected": settings.EnableReportRejected = enabled; break;
                case "ReportUnlocked": settings.EnableReportUnlocked = enabled; break;
                case "WelcomeEmail": settings.EnableWelcomeEmail = enabled; break;
                default: return Json(new { success = false, message = "Unknown notification type" });
            }

            await _emailService.SaveSettingsAsync(settings);
            return Json(new { success = true, message = $"{type} {(enabled ? "enabled" : "disabled")}" });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendTestEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return Json(new { success = false, message = "Email address is required" });

            var user = await _userManager.GetUserAsync(User);
            var result = await _emailService.SendTestEmailAsync(email, user?.FirstName ?? "Admin");
            return Json(new { success = result.Success, message = result.Message });
        }

        [HttpGet]
        public async Task<IActionResult> PreviewTemplate(string type)
        {
            var previews = EmailTemplateService.GetAllTemplatePreviews();
            if (previews.TryGetValue(type, out var html))
                return Content(html, "text/html");
            return NotFound();
        }

        // ══════════════════════════════════════════════════
        //  DATA RETENTION
        // ══════════════════════════════════════════════════

        /// <summary>
        /// Export all report data as an Excel backup file for admin download.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> BackupData()
        {
            try
            {
                var reports = await _context.RosraReports.IgnoreQueryFilters().Include(r => r.User).ToListAsync();
                var auditLogs = await _context.AuditLogs.OrderByDescending(a => a.Timestamp).Take(1000).ToListAsync();

                using var workbook = new XLWorkbook();

                // Sheet 1: Reports
                var ws1 = workbook.Worksheets.Add("Reports");
                var rHeaders = new[] { "ID","PublicId","Title","Country","Region","City","Year","Currency","ActualOSR","BudgetedOSR","Population","GdpPerCapita","Status","CompletionLevel","Version","Author","Email","Created","Submitted","Validated","IsDeleted","IsArchived" };
                for (int i = 0; i < rHeaders.Length; i++) { ws1.Cell(1, i + 1).Value = rHeaders[i]; ws1.Cell(1, i + 1).Style.Font.Bold = true; ws1.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#00689D"); ws1.Cell(1, i + 1).Style.Font.FontColor = XLColor.White; }
                int row = 2;
                foreach (var r in reports)
                {
                    int c = 1;
                    ws1.Cell(row, c++).Value = r.Id;
                    ws1.Cell(row, c++).Value = r.PublicId.ToString();
                    ws1.Cell(row, c++).Value = r.Title ?? "";
                    ws1.Cell(row, c++).Value = r.Country ?? "";
                    ws1.Cell(row, c++).Value = r.Region ?? "";
                    ws1.Cell(row, c++).Value = r.City ?? "";
                    ws1.Cell(row, c++).Value = r.FinancialYear ?? "";
                    ws1.Cell(row, c++).Value = r.Currency ?? "";
                    ws1.Cell(row, c).Value = r.ActualOsr ?? 0; ws1.Cell(row, c++).Style.NumberFormat.Format = "#,##0";
                    ws1.Cell(row, c).Value = r.BudgetedOsr ?? 0; ws1.Cell(row, c++).Style.NumberFormat.Format = "#,##0";
                    ws1.Cell(row, c).Value = r.Population ?? 0; ws1.Cell(row, c++).Style.NumberFormat.Format = "#,##0";
                    ws1.Cell(row, c).Value = r.GdpPerCapita ?? 0; ws1.Cell(row, c++).Style.NumberFormat.Format = "#,##0";
                    ws1.Cell(row, c++).Value = ((ReportStatus)r.Status).ToString();
                    ws1.Cell(row, c++).Value = ((Models.Enums.CompletionLevel)r.CompletionLevel).ToString();
                    ws1.Cell(row, c++).Value = r.SubmissionVersion;
                    ws1.Cell(row, c++).Value = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "";
                    ws1.Cell(row, c++).Value = r.User?.Email ?? "";
                    ws1.Cell(row, c++).Value = r.CreatedAt.ToString("yyyy-MM-dd HH:mm");
                    ws1.Cell(row, c++).Value = r.SubmittedAt?.ToString("yyyy-MM-dd HH:mm") ?? "";
                    ws1.Cell(row, c++).Value = r.ValidatedAt?.ToString("yyyy-MM-dd HH:mm") ?? "";
                    ws1.Cell(row, c++).Value = r.IsDeleted ? "Yes" : "No";
                    ws1.Cell(row, c++).Value = r.IsArchived ? "Yes" : "No";
                    row++;
                }
                ws1.Columns().AdjustToContents();

                // Sheet 2: Audit Log
                var ws2 = workbook.Worksheets.Add("Audit Log");
                var aHeaders = new[] { "Timestamp","User","Action","Entity","EntityId","StatusFrom","StatusTo","Details" };
                for (int i = 0; i < aHeaders.Length; i++) { ws2.Cell(1, i + 1).Value = aHeaders[i]; ws2.Cell(1, i + 1).Style.Font.Bold = true; ws2.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#F59E0B"); ws2.Cell(1, i + 1).Style.Font.FontColor = XLColor.White; }
                row = 2;
                foreach (var a in auditLogs)
                {
                    ws2.Cell(row, 1).Value = a.Timestamp.ToString("yyyy-MM-dd HH:mm:ss");
                    ws2.Cell(row, 2).Value = a.UserEmail ?? "";
                    ws2.Cell(row, 3).Value = a.Action ?? "";
                    ws2.Cell(row, 4).Value = a.EntityType ?? "";
                    ws2.Cell(row, 5).Value = a.EntityId ?? "";
                    ws2.Cell(row, 6).Value = a.StatusFrom ?? "";
                    ws2.Cell(row, 7).Value = a.StatusTo ?? "";
                    ws2.Cell(row, 8).Value = a.Details ?? "";
                    row++;
                }
                ws2.Columns().AdjustToContents();

                // Sheet 3: Upload History
                var ws3 = workbook.Worksheets.Add("Upload History");
                var uploads = await _context.DataUploadHistory.OrderByDescending(h => h.UploadedAt).ToListAsync();
                var uHeaders = new[] { "Dataset","Version","Records","File","UploadedBy","UploadedAt" };
                for (int i = 0; i < uHeaders.Length; i++) { ws3.Cell(1, i + 1).Value = uHeaders[i]; ws3.Cell(1, i + 1).Style.Font.Bold = true; ws3.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#10B981"); ws3.Cell(1, i + 1).Style.Font.FontColor = XLColor.White; }
                row = 2;
                foreach (var u in uploads)
                {
                    ws3.Cell(row, 1).Value = u.DatasetType;
                    ws3.Cell(row, 2).Value = $"v{u.Version}";
                    ws3.Cell(row, 3).Value = u.RecordCount;
                    ws3.Cell(row, 4).Value = u.FileName ?? "";
                    ws3.Cell(row, 5).Value = u.UploadedByEmail ?? "";
                    ws3.Cell(row, 6).Value = u.UploadedAt.ToString("yyyy-MM-dd HH:mm");
                    row++;
                }
                ws3.Columns().AdjustToContents();

                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                var filename = $"ROSRA_Backup_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
                return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename);
            }
            catch (Exception ex)
            {
                var refId = NewErrorRef(ex, "Backup");
                return Json(new { success = false, message = $"Backup failed. Reference: {refId}" });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> PurgeExpiredRecords()
        {
            var service = HttpContext.RequestServices.GetRequiredService<DataRetentionService>();
            var result = await service.PurgeExpiredRecords();
            return Json(new
            {
                success = true,
                message = $"Purged {result.PurgedReports} reports, {result.PurgedSnapshots} snapshots, {result.PurgedArtifacts} artifacts, {result.PurgedNotes} notes"
            });
        }

        // =====================================================================
        // SOLUTION CARD MANAGEMENT (CRM)
        // =====================================================================

        /// <summary>
        /// Solution Library — list all cards with filters
        /// </summary>
        public async Task<IActionResult> SolutionLibrary(
            int page = 1, int pageSize = 20,
            string? search = null, string? stream = null,
            string? gap = null, string? subgroup = null,
            string? timeline = null, string? status = null)
        {
            var query = _context.SolutionCards.IgnoreQueryFilters().AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
                query = query.Where(c => c.Title.Contains(search) || c.SolutionId.Contains(search) || (c.ShortTitle != null && c.ShortTitle.Contains(search)));
            if (!string.IsNullOrEmpty(stream))
                query = query.Where(c => c.Stream == stream);
            if (!string.IsNullOrEmpty(gap))
                query = query.Where(c => c.Gap == gap);
            if (!string.IsNullOrEmpty(subgroup))
                query = query.Where(c => c.Subgroup == subgroup);
            if (!string.IsNullOrEmpty(timeline))
                query = query.Where(c => c.Timeline == timeline);
            if (status == "active")
                query = query.Where(c => c.IsActive && !c.IsDeleted);
            else if (status == "inactive")
                query = query.Where(c => !c.IsActive && !c.IsDeleted);
            else if (status == "deleted")
                query = query.Where(c => c.IsDeleted);
            else
                query = query.Where(c => !c.IsDeleted); // default: show non-deleted

            var totalCount = await query.CountAsync();
            var cards = await query
                .OrderBy(c => c.Stream).ThenBy(c => c.Gap).ThenBy(c => c.SortOrder)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .ToListAsync();

            // Stats for badges
            var allCards = _context.SolutionCards.IgnoreQueryFilters();
            ViewBag.TotalActive = await allCards.CountAsync(c => c.IsActive && !c.IsDeleted);
            ViewBag.TotalInactive = await allCards.CountAsync(c => !c.IsActive && !c.IsDeleted);
            ViewBag.TotalDeleted = await allCards.CountAsync(c => c.IsDeleted);
            ViewBag.TotalCards = await allCards.CountAsync(c => !c.IsDeleted);

            ViewBag.CurrentPage = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            ViewBag.TotalCount = totalCount;
            ViewBag.Search = search;
            ViewBag.Stream = stream;
            ViewBag.Gap = gap;
            ViewBag.Subgroup = subgroup;
            ViewBag.Timeline = timeline;
            ViewBag.Status = status;

            return View(cards);
        }

        /// <summary>
        /// Create Solution Card — GET
        /// </summary>
        public IActionResult CreateSolutionCard()
        {
            return View("SolutionCardEditor", new SolutionCard());
        }

        /// <summary>
        /// Create Solution Card — POST
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateSolutionCard(SolutionCard card, string? overviewJson, string? fullDetailsJson)
        {
            // Check for duplicate SolutionId
            if (await _context.SolutionCards.IgnoreQueryFilters().AnyAsync(c => c.SolutionId == card.SolutionId))
            {
                ModelState.AddModelError("SolutionId", "A card with this Solution ID already exists.");
                return View("SolutionCardEditor", card);
            }

            card.OverviewData = overviewJson;
            card.FullDetailsData = fullDetailsJson;
            card.CreatedAt = DateTime.UtcNow;
            card.CreatedByUserId = _userManager.GetUserId(User);

            _context.SolutionCards.Add(card);

            // Create history entry
            _context.SolutionCardHistory.Add(new SolutionCardHistory
            {
                SolutionCardId = card.Id,
                ChangeType = "Created",
                ChangedByUserId = card.CreatedByUserId,
                ChangedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            // Fix history entry with correct card ID (after save)
            var historyEntry = await _context.SolutionCardHistory
                .OrderByDescending(h => h.ChangedAt)
                .FirstOrDefaultAsync(h => h.ChangeType == "Created" && h.SolutionCardId == 0);
            if (historyEntry != null)
            {
                historyEntry.SolutionCardId = card.Id;
                await _context.SaveChangesAsync();
            }

            TempData["SuccessMessage"] = $"Card '{card.SolutionId}' created successfully.";
            return RedirectToAction("SolutionLibrary");
        }

        /// <summary>
        /// Edit Solution Card — GET
        /// </summary>
        public async Task<IActionResult> EditSolutionCard(int id)
        {
            var card = await _context.SolutionCards.IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.Id == id);
            if (card == null) return NotFound();

            ViewBag.IsEdit = true;
            return View("SolutionCardEditor", card);
        }

        /// <summary>
        /// Edit Solution Card — POST
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditSolutionCard(int id, SolutionCard card, string? overviewJson, string? fullDetailsJson)
        {
            var existing = await _context.SolutionCards.IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.Id == id);
            if (existing == null) return NotFound();

            // Save history before updating
            _context.SolutionCardHistory.Add(new SolutionCardHistory
            {
                SolutionCardId = id,
                ChangeType = "Updated",
                PreviousData = System.Text.Json.JsonSerializer.Serialize(new
                {
                    existing.SolutionId, existing.Stream, existing.StreamType, existing.Subgroup,
                    existing.Gap, existing.Title, existing.ShortTitle, existing.Timeline,
                    existing.DeliveryDifficulty, existing.PoliticalSensitivity, existing.Category,
                    existing.SortOrder, existing.IsActive, existing.OverviewData, existing.FullDetailsData
                }),
                ChangedByUserId = _userManager.GetUserId(User),
                ChangedAt = DateTime.UtcNow
            });

            // Update fields
            existing.SolutionId = card.SolutionId;
            existing.Stream = card.Stream;
            existing.StreamType = card.StreamType;
            existing.Subgroup = card.Subgroup;
            existing.Gap = card.Gap;
            existing.Title = card.Title;
            existing.ShortTitle = card.ShortTitle;
            existing.Timeline = card.Timeline;
            existing.DeliveryDifficulty = card.DeliveryDifficulty;
            existing.PoliticalSensitivity = card.PoliticalSensitivity;
            existing.Category = card.Category;
            existing.SortOrder = card.SortOrder;
            existing.IsActive = card.IsActive;
            existing.OverviewData = overviewJson;
            existing.FullDetailsData = fullDetailsJson;
            existing.UpdatedAt = DateTime.UtcNow;
            existing.UpdatedByUserId = _userManager.GetUserId(User);

            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = $"Card '{existing.SolutionId}' updated successfully.";
            return RedirectToAction("SolutionLibrary");
        }

        /// <summary>
        /// Delete Solution Card (soft-delete) — POST
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteSolutionCard(int id)
        {
            var card = await _context.SolutionCards.IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.Id == id);
            if (card == null) return NotFound();

            card.IsDeleted = true;
            card.DeletedAt = DateTime.UtcNow;

            _context.SolutionCardHistory.Add(new SolutionCardHistory
            {
                SolutionCardId = id,
                ChangeType = "Deleted",
                ChangedByUserId = _userManager.GetUserId(User),
                ChangedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Json(new { success = true, message = $"Card '{card.SolutionId}' deleted." });
        }

        /// <summary>
        /// Restore a soft-deleted card — POST
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RestoreSolutionCard(int id)
        {
            var card = await _context.SolutionCards.IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.Id == id);
            if (card == null) return NotFound();

            card.IsDeleted = false;
            card.DeletedAt = null;

            _context.SolutionCardHistory.Add(new SolutionCardHistory
            {
                SolutionCardId = id,
                ChangeType = "Restored",
                ChangedByUserId = _userManager.GetUserId(User),
                ChangedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Json(new { success = true, message = $"Card '{card.SolutionId}' restored." });
        }

        /// <summary>
        /// Toggle card active/inactive — POST
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleSolutionCardActive(int id)
        {
            var card = await _context.SolutionCards.IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.Id == id);
            if (card == null) return NotFound();

            card.IsActive = !card.IsActive;
            card.UpdatedAt = DateTime.UtcNow;
            card.UpdatedByUserId = _userManager.GetUserId(User);

            await _context.SaveChangesAsync();

            return Json(new { success = true, isActive = card.IsActive, message = $"Card '{card.SolutionId}' is now {(card.IsActive ? "active" : "inactive")}." });
        }

        /// <summary>
        /// View card version history — GET
        /// </summary>
        public async Task<IActionResult> SolutionCardHistory(int id)
        {
            var card = await _context.SolutionCards.IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.Id == id);
            if (card == null) return NotFound();

            var history = await _context.SolutionCardHistory
                .Where(h => h.SolutionCardId == id)
                .OrderByDescending(h => h.ChangedAt)
                .Include(h => h.ChangedBy)
                .ToListAsync();

            ViewBag.Card = card;
            return View(history);
        }

        /// <summary>
        /// Export all solution cards as JSON — GET
        /// </summary>
        public async Task<IActionResult> ExportSolutionCards()
        {
            var cards = await _context.SolutionCards
                .Where(c => !c.IsDeleted)
                .OrderBy(c => c.Stream).ThenBy(c => c.Gap).ThenBy(c => c.SortOrder)
                .ToListAsync();

            var export = cards.Select(c => new
            {
                c.SolutionId, c.Stream, c.StreamType, c.Subgroup, c.Gap,
                c.Title, c.ShortTitle, c.Timeline, c.DeliveryDifficulty,
                c.PoliticalSensitivity, c.Category, c.SortOrder, c.IsActive,
                overview = string.IsNullOrEmpty(c.OverviewData) ? null : System.Text.Json.JsonSerializer.Deserialize<object>(c.OverviewData),
                fullDetails = string.IsNullOrEmpty(c.FullDetailsData) ? null : System.Text.Json.JsonSerializer.Deserialize<object>(c.FullDetailsData)
            });

            var json = System.Text.Json.JsonSerializer.Serialize(export, new System.Text.Json.JsonSerializerOptions { WriteIndented = true });
            var bytes = System.Text.Encoding.UTF8.GetBytes(json);
            return File(bytes, "application/json", $"rosra-solution-cards-{DateTime.UtcNow:yyyyMMdd}.json");
        }

        /// <summary>
        /// Import solution cards from JSON — POST
        /// </summary>
        // Audit M-3: cap upload size. Without this an Admin (or anyone who compromises an Admin
        // account) can OOM the worker by posting a multi-hundred-MB JSON file, since the body
        // is fully read into memory before deserialization.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [RequestSizeLimit(5_000_000)]
        public async Task<IActionResult> ImportSolutionCards(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Json(new { success = false, message = "No file provided." });
            if (file.Length > 5_000_000)
                return Json(new { success = false, message = "File exceeds 5 MB limit." });

            try
            {
                using var stream = new System.IO.StreamReader(file.OpenReadStream());
                var json = await stream.ReadToEndAsync();
                var cards = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(json);

                if (cards == null || cards.Count == 0)
                    return Json(new { success = false, message = "No cards found in file." });

                int imported = 0, skipped = 0;
                var userId = _userManager.GetUserId(User);

                // Audit L-8: only accept solutionId values that match the documented
                // format (uppercase letters, digits, hyphen; 1–32 chars — e.g. "PT-COM-01",
                // "A1", "GEN-04"). Without this an Admin could import a card whose ID
                // contains JS / HTML and trigger stored XSS on other Admins viewing the
                // editor or in any place the ID is interpolated into DOM/onclick handlers.
                var solutionIdPattern = new System.Text.RegularExpressions.Regex(
                    "^[A-Z0-9][A-Z0-9-]{0,31}$",
                    System.Text.RegularExpressions.RegexOptions.CultureInvariant);

                foreach (var cardJson in cards)
                {
                    var solutionId = cardJson.TryGetProperty("solutionId", out var sid) ? sid.GetString() : null;
                    if (string.IsNullOrEmpty(solutionId)) { skipped++; continue; }
                    if (!solutionIdPattern.IsMatch(solutionId)) { skipped++; continue; }

                    // Skip if already exists
                    if (await _context.SolutionCards.IgnoreQueryFilters().AnyAsync(c => c.SolutionId == solutionId))
                    { skipped++; continue; }

                    var card = new SolutionCard
                    {
                        SolutionId = solutionId,
                        Stream = cardJson.TryGetProperty("stream", out var s) ? s.GetString() ?? "" : "",
                        StreamType = cardJson.TryGetProperty("streamType", out var st) ? st.GetString() ?? "" : "",
                        Subgroup = cardJson.TryGetProperty("subgroup", out var sg) && sg.ValueKind == System.Text.Json.JsonValueKind.String ? sg.GetString() : null,
                        Gap = cardJson.TryGetProperty("gap", out var g) ? g.GetString() ?? "" : "",
                        Title = cardJson.TryGetProperty("title", out var t) ? t.GetString() ?? "" : "",
                        ShortTitle = cardJson.TryGetProperty("shortTitle", out var sht) ? sht.GetString() : null,
                        Timeline = cardJson.TryGetProperty("timeline", out var tl) ? tl.GetString() : null,
                        DeliveryDifficulty = cardJson.TryGetProperty("deliveryDifficulty", out var dd) ? dd.GetString() : null,
                        PoliticalSensitivity = cardJson.TryGetProperty("politicalSensitivity", out var ps) ? ps.GetString() : null,
                        Category = cardJson.TryGetProperty("category", out var cat) ? cat.GetString() : null,
                        SortOrder = cardJson.TryGetProperty("sortOrder", out var so) && so.ValueKind == System.Text.Json.JsonValueKind.Number ? so.GetInt32() : 0,
                        IsActive = true,
                        OverviewData = cardJson.TryGetProperty("overview", out var ov) ? ov.GetRawText() : null,
                        FullDetailsData = cardJson.TryGetProperty("fullDetails", out var fd) ? fd.GetRawText() : null,
                        CreatedAt = DateTime.UtcNow,
                        CreatedByUserId = userId
                    };

                    _context.SolutionCards.Add(card);
                    imported++;
                }

                await _context.SaveChangesAsync();

                return Json(new { success = true, message = $"Imported {imported} cards, skipped {skipped} (already exist or invalid)." });
            }
            catch (Exception ex)
            {
                var refId = NewErrorRef(ex, "ImportSolutionCards");
                return Json(new { success = false, message = $"Import failed. Reference: {refId}" });
            }
        }

        // =====================================================================
        // SYSTEM SETTINGS
        // =====================================================================

        public async Task<IActionResult> SystemSettings()
        {
            var settings = await _context.SystemSettings.OrderBy(s => s.Key).ToListAsync();

            // Seed defaults if empty
            if (!settings.Any())
            {
                var defaults = new List<SystemSetting>
                {
                    new() { Key = "ComplianceRatioThreshold", Value = "75", Description = "Compliance ratio (%) above which 'Revenue Potential' mode is used in Prioritization" },
                    new() { Key = "CoverageRatioThreshold", Value = "60", Description = "Coverage ratio (%) above which 'Compliance First' mode is used in Prioritization" },
                    new() { Key = "MaxStreamsPerReport", Value = "20", Description = "Maximum number of custom streams allowed per report" },
                    new() { Key = "DefaultTimeline", Value = "1-3 years", Description = "Default timeline for new solution cards" }
                };
                _context.SystemSettings.AddRange(defaults);
                await _context.SaveChangesAsync();
                settings = defaults;
            }

            return View(settings);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateSystemSetting([FromBody] SystemSettingUpdate update)
        {
            if (string.IsNullOrEmpty(update?.Key))
                return Json(new { success = false, message = "Key is required." });

            var existing = await _context.SystemSettings.FindAsync(update.Key);
            if (existing != null)
            {
                existing.Value = update.Value ?? "";
                if (!string.IsNullOrEmpty(update.Description))
                    existing.Description = update.Description;
                existing.UpdatedAt = DateTime.UtcNow;
                existing.UpdatedByUserId = _userManager.GetUserId(User);
            }
            else
            {
                _context.SystemSettings.Add(new SystemSetting
                {
                    Key = update.Key,
                    Value = update.Value ?? "",
                    Description = update.Description,
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedByUserId = _userManager.GetUserId(User)
                });
            }

            await _context.SaveChangesAsync();
            return Json(new { success = true });
        }

        // =====================================================================
        // ANALYTICS DASHBOARD
        // =====================================================================

        public async Task<IActionResult> Analytics()
        {
            // Report stats
            var allReports = await _context.RosraReports.IgnoreQueryFilters().Where(r => !r.IsDeleted).ToListAsync();
            ViewBag.TotalReports = allReports.Count;
            ViewBag.ReportsByStatus = allReports.GroupBy(r => r.Status)
                .Select(g => new { Status = g.Key.ToString(), Count = g.Count() }).ToList();
            ViewBag.ReportsByCountry = allReports.Where(r => !string.IsNullOrEmpty(r.Country))
                .GroupBy(r => r.Country).Select(g => new { Country = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count).Take(15).ToList();

            // Solution card stats
            var cards = await _context.SolutionCards.Where(c => !c.IsDeleted).ToListAsync();
            ViewBag.TotalCards = cards.Count;
            ViewBag.CardsByStream = cards.GroupBy(c => c.Stream).Select(g => new { Stream = g.Key, Count = g.Count() }).ToList();
            ViewBag.CardsByGap = cards.GroupBy(c => c.Gap).Select(g => new { Gap = g.Key, Count = g.Count() }).ToList();
            ViewBag.CardsByTimeline = cards.GroupBy(c => c.Timeline).Select(g => new { Timeline = g.Key, Count = g.Count() }).ToList();

            // Solution adoption (which cards are most selected across reports)
            var solutionSelections = new Dictionary<string, int>();
            foreach (var report in allReports.Where(r => !string.IsNullOrEmpty(r.SelectedSolutionsData)))
            {
                try
                {
                    var data = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(report.SelectedSolutionsData!);
                    if (data.TryGetProperty("selectedSolutions", out var solutions) && solutions.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        foreach (var sol in solutions.EnumerateArray())
                        {
                            var id = sol.TryGetProperty("solutionId", out var sid) ? sid.GetString() ?? "" : "";
                            if (!string.IsNullOrEmpty(id))
                            {
                                solutionSelections[id] = solutionSelections.GetValueOrDefault(id) + 1;
                            }
                        }
                    }
                }
                catch { }
            }
            ViewBag.TopSelectedCards = solutionSelections.OrderByDescending(kv => kv.Value).Take(10)
                .Select(kv => new { SolutionId = kv.Key, Count = kv.Value }).ToList();

            // User stats
            ViewBag.TotalUsers = await _userManager.Users.CountAsync();
            ViewBag.ActiveUsers = await _userManager.Users
                .Where(u => !u.LockoutEnabled || u.LockoutEnd == null || u.LockoutEnd < DateTimeOffset.Now)
                .CountAsync();

            return View();
        }
    }

    // DTO for system setting updates
    public class SystemSettingUpdate
    {
        public string? Key { get; set; }
        public string? Value { get; set; }
        public string? Description { get; set; }
    }
}
