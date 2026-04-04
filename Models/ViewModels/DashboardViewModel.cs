using System;
using System.Collections.Generic;
using RosraApp.Models;
using System.Text.Json;

namespace RosraApp.Models.ViewModels
{
    public class DashboardViewModel
    {
        public List<RosraReportViewModel> Reports { get; set; } = new List<RosraReportViewModel>();

        // Pagination
        public int PageNumber { get; set; } = 1;
        public int TotalPages { get; set; } = 1;
        public int TotalCount { get; set; }

        // Search
        public string? SearchTerm { get; set; }

        // Tab (active / archived)
        public string CurrentTab { get; set; } = "active";
    }
    
    public class RosraReportViewModel
    {
        public int Id { get; set; }
        public Guid PublicId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsArchived { get; set; }
        public int Status { get; set; }
        public int CompletionLevel { get; set; }
        public string? RevisionReason { get; set; }
        public string? ProjectName { get; set; }
        public decimal? EstimatedBudget { get; set; }
        public string? ProblemStatement { get; set; }
        public List<string> RootCauses { get; set; } = new List<string>();
        public string? RecommendationSummary { get; set; }
        public List<ActionItemViewModel> ActionItems { get; set; } = new List<ActionItemViewModel>();
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? UserFullName { get; set; }
        public string? Currency { get; set; }
        public string? CurrencySymbol { get; set; }
        public string? Region { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? GovUnitLevel3 { get; set; }
        public int? FinalUnitLevel { get; set; }
        public string? FinancialYear { get; set; }

        // Peer SNG Data for Within-Country OSR Frontier analysis
        public string? PeerSNGData { get; set; }

        // Helper method to convert from RosraReport to RosraReportViewModel
        public static RosraReportViewModel FromRosraReport(RosraReport report)
        {
            return new RosraReportViewModel
            {
                Id = report.Id,
                PublicId = report.PublicId,
                Title = report.Title,
                CreatedAt = report.CreatedAt,
                UpdatedAt = report.UpdatedAt,
                IsArchived = report.IsArchived,
                Status = report.Status,
                CompletionLevel = report.CompletionLevel,
                RevisionReason = report.RevisionReason,
                ProjectName = report.ProjectName,
                EstimatedBudget = report.EstimatedBudget,
                ProblemStatement = report.ProblemStatement,
                RootCauses = string.IsNullOrEmpty(report.RootCauses) 
                    ? new List<string>() 
                    : JsonSerializer.Deserialize<List<string>>(report.RootCauses) ?? new List<string>(),
                RecommendationSummary = report.RecommendationSummary,
                ActionItems = string.IsNullOrEmpty(report.ActionItems) 
                    ? new List<ActionItemViewModel>() 
                    : JsonSerializer.Deserialize<List<ActionItemViewModel>>(report.ActionItems) ?? new List<ActionItemViewModel>(),
                UserName = report.User?.UserName,
                UserEmail = report.User?.Email,
                UserFullName = report.User != null ? $"{report.User.FirstName} {report.User.LastName}" : null,
                Currency = report.Currency,
                CurrencySymbol = report.CurrencySymbol,
                Region = report.Region,
                Country = report.Country,
                City = report.City,
                GovUnitLevel3 = report.GovUnitLevel3,
                FinalUnitLevel = report.FinalUnitLevel,
                FinancialYear = report.FinancialYear,
                PeerSNGData = report.PeerSNGData
            };
        }
    }
}
