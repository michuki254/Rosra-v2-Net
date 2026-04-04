using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;
using RosraApp.Models.ViewModels;
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

        public AdminController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
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
                    Country = r.Country
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

            _context.RosraReports.Remove(report);
            await _context.SaveChangesAsync();

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

            ViewData["PageNumber"] = page;
            ViewData["TotalPages"] = totalPages;
            ViewData["TotalCount"] = totalCount;
            ViewData["ActionFilter"] = action;
            ViewData["EntityTypeFilter"] = entityType;

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
                return Json(new { success = true, message = $"Role '{role.Name}' deleted successfully." });
            }

            return Json(new { success = false, message = "Failed to delete role." });
        }

        // User Management Page
        public async Task<IActionResult> Users()
        {
            var users = await _userManager.Users.ToListAsync();
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
    }
}
