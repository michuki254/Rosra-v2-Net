using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace RosraApp.Models.ViewModels
{
    public class AdminDashboardViewModel
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        public int TotalReports { get; set; }
        public List<ReportListItemViewModel> AllReports { get; set; } = new();

        // Pagination
        public int PageNumber { get; set; } = 1;
        public int TotalPages { get; set; } = 1;
        public int TotalCount { get; set; }

        // Search
        public string? SearchTerm { get; set; }
    }

    public class ReportListItemViewModel
    {
        public int Id { get; set; }
        public Guid PublicId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public int Status { get; set; }
    }

    public class UserManagementViewModel
    {
        public ApplicationUser User { get; set; } = null!;
        public int ReportCount { get; set; }
        public List<string> Roles { get; set; } = new();
        public bool IsActive { get; set; }
    }

    public class UserDetailsViewModel
    {
        public ApplicationUser? User { get; set; }
        public IList<string>? UserRoles { get; set; }
        public List<IdentityRole>? AllRoles { get; set; }
    }

    public class CreateRoleViewModel
    {
        public string? RoleName { get; set; }
        public string? Description { get; set; }
        public List<RoleInfoViewModel> ExistingRoles { get; set; } = new();
        public List<PermissionCategoryViewModel> PermissionCategories { get; set; } = new();
        public List<int> SelectedPermissionIds { get; set; } = new();
    }

    public class RoleInfoViewModel
    {
        public string RoleId { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public int UserCount { get; set; }
    }

    public class PermissionCategoryViewModel
    {
        public string Category { get; set; } = string.Empty;
        public List<PermissionViewModel> Permissions { get; set; } = new();
    }

    public class PermissionViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsSelected { get; set; }
    }

    public class EditRolePermissionsViewModel
    {
        public string RoleId { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public List<PermissionCategoryViewModel> PermissionCategories { get; set; } = new();
    }
}
