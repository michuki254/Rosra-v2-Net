using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public AdminController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context,
            IEmailService emailService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _emailService = emailService;
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

        // Upload PeerSNG Data
        [HttpPost]
        public async Task<IActionResult> UploadPeerSNGData(IFormFile file)
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
                    if (values.Length < 4) continue;

                    var peer = new PeerSNG
                    {
                        SNG = values[0].Trim(),
                        OSR = decimal.Parse(values[1].Trim()),
                        GCP = decimal.Parse(values[2].Trim()),
                        Include = values[3].Trim() == "1" || values[3].Trim().ToLower() == "true"
                    };

                    _context.Peers_SNG.Add(peer);
                    importedCount++;
                }

                await _context.SaveChangesAsync();
                return Json(new { success = true, message = $"Successfully imported {importedCount} PeerSNG records" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error importing data: {ex.Message}" });
            }
        }

        // Upload CountryData (16 columns including CurrencyCode and CurrencySymbol)
        [HttpPost]
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
                return Json(new { success = true, message = $"Successfully imported {importedCount} Country records" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error importing data: {ex.Message}" });
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
                            item.Streams.Add(new StreamDetailItem
                            {
                                StreamType = "Property Tax", StreamName = "Property Tax",
                                Revenue = pt.RevenueToDate ?? 0, Billed = pt.BilledAmount ?? 0,
                                Outstanding = pt.OutstandingAmount ?? 0,
                                RegisteredUnits = pt.RegisteredProperties ?? 0,
                                CompliantUnits = pt.CompliantProperties ?? 0,
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
                            item.Streams.Add(new StreamDetailItem
                            {
                                StreamType = "Business License", StreamName = "Business License",
                                Revenue = bl.RevenueToDate ?? 0, Billed = bl.BilledAmount ?? 0,
                                Outstanding = bl.OutstandingAmount ?? 0,
                                RegisteredUnits = bl.RegisteredBusinesses ?? 0,
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
                                item.Streams.Add(new StreamDetailItem
                                {
                                    StreamType = "Generic", StreamName = s.StreamName ?? "Unnamed",
                                    Revenue = s.RevenueToDate ?? 0, Billed = s.BilledAmount ?? 0,
                                    Outstanding = s.OutstandingAmount ?? 0,
                                    RegisteredUnits = s.RegisteredUnits ?? 0,
                                    ComplianceGap = s.ComplianceGap ?? 0,
                                    CoverageGap = s.CoverageGap ?? 0,
                                    LiabilityGap = s.LiabilityGap ?? 0,
                                    TotalPotentialRevenue = s.TotalPotentialRevenue ?? 0,
                                });
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

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> ExportDataExcel(
            string? search = null, string? country = null, string? status = null,
            string? completionLevel = null, string? author = null,
            string? financialYear = null, string? dateFrom = null, string? dateTo = null)
        {
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
            var ws = workbook.Worksheets.Add("ROSRA Data");

            var jsonOpts = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            // Headers
            var headers = new[] {
                "ID", "Title", "Country", "Region", "City", "Financial Year",
                "Currency", "Actual OSR", "Budgeted OSR", "Population", "GDP per Capita", "Other Revenue",
                "Status", "Completion", "Version", "Author", "Email",
                "Created", "Submitted", "Validated",
                // Property Tax
                "PT Revenue", "PT Billed", "PT Outstanding", "PT Registered", "PT Compliant",
                // Business License
                "BL Revenue", "BL Billed", "BL Outstanding", "BL Registered",
                // Generic Streams
                "Generic Count", "Generic Names", "Generic Total Revenue",
                // Stream flags
                "Has Property Tax", "Has License", "Has Short-Term", "Has Long-Term", "Has Mixed", "Has Generic", "Has Peer SNG"
            };

            // Header colors by group
            var headerColors = new Dictionary<string, string> {
                {"PT", "#F59E0B"}, {"BL", "#8B5CF6"}, {"Generic", "#06B6D4"}, {"Has", "#6A6A6A"}
            };

            for (int i = 0; i < headers.Length; i++)
            {
                var cell = ws.Cell(1, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                // Color-code header groups
                var h = headers[i];
                if (h.StartsWith("PT")) { cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#FEF3C7"); cell.Style.Font.FontColor = XLColor.FromHtml("#92400E"); }
                else if (h.StartsWith("BL")) { cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#EDE9FE"); cell.Style.Font.FontColor = XLColor.FromHtml("#5B21B6"); }
                else if (h.StartsWith("Generic")) { cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#CFFAFE"); cell.Style.Font.FontColor = XLColor.FromHtml("#155E75"); }
                else if (h.StartsWith("Has")) { cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#F3F4F6"); cell.Style.Font.FontColor = XLColor.FromHtml("#374151"); }
                else { cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#00689D"); cell.Style.Font.FontColor = XLColor.White; }
            }

            // Data rows
            int row = 2;
            foreach (var r in reports)
            {
                var statusName = ((ReportStatus)r.Status).ToString();
                var compName = ((Models.Enums.CompletionLevel)r.CompletionLevel).ToString();
                var authorName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Unknown";
                var authorEmail = r.User?.Email ?? "";

                int col = 1;
                ws.Cell(row, col++).Value = r.Id;
                ws.Cell(row, col++).Value = r.Title ?? "";
                ws.Cell(row, col++).Value = r.Country ?? "";
                ws.Cell(row, col++).Value = r.Region ?? "";
                ws.Cell(row, col++).Value = r.City ?? "";
                ws.Cell(row, col++).Value = r.FinancialYear ?? "";
                ws.Cell(row, col++).Value = r.Currency ?? "";
                ws.Cell(row, col).Value = r.ActualOsr ?? 0; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col).Value = r.BudgetedOsr ?? 0; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col).Value = r.Population ?? 0; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col).Value = r.GdpPerCapita ?? 0; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col).Value = r.OtherRevenue ?? 0; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col++).Value = statusName;
                ws.Cell(row, col++).Value = compName;
                ws.Cell(row, col++).Value = r.SubmissionVersion;
                ws.Cell(row, col++).Value = authorName;
                ws.Cell(row, col++).Value = authorEmail;
                ws.Cell(row, col++).Value = r.CreatedAt.ToString("yyyy-MM-dd HH:mm");
                ws.Cell(row, col++).Value = r.SubmittedAt?.ToString("yyyy-MM-dd HH:mm") ?? "";
                ws.Cell(row, col++).Value = r.ValidatedAt?.ToString("yyyy-MM-dd HH:mm") ?? "";

                // Parse Property Tax
                decimal ptRev = 0, ptBill = 0, ptOut = 0; int ptReg = 0, ptComp = 0;
                if (!string.IsNullOrEmpty(r.PropertyTaxData))
                {
                    try { var pt = System.Text.Json.JsonSerializer.Deserialize<GapAnalysisPropertyTaxViewModel>(r.PropertyTaxData, jsonOpts);
                        if (pt != null) { ptRev = pt.RevenueToDate ?? 0; ptBill = pt.BilledAmount ?? 0; ptOut = pt.OutstandingAmount ?? 0; ptReg = pt.RegisteredProperties ?? 0; ptComp = pt.CompliantProperties ?? 0; }
                    } catch { }
                }
                ws.Cell(row, col).Value = ptRev; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col).Value = ptBill; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col).Value = ptOut; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col++).Value = ptReg;
                ws.Cell(row, col++).Value = ptComp;

                // Parse Business License
                decimal blRev = 0, blBill = 0, blOut = 0; int blReg = 0;
                if (!string.IsNullOrEmpty(r.LicenseData))
                {
                    try { var bl = System.Text.Json.JsonSerializer.Deserialize<GapAnalysisLicenseViewModel>(r.LicenseData, jsonOpts);
                        if (bl != null) { blRev = bl.RevenueToDate ?? 0; blBill = bl.BilledAmount ?? 0; blOut = bl.OutstandingAmount ?? 0; blReg = bl.RegisteredBusinesses ?? 0; }
                    } catch { }
                }
                ws.Cell(row, col).Value = blRev; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col).Value = blBill; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col).Value = blOut; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";
                ws.Cell(row, col++).Value = blReg;

                // Parse Generic Streams
                int genCount = 0; string genNames = ""; decimal genRev = 0;
                if (!string.IsNullOrEmpty(r.GenericStreamsData))
                {
                    try { var streams = System.Text.Json.JsonSerializer.Deserialize<List<GenericStreamViewModel>>(r.GenericStreamsData, jsonOpts);
                        if (streams != null) { genCount = streams.Count; genNames = string.Join(", ", streams.Select(s => s.StreamName)); genRev = streams.Sum(s => s.RevenueToDate ?? 0); }
                    } catch { }
                }
                ws.Cell(row, col++).Value = genCount;
                ws.Cell(row, col++).Value = genNames;
                ws.Cell(row, col).Value = genRev; ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0";

                // Stream flags
                ws.Cell(row, col++).Value = !string.IsNullOrEmpty(r.PropertyTaxData) ? "Yes" : "No";
                ws.Cell(row, col++).Value = !string.IsNullOrEmpty(r.LicenseData) ? "Yes" : "No";
                ws.Cell(row, col++).Value = !string.IsNullOrEmpty(r.ShortTermUserChargeData) ? "Yes" : "No";
                ws.Cell(row, col++).Value = !string.IsNullOrEmpty(r.LongTermUserChargeData) ? "Yes" : "No";
                ws.Cell(row, col++).Value = !string.IsNullOrEmpty(r.MixedUserChargeData) ? "Yes" : "No";
                ws.Cell(row, col++).Value = !string.IsNullOrEmpty(r.GenericStreamsData) ? "Yes" : "No";
                ws.Cell(row, col++).Value = !string.IsNullOrEmpty(r.PeerSNGData) ? "Yes" : "No";

                row++;
            }

            // Auto-fit columns
            ws.Columns().AdjustToContents();

            // Add autofilter
            if (reports.Count > 0)
                ws.Range(1, 1, row - 1, headers.Length).SetAutoFilter();

            // ── Sheet 2: Stream Details (one row per stream per report) ──
            var sd = workbook.Worksheets.Add("Stream Details");
            var sdHeaders = new[] { "Report ID", "Title", "Country", "City", "Financial Year",
                "Stream Type", "Stream Name", "Revenue", "Billed", "Outstanding",
                "Registered Units", "Compliant Units",
                "Compliance Gap", "Coverage Gap", "Liability Gap", "Total Potential Revenue" };

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
                // Parse all streams for this report
                var streamItems = new List<(string Type, string Name, decimal Rev, decimal Bill, decimal Out, int Reg, int Comp, decimal CG, decimal CovG, decimal LG, decimal TPR)>();

                if (!string.IsNullOrEmpty(r.PropertyTaxData))
                {
                    try { var pt = System.Text.Json.JsonSerializer.Deserialize<GapAnalysisPropertyTaxViewModel>(r.PropertyTaxData, jsonOpts);
                        if (pt != null) streamItems.Add(("Property Tax", "Property Tax", pt.RevenueToDate??0, pt.BilledAmount??0, pt.OutstandingAmount??0, pt.RegisteredProperties??0, pt.CompliantProperties??0, 0, 0, 0, 0));
                    } catch { }
                }
                if (!string.IsNullOrEmpty(r.LicenseData))
                {
                    try { var bl = System.Text.Json.JsonSerializer.Deserialize<GapAnalysisLicenseViewModel>(r.LicenseData, jsonOpts);
                        if (bl != null) streamItems.Add(("Business License", "Business License", bl.RevenueToDate??0, bl.BilledAmount??0, bl.OutstandingAmount??0, bl.RegisteredBusinesses??0, 0, 0, 0, 0, 0));
                    } catch { }
                }
                if (!string.IsNullOrEmpty(r.GenericStreamsData))
                {
                    try { var streams = System.Text.Json.JsonSerializer.Deserialize<List<GenericStreamViewModel>>(r.GenericStreamsData, jsonOpts);
                        if (streams != null) foreach (var s in streams)
                            streamItems.Add(("Generic", s.StreamName??"Unnamed", s.RevenueToDate??0, s.BilledAmount??0, s.OutstandingAmount??0, s.RegisteredUnits??0, (int)(s.CompliantUnits??0), s.ComplianceGap??0, s.CoverageGap??0, s.LiabilityGap??0, s.TotalPotentialRevenue??0));
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
                    sd.Cell(sdRow, c++).Value = si.Type;
                    sd.Cell(sdRow, c++).Value = si.Name;
                    sd.Cell(sdRow, c).Value = si.Rev; sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                    sd.Cell(sdRow, c).Value = si.Bill; sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                    sd.Cell(sdRow, c).Value = si.Out; sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                    sd.Cell(sdRow, c++).Value = si.Reg;
                    sd.Cell(sdRow, c++).Value = si.Comp;
                    sd.Cell(sdRow, c).Value = si.CG; sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                    sd.Cell(sdRow, c).Value = si.CovG; sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                    sd.Cell(sdRow, c).Value = si.LG; sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                    sd.Cell(sdRow, c).Value = si.TPR; sd.Cell(sdRow, c++).Style.NumberFormat.Format = "#,##0";
                    sdRow++;
                }
            }

            sd.Columns().AdjustToContents();
            if (sdRow > 2)
                sd.Range(1, 1, sdRow - 1, sdHeaders.Length).SetAutoFilter();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var filename = $"ROSRA_Data_Export_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
            return File(stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename);
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
                settings.SmtpPassword = smtpPassword;
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
    }
}
