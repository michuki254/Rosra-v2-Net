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

    public class DataManagementViewModel
    {
        public List<DataManagementReportItem> Reports { get; set; } = new();

        // Pagination
        public int PageNumber { get; set; } = 1;
        public int TotalPages { get; set; } = 1;
        public int TotalCount { get; set; }
        public int PageSize { get; set; } = 25;

        // Filters
        public string? Search { get; set; }
        public string? Country { get; set; }
        public string? Status { get; set; }
        public string? CompletionLevel { get; set; }
        public string? Author { get; set; }
        public string? FinancialYear { get; set; }
        public string? DateFrom { get; set; }
        public string? DateTo { get; set; }

        // Filter options (populated from data)
        public List<string> Countries { get; set; } = new();
        public List<string> Authors { get; set; } = new();
        public List<string> FinancialYears { get; set; } = new();

        // Summary stats
        public int TotalReports { get; set; }
        public int DraftCount { get; set; }
        public int SubmittedCount { get; set; }
        public int UnderReviewCount { get; set; }
        public int NeedsRevisionCount { get; set; }
        public int ValidatedCount { get; set; }
    }

    public class DataManagementReportItem
    {
        public int Id { get; set; }
        public Guid PublicId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Country { get; set; }
        public string? Region { get; set; }
        public string? City { get; set; }
        public string? FinancialYear { get; set; }
        public string? Currency { get; set; }
        public string? CurrencySymbol { get; set; }
        public decimal ActualOsr { get; set; }
        public decimal BudgetedOsr { get; set; }
        public decimal Population { get; set; }
        public decimal GdpPerCapita { get; set; }
        public decimal OtherRevenue { get; set; }
        public int Status { get; set; }
        public int CompletionLevel { get; set; }
        public int SubmissionVersion { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string AuthorEmail { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public DateTime? ValidatedAt { get; set; }
        public bool IsArchived { get; set; }

        // Stream presence flags
        public bool HasPropertyTax { get; set; }
        public bool HasLicense { get; set; }
        public bool HasShortTerm { get; set; }
        public bool HasLongTerm { get; set; }
        public bool HasMixed { get; set; }
        public bool HasGeneric { get; set; }
        public bool HasPeerSNG { get; set; }

        // Gap Analysis: Property Tax
        public decimal PtRevenue { get; set; }
        public decimal PtBilled { get; set; }
        public decimal PtOutstanding { get; set; }
        public int PtRegistered { get; set; }
        public int PtCompliant { get; set; }

        // Gap Analysis: Business License
        public decimal BlRevenue { get; set; }
        public decimal BlBilled { get; set; }
        public decimal BlOutstanding { get; set; }
        public int BlRegistered { get; set; }

        // Gap Analysis: Generic Streams (aggregated)
        public int GenericStreamCount { get; set; }
        public string GenericStreamNames { get; set; } = "";
        public decimal GenericTotalRevenue { get; set; }
        public decimal GenericTotalBilled { get; set; }

        // Per-stream details (parsed from JSON)
        public List<StreamDetailItem> Streams { get; set; } = new();
    }

    public class StreamDetailItem
    {
        public string StreamType { get; set; } = ""; // "Property Tax", "Business License", "Short-Term", "Long-Term", "Mixed", or custom name
        public string StreamName { get; set; } = "";
        public decimal Revenue { get; set; }
        public decimal Billed { get; set; }
        public decimal Outstanding { get; set; }
        public int RegisteredUnits { get; set; }
        public int CompliantUnits { get; set; }
        public decimal ComplianceGap { get; set; }
        public decimal CoverageGap { get; set; }
        public decimal LiabilityGap { get; set; }
        public decimal TotalPotentialRevenue { get; set; }
    }
}
