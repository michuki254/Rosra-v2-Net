using Microsoft.AspNetCore.Mvc;
using RosraApp.Models.ViewModels;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using RosraApp.Models;
using RosraApp.Data;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace RosraApp.Controllers
{
    public class RosraController : Controller
    {
        private const string VisitedTabsKey = "VisitedTabs";
        private const string RosraFormDataKey = "RosraFormData";
        
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RosraController> _logger;
        
        // JSON serialization options to ensure consistent property naming
        private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = null,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        public RosraController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<RosraController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public IActionResult Index(string activeTab = null, bool viewMode = false)
        {
            // Get or initialize visited tabs from session
            var visitedTabs = GetVisitedTabsFromSession();
            
            // Get form data from session or initialize new
            var formData = GetFormDataFromSession() ?? new RosraFormViewModel { Id = 0 };
            
            // Ensure Id is 0 for new reports
            if (formData.Id < 0)
            {
                formData.Id = 0;
            }
            
            // Set ViewMode flag in ViewData if specified
            if (viewMode)
            {
                ViewData["ViewMode"] = true;
            }
            
            // Create a view model for the tabs
            var tabsViewModel = new TabsContainerViewModel
            {
                ContainerId = "rosraTabs",
                Tabs = new List<TabViewModel>(),
                TabContentModel = formData
            };

            // Add tabs to the model
            var tabs = new List<TabViewModel>
            {
                new TabViewModel
                {
                    Id = "potential-estimates",
                    Title = "Potential Estimates",
                    IsActive = activeTab == "potential-estimates" || activeTab == null,
                    ContentPartialName = "_PotentialEstimates"
                },
                new TabViewModel
                {
                    Id = "gap-analysis",
                    Title = "Gap Analysis",
                    IsActive = activeTab == "gap-analysis",
                    ContentPartialName = "_GapAnalysis"
                },
                new TabViewModel
                {
                    Id = "causes-analysis",
                    Title = "Causes Analysis",
                    IsActive = activeTab == "causes-analysis",
                    ContentPartialName = "_CausesAnalysis"
                },
                new TabViewModel
                {
                    Id = "recommendations",
                    Title = "Recommendations",
                    IsActive = activeTab == "recommendations",
                    ContentPartialName = "_Recommendations"
                }
            };

            // Find active tab index
            int activeIndex = 0;
            for (int i = 0; i < tabs.Count; i++)
            {
                if (tabs[i].IsActive)
                {
                    activeIndex = i;
                    break;
                }
            }

            // Mark tabs as visited based on active tab
            for (int i = 0; i < tabs.Count; i++)
            {
                // Mark current and all previous tabs as visited
                tabs[i].IsVisited = i <= activeIndex || visitedTabs.Contains(tabs[i].Id);
                
                // Add current tab to visited tabs
                if (tabs[i].IsActive && !visitedTabs.Contains(tabs[i].Id))
                {
                    visitedTabs.Add(tabs[i].Id);
                }
            }

            // Save visited tabs to session
            SaveVisitedTabsToSession(visitedTabs);
            
            tabsViewModel.Tabs = tabs;
            return View(tabsViewModel);
        }
        
        [HttpGet]
        public IActionResult NewReport()
        {
            // Clear the session data
            HttpContext.Session.Remove(RosraFormDataKey);
            HttpContext.Session.Remove(VisitedTabsKey);
            
            // Redirect to the Index action to create a new report
            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult SwitchTab(string tabId, RosraFormViewModel formData)
        {
            // Parse formatted number values from the form
            if (!string.IsNullOrEmpty(Request.Form["Population"]))
            {
                string populationStr = Request.Form["Population"].ToString().Replace(",", "");
                if (int.TryParse(populationStr, NumberStyles.Any, CultureInfo.InvariantCulture, out int population))
                {
                    formData.Population = population;
                }
            }
            
            if (!string.IsNullOrEmpty(Request.Form["ActualOsr"]))
            {
                string actualOsrStr = Request.Form["ActualOsr"].ToString().Replace(",", "");
                if (decimal.TryParse(actualOsrStr, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal actualOsr))
                {
                    formData.ActualOsr = actualOsr;
                }
            }
            
            if (!string.IsNullOrEmpty(Request.Form["BudgetedOsr"]))
            {
                string budgetedOsrStr = Request.Form["BudgetedOsr"].ToString().Replace(",", "");
                if (decimal.TryParse(budgetedOsrStr, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal budgetedOsr))
                {
                    formData.BudgetedOsr = budgetedOsr;
                }
            }
            
            if (!string.IsNullOrEmpty(Request.Form["GdpPerCapita"]))
            {
                string gdpPerCapitaStr = Request.Form["GdpPerCapita"].ToString().Replace(",", "");
                if (decimal.TryParse(gdpPerCapitaStr, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal gdpPerCapita))
                {
                    formData.GdpPerCapita = gdpPerCapita;
                }
            }
            
            // Save form data to session
            SaveFormDataToSession(formData);
            
            // Check if we're in view mode (from hidden field in the form)
            bool isViewMode = Request.Form.ContainsKey("IsViewMode") && bool.TryParse(Request.Form["IsViewMode"], out bool viewMode) && viewMode;
            
            // If in view mode, pass the view mode flag to the Index action
            if (isViewMode)
            {
                ViewData["ViewMode"] = true;
                return RedirectToAction("Index", new { activeTab = tabId, viewMode = true });
            }
            
            return RedirectToAction("Index", new { activeTab = tabId });
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveReport(RosraFormViewModel formData, string DynamicCategoriesJson)
        {
            // Parse formatted number values
            decimal actualOsr = 0;
            decimal budgetedOsr = 0;
            int population = 0;
            decimal gdpPerCapita = 0;
            
            // Parse formatted numbers (removing commas)
            if (!string.IsNullOrEmpty(Request.Form["ActualOsr"]))
            {
                string actualOsrStr = Request.Form["ActualOsr"].ToString().Replace(",", "");
                decimal.TryParse(actualOsrStr, NumberStyles.Any, CultureInfo.InvariantCulture, out actualOsr);
                formData.ActualOsr = actualOsr;
            }
            
            if (!string.IsNullOrEmpty(Request.Form["BudgetedOsr"]))
            {
                string budgetedOsrStr = Request.Form["BudgetedOsr"].ToString().Replace(",", "");
                decimal.TryParse(budgetedOsrStr, NumberStyles.Any, CultureInfo.InvariantCulture, out budgetedOsr);
                formData.BudgetedOsr = budgetedOsr;
            }
            
            if (!string.IsNullOrEmpty(Request.Form["Population"]))
            {
                string populationStr = Request.Form["Population"].ToString().Replace(",", "");
                int.TryParse(populationStr, NumberStyles.Any, CultureInfo.InvariantCulture, out population);
                formData.Population = population;
            }
            
            if (!string.IsNullOrEmpty(Request.Form["GdpPerCapita"]))
            {
                string gdpPerCapitaStr = Request.Form["GdpPerCapita"].ToString().Replace(",", "");
                decimal.TryParse(gdpPerCapitaStr, NumberStyles.Any, CultureInfo.InvariantCulture, out gdpPerCapita);
                formData.GdpPerCapita = gdpPerCapita;
            }
            
            // Save form data to session
            SaveFormDataToSession(formData);
            
            // Create a new report
            var report = new RosraReport
            {
                Title = formData.Title,
                // Location Information
                Country = formData.Country,
                Region = formData.Region,
                City = formData.City,
                Currency = formData.Currency,
                CurrencySymbol = formData.CurrencySymbol,
                FinancialYear = formData.FinancialYear,
                // Financial Data
                ActualOsr = formData.ActualOsr,
                BudgetedOsr = formData.BudgetedOsr,
                Population = formData.Population,
                GdpPerCapita = formData.GdpPerCapita,
                // Project Details
                ProjectName = formData.ProjectName,
                // EstimatedBudget field removed from UI but kept in DB for backward compatibility
                ProjectDescription = formData.ProjectDescription,
                KeyObjectives = formData.KeyObjectives,
                StartDate = formData.StartDate,
                EndDate = formData.EndDate,

                // Gap Analysis Sub-Tabs
                // Ensure PropertyTax values are properly saved
                PropertyTaxData = SerializePropertyTaxData(formData.PropertyTax, DynamicCategoriesJson),
                LicenseData = JsonSerializer.Serialize(formData.License, _jsonOptions),
                ShortTermUserChargeData = JsonSerializer.Serialize(formData.ShortTermUserCharge, _jsonOptions),
                LongTermUserChargeData = JsonSerializer.Serialize(formData.LongTermUserCharge, _jsonOptions),
                MixedUserChargeData = JsonSerializer.Serialize(formData.MixedUserCharge, _jsonOptions),
                TotalEstimateData = JsonSerializer.Serialize(formData.TotalEstimate, _jsonOptions),
                // Causes Analysis Tab
                ProblemStatement = formData.ProblemStatement,
                RootCauses = JsonSerializer.Serialize(formData.RootCauses, _jsonOptions),
                RecommendationSummary = formData.RecommendationSummary,
                ActionItems = JsonSerializer.Serialize(formData.ActionItems, _jsonOptions),
                CreatedAt = System.DateTime.UtcNow
            };
            
            // Associate with current user if authenticated
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                var user = await _userManager.GetUserAsync(User);
                if (user != null)
                {
                    report.UserId = user.Id;
                }
            }
            
            try
            {
                // Check if we're updating an existing report
                if (formData.Id > 0)
                {
                    // Get the existing report
                    var existingReport = await _context.RosraReports.FindAsync(formData.Id);
                    
                    if (existingReport != null)
                    {
                        // Update the existing report
                        existingReport.Title = formData.Title;
                        existingReport.Country = formData.Country;
                        existingReport.Region = formData.Region;
                        existingReport.City = formData.City;
                        existingReport.Currency = formData.Currency;
                        existingReport.CurrencySymbol = formData.CurrencySymbol;
                        existingReport.FinancialYear = formData.FinancialYear;
                        // Financial Data
                        existingReport.ActualOsr = formData.ActualOsr;
                        existingReport.BudgetedOsr = formData.BudgetedOsr;
                        existingReport.Population = formData.Population;
                        existingReport.GdpPerCapita = formData.GdpPerCapita;
                        // Project Details
                        existingReport.ProjectName = formData.ProjectName;
                        existingReport.EstimatedBudget = formData.EstimatedBudget;
                        existingReport.ProjectDescription = formData.ProjectDescription;
                        existingReport.KeyObjectives = formData.KeyObjectives;
                        existingReport.StartDate = formData.StartDate;
                        existingReport.EndDate = formData.EndDate;

                        // Gap Analysis Sub-Tabs
                        existingReport.PropertyTaxData = JsonSerializer.Serialize(formData.PropertyTax);
                        // TotalPropertyTaxPayers is now saved only as part of PropertyTaxData JSON
                        // RegisteredPropertyTaxPayers is now saved only as part of PropertyTaxData JSON
                        existingReport.LicenseData = JsonSerializer.Serialize(formData.License);
                        existingReport.ShortTermUserChargeData = JsonSerializer.Serialize(formData.ShortTermUserCharge);
                        existingReport.LongTermUserChargeData = JsonSerializer.Serialize(formData.LongTermUserCharge);
                        existingReport.MixedUserChargeData = JsonSerializer.Serialize(formData.MixedUserCharge);
                        existingReport.TotalEstimateData = JsonSerializer.Serialize(formData.TotalEstimate);
                        // Causes Analysis Tab
                        existingReport.ProblemStatement = formData.ProblemStatement;
                        existingReport.RootCauses = JsonSerializer.Serialize(formData.RootCauses);
                        existingReport.RecommendationSummary = formData.RecommendationSummary;
                        existingReport.ActionItems = JsonSerializer.Serialize(formData.ActionItems);
                        
                        _context.Update(existingReport);
                        await _context.SaveChangesAsync();
                        
                        TempData["SuccessMessage"] = "Report updated successfully!";
                    }
                    else
                    {
                        TempData["ErrorMessage"] = "Report not found!";
                    }
                }
                else
                {
                    // Save to database as a new report
                    _context.RosraReports.Add(report);
                    await _context.SaveChangesAsync();
                    
                    TempData["SuccessMessage"] = "Report saved successfully!";
                }
            }
            catch (Exception ex)
            {
                // Handle exception
                TempData["ErrorMessage"] = "Failed to save report: " + ex.Message;
            }
            
            return RedirectToAction("Index");
        }
        
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            // Get the current user
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }
            
            // Get the report
            var report = await _context.RosraReports.FirstOrDefaultAsync(r => r.Id == id);
            if (report == null)
            {
                return NotFound();
            }
            
            // Check if the report belongs to the current user
            if (report.UserId != user.Id)
            {
                return Forbid();
            }
            
            // Create a view model for the form
            var formData = new RosraFormViewModel
            {
                Id = report.Id,
                Title = report.Title,
                // Location Information
                Country = report.Country,
                Region = report.Region,
                City = report.City,
                Currency = report.Currency,
                CurrencySymbol = report.CurrencySymbol,
                FinancialYear = report.FinancialYear,
                // Financial Data
                ActualOsr = report.ActualOsr,
                BudgetedOsr = report.BudgetedOsr,
                Population = report.Population,
                GdpPerCapita = report.GdpPerCapita,
                // Project Details
                ProjectName = report.ProjectName,
                ProjectDescription = report.ProjectDescription,
                KeyObjectives = report.KeyObjectives,
                StartDate = report.StartDate,
                EndDate = report.EndDate,
                // Gap Analysis Sub-Tabs
                PropertyTax = string.IsNullOrEmpty(report.PropertyTaxData)
                    ? new GapAnalysisPropertyTaxViewModel()
                    : DeserializePropertyTaxData(report.PropertyTaxData),
                License = string.IsNullOrEmpty(report.LicenseData)
                    ? new GapAnalysisLicenseViewModel()
                    : JsonSerializer.Deserialize<GapAnalysisLicenseViewModel>(report.LicenseData, _jsonOptions) ?? new GapAnalysisLicenseViewModel(),
                ShortTermUserCharge = string.IsNullOrEmpty(report.ShortTermUserChargeData)
                    ? new GapAnalysisShortTermViewModel()
                    : JsonSerializer.Deserialize<GapAnalysisShortTermViewModel>(report.ShortTermUserChargeData, _jsonOptions) ?? new GapAnalysisShortTermViewModel(),
                LongTermUserCharge = string.IsNullOrEmpty(report.LongTermUserChargeData)
                    ? new GapAnalysisLongTermViewModel()
                    : JsonSerializer.Deserialize<GapAnalysisLongTermViewModel>(report.LongTermUserChargeData, _jsonOptions) ?? new GapAnalysisLongTermViewModel(),
                MixedUserCharge = string.IsNullOrEmpty(report.MixedUserChargeData)
                    ? new GapAnalysisMixedViewModel()
                    : JsonSerializer.Deserialize<GapAnalysisMixedViewModel>(report.MixedUserChargeData, _jsonOptions) ?? new GapAnalysisMixedViewModel(),
                TotalEstimate = string.IsNullOrEmpty(report.TotalEstimateData)
                    ? new GapAnalysisTotalViewModel()
                    : JsonSerializer.Deserialize<GapAnalysisTotalViewModel>(report.TotalEstimateData, _jsonOptions) ?? new GapAnalysisTotalViewModel(),
                // Causes Analysis Tab
                ProblemStatement = report.ProblemStatement,
                RootCauses = string.IsNullOrEmpty(report.RootCauses) 
                    ? new List<string>() 
                    : JsonSerializer.Deserialize<List<string>>(report.RootCauses, _jsonOptions) ?? new List<string>(),
                RecommendationSummary = report.RecommendationSummary,
                ActionItems = string.IsNullOrEmpty(report.ActionItems)
                    ? new List<ActionItemViewModel>()
                    : JsonSerializer.Deserialize<List<ActionItemViewModel>>(report.ActionItems, _jsonOptions) ?? new List<ActionItemViewModel>()
            };
            
            // Log the PropertyTax values to verify they are loaded correctly
            _logger.LogInformation("View action - PropertyTax values: TotalPropertyTaxPayers={Total}, RegisteredPropertyTaxPayers={Registered}", 
                formData.PropertyTax.TotalPropertyTaxPayers, formData.PropertyTax.RegisteredPropertyTaxPayers);
            
            // Save form data to session
            SaveFormDataToSession(formData);
            
            // Redirect to the Rosra page with the form data
            return RedirectToAction("Index");
        }
        
        [HttpGet]
        public async Task<IActionResult> View(int id)
        {
            // Check if user is authenticated
            if (User.Identity == null || !User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }
            
            // Get the current user
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }
            
            // Get the report
            var report = await _context.RosraReports.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }
            
            // Debug the raw PropertyTaxData
            _logger.LogInformation("Raw PropertyTaxData from database: {PropertyTaxData}", report.PropertyTaxData);
            
            // Check if the report belongs to the current user
            if (report.UserId != user.Id && !User.IsInRole("Admin"))
            {
                return Forbid();
            }
            
            // Create a view model for the form
            var formData = new RosraFormViewModel
            {
                Id = report.Id,
                Title = report.Title,
                // Location Information
                Country = report.Country,
                Region = report.Region,
                City = report.City,
                Currency = report.Currency,
                CurrencySymbol = report.CurrencySymbol,
                FinancialYear = report.FinancialYear,
                // Financial Data
                ActualOsr = report.ActualOsr,
                BudgetedOsr = report.BudgetedOsr,
                Population = report.Population,
                GdpPerCapita = report.GdpPerCapita,
                // Project Details
                ProjectName = report.ProjectName,
                ProjectDescription = report.ProjectDescription,
                KeyObjectives = report.KeyObjectives,
                StartDate = report.StartDate,
                EndDate = report.EndDate,
                // Gap Analysis Sub-Tabs
                PropertyTax = string.IsNullOrEmpty(report.PropertyTaxData)
                    ? new GapAnalysisPropertyTaxViewModel()
                    : DeserializePropertyTaxData(report.PropertyTaxData),
                License = string.IsNullOrEmpty(report.LicenseData)
                    ? new GapAnalysisLicenseViewModel()
                    : JsonSerializer.Deserialize<GapAnalysisLicenseViewModel>(report.LicenseData, _jsonOptions) ?? new GapAnalysisLicenseViewModel(),
                ShortTermUserCharge = string.IsNullOrEmpty(report.ShortTermUserChargeData)
                    ? new GapAnalysisShortTermViewModel()
                    : JsonSerializer.Deserialize<GapAnalysisShortTermViewModel>(report.ShortTermUserChargeData, _jsonOptions) ?? new GapAnalysisShortTermViewModel(),
                LongTermUserCharge = string.IsNullOrEmpty(report.LongTermUserChargeData)
                    ? new GapAnalysisLongTermViewModel()
                    : JsonSerializer.Deserialize<GapAnalysisLongTermViewModel>(report.LongTermUserChargeData, _jsonOptions) ?? new GapAnalysisLongTermViewModel(),
                MixedUserCharge = string.IsNullOrEmpty(report.MixedUserChargeData)
                    ? new GapAnalysisMixedViewModel()
                    : JsonSerializer.Deserialize<GapAnalysisMixedViewModel>(report.MixedUserChargeData, _jsonOptions) ?? new GapAnalysisMixedViewModel(),
                TotalEstimate = string.IsNullOrEmpty(report.TotalEstimateData)
                    ? new GapAnalysisTotalViewModel()
                    : JsonSerializer.Deserialize<GapAnalysisTotalViewModel>(report.TotalEstimateData, _jsonOptions) ?? new GapAnalysisTotalViewModel(),
                // Causes Analysis Tab
                ProblemStatement = report.ProblemStatement,
                RootCauses = string.IsNullOrEmpty(report.RootCauses) 
                    ? new List<string>() 
                    : JsonSerializer.Deserialize<List<string>>(report.RootCauses, _jsonOptions) ?? new List<string>(),
                RecommendationSummary = report.RecommendationSummary,
                ActionItems = string.IsNullOrEmpty(report.ActionItems)
                    ? new List<ActionItemViewModel>()
                    : JsonSerializer.Deserialize<List<ActionItemViewModel>>(report.ActionItems, _jsonOptions) ?? new List<ActionItemViewModel>()
            };
            
            // Log the PropertyTax values to verify they are loaded correctly
            _logger.LogInformation("View action - PropertyTax values: TotalPropertyTaxPayers={Total}, RegisteredPropertyTaxPayers={Registered}", 
                formData.PropertyTax.TotalPropertyTaxPayers, formData.PropertyTax.RegisteredPropertyTaxPayers);
            
            // Save form data to session
            SaveFormDataToSession(formData);
            
            // Set ViewMode flag in ViewData
            ViewData["ViewMode"] = true;
            
            // Create a view model for the tabs
            var tabsViewModel = new TabsContainerViewModel
            {
                ContainerId = "rosraTabs",
                Tabs = new List<TabViewModel>(),
                TabContentModel = formData
            };

            // Add tabs to the model
            var tabs = new List<TabViewModel>
            {
                new TabViewModel
                {
                    Id = "potential-estimates",
                    Title = "Potential Estimates",
                    IsActive = true,
                    ContentPartialName = "_PotentialEstimates"
                },
                new TabViewModel
                {
                    Id = "gap-analysis",
                    Title = "Gap Analysis",
                    IsActive = false,
                    ContentPartialName = "_GapAnalysis"
                },
                new TabViewModel
                {
                    Id = "causes-analysis",
                    Title = "Causes Analysis",
                    IsActive = false,
                    ContentPartialName = "_CausesAnalysis"
                },
                new TabViewModel
                {
                    Id = "recommendations",
                    Title = "Recommendations",
                    IsActive = false,
                    ContentPartialName = "_Recommendations"
                }
            };

            // Mark all tabs as visited in view mode
            foreach (var tab in tabs)
            {
                tab.IsVisited = true;
            }

            tabsViewModel.Tabs = tabs;
            return View("Index", tabsViewModel);
        }
        
        [HttpPost]
        public IActionResult ExportAnalysis(RosraFormViewModel formData)
        {
            // Save form data to session
            SaveFormDataToSession(formData);
            
            // In a real application, we would generate a PDF or Excel file here
            // For now, we'll just redirect back with a success message
            
            TempData["SuccessMessage"] = "Analysis exported successfully!";
            
            return RedirectToAction("Index");
        }

        private List<string> GetVisitedTabsFromSession()
        {
            var visitedTabsJson = HttpContext.Session.GetString(VisitedTabsKey);
            if (string.IsNullOrEmpty(visitedTabsJson))
            {
                return new List<string>();
            }
            return JsonSerializer.Deserialize<List<string>>(visitedTabsJson) ?? new List<string>();
        }

        private void SaveVisitedTabsToSession(List<string> visitedTabs)
        {
            var visitedTabsJson = JsonSerializer.Serialize(visitedTabs);
            HttpContext.Session.SetString(VisitedTabsKey, visitedTabsJson);
        }
        
        private RosraFormViewModel? GetFormDataFromSession()
        {
            var formDataJson = HttpContext.Session.GetString(RosraFormDataKey);
            if (string.IsNullOrEmpty(formDataJson))
            {
                return null;
            }
            return JsonSerializer.Deserialize<RosraFormViewModel>(formDataJson);
        }
        
        private void SaveFormDataToSession(RosraFormViewModel formData)
        {
            var formDataJson = JsonSerializer.Serialize(formData);
            HttpContext.Session.SetString(RosraFormDataKey, formDataJson);
        }
        
        // Helper method to ensure PropertyTax values are properly serialized
        private string SerializePropertyTaxData(GapAnalysisPropertyTaxViewModel propertyTax, string dynamicCategoriesJson = null)
        {
            try
            {
                // Log the values being serialized
                _logger.LogInformation("Serializing PropertyTax: TotalPropertyTaxPayers={Total}, RegisteredPropertyTaxPayers={Registered}", 
                    propertyTax.TotalPropertyTaxPayers, propertyTax.RegisteredPropertyTaxPayers);
                
                // Process dynamic categories if provided
                if (!string.IsNullOrEmpty(dynamicCategoriesJson))
                {
                    try
                    {
                        // Log the raw JSON for debugging
                        _logger.LogInformation("Raw dynamic categories JSON: {Json}", dynamicCategoriesJson);
                        
                        // Parse the dynamic categories JSON
                        var dynamicCategories = JsonSerializer.Deserialize<List<dynamic>>(dynamicCategoriesJson);
                        propertyTax.DynamicCategories = new List<PropertyTaxCategory>();
                        
                        _logger.LogInformation("Found {Count} dynamic categories in JSON", dynamicCategories.Count);
                        
                        // Convert dynamic objects to PropertyTaxCategory objects
                        foreach (var category in dynamicCategories)
                        {
                            // Try to get the name property in a case-insensitive way
                            string name = "New Category";
                            
                            // Log all properties of the category for debugging
                            try {
                                var categoryString = JsonSerializer.Serialize((object)category);
                                _logger.LogInformation("Category properties: {Properties}", categoryString);
                            } catch (Exception ex) {
                                _logger.LogError("Error serializing category: {Error}", ex.Message);
                            }
                            
                            if (category.TryGetProperty("name", out JsonElement nameProp) && !nameProp.ValueKind.Equals(JsonValueKind.Null))
                            {
                                name = nameProp.GetString() ?? "New Category";
                                _logger.LogInformation("Found lowercase 'name' property: {Name}", name);
                            }
                            else if (category.TryGetProperty("Name", out JsonElement nameUpperProp) && !nameUpperProp.ValueKind.Equals(JsonValueKind.Null))
                            {
                                name = nameUpperProp.GetString() ?? "New Category";
                                _logger.LogInformation("Found uppercase 'Name' property: {Name}", name);
                            }
                            else
                            {
                                _logger.LogWarning("No name property found in category, using default: New Category");
                            }
                            
                            // Parse numeric values
                            int? registeredTaxpayers = null;
                            int? compliantTaxpayers = null;
                            decimal? averagePropertyValue = null;
                            decimal? estimatedAveragePropertyValue = null;
                            decimal? taxRate = null;
                            
                            if (category.TryGetProperty("registeredTaxpayers", out JsonElement registeredProp) && !registeredProp.ValueKind.Equals(JsonValueKind.Null))
                            {
                                var registeredStr = registeredProp.GetString();
                                if (!string.IsNullOrEmpty(registeredStr) && int.TryParse(registeredStr, out var registeredValue))
                                {
                                    registeredTaxpayers = registeredValue;
                                }
                            }
                            
                            if (category.TryGetProperty("compliantTaxpayers", out JsonElement compliantProp) && !compliantProp.ValueKind.Equals(JsonValueKind.Null))
                            {
                                var compliantStr = compliantProp.GetString();
                                if (!string.IsNullOrEmpty(compliantStr) && int.TryParse(compliantStr, out var compliantValue))
                                {
                                    compliantTaxpayers = compliantValue;
                                }
                            }
                            
                            if (category.TryGetProperty("averagePropertyValue", out JsonElement averageProp) && !averageProp.ValueKind.Equals(JsonValueKind.Null))
                            {
                                var averageStr = averageProp.GetString();
                                if (!string.IsNullOrEmpty(averageStr) && decimal.TryParse(averageStr, out var averageValue))
                                {
                                    averagePropertyValue = averageValue;
                                }
                            }
                            
                            if (category.TryGetProperty("estimatedAveragePropertyValue", out JsonElement estimatedProp) && !estimatedProp.ValueKind.Equals(JsonValueKind.Null))
                            {
                                var estimatedStr = estimatedProp.GetString();
                                if (!string.IsNullOrEmpty(estimatedStr) && decimal.TryParse(estimatedStr, out var estimatedValue))
                                {
                                    estimatedAveragePropertyValue = estimatedValue;
                                }
                            }
                            
                            if (category.TryGetProperty("taxRate", out JsonElement taxRateProp) && !taxRateProp.ValueKind.Equals(JsonValueKind.Null))
                            {
                                var taxRateStr = taxRateProp.GetString();
                                if (!string.IsNullOrEmpty(taxRateStr) && decimal.TryParse(taxRateStr, out var taxRateValue))
                                {
                                    taxRate = taxRateValue;
                                }
                            }
                            
                            // Add the category to the list
                            var newCategory = new PropertyTaxCategory
                            {
                                Name = name, // Explicitly set the name
                                RegisteredTaxpayers = registeredTaxpayers,
                                CompliantTaxpayers = compliantTaxpayers,
                                AveragePropertyValue = averagePropertyValue,
                                EstimatedAveragePropertyValue = estimatedAveragePropertyValue,
                                TaxRate = taxRate
                            };
                            
                            // Log the category being added
                            _logger.LogInformation("Adding category with name: {Name}", newCategory.Name);
                            
                            propertyTax.DynamicCategories.Add(newCategory);
                        }
                        
                        _logger.LogInformation("Added {Count} dynamic categories from JSON", propertyTax.DynamicCategories.Count);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error processing dynamic categories JSON");
                    }
                }
                
                // Create a dynamic object to ensure proper serialization of large integers
                var jsonObj = new
                {
                    TotalPropertyTaxPayers = propertyTax.TotalPropertyTaxPayers,
                    RegisteredPropertyTaxPayers = propertyTax.RegisteredPropertyTaxPayers,
                    Description = propertyTax.Description,
                    Notes = propertyTax.Notes,
                    CurrentValue = propertyTax.CurrentValue,
                    PotentialValue = propertyTax.PotentialValue,
                    Gap = propertyTax.Gap,
                    // Include standard category fields
                    RegisteredTaxpayersCategoryA = propertyTax.RegisteredTaxpayersCategoryA,
                    RegisteredTaxpayersCategoryB = propertyTax.RegisteredTaxpayersCategoryB,
                    RegisteredTaxpayersCategoryC = propertyTax.RegisteredTaxpayersCategoryC,
                    CompliantTaxpayersCategoryA = propertyTax.CompliantTaxpayersCategoryA,
                    CompliantTaxpayersCategoryB = propertyTax.CompliantTaxpayersCategoryB,
                    CompliantTaxpayersCategoryC = propertyTax.CompliantTaxpayersCategoryC,
                    AveragePropertyValueCategoryA = propertyTax.AveragePropertyValueCategoryA,
                    AveragePropertyValueCategoryB = propertyTax.AveragePropertyValueCategoryB,
                    AveragePropertyValueCategoryC = propertyTax.AveragePropertyValueCategoryC,
                    EstimatedAveragePropertyValueCategoryA = propertyTax.EstimatedAveragePropertyValueCategoryA,
                    EstimatedAveragePropertyValueCategoryB = propertyTax.EstimatedAveragePropertyValueCategoryB,
                    EstimatedAveragePropertyValueCategoryC = propertyTax.EstimatedAveragePropertyValueCategoryC,
                    TaxRateCategoryA = propertyTax.TaxRateCategoryA,
                    TaxRateCategoryB = propertyTax.TaxRateCategoryB,
                    TaxRateCategoryC = propertyTax.TaxRateCategoryC,
                    // Include dynamic categories
                    DynamicCategories = propertyTax.DynamicCategories
                };
                
                var jsonString = JsonSerializer.Serialize(jsonObj, _jsonOptions);
                _logger.LogInformation("Serialized PropertyTaxData: {PropertyTaxData}", jsonString);
                
                return jsonString;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error serializing PropertyTaxData");
                
                // Fallback to manual serialization if needed
                try
                {
                    // Create a simple JSON object with the key properties
                    var jsonObj = new
                    {
                        TotalPropertyTaxPayers = propertyTax.TotalPropertyTaxPayers,
                        RegisteredPropertyTaxPayers = propertyTax.RegisteredPropertyTaxPayers,
                        Description = propertyTax.Description,
                        Notes = propertyTax.Notes,
                        CurrentValue = propertyTax.CurrentValue,
                        PotentialValue = propertyTax.PotentialValue,
                        Gap = propertyTax.Gap,
                        // Include dynamic categories if available
                        DynamicCategories = propertyTax.DynamicCategories
                    };
                    
                    var result = JsonSerializer.Serialize(jsonObj, _jsonOptions);
                    _logger.LogInformation("Manual serialization result: {Result}", result);
                    return result;
                }
                catch (Exception innerEx)
                {
                    _logger.LogError(innerEx, "Manual serialization also failed");
                    return "{}";
                }
            }
        }
        
        // Helper method to debug PropertyTax deserialization
        private GapAnalysisPropertyTaxViewModel DeserializePropertyTaxData(string jsonData)
        {
            try
            {
                _logger.LogInformation("Deserializing PropertyTaxData: {JsonData}", jsonData);
                var result = JsonSerializer.Deserialize<GapAnalysisPropertyTaxViewModel>(jsonData, _jsonOptions) ?? new GapAnalysisPropertyTaxViewModel();
                
                // Check if there are dynamic categories in the JSON but not in the model
                if (result.DynamicCategories == null || result.DynamicCategories.Count == 0)
                {
                    try
                    {
                        // Try to extract dynamic categories from the JSON directly
                        var jsonElement = JsonSerializer.Deserialize<JsonElement>(jsonData);
                        if (jsonElement.TryGetProperty("DynamicCategories", out var dynamicCategoriesElement) && 
                            dynamicCategoriesElement.ValueKind == JsonValueKind.Array)
                        {
                            result.DynamicCategories = new List<PropertyTaxCategory>();
                            
                            foreach (var categoryElement in dynamicCategoriesElement.EnumerateArray())
                            {
                                var category = new PropertyTaxCategory();
                                
                                if (categoryElement.TryGetProperty("Name", out var nameElement) && 
                                    nameElement.ValueKind == JsonValueKind.String)
                                {
                                    category.Name = nameElement.GetString();
                                }
                                
                                if (categoryElement.TryGetProperty("RegisteredTaxpayers", out var registeredElement) && 
                                    registeredElement.ValueKind == JsonValueKind.Number)
                                {
                                    category.RegisteredTaxpayers = registeredElement.GetInt32();
                                }
                                
                                if (categoryElement.TryGetProperty("CompliantTaxpayers", out var compliantElement) && 
                                    compliantElement.ValueKind == JsonValueKind.Number)
                                {
                                    category.CompliantTaxpayers = compliantElement.GetInt32();
                                }
                                
                                if (categoryElement.TryGetProperty("AveragePropertyValue", out var averageElement) && 
                                    averageElement.ValueKind == JsonValueKind.Number)
                                {
                                    category.AveragePropertyValue = averageElement.GetDecimal();
                                }
                                
                                if (categoryElement.TryGetProperty("EstimatedAveragePropertyValue", out var estimatedElement) && 
                                    estimatedElement.ValueKind == JsonValueKind.Number)
                                {
                                    category.EstimatedAveragePropertyValue = estimatedElement.GetDecimal();
                                }
                                
                                if (categoryElement.TryGetProperty("TaxRate", out var taxRateElement) && 
                                    taxRateElement.ValueKind == JsonValueKind.Number)
                                {
                                    category.TaxRate = taxRateElement.GetDecimal();
                                }
                                
                                result.DynamicCategories.Add(category);
                            }
                            
                            _logger.LogInformation("Extracted {Count} dynamic categories from JSON", result.DynamicCategories.Count);
                        }
                    }
                    catch (Exception innerEx)
                    {
                        _logger.LogError(innerEx, "Error extracting dynamic categories from JSON");
                    }
                }
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deserializing PropertyTaxData");
                return new GapAnalysisPropertyTaxViewModel();
            }
        }
    }
}
