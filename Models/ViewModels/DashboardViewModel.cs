using System;
using System.Collections.Generic;
using RosraApp.Models;
using System.Text.Json;

namespace RosraApp.Models.ViewModels
{
    public class DashboardViewModel
    {
        public List<RosraReportViewModel> Reports { get; set; } = new List<RosraReportViewModel>();
    }
    
    public class RosraReportViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? ProjectName { get; set; }
        public decimal? EstimatedBudget { get; set; }
        public string? ProblemStatement { get; set; }
        public List<string> RootCauses { get; set; } = new List<string>();
        public string? RecommendationSummary { get; set; }
        public List<ActionItemViewModel> ActionItems { get; set; } = new List<ActionItemViewModel>();
        public string? UserName { get; set; }
        public string? Currency { get; set; }
        public string? CurrencySymbol { get; set; }
        public string? Region { get; set; }
        public string? Country { get; set; }
        public string? FinancialYear { get; set; }

        // Peer SNG Data for Within-Country OSR Frontier analysis
        public string? PeerSNGData { get; set; }

        // Helper method to convert from RosraReport to RosraReportViewModel
        public static RosraReportViewModel FromRosraReport(RosraReport report)
        {
            return new RosraReportViewModel
            {
                Id = report.Id,
                Title = report.Title,
                CreatedAt = report.CreatedAt,
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
                Currency = report.Currency,
                CurrencySymbol = report.CurrencySymbol,
                Region = report.Region,
                Country = report.Country,
                FinancialYear = report.FinancialYear,
                PeerSNGData = report.PeerSNGData
            };
        }
    }
}
