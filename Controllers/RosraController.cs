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
using System.IO;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Localization;
using RosraApp.Services;

namespace RosraApp.Controllers
{
    public class RosraController : Controller
    {
        private const string VisitedTabsKey = "VisitedTabs";
        private const string RosraFormDataKey = "RosraFormData";
        
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RosraController> _logger;
        private readonly IStringLocalizer<RosraApp.RosraResources> _localizer;
        private readonly ReportExportService _pdfExportService;
        private readonly ExcelExportService _excelExportService;
        private readonly HtmlToPdfService _htmlToPdfService;
        private readonly IMemoryCache _cache;

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
            ILogger<RosraController> logger,
            IStringLocalizer<RosraApp.RosraResources> localizer,
            ReportExportService pdfExportService,
            ExcelExportService excelExportService,
            HtmlToPdfService htmlToPdfService,
            IMemoryCache cache)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
            _localizer = localizer;
            _pdfExportService = pdfExportService;
            _excelExportService = excelExportService;
            _htmlToPdfService = htmlToPdfService;
            _cache = cache;
        }

        public IActionResult Index(string activeTab = null, string umbrellaTab = null, bool viewMode = false)
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
                UmbrellaTabs = new List<UmbrellaTabViewModel>(),
                TabContentModel = formData
            };

            // Determine which umbrella tab and sub-tab should be active
            string activeUmbrellaId = umbrellaTab ?? "top-down";
            string activeSubTabId = activeTab;

            // Define Bottom-Up sub-tabs (4-step pipeline)
            var bottomUpSubTabs = new List<TabViewModel>
            {
                new TabViewModel
                {
                    Id = "gap-analysis",
                    Title = _localizer["Tab_GapAnalysis"].Value,
                    ContentPartialName = "_GapAnalysis",
                    StepNumber = 1
                },
                new TabViewModel
                {
                    Id = "prioritization",
                    Title = _localizer["Tab_Prioritization"].Value,
                    ContentPartialName = "_Prioritization",
                    StepNumber = 2
                },
                new TabViewModel
                {
                    Id = "overview-selection",
                    Title = _localizer["Tab_OverviewSelection"].Value,
                    ContentPartialName = "_OverviewSelection",
                    StepNumber = 3
                },
                new TabViewModel
                {
                    Id = "recommendations",
                    Title = _localizer["Tab_Recommendations"].Value,
                    ContentPartialName = "_Recommendations",
                    StepNumber = 4
                }
            };

            // Check if activeTab belongs to bottom-up
            var bottomUpTabIds = bottomUpSubTabs.Select(t => t.Id).ToList();
            bool isBottomUpTab = activeSubTabId != null && bottomUpTabIds.Contains(activeSubTabId);

            // If activeTab is a bottom-up tab, set umbrella to bottom-up
            if (isBottomUpTab)
            {
                activeUmbrellaId = "bottom-up";
            }
            else if (activeSubTabId == "potential-estimates" || activeSubTabId == null)
            {
                activeUmbrellaId = "top-down";
                activeSubTabId = "potential-estimates";
            }

            // Set active states for bottom-up sub-tabs
            if (activeUmbrellaId == "bottom-up")
            {
                // Default to first sub-tab if none specified
                if (string.IsNullOrEmpty(activeSubTabId) || !bottomUpTabIds.Contains(activeSubTabId))
                {
                    activeSubTabId = "gap-analysis";
                }

                // Find active tab index in bottom-up tabs
                int activeIndex = bottomUpSubTabs.FindIndex(t => t.Id == activeSubTabId);
                if (activeIndex < 0) activeIndex = 0;

                for (int i = 0; i < bottomUpSubTabs.Count; i++)
                {
                    bottomUpSubTabs[i].IsActive = bottomUpSubTabs[i].Id == activeSubTabId;
                    bottomUpSubTabs[i].IsVisited = i <= activeIndex || visitedTabs.Contains(bottomUpSubTabs[i].Id);

                    // Add current tab to visited tabs
                    if (bottomUpSubTabs[i].IsActive && !visitedTabs.Contains(bottomUpSubTabs[i].Id))
                    {
                        visitedTabs.Add(bottomUpSubTabs[i].Id);
                    }
                }
            }

            // Create umbrella tabs
            var umbrellaTabs = new List<UmbrellaTabViewModel>
            {
                new UmbrellaTabViewModel
                {
                    Id = "top-down",
                    Title = _localizer["Tab_TopDown"].Value,
                    Description = "Quick OSR Potential Estimate",
                    Icon = "bi bi-arrow-down-circle",
                    IsActive = activeUmbrellaId == "top-down",
                    HasStepper = false,
                    SubTabs = new List<TabViewModel>
                    {
                        new TabViewModel
                        {
                            Id = "potential-estimates",
                            Title = "Quick OSR Potential Estimate",
                            IsActive = true,
                            IsVisited = true,
                            ContentPartialName = "_PotentialEstimates"
                        }
                    }
                },
                new UmbrellaTabViewModel
                {
                    Id = "bottom-up",
                    Title = _localizer["Tab_BottomUp"].Value,
                    Description = "Detailed 4-Step Pipeline",
                    Icon = "bi bi-arrow-up-circle",
                    IsActive = activeUmbrellaId == "bottom-up",
                    HasStepper = true,
                    SubTabs = bottomUpSubTabs
                }
            };

            // Save visited tabs to session
            SaveVisitedTabsToSession(visitedTabs);

            tabsViewModel.UmbrellaTabs = umbrellaTabs;
            tabsViewModel.ActiveUmbrellaTabId = activeUmbrellaId;
            tabsViewModel.ActiveSubTabId = activeSubTabId;

            // Also populate legacy Tabs for backward compatibility
            var allTabs = new List<TabViewModel>
            {
                new TabViewModel
                {
                    Id = "potential-estimates",
                    Title = "Potential Estimates",
                    IsActive = activeSubTabId == "potential-estimates",
                    ContentPartialName = "_PotentialEstimates"
                }
            };
            allTabs.AddRange(bottomUpSubTabs);
            tabsViewModel.Tabs = allTabs;

            return View(tabsViewModel);
        }
        
        [HttpGet]
        public IActionResult NewReport()
        {
            // Clear the session data
            HttpContext.Session.Remove(RosraFormDataKey);
            HttpContext.Session.Remove(VisitedTabsKey);

            // Signal the client to clear localStorage as well
            TempData["ClearLocalStorage"] = true;

            // Redirect to the Index action to create a new report
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult LoadSampleData()
        {
            // Clear existing session data
            HttpContext.Session.Remove(RosraFormDataKey);
            HttpContext.Session.Remove(VisitedTabsKey);

            // Build sample form data
            var sampleData = new RosraFormViewModel
            {
                Title = "ROSRA Report - Kenya - Nakuru (Sample)",
                Country = "Kenya",
                Region = "Kiambu",
                City = "Nakuru",
                Currency = "KES",
                CurrencySymbol = "KSh",
                FinancialYear = "2022",
                GovernmentType = "County Government",
                IncomeLevel = "Lower-middle income",
                ActualOsr = 1_850_000_000,
                BudgetedOsr = 2_400_000_000,
                Population = 2_162_202,
                GdpPerCapita = 1_850,
                ProjectName = "Nakuru County OSR Enhancement Programme",
                ProjectDescription = "A comprehensive programme to improve own-source revenue mobilization across property tax, business licensing, and user charges in Nakuru County.",
                KeyObjectives = "1. Expand the property tax base through improved registration\n2. Improve business license compliance rates\n3. Modernize revenue collection systems\n4. Reduce revenue leakage in user charges",
                PropertyTax = new GapAnalysisPropertyTaxViewModel
                {
                    RegisteredProperties = 20344,
                    NonRegisteredProperties = 1000,
                    CompliantProperties = 28000,
                    TotalFiscalBase = 85_000_000_000,
                    TotalMarketValue = 142_000_000_000,
                    BilledAmount = 680_000_000,
                    OutstandingAmount = 245_000_000,
                    RevenueToDate = 435_000_000
                },
                License = new GapAnalysisLicenseViewModel
                {
                    RegisteredBusinesses = 18500,
                    EstimatedUnregisteredPercent = 35,
                    BilledAmount = 520_000_000,
                    OutstandingAmount = 156_000_000,
                    StatutoryAverageBilled = 38_000,
                    RealisticImprovementPercent = 20,
                    RevenueToDate = 364_000_000
                },
                ProblemStatement = "Nakuru County faces significant revenue gaps driven by low property registration coverage, inadequate business license compliance, and outdated valuation rolls. The current OSR collection represents only 77% of the budgeted target, with property tax and business licenses showing the largest gaps.",
                RootCauses = new List<string>
                {
                    "Outdated property valuation roll (last updated 2015)",
                    "Weak enforcement of business license requirements",
                    "Manual collection processes leading to revenue leakage",
                    "Limited taxpayer awareness and engagement",
                    "Insufficient staffing for revenue administration"
                },
                RecommendationSummary = "Prioritize property tax base expansion through a digital property registration drive, implement an integrated revenue management system, and strengthen enforcement mechanisms for business license compliance.",
                ActionItems = new List<ActionItemViewModel>
                {
                    new ActionItemViewModel { Description = "Launch digital property enumeration exercise in all 11 sub-counties", Priority = "high" },
                    new ActionItemViewModel { Description = "Deploy integrated revenue management information system (IRMIS)", Priority = "high" },
                    new ActionItemViewModel { Description = "Establish revenue enforcement unit with mobile collection teams", Priority = "medium" },
                    new ActionItemViewModel { Description = "Conduct taxpayer sensitization campaigns across all wards", Priority = "medium" },
                    new ActionItemViewModel { Description = "Update property valuation roll using GIS-based mass appraisal", Priority = "high" }
                }
            };

            // Load sample data directly into session without saving to database
            // Id = 0 means it's not persisted - view mode prevents accidental saves
            SaveFormDataToSession(sampleData);
            TempData["ClearLocalStorage"] = true;
            return RedirectToAction("Index", new { viewMode = true });
        }

        [HttpPost]
        public IActionResult SwitchTab(string tabId, string umbrellaTabId, RosraFormViewModel formData)
        {
            // Preserve fields from session that don't survive form POST
            var existing = GetFormDataFromSession();
            if (existing != null)
            {
                // Preserve PublicId (hidden field has no name attribute, doesn't bind)
                if (formData.PublicId == Guid.Empty && existing.PublicId != Guid.Empty)
                    formData.PublicId = existing.PublicId;
                if (formData.PropertyTax?.RegisteredProperties == null && existing.PropertyTax?.RegisteredProperties != null)
                    formData.PropertyTax = existing.PropertyTax;
                if (formData.License?.RegisteredBusinesses == null && existing.License?.RegisteredBusinesses != null)
                    formData.License = existing.License;
                // Preserve other sub-objects that may not be in the form POST
                if (formData.ShortTermUserCharge?.EstimatedDailyFeesCategoryA == null && existing.ShortTermUserCharge != null)
                    formData.ShortTermUserCharge = existing.ShortTermUserCharge;
                if (formData.LongTermUserCharge?.EstimatedMonthlyLeaseesCategoryA == null && existing.LongTermUserCharge != null)
                    formData.LongTermUserCharge = existing.LongTermUserCharge;
                if (formData.MixedUserCharge?.EstimatedDailyUsers == null && existing.MixedUserCharge != null)
                    formData.MixedUserCharge = existing.MixedUserCharge;
                if (formData.TotalEstimate?.TotalCurrentRevenue == null && existing.TotalEstimate != null)
                    formData.TotalEstimate = existing.TotalEstimate;
            }

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
                return RedirectToAction("Index", new { activeTab = tabId, umbrellaTab = umbrellaTabId, viewMode = true });
            }

            return RedirectToAction("Index", new { activeTab = tabId, umbrellaTab = umbrellaTabId });
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
                GovUnitLevel3 = formData.GovUnitLevel3,
                FinalUnitLevel = formData.FinalUnitLevel,
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
                // Top OSR Configuration
                TopOsrConfigData = JsonSerializer.Serialize(formData.TopOsrConfig, _jsonOptions),
                // Dynamic Generic Streams
                GenericStreamsData = JsonSerializer.Serialize(formData.GenericStreams, _jsonOptions),
                // Additional fields
                GovernmentType = formData.GovernmentType,
                IncomeLevel = formData.IncomeLevel,
                OtherRevenue = formData.OtherRevenue,
                CreatedAt = System.DateTime.UtcNow,
                // New tab data fields
                PrioritizationData = formData.PrioritizationData,
                SelectedSolutionsData = formData.SelectedSolutionsData,
                ImplementationProgressData = formData.ImplementationProgressData,
                // Peer SNG data for Within-Country OSR Frontier analysis
                PeerSNGData = formData.PeerSNGData
            };
            
            // Get current user
            ApplicationUser? currentUser = null;
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                currentUser = await _userManager.GetUserAsync(User);
                if (currentUser != null)
                {
                    report.UserId = currentUser.Id;
                }
            }

            // Validate JSON fields before saving
            var jsonFields = new[] {
                report.PropertyTaxData, report.LicenseData, report.ShortTermUserChargeData,
                report.LongTermUserChargeData, report.MixedUserChargeData, report.TotalEstimateData,
                report.RootCauses, report.ActionItems, report.TopOsrConfigData,
                report.GenericStreamsData, report.PrioritizationData, report.SelectedSolutionsData,
                report.ImplementationProgressData, report.PeerSNGData
            };

            foreach (var jsonField in jsonFields)
            {
                if (!ValidateJsonField(jsonField))
                {
                    TempData["ErrorMessage"] = "Invalid or oversized data detected. Please check your inputs and try again.";
                    return RedirectToAction("Index");
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
                        // Set concurrency token from form
                        if (!string.IsNullOrEmpty(formData.RowVersion))
                        {
                            _context.Entry(existingReport).Property(r => r.RowVersion)
                                .OriginalValue = Convert.FromBase64String(formData.RowVersion);
                        }

                        // Track who modified the report
                        existingReport.LastModifiedByUserId = currentUser?.Id;

                        // Update the existing report
                        existingReport.Title = formData.Title;
                        existingReport.Country = formData.Country;
                        existingReport.Region = formData.Region;
                        existingReport.City = formData.City;
                        existingReport.GovUnitLevel3 = formData.GovUnitLevel3;
                        existingReport.FinalUnitLevel = formData.FinalUnitLevel;
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
                        
                        // Update Top OSR Configuration
                        existingReport.TopOsrConfigData = JsonSerializer.Serialize(formData.TopOsrConfig);

                        // Update Dynamic Generic Streams
                        existingReport.GenericStreamsData = JsonSerializer.Serialize(formData.GenericStreams);

                        // Update Additional fields
                        existingReport.GovernmentType = formData.GovernmentType;
                        existingReport.IncomeLevel = formData.IncomeLevel;
                        existingReport.OtherRevenue = formData.OtherRevenue;

                        // Update New tab data fields
                        existingReport.PrioritizationData = formData.PrioritizationData;
                        existingReport.SelectedSolutionsData = formData.SelectedSolutionsData;
                        existingReport.ImplementationProgressData = formData.ImplementationProgressData;

                        // Update Peer SNG data for Within-Country OSR Frontier analysis
                        existingReport.PeerSNGData = formData.PeerSNGData;

                        _context.Update(existingReport);
                        await _context.SaveChangesAsync();
                        
                        TempData["SuccessMessage"] = _localizer["Msg_ReportUpdated"].Value;
                    }
                    else
                    {
                        TempData["ErrorMessage"] = _localizer["Msg_ReportNotFound"].Value;
                    }
                }
                else
                {
                    // Save to database as a new report
                    _context.RosraReports.Add(report);
                    await _context.SaveChangesAsync();
                    
                    TempData["SuccessMessage"] = _localizer["Msg_ReportSaved"].Value;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                TempData["ErrorMessage"] = "This report was modified by another user since you loaded it. Please reload the report and re-apply your changes.";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Failed to save report: " + ex.Message;
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AutoSaveReport(RosraFormViewModel formData, string DynamicCategoriesJson)
        {
            if (User.Identity == null || !User.Identity.IsAuthenticated)
                return Json(new { success = false, message = "Not authenticated" });

            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
                return Json(new { success = false, message = "User not found" });

            // Parse formatted numbers (same as SaveReport)
            if (!string.IsNullOrEmpty(Request.Form["ActualOsr"]))
            {
                string val = Request.Form["ActualOsr"].ToString().Replace(",", "");
                if (decimal.TryParse(val, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var parsed))
                    formData.ActualOsr = parsed;
            }
            if (!string.IsNullOrEmpty(Request.Form["BudgetedOsr"]))
            {
                string val = Request.Form["BudgetedOsr"].ToString().Replace(",", "");
                if (decimal.TryParse(val, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var parsed))
                    formData.BudgetedOsr = parsed;
            }
            if (!string.IsNullOrEmpty(Request.Form["Population"]))
            {
                string val = Request.Form["Population"].ToString().Replace(",", "");
                if (int.TryParse(val, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var parsed))
                    formData.Population = parsed;
            }
            if (!string.IsNullOrEmpty(Request.Form["GdpPerCapita"]))
            {
                string val = Request.Form["GdpPerCapita"].ToString().Replace(",", "");
                if (decimal.TryParse(val, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var parsed))
                    formData.GdpPerCapita = parsed;
            }

            SaveFormDataToSession(formData);

            try
            {
                if (formData.Id > 0)
                {
                    // Update existing report
                    var existing = await _context.RosraReports.FindAsync(formData.Id);
                    if (existing == null)
                        return Json(new { success = false, message = "Report not found" });

                    // Only allow auto-save for Draft and NeedsRevision
                    var status = (Models.Enums.ReportStatus)existing.Status;
                    if (status != Models.Enums.ReportStatus.Draft && status != Models.Enums.ReportStatus.NeedsRevision)
                        return Json(new { success = false, message = "Report is locked" });

                    MapFormDataToReport(existing, formData, DynamicCategoriesJson);
                    existing.CompletionLevel = (int)Services.SubmissionService.ComputeCompletionLevel(existing);
                    existing.LastModifiedByUserId = currentUser.Id;
                    _context.Update(existing);
                    await _context.SaveChangesAsync();

                    var rowVersion = existing.RowVersion != null ? Convert.ToBase64String(existing.RowVersion) : null;
                    return Json(new { success = true, reportId = existing.Id, publicId = existing.PublicId, rowVersion });
                }
                else
                {
                    // Create new report
                    var report = CreateReportFromFormData(formData, DynamicCategoriesJson, currentUser.Id);
                    _context.RosraReports.Add(report);
                    await _context.SaveChangesAsync();

                    // Update session with new ID
                    formData.Id = report.Id;
                    formData.PublicId = report.PublicId;
                    SaveFormDataToSession(formData);

                    var rowVersion = report.RowVersion != null ? Convert.ToBase64String(report.RowVersion) : null;
                    return Json(new { success = true, reportId = report.Id, publicId = report.PublicId, rowVersion });
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                return Json(new { success = false, message = "Conflict detected" });
            }
            catch (Exception)
            {
                return Json(new { success = false, message = "Auto-save failed" });
            }
        }

        /// <summary>
        /// Maps form data fields to an existing RosraReport entity for updates.
        /// </summary>
        private void MapFormDataToReport(RosraReport report, RosraFormViewModel formData, string? dynamicCategoriesJson)
        {
            report.Title = formData.Title;
            report.Country = formData.Country;
            report.Region = formData.Region;
            report.City = formData.City;
            report.GovUnitLevel3 = formData.GovUnitLevel3;
            report.FinalUnitLevel = formData.FinalUnitLevel;
            report.Currency = formData.Currency;
            report.CurrencySymbol = formData.CurrencySymbol;
            report.FinancialYear = formData.FinancialYear;
            report.ActualOsr = formData.ActualOsr;
            report.BudgetedOsr = formData.BudgetedOsr;
            report.Population = formData.Population;
            report.GdpPerCapita = formData.GdpPerCapita;
            report.ProjectName = formData.ProjectName;
            report.EstimatedBudget = formData.EstimatedBudget;
            report.ProjectDescription = formData.ProjectDescription;
            report.KeyObjectives = formData.KeyObjectives;
            report.StartDate = formData.StartDate;
            report.EndDate = formData.EndDate;
            report.PropertyTaxData = JsonSerializer.Serialize(formData.PropertyTax, _jsonOptions);
            report.LicenseData = JsonSerializer.Serialize(formData.License, _jsonOptions);
            report.ShortTermUserChargeData = JsonSerializer.Serialize(formData.ShortTermUserCharge, _jsonOptions);
            report.LongTermUserChargeData = JsonSerializer.Serialize(formData.LongTermUserCharge, _jsonOptions);
            report.MixedUserChargeData = JsonSerializer.Serialize(formData.MixedUserCharge, _jsonOptions);
            report.TotalEstimateData = JsonSerializer.Serialize(formData.TotalEstimate, _jsonOptions);
            report.ProblemStatement = formData.ProblemStatement;
            report.RootCauses = JsonSerializer.Serialize(formData.RootCauses, _jsonOptions);
            report.RecommendationSummary = formData.RecommendationSummary;
            report.ActionItems = JsonSerializer.Serialize(formData.ActionItems, _jsonOptions);
            report.TopOsrConfigData = JsonSerializer.Serialize(formData.TopOsrConfig, _jsonOptions);
            report.GenericStreamsData = JsonSerializer.Serialize(formData.GenericStreams, _jsonOptions);
            report.GovernmentType = formData.GovernmentType;
            report.IncomeLevel = formData.IncomeLevel;
            report.OtherRevenue = formData.OtherRevenue;
            report.PrioritizationData = formData.PrioritizationData;
            report.SelectedSolutionsData = formData.SelectedSolutionsData;
            report.ImplementationProgressData = formData.ImplementationProgressData;
            report.PeerSNGData = formData.PeerSNGData;
        }

        /// <summary>
        /// Creates a new RosraReport entity from form data.
        /// </summary>
        private RosraReport CreateReportFromFormData(RosraFormViewModel formData, string? dynamicCategoriesJson, string userId)
        {
            var report = new RosraReport
            {
                Title = formData.Title ?? "ROSRA Report",
                Country = formData.Country,
                Region = formData.Region,
                City = formData.City,
                GovUnitLevel3 = formData.GovUnitLevel3,
                FinalUnitLevel = formData.FinalUnitLevel,
                Currency = formData.Currency,
                CurrencySymbol = formData.CurrencySymbol,
                FinancialYear = formData.FinancialYear,
                ActualOsr = formData.ActualOsr,
                BudgetedOsr = formData.BudgetedOsr,
                Population = formData.Population,
                GdpPerCapita = formData.GdpPerCapita,
                ProjectName = formData.ProjectName,
                EstimatedBudget = formData.EstimatedBudget,
                ProjectDescription = formData.ProjectDescription,
                KeyObjectives = formData.KeyObjectives,
                StartDate = formData.StartDate,
                EndDate = formData.EndDate,
                PropertyTaxData = JsonSerializer.Serialize(formData.PropertyTax, _jsonOptions),
                LicenseData = JsonSerializer.Serialize(formData.License, _jsonOptions),
                ShortTermUserChargeData = JsonSerializer.Serialize(formData.ShortTermUserCharge, _jsonOptions),
                LongTermUserChargeData = JsonSerializer.Serialize(formData.LongTermUserCharge, _jsonOptions),
                MixedUserChargeData = JsonSerializer.Serialize(formData.MixedUserCharge, _jsonOptions),
                TotalEstimateData = JsonSerializer.Serialize(formData.TotalEstimate, _jsonOptions),
                ProblemStatement = formData.ProblemStatement,
                RootCauses = JsonSerializer.Serialize(formData.RootCauses, _jsonOptions),
                RecommendationSummary = formData.RecommendationSummary,
                ActionItems = JsonSerializer.Serialize(formData.ActionItems, _jsonOptions),
                TopOsrConfigData = JsonSerializer.Serialize(formData.TopOsrConfig, _jsonOptions),
                GenericStreamsData = JsonSerializer.Serialize(formData.GenericStreams, _jsonOptions),
                GovernmentType = formData.GovernmentType,
                IncomeLevel = formData.IncomeLevel,
                OtherRevenue = formData.OtherRevenue,
                PrioritizationData = formData.PrioritizationData,
                SelectedSolutionsData = formData.SelectedSolutionsData,
                ImplementationProgressData = formData.ImplementationProgressData,
                PeerSNGData = formData.PeerSNGData,
                CreatedAt = DateTime.UtcNow,
                UserId = userId,
                Status = (int)Models.Enums.ReportStatus.Draft
            };

            // Compute completion level on creation
            report.CompletionLevel = (int)Services.SubmissionService.ComputeCompletionLevel(report);
            return report;
        }

        [HttpGet]
        public async Task<IActionResult> Edit(Guid id)
        {
            // Get the current user
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            // Get the report by PublicId
            var report = await _context.RosraReports.FirstOrDefaultAsync(r => r.PublicId == id);
            if (report == null)
            {
                return NotFound();
            }
            
            // Check if the report belongs to the current user
            if (report.UserId != user.Id)
            {
                return Forbid();
            }

            // Status-based edit locking: only Draft and NeedsRevision are editable
            var status = (Models.Enums.ReportStatus)report.Status;
            if (status != Models.Enums.ReportStatus.Draft && status != Models.Enums.ReportStatus.NeedsRevision)
            {
                TempData["ErrorMessage"] = $"This report is currently '{status}' and cannot be edited.";
                return RedirectToAction("Index", "Dashboard");
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
                GovUnitLevel3 = report.GovUnitLevel3,
                FinalUnitLevel = report.FinalUnitLevel,
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
                EstimatedBudget = report.EstimatedBudget,
                ProjectDescription = report.ProjectDescription,
                KeyObjectives = report.KeyObjectives,
                StartDate = report.StartDate,
                EndDate = report.EndDate,
            };
            
            // Load Top OSR Configuration if exists
            if (!string.IsNullOrEmpty(report.TopOsrConfigData))
            {
                try
                {
                    formData.TopOsrConfig = JsonSerializer.Deserialize<List<TopOsrViewModel>>(report.TopOsrConfigData, _jsonOptions);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error deserializing Top OSR Config data");
                }
            }

            // Load Generic Streams if exists
            if (!string.IsNullOrEmpty(report.GenericStreamsData))
            {
                try
                {
                    formData.GenericStreams = JsonSerializer.Deserialize<List<GenericStreamViewModel>>(report.GenericStreamsData, _jsonOptions) ?? new List<GenericStreamViewModel>();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error deserializing Generic Streams data");
                }
            }

            // Load additional fields
            formData.GovernmentType = report.GovernmentType;
            formData.IncomeLevel = report.IncomeLevel;
            formData.OtherRevenue = report.OtherRevenue;

            // Create a view model for the form
            var formDataViewModel = new RosraFormViewModel
            {
                Id = report.Id,
                PublicId = report.PublicId,
                Title = report.Title,
                // Location Information
                Country = report.Country,
                Region = report.Region,
                City = report.City,
                GovUnitLevel3 = report.GovUnitLevel3,
                FinalUnitLevel = report.FinalUnitLevel,
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
                    : JsonSerializer.Deserialize<List<ActionItemViewModel>>(report.ActionItems, _jsonOptions) ?? new List<ActionItemViewModel>(),
                // Generic Streams
                GenericStreams = string.IsNullOrEmpty(report.GenericStreamsData)
                    ? new List<GenericStreamViewModel>()
                    : JsonSerializer.Deserialize<List<GenericStreamViewModel>>(report.GenericStreamsData, _jsonOptions) ?? new List<GenericStreamViewModel>(),
                // Additional fields
                GovernmentType = report.GovernmentType,
                IncomeLevel = report.IncomeLevel,
                OtherRevenue = report.OtherRevenue,
                // New tab data fields
                PrioritizationData = report.PrioritizationData,
                SelectedSolutionsData = report.SelectedSolutionsData,
                ImplementationProgressData = report.ImplementationProgressData,
                // Concurrency token
                RowVersion = report.RowVersion != null ? Convert.ToBase64String(report.RowVersion) : null
            };

            // Log the PropertyTax values to verify they are loaded correctly
            _logger.LogInformation("Edit action - PropertyTax values: TotalPropertyTaxPayers={Total}, RegisteredPropertyTaxPayers={Registered}",
                formDataViewModel.PropertyTax.TotalPropertyTaxPayers, formDataViewModel.PropertyTax.RegisteredPropertyTaxPayers);

            // Save form data to session
            SaveFormDataToSession(formDataViewModel);

            // Redirect to the Rosra page with the form data
            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> View(Guid id)
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

            // Get the report by PublicId
            var report = await _context.RosraReports.FirstOrDefaultAsync(r => r.PublicId == id);
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
                PublicId = report.PublicId,
                Title = report.Title,
                // Location Information
                Country = report.Country,
                Region = report.Region,
                City = report.City,
                GovUnitLevel3 = report.GovUnitLevel3,
                FinalUnitLevel = report.FinalUnitLevel,
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
                    : JsonSerializer.Deserialize<List<ActionItemViewModel>>(report.ActionItems, _jsonOptions) ?? new List<ActionItemViewModel>(),
                // Generic Streams
                GenericStreams = string.IsNullOrEmpty(report.GenericStreamsData)
                    ? new List<GenericStreamViewModel>()
                    : JsonSerializer.Deserialize<List<GenericStreamViewModel>>(report.GenericStreamsData, _jsonOptions) ?? new List<GenericStreamViewModel>(),
                // Additional fields
                GovernmentType = report.GovernmentType,
                IncomeLevel = report.IncomeLevel,
                OtherRevenue = report.OtherRevenue,
                // New tab data fields
                PrioritizationData = report.PrioritizationData,
                SelectedSolutionsData = report.SelectedSolutionsData,
                ImplementationProgressData = report.ImplementationProgressData,
                // Concurrency token
                RowVersion = report.RowVersion != null ? Convert.ToBase64String(report.RowVersion) : null
            };

            // Save form data to session
            SaveFormDataToSession(formData);

            // Set ViewMode flag in ViewData
            ViewData["ViewMode"] = true;

            // Create a view model for the tabs with umbrella structure
            var tabsViewModel = new TabsContainerViewModel
            {
                ContainerId = "rosraTabs",
                Tabs = new List<TabViewModel>(),
                UmbrellaTabs = new List<UmbrellaTabViewModel>(),
                TabContentModel = formData
            };

            // Define Bottom-Up sub-tabs (4-step pipeline)
            var bottomUpSubTabs = new List<TabViewModel>
            {
                new TabViewModel
                {
                    Id = "gap-analysis",
                    Title = _localizer["Tab_GapAnalysis"].Value,
                    IsActive = true, // First bottom-up step active by default in view
                    IsVisited = true,
                    ContentPartialName = "_GapAnalysis",
                    StepNumber = 1
                },
                new TabViewModel
                {
                    Id = "prioritization",
                    Title = _localizer["Tab_Prioritization"].Value,
                    IsActive = false,
                    IsVisited = true,
                    ContentPartialName = "_Prioritization",
                    StepNumber = 2
                },
                new TabViewModel
                {
                    Id = "overview-selection",
                    Title = _localizer["Tab_OverviewSelection"].Value,
                    IsActive = false,
                    IsVisited = true,
                    ContentPartialName = "_OverviewSelection",
                    StepNumber = 3
                },
                new TabViewModel
                {
                    Id = "recommendations",
                    Title = _localizer["Tab_Recommendations"].Value,
                    IsActive = false,
                    IsVisited = true,
                    ContentPartialName = "_Recommendations",
                    StepNumber = 4
                }
            };

            // Create umbrella tabs - Top-Down active by default in view mode
            var umbrellaTabs = new List<UmbrellaTabViewModel>
            {
                new UmbrellaTabViewModel
                {
                    Id = "top-down",
                    Title = _localizer["Tab_TopDown"].Value,
                    Description = "Quick OSR Potential Estimate",
                    Icon = "bi bi-arrow-down-circle",
                    IsActive = true,
                    HasStepper = false,
                    SubTabs = new List<TabViewModel>
                    {
                        new TabViewModel
                        {
                            Id = "potential-estimates",
                            Title = "Quick OSR Potential Estimate",
                            IsActive = true,
                            IsVisited = true,
                            ContentPartialName = "_PotentialEstimates"
                        }
                    }
                },
                new UmbrellaTabViewModel
                {
                    Id = "bottom-up",
                    Title = _localizer["Tab_BottomUp"].Value,
                    Description = "Detailed 4-Step Pipeline",
                    Icon = "bi bi-arrow-up-circle",
                    IsActive = false,
                    HasStepper = true,
                    SubTabs = bottomUpSubTabs
                }
            };

            tabsViewModel.UmbrellaTabs = umbrellaTabs;
            tabsViewModel.ActiveUmbrellaTabId = "top-down";
            tabsViewModel.ActiveSubTabId = "potential-estimates";

            // Also populate legacy Tabs for backward compatibility
            var allTabs = new List<TabViewModel>
            {
                new TabViewModel
                {
                    Id = "potential-estimates",
                    Title = "Potential Estimates",
                    IsActive = true,
                    IsVisited = true,
                    ContentPartialName = "_PotentialEstimates"
                }
            };
            allTabs.AddRange(bottomUpSubTabs);
            tabsViewModel.Tabs = allTabs;

            return View("Index", tabsViewModel);
        }
        
        [HttpPost]
        public IActionResult ExportAnalysis(RosraFormViewModel formData)
        {
            // Save form data to session
            SaveFormDataToSession(formData);

            // In a real application, we would generate a PDF or Excel file here
            // For now, we'll just redirect back with a success message

            TempData["SuccessMessage"] = _localizer["Msg_ExportSuccess"].Value;

            return RedirectToAction("Index");
        }

        /// <summary>
        /// Export analysis report as PDF
        /// </summary>
        [HttpPost]
        public IActionResult ExportPdf(RosraFormViewModel formData)
        {
            try
            {
                // Save current form data to session, then merge
                if (formData != null && !string.IsNullOrEmpty(formData.Country))
                {
                    SaveFormDataToSession(formData);
                }
                var sessionData = GetFormDataFromSession();
                if (sessionData == null)
                {
                    TempData["ErrorMessage"] = _localizer["Msg_NoAnalysisData"].Value;
                    return RedirectToAction("Index");
                }
                // Preserve chart images from form POST (not stored in session)
                if (formData != null && !string.IsNullOrEmpty(formData.ChartImagesData))
                {
                    sessionData.ChartImagesData = formData.ChartImagesData;
                }

                // Generate PDF using the ReportExportService
                var pdfBytes = _pdfExportService.GeneratePdfReport(sessionData, sessionData.Title ?? "ROSRA Analysis Report");

                // Generate filename with timestamp
                var filename = $"ROSRA_Report_{formData.City ?? "Analysis"}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";

                // Return the PDF file
                return File(pdfBytes, "application/pdf", filename);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating PDF report");
                TempData["ErrorMessage"] = _localizer["Msg_PdfError"].Value;
                return RedirectToAction("Index");
            }
        }

        /// <summary>
        /// Generates a PDF from the Top-Down print view and returns it as a file download.
        /// Headless Chromium navigates to the actual print page, so all CSS/images/charts render properly.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> PrintTopDown()
        {
            var data = GetFormDataFromSession();
            if (data == null)
                return Json(new { success = false, message = "No analysis data found. Please fill in the form first." });

            try
            {
                var pdfBytes = await _htmlToPdfService.RenderUrlToPdf("/Rosra/PrintTopDownView", HttpContext);
                var filename = $"ROSRA_TopDown_{data.Country ?? "Analysis"}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";
                return File(pdfBytes, "application/pdf", filename);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating Top-Down PDF");
                return Json(new { success = false, message = "Failed to generate PDF. Please try again." });
            }
        }

        /// <summary>
        /// Internal HTML view for Playwright to navigate to (not exposed to users).
        /// </summary>
        [HttpGet]
        public IActionResult PrintTopDownView()
        {
            var data = GetFormDataFromSession();
            if (data == null) return NotFound();
            return View("PrintTopDown", data);
        }

        /// <summary>
        /// Generates a PDF from the Full Report print view and returns it as a file download.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> PrintFullReport()
        {
            var data = GetFormDataFromSession();
            if (data == null)
                return Json(new { success = false, message = "No analysis data found. Please fill in the form first." });

            try
            {
                var pdfBytes = await _htmlToPdfService.RenderUrlToPdf("/Rosra/PrintFullReportView", HttpContext);
                var filename = $"ROSRA_FullReport_{data.Country ?? "Analysis"}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";
                return File(pdfBytes, "application/pdf", filename);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating Full Report PDF");
                return Json(new { success = false, message = "Failed to generate PDF. Please try again." });
            }
        }

        /// <summary>
        /// Internal HTML view for Playwright to navigate to.
        /// </summary>
        [HttpGet]
        public IActionResult PrintFullReportView()
        {
            var data = GetFormDataFromSession();
            if (data == null) return NotFound();
            return View("PrintFullReport", data);
        }

        /// <summary>
        /// Generates a PDF from the Bottom-Up print view and returns it as a file download.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> PrintBottomUp()
        {
            var data = GetFormDataFromSession();
            if (data == null)
                return Json(new { success = false, message = "No analysis data found. Please fill in the form first." });

            try
            {
                var pdfBytes = await _htmlToPdfService.RenderUrlToPdf("/Rosra/PrintBottomUpView", HttpContext);
                var filename = $"ROSRA_BottomUp_{data.Country ?? "Analysis"}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";
                return File(pdfBytes, "application/pdf", filename);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating Bottom-Up PDF");
                return Json(new { success = false, message = "Failed to generate PDF. Please try again." });
            }
        }

        /// <summary>
        /// Internal HTML view for Playwright to navigate to.
        /// </summary>
        [HttpGet]
        public IActionResult PrintBottomUpView()
        {
            var data = GetFormDataFromSession();
            if (data == null) return NotFound();
            return View("PrintBottomUp", data);
        }

        /// <summary>
        /// Export Top-Down Analysis only as a standalone PDF
        /// </summary>
        [HttpPost]
        public IActionResult ExportTopDownPdf(RosraFormViewModel formData)
        {
            try
            {
                if (formData != null && !string.IsNullOrEmpty(formData.Country))
                {
                    SaveFormDataToSession(formData);
                }
                var sessionData = GetFormDataFromSession();
                if (sessionData == null)
                {
                    TempData["ErrorMessage"] = _localizer["Msg_NoAnalysisData"].Value;
                    return RedirectToAction("Index");
                }
                // Preserve POST data that may be fresher than session
                if (formData != null)
                {
                    if (!string.IsNullOrEmpty(formData.ChartImagesData))
                        sessionData.ChartImagesData = formData.ChartImagesData;
                    if (!string.IsNullOrEmpty(formData.PeerSNGData))
                        sessionData.PeerSNGData = formData.PeerSNGData;
                    if (!string.IsNullOrEmpty(formData.PrioritizationData))
                        sessionData.PrioritizationData = formData.PrioritizationData;
                }

                _logger.LogInformation("ExportTopDownPdf: PeerSNGData length = {Length}", sessionData.PeerSNGData?.Length ?? 0);

                var pdfBytes = _pdfExportService.GenerateTopDownPdf(sessionData);
                var filename = $"ROSRA_TopDown_{sessionData.Country ?? "Analysis"}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";
                return File(pdfBytes, "application/pdf", filename);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating Top-Down PDF report");
                TempData["ErrorMessage"] = _localizer["Msg_PdfError"].Value;
                return RedirectToAction("Index");
            }
        }

        /// <summary>
        /// Export analysis report as Excel (placeholder for future implementation)
        /// </summary>
        [HttpPost]
        public IActionResult ExportExcel(RosraFormViewModel formData)
        {
            try
            {
                // Save current form data to session, then merge
                if (formData != null && !string.IsNullOrEmpty(formData.Country))
                {
                    SaveFormDataToSession(formData);
                }
                var sessionData = GetFormDataFromSession();
                if (sessionData == null)
                {
                    TempData["ErrorMessage"] = _localizer["Msg_NoAnalysisData"].Value;
                    return RedirectToAction("Index");
                }

                // Generate Excel using the ExcelExportService
                var excelBytes = _excelExportService.GenerateExcelReport(sessionData, sessionData.Title ?? "ROSRA Analysis Report");
                var filename = $"ROSRA_Report_{sessionData.City ?? "Analysis"}_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
                return File(excelBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating Excel report");
                TempData["ErrorMessage"] = _localizer["Msg_ExcelError"].Value;
                return RedirectToAction("Index");
            }
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
        
        // Session serialization options — include ALL properties (no WhenWritingNull)
        private static readonly JsonSerializerOptions _sessionJsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = null,
            PropertyNameCaseInsensitive = true,
            IncludeFields = true,
            WriteIndented = false
        };

        private RosraFormViewModel? GetFormDataFromSession()
        {
            var formDataJson = HttpContext.Session.GetString(RosraFormDataKey);
            if (string.IsNullOrEmpty(formDataJson))
            {
                return null;
            }
            return JsonSerializer.Deserialize<RosraFormViewModel>(formDataJson, _sessionJsonOptions);
        }

        private void SaveFormDataToSession(RosraFormViewModel formData)
        {
            var formDataJson = JsonSerializer.Serialize(formData, _sessionJsonOptions);
            HttpContext.Session.SetString(RosraFormDataKey, formDataJson);
        }
        
        // Validate JSON string fields before saving to database
        private static string MapCurrencyNameToSymbol(string currencyName)
        {
            if (string.IsNullOrEmpty(currencyName)) return "";

            var name = currencyName.Trim().ToLower();
            // Common currency name → symbol/code mappings
            var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "kenyan shilling", "KSh" }, { "kenya shilling", "KSh" },
                { "us dollar", "$" }, { "united states dollar", "$" },
                { "euro", "\u20ac" }, { "pound sterling", "\u00a3" }, { "british pound", "\u00a3" },
                { "japanese yen", "\u00a5" }, { "chinese yuan", "\u00a5" },
                { "indian rupee", "\u20b9" }, { "pakistani rupee", "Rs" },
                { "south african rand", "R" }, { "nigerian naira", "\u20a6" },
                { "ghanaian cedi", "GH\u20b5" }, { "tanzanian shilling", "TSh" },
                { "ugandan shilling", "USh" }, { "rwandan franc", "RF" },
                { "ethiopian birr", "Br" }, { "egyptian pound", "E\u00a3" },
                { "moroccan dirham", "MAD" }, { "algerian dinar", "DA" },
                { "west african cfa franc", "CFA" }, { "central african cfa franc", "FCFA" },
                { "brazilian real", "R$" }, { "mexican peso", "MX$" },
                { "colombian peso", "COL$" }, { "argentine peso", "AR$" },
                { "chilean peso", "CLP$" }, { "peruvian sol", "S/" },
                { "canadian dollar", "CA$" }, { "australian dollar", "A$" },
                { "new zealand dollar", "NZ$" }, { "singapore dollar", "S$" },
                { "malaysian ringgit", "RM" }, { "thai baht", "\u0e3f" },
                { "indonesian rupiah", "Rp" }, { "philippine peso", "\u20b1" },
                { "vietnamese dong", "\u20ab" }, { "bangladeshi taka", "\u09f3" },
                { "sri lankan rupee", "Rs" }, { "nepalese rupee", "NRs" },
                { "saudi riyal", "SAR" }, { "uae dirham", "AED" },
                { "turkish lira", "\u20ba" }, { "russian ruble", "\u20bd" },
                { "ukrainian hryvnia", "\u20b4" }, { "polish zloty", "z\u0142" },
                { "swiss franc", "CHF" }, { "swedish krona", "SEK" },
                { "norwegian krone", "NOK" }, { "danish krone", "DKK" },
                { "zambian kwacha", "ZK" }, { "malawian kwacha", "MK" },
                { "mozambican metical", "MT" }, { "botswana pula", "P" },
                { "namibian dollar", "N$" }
            };

            // Try exact match first
            foreach (var entry in map)
            {
                if (name.Contains(entry.Key.ToLower()))
                    return entry.Value;
            }

            // Fallback: use ISO-style 3-letter code from first letters
            var words = currencyName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (words.Length >= 2)
            {
                // e.g., "Kenyan Shilling" → "KSh" (first letter of each word)
                return string.Concat(words.Select(w => char.ToUpper(w[0])));
            }

            return words.Length > 0 && words[0].Length <= 4 ? words[0] : words[0].Substring(0, 3);
        }

        private static bool ValidateJsonField(string? jsonValue, int maxSizeBytes = 1_048_576)
        {
            if (string.IsNullOrEmpty(jsonValue)) return true;

            if (System.Text.Encoding.UTF8.GetByteCount(jsonValue) > maxSizeBytes)
                return false;

            try
            {
                System.Text.Json.JsonDocument.Parse(jsonValue);
                return true;
            }
            catch
            {
                return false;
            }
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
                    // New ROSRA fields
                    RegisteredProperties = propertyTax.RegisteredProperties,
                    NonRegisteredProperties = propertyTax.NonRegisteredProperties,
                    CompliantProperties = propertyTax.CompliantProperties,
                    TotalFiscalBase = propertyTax.TotalFiscalBase,
                    TotalMarketValue = propertyTax.TotalMarketValue,
                    BilledAmount = propertyTax.BilledAmount,
                    OutstandingAmount = propertyTax.OutstandingAmount,
                    RevenueToDate = propertyTax.RevenueToDate,
                    // Legacy fields for backward compatibility
                    TotalPropertyTaxPayers = propertyTax.TotalPropertyTaxPayers,
                    RegisteredPropertyTaxPayers = propertyTax.RegisteredPropertyTaxPayers,
                    Description = propertyTax.Description,
                    Notes = propertyTax.Notes,
                    CurrentValue = propertyTax.CurrentValue,
                    PotentialValue = propertyTax.PotentialValue,
                    Gap = propertyTax.Gap,
                    // Include standard category fields (legacy)
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
                        // New ROSRA fields
                        RegisteredProperties = propertyTax.RegisteredProperties,
                        NonRegisteredProperties = propertyTax.NonRegisteredProperties,
                        CompliantProperties = propertyTax.CompliantProperties,
                        TotalFiscalBase = propertyTax.TotalFiscalBase,
                        TotalMarketValue = propertyTax.TotalMarketValue,
                        BilledAmount = propertyTax.BilledAmount,
                        OutstandingAmount = propertyTax.OutstandingAmount,
                        RevenueToDate = propertyTax.RevenueToDate,
                        // Legacy fields
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

        [HttpGet]
        public async Task<IActionResult> GetTopOsrConfig(int reportId)
        {
            try
            {
                // Get the current user
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized();
                }
                
                // Get the report
                var report = await _context.RosraReports.FirstOrDefaultAsync(r => r.Id == reportId);
                if (report == null)
                {
                    return NotFound();
                }
                
                // Check if the report belongs to the current user
                if (report.UserId != user.Id)
                {
                    return Forbid();
                }
                
                // Check if the report has Top OSR Configuration data
                if (string.IsNullOrEmpty(report.TopOsrConfigData))
                {
                    return Json(new { success = false, message = "No OSR configuration data found" });
                }
                
                // Deserialize the data
                var topOsrConfig = JsonSerializer.Deserialize<List<TopOsrViewModel>>(report.TopOsrConfigData, _jsonOptions);
                
                // Return the data as JSON
                return Json(new { 
                    success = true, 
                    topOsrConfig = topOsrConfig,
                    otherRevenue = 0 // We need to add OtherRevenue to the report model in a future update
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving Top OSR Configuration data");
                return Json(new { success = false, message = "Error retrieving OSR configuration data" });
            }
        }

        /// <summary>
        /// Get all distinct countries from the Country table with additional data from DB_Countries
        /// </summary>
        [HttpGet]
        [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("api")]
        public async Task<IActionResult> GetCountries()
        {
            try
            {
                const string cacheKey = "countries_list";
                if (_cache.TryGetValue(cacheKey, out object? cached) && cached != null)
                {
                    return Json(cached);
                }

                // Primary source: DB_Countries has currency, income level, government type
                var dbCountries = await _context.DB_Countries
                    .Where(cd => cd.Country != null)
                    .Select(cd => new {
                        name = cd.Country,
                        currencyCode = cd.CurrencyCode,
                        currencySymbol = cd.CurrencySymbol,
                        governmentType = cd.Government_Type,
                        incomeLevel = cd.Income_Level
                    })
                    .OrderBy(cd => cd.name)
                    .ToListAsync();

                // Also get any countries from the Country table that might not be in DB_Countries
                var countryTableNames = await _context.Countries
                    .Where(c => c.Name != null)
                    .Select(c => c.Name!)
                    .Distinct()
                    .ToListAsync();

                // Build result: DB_Countries is authoritative, supplement with Country table entries
                var dbNames = new HashSet<string>(dbCountries.Select(c => c.name!), StringComparer.OrdinalIgnoreCase);
                var result = dbCountries.Select(c => new {
                    name = c.name,
                    currency = c.currencyCode ?? "",
                    currencySymbol = !string.IsNullOrEmpty(c.currencySymbol) ? c.currencySymbol
                                   : !string.IsNullOrEmpty(c.currencyCode) ? c.currencyCode
                                   : "",
                    governmentType = c.governmentType ?? "",
                    incomeLevel = c.incomeLevel ?? ""
                }).ToList();

                // Add any countries from Country table not in DB_Countries (with no fiscal data)
                foreach (var name in countryTableNames.Where(n => !dbNames.Contains(n)).OrderBy(n => n))
                {
                    result.Add(new { name = name, currency = "", currencySymbol = "", governmentType = "", incomeLevel = "" });
                }

                result = result.OrderBy(r => r.name).ToList();

                _cache.Set(cacheKey, result, TimeSpan.FromHours(24));
                return Json(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving countries");
                return Json(new List<object>());
            }
        }

        /// <summary>
        /// Get all states/regions for a specific country
        /// </summary>
        [HttpGet]
        [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("api")]
        public async Task<IActionResult> GetStatesByCountry(string country)
        {
            try
            {
                if (string.IsNullOrEmpty(country))
                {
                    return Json(new List<object>());
                }

                var cacheKey = $"states_{country.ToLower()}";
                if (_cache.TryGetValue(cacheKey, out object? cached) && cached != null)
                {
                    return Json(cached);
                }

                var states = await _context.Countries
                    .Where(c => c.Name == country && c.StateName != null)
                    .Select(c => new {
                        code = c.StateCode ?? c.StateName,
                        name = c.StateName
                    })
                    .Distinct()
                    .OrderBy(s => s.name)
                    .ToListAsync();

                _cache.Set(cacheKey, states, TimeSpan.FromHours(24));
                return Json(states);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving states for country: {Country}", country);
                return Json(new List<object>());
            }
        }

        /// <summary>
        /// Get Frontier Analysis data for a specific country
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetFrontierAnalysis(string country)
        {
            try
            {
                if (string.IsNullOrEmpty(country))
                {
                    return Json(new { success = false, message = "Country is required" });
                }

                // Get country data from DB_Countries
                var countryData = await _context.DB_Countries
                    .FirstOrDefaultAsync(c => c.Country.ToLower() == country.ToLower());

                if (countryData == null)
                {
                    return Json(new { success = false, message = "Country not found in database" });
                }

                // Get peer benchmark based on income level and government type
                var incomeLevel = countryData.Income_Level?.ToLower() ?? "";
                var govType = countryData.Government_Type?.ToLower() ?? "";

                // Normalize income level to match DB_Frontiers format
                // DB_Countries has "Lower middle income", DB_Frontiers has "Lower-middle"
                string normalizedIncomeLevel = incomeLevel
                    .Replace("lower middle income", "lower-middle")
                    .Replace("upper middle income", "upper-middle")
                    .Replace("high income", "high")
                    .Replace("low income", "low");

                _logger.LogInformation("Looking for frontier: IncomeLevel={IncomeLevel}, Normalized={Normalized}, GovType={GovType}",
                    incomeLevel, normalizedIncomeLevel, govType);

                // Determine if federal or unitary
                bool isFederal = govType == "federal";

                // Try to find specific benchmark for federal if applicable
                Frontier? frontier = null;
                if (isFederal)
                {
                    frontier = await _context.DB_Frontiers
                        .FirstOrDefaultAsync(f => f.Income_Level.ToLower() == normalizedIncomeLevel &&
                                                  f.Government_Type != null &&
                                                  f.Government_Type.ToLower() == "federal");
                }

                // If no federal match or not federal, get unitary benchmark
                if (frontier == null)
                {
                    frontier = await _context.DB_Frontiers
                        .FirstOrDefaultAsync(f => f.Income_Level.ToLower() == normalizedIncomeLevel &&
                                                  (f.Government_Type == null ||
                                                   f.Government_Type.ToLower() == "unitary" ||
                                                   f.Government_Type == ""));
                }

                // Log if frontier not found
                if (frontier == null)
                {
                    _logger.LogWarning("No frontier found for IncomeLevel={IncomeLevel}, GovType={GovType}", normalizedIncomeLevel, govType);
                }

                // Calculate frontier metrics
                decimal sngRevenuePerCapita = countryData.SNG_total_rev_pc_usd ?? 0;
                decimal peerBenchmarkFunding = frontier?.SNG_total_rev_pc_frontier ?? 0;
                decimal fundingIndex = peerBenchmarkFunding > 0 ? (sngRevenuePerCapita / peerBenchmarkFunding) * 100 : 0;
                decimal fundingHeadroom = peerBenchmarkFunding - sngRevenuePerCapita;

                decimal nonGrantsShare = (countryData.Revenue_Autonomy ?? 0) * 100; // Convert to percentage
                decimal peerBenchmarkAutonomy = (frontier?.Revenue_Autonomy_frontier ?? 0) * 100;
                decimal autonomyIndex = peerBenchmarkAutonomy > 0 ? (nonGrantsShare / peerBenchmarkAutonomy) * 100 : 0;
                decimal distanceFromBenchmark = Math.Abs(nonGrantsShare - peerBenchmarkAutonomy);

                // Determine position relative to benchmark
                string positionRelative = "";
                if (nonGrantsShare > peerBenchmarkAutonomy)
                {
                    positionRelative = $"Above frontier by {(nonGrantsShare - peerBenchmarkAutonomy):F0}% (more autonomous)";
                }
                else if (nonGrantsShare < peerBenchmarkAutonomy)
                {
                    positionRelative = $"Below frontier by {(peerBenchmarkAutonomy - nonGrantsShare):F0}% (more grant-dependent)";
                }
                else
                {
                    positionRelative = "At the frontier (same as peer benchmark)";
                }

                return Json(new
                {
                    success = true,
                    country = countryData.Country,
                    incomeLevel = countryData.Income_Level,
                    governmentType = countryData.Government_Type,
                    frontier1 = new
                    {
                        sngRevenuePerCapita = Math.Round(sngRevenuePerCapita, 0),
                        peerBenchmark = Math.Round(peerBenchmarkFunding, 0),
                        fundingIndex = Math.Round(fundingIndex, 0),
                        fundingHeadroom = Math.Round(fundingHeadroom, 0)
                    },
                    frontier2 = new
                    {
                        nonGrantsShare = Math.Round(nonGrantsShare, 0),
                        peerBenchmark = Math.Round(peerBenchmarkAutonomy, 0),
                        autonomyIndex = Math.Round(autonomyIndex, 0),
                        distanceFromBenchmark = Math.Round(distanceFromBenchmark, 0),
                        positionRelative = positionRelative
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving frontier analysis for country: {Country}", country);
                return Json(new { success = false, message = "Error retrieving frontier analysis data" });
            }
        }

        /// <summary>
        /// Get list of Peer SNGs for dropdown, optionally filtered by country code
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetPeerSNGs(string countryCode = null)
        {
            try
            {
                // Try to use CountryCode column if it exists (after migration)
                try
                {
                    var query = _context.Peers_SNG.AsQueryable();

                    // Filter by country code if provided, otherwise return all (default Kenya for backward compatibility)
                    if (!string.IsNullOrEmpty(countryCode))
                    {
                        query = query.Where(p => p.CountryCode == countryCode);
                    }

                    var peers = await query
                        .OrderBy(p => p.SNG)
                        .Select(p => new { name = p.SNG, countryCode = p.CountryCode })
                        .ToListAsync();

                    return Json(peers);
                }
                catch (Microsoft.Data.SqlClient.SqlException sqlEx) when (sqlEx.Message.Contains("Invalid column name 'CountryCode'"))
                {
                    // Fallback for databases that don't have CountryCode column yet
                    // Return all peer SNGs (assumed to be Kenya data) for Kenya requests
                    _logger.LogWarning("CountryCode column not found in Peers_SNG table. Please run database migration. Falling back to returning all peers for Kenya.");

                    if (string.IsNullOrEmpty(countryCode) || countryCode == "KEN")
                    {
                        var peers = await _context.Peers_SNG
                            .OrderBy(p => p.SNG)
                            .Select(p => new { name = p.SNG, countryCode = "KEN" })
                            .ToListAsync();
                        return Json(peers);
                    }
                    else
                    {
                        // For non-Kenya countries, return empty list (no data available yet)
                        return Json(new List<object>());
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving peer SNGs for country: {CountryCode}", countryCode);
                return Json(new List<object>());
            }
        }

        /// <summary>
        /// Upload Peer SNG data from CSV for non-Kenya countries
        /// Format: SNG,OSR,GCP,Population,Include or SNG,OSR,GCP (legacy)
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> UploadPeerSNGs([FromForm] IFormFile file, [FromForm] string countryCode)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return Json(new { success = false, message = "No file uploaded" });
                }

                if (string.IsNullOrEmpty(countryCode) || countryCode.Length != 3)
                {
                    return Json(new { success = false, message = "Valid 3-letter country code is required" });
                }

                var peers = new List<PeerSNG>();
                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    int lineNumber = 0;
                    while (!reader.EndOfStream)
                    {
                        var line = await reader.ReadLineAsync();
                        lineNumber++;

                        if (string.IsNullOrWhiteSpace(line)) continue;

                        var values = line.Split(',');

                        // Skip header row if present
                        if (lineNumber == 1 && (values[0].Trim().ToUpper() == "SNG" || values[0].Trim().ToUpper() == "NAME"))
                        {
                            continue;
                        }

                        if (values.Length < 3)
                        {
                            return Json(new { success = false, message = $"Invalid format at line {lineNumber}. Expected: SNG,OSR,GCP,Population,Include" });
                        }

                        if (!decimal.TryParse(values[1].Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out var osr) ||
                            !decimal.TryParse(values[2].Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out var gcp))
                        {
                            return Json(new { success = false, message = $"Invalid numeric values at line {lineNumber}" });
                        }

                        var peer = new PeerSNG
                        {
                            CountryCode = countryCode.ToUpper(),
                            SNG = values[0].Trim(),
                            OSR = osr,
                            GCP = gcp,
                            Include = true
                        };

                        // Parse Population and Include if available (5-column format)
                        if (values.Length >= 5)
                        {
                            peer.Population = long.TryParse(values[3].Trim(), out var pop) ? pop : 0;
                            peer.Include = values[4].Trim() == "1" || values[4].Trim().ToLower() == "true";
                        }
                        else if (values.Length >= 4)
                        {
                            // Legacy 4-column: SNG,OSR,GCP,Include
                            peer.Include = values[3].Trim() == "1" || values[3].Trim().ToLower() == "true";
                        }

                        peers.Add(peer);
                    }
                }

                if (!peers.Any())
                {
                    return Json(new { success = false, message = "No valid peer data found in file" });
                }

                // Remove existing peers for this country (except Kenya default data)
                var existingPeers = await _context.Peers_SNG
                    .Where(p => p.CountryCode == countryCode.ToUpper())
                    .ToListAsync();

                if (existingPeers.Any())
                {
                    _context.Peers_SNG.RemoveRange(existingPeers);
                }

                // Add new peers
                await _context.Peers_SNG.AddRangeAsync(peers);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = $"Successfully uploaded {peers.Count} peer SNGs for {countryCode}", count = peers.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading peer SNGs");
                return Json(new { success = false, message = "Error uploading peer data: " + ex.Message });
            }
        }

        /// <summary>
        /// Validate peer SNG data for client-side storage (no database write)
        /// Data will be saved with the report in RosraReport.PeerSNGData
        /// </summary>
        [HttpPost]
        public IActionResult SavePeerSNGs([FromBody] SavePeerSNGsRequest request)
        {
            try
            {
                if (request == null || request.Peers == null || !request.Peers.Any())
                {
                    return Json(new { success = false, message = "No peer data provided" });
                }

                if (string.IsNullOrEmpty(request.CountryCode) || request.CountryCode.Length != 3)
                {
                    return Json(new { success = false, message = "Valid 3-letter country code is required" });
                }

                var countryCode = request.CountryCode.ToUpper();

                // Validate and transform peers (no database write - data stored per-report)
                var validatedPeers = request.Peers
                    .Where(p => !string.IsNullOrWhiteSpace(p.SNG))
                    .Select(p => new
                    {
                        sng = p.SNG.Trim(),
                        osr = p.OSR,
                        gcp = p.GCP,
                        include = true,
                        mult = p.GCP > 0 ? Math.Round(p.OSR / p.GCP, 10) : 0
                    })
                    .ToList();

                if (!validatedPeers.Any())
                {
                    return Json(new { success = false, message = "No valid peer data found after validation" });
                }

                // Return validated data for client-side storage
                return Json(new {
                    success = true,
                    message = $"Data validated ({validatedPeers.Count} peers). Will be saved with report.",
                    peers = validatedPeers,
                    countryCode = countryCode,
                    count = validatedPeers.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating peer SNGs");
                return Json(new { success = false, message = "Error validating peer data: " + ex.Message });
            }
        }

        public class SavePeerSNGsRequest
        {
            public string CountryCode { get; set; }
            public List<PeerSNGInput> Peers { get; set; }
        }

        public class PeerSNGInput
        {
            public string SNG { get; set; }
            public decimal OSR { get; set; }
            public decimal GCP { get; set; }
        }

        /// <summary>
        /// Request model for Peer SNG Analysis with optional custom peers
        /// </summary>
        public class PeerAnalysisRequest
        {
            public string Sng { get; set; }
            public string CountryCode { get; set; }
            public List<CustomPeerInput> CustomPeers { get; set; }
        }

        public class CustomPeerInput
        {
            public string Sng { get; set; }
            public decimal Osr { get; set; }
            public decimal Gcp { get; set; }
            public long Population { get; set; }
            public bool Include { get; set; } = true;
        }

        /// <summary>
        /// Get Peer SNG Frontier Analysis (Module 2: Within-Country OSR Frontier)
        /// Supports both GET (for reference data) and POST (for custom peers)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetPeerSNGAnalysis(string sng, string countryCode = null)
        {
            return await PerformPeerSNGAnalysis(sng, countryCode, null);
        }

        /// <summary>
        /// Get Peer SNG Frontier Analysis with custom peers (POST version)
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GetPeerSNGAnalysisWithCustomPeers([FromBody] PeerAnalysisRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Sng))
            {
                return Json(new { success = false, message = "Subnational Government is required" });
            }
            return await PerformPeerSNGAnalysis(request.Sng, request.CountryCode, request.CustomPeers);
        }

        /// <summary>
        /// Internal method to perform peer SNG analysis
        /// </summary>
        private async Task<IActionResult> PerformPeerSNGAnalysis(string sng, string countryCode, List<CustomPeerInput> customPeers)
        {
            try
            {
                if (string.IsNullOrEmpty(sng))
                {
                    return Json(new { success = false, message = "Subnational Government is required" });
                }

                List<PeerSNG> allPeers;
                bool usingCustomData = false;

                // Use custom peers if provided, otherwise fetch from database
                if (customPeers != null && customPeers.Any())
                {
                    usingCustomData = true;
                    allPeers = customPeers.Select(p => new PeerSNG
                    {
                        CountryCode = countryCode ?? "CUSTOM",
                        SNG = p.Sng,
                        OSR = p.Osr,
                        GCP = p.Gcp,
                        Population = p.Population,
                        Include = p.Include
                    }).ToList();
                    _logger.LogInformation("Using custom peer data: {Count} peers", allPeers.Count);
                }
                else
                {
                    // Get reference data from database
                    if (!string.IsNullOrEmpty(countryCode))
                    {
                        allPeers = await _context.Peers_SNG
                            .Where(p => p.CountryCode == countryCode.ToUpper())
                            .ToListAsync();
                    }
                    else
                    {
                        allPeers = await _context.Peers_SNG.ToListAsync();
                    }
                    _logger.LogInformation("Using reference data: {Count} peers for country {Country}", allPeers.Count, countryCode ?? "ALL");
                }

                if (allPeers == null || !allPeers.Any())
                {
                    return Json(new { success = false, message = "No peer data available" });
                }

                // Get selected SNG data
                var selectedPeer = allPeers.FirstOrDefault(p => p.SNG.ToLower() == sng.ToLower());

                if (selectedPeer == null)
                {
                    return Json(new { success = false, message = "Subnational Government not found" });
                }

                // Get OSR and GDP for the selected SNG
                decimal actualOSR = selectedPeer.OSR;
                decimal subnationalGDP = selectedPeer.GCP;

                // Calculate multipliers for all included peers
                // First try with Include flag, if no results, use all peers with valid data
                var validMultipliers = allPeers
                    .Where(p => p.Include && p.GCP > 0 && p.OSR > 0)
                    .Select(p => p.OSR / p.GCP)
                    .OrderByDescending(m => m)
                    .ToList();

                // Fallback: if no peers with Include=true, use all peers with valid GCP and OSR
                if (!validMultipliers.Any())
                {
                    _logger.LogWarning("No peers with Include=true found, using all peers with valid data");
                    validMultipliers = allPeers
                        .Where(p => p.GCP > 0 && p.OSR > 0)
                        .Select(p => p.OSR / p.GCP)
                        .OrderByDescending(m => m)
                        .ToList();
                }

                if (!validMultipliers.Any())
                {
                    return Json(new { success = false, message = $"No valid peer data for frontier calculation. Total peers: {allPeers.Count}, With GCP>0: {allPeers.Count(p => p.GCP > 0)}, With OSR>0: {allPeers.Count(p => p.OSR > 0)}" });
                }

                // Calculate 90th percentile threshold (matches Excel PERCENTILE.INC formula)
                // Excel formula: PERCENTILE.INC(multipliers, 0.9) then AVERAGE(FILTER(m, m >= threshold))
                int validPeersCount = validMultipliers.Count;
                var sortedAscForPercentile = validMultipliers.OrderBy(x => x).ToList();

                // PERCENTILE.INC calculation: position = k * (n - 1)
                double percentileIndex = 0.9 * (sortedAscForPercentile.Count - 1);
                int lowerIdx = (int)Math.Floor(percentileIndex);
                int upperIdx = (int)Math.Ceiling(percentileIndex);
                decimal percentile90Threshold;
                if (lowerIdx == upperIdx || upperIdx >= sortedAscForPercentile.Count)
                    percentile90Threshold = sortedAscForPercentile[lowerIdx];
                else
                    percentile90Threshold = sortedAscForPercentile[lowerIdx] +
                        (sortedAscForPercentile[upperIdx] - sortedAscForPercentile[lowerIdx]) *
                        ((decimal)percentileIndex - lowerIdx);

                // Peer frontier multiplier = average of all multipliers >= 90th percentile
                var topMultipliers = validMultipliers.Where(m => m >= percentile90Threshold).ToList();
                decimal peerFrontierMultiplier = topMultipliers.Any() ? topMultipliers.Average() : validMultipliers.First();
                int top10Count = topMultipliers.Count; // For display purposes

                // Calculate 80th percentile threshold (for display/comparison)
                decimal percentile80Threshold = 0;
                if (validMultipliers.Count > 0)
                {
                    var sortedAsc = validMultipliers.OrderBy(x => x).ToList();
                    double index = 0.8 * (sortedAsc.Count - 1);
                    int lower = (int)Math.Floor(index);
                    int upper = (int)Math.Ceiling(index);
                    if (lower == upper)
                        percentile80Threshold = sortedAsc[lower];
                    else
                        percentile80Threshold = sortedAsc[lower] + (sortedAsc[upper] - sortedAsc[lower]) * ((decimal)index - lower);
                }

                // Subject multiplier (OSR/GDP for selected SNG)
                decimal subjectMultiplier = subnationalGDP > 0 ? actualOSR / subnationalGDP : 0;

                // OSR potential (frontier multiplier × GDP)
                decimal osrPotential = peerFrontierMultiplier * subnationalGDP;

                // Performance Index (actual OSR / OSR potential)
                decimal performanceIndex = osrPotential > 0 ? actualOSR / osrPotential : 0;

                // OSR Gap (potential - actual, minimum 0)
                decimal osrGap = Math.Max(0, osrPotential - actualOSR);

                // Per capita diagnostics (secondary metrics)
                long selectedPopulation = selectedPeer.Population;
                decimal osrPerCapita = selectedPopulation > 0 ? actualOSR / selectedPopulation : 0;
                decimal potentialOSRPerCapita = selectedPopulation > 0 ? osrPotential / selectedPopulation : 0;
                decimal perCapitaGap = Math.Max(0, potentialOSRPerCapita - osrPerCapita);

                // Prepare peer data for scatter chart (use same logic - fallback if no Include=true)
                var includedPeers = allPeers.Where(p => p.Include && p.GCP > 0).ToList();
                if (!includedPeers.Any())
                {
                    includedPeers = allPeers.Where(p => p.GCP > 0).ToList();
                }

                // Calculate helper values for the modal
                var validPeersWithGCP = allPeers.Where(p => (p.Include || !allPeers.Any(x => x.Include)) && p.GCP > 0 && p.OSR > 0).ToList();
                decimal minGDP = validPeersWithGCP.Any() ? validPeersWithGCP.Min(p => p.GCP) : 0;
                decimal maxGDP = validPeersWithGCP.Any() ? validPeersWithGCP.Max(p => p.GCP) : 0;
                decimal frontierYAtMinGDP = peerFrontierMultiplier * minGDP;
                decimal frontierYAtMaxGDP = peerFrontierMultiplier * maxGDP;
                int topPerformersUsed = top10Count; // Number of peers >= 90th percentile
                bool isAbove80thPercentile = subjectMultiplier >= percentile80Threshold;

                var peerChartData = includedPeers
                    .Select(p => new
                    {
                        name = p.SNG,
                        gdp = Math.Round(p.GCP, 0),
                        osr = Math.Round(p.OSR, 2),
                        population = p.Population,
                        osrPerCapita = p.Population > 0 ? Math.Round(p.OSR / p.Population, 2) : 0m,
                        isSelected = p.SNG.ToLower() == sng.ToLower()
                    })
                    .ToList();

                return Json(new
                {
                    success = true,
                    sng = selectedPeer.SNG,
                    metrics = new
                    {
                        actualOSR = Math.Round(actualOSR, 2),
                        subnationalGDP = Math.Round(subnationalGDP, 0),
                        peerFrontierMultiplier = Math.Round(peerFrontierMultiplier, 8),
                        subjectMultiplier = Math.Round(subjectMultiplier, 8),
                        osrPotential = Math.Round(osrPotential, 2),
                        performanceIndex = Math.Round(performanceIndex * 100, 1), // As percentage
                        osrGap = Math.Round(osrGap, 0),
                        population = selectedPopulation,
                        osrPerCapita = Math.Round(osrPerCapita, 2),
                        potentialOSRPerCapita = Math.Round(potentialOSRPerCapita, 2),
                        perCapitaGap = Math.Round(perCapitaGap, 2)
                    },
                    helpers = new
                    {
                        validPeersUsed = validPeersCount,
                        top10Count = top10Count, // Peers >= 90th percentile
                        frontierMultiplier = Math.Round(peerFrontierMultiplier, 8),
                        percentile80Threshold = Math.Round(percentile80Threshold, 8),
                        minGDP = Math.Round(minGDP, 0),
                        maxGDP = Math.Round(maxGDP, 0),
                        frontierYAtMinGDP = Math.Round(frontierYAtMinGDP, 2),
                        frontierYAtMaxGDP = Math.Round(frontierYAtMaxGDP, 2),
                        subjectMultiplier = Math.Round(subjectMultiplier, 8),
                        osrPotential = Math.Round(osrPotential, 2),
                        topPerformersUsed = topPerformersUsed,
                        isAbove80thPercentile = isAbove80thPercentile
                    },
                    debug = new
                    {
                        usingCustomData = usingCustomData,
                        dataSource = usingCustomData ? "custom" : "reference",
                        totalPeersInDb = allPeers.Count,
                        peersWithIncludeTrue = allPeers.Count(p => p.Include),
                        peersWithValidData = allPeers.Count(p => p.Include && p.GCP > 0 && p.OSR > 0),
                        percentile90Threshold = Math.Round(percentile90Threshold, 10),
                        topMultipliersCount = topMultipliers.Count,
                        topMultipliers = topMultipliers.Select(m => Math.Round(m, 10)).ToList(),
                        calculationSteps = new
                        {
                            step1_validMultipliersCount = validMultipliers.Count,
                            step2_percentileIndex = percentileIndex,
                            step3_percentile90Threshold = Math.Round(percentile90Threshold, 10),
                            step4_topMultipliersAvg = Math.Round(peerFrontierMultiplier, 10),
                            step5_osrPotential = $"{Math.Round(peerFrontierMultiplier, 10)} × {subnationalGDP} = {Math.Round(osrPotential, 2)}"
                        }
                    },
                    chartData = peerChartData,
                    frontierSlope = peerFrontierMultiplier, // For drawing frontier line
                    dataSource = usingCustomData ? "custom" : "reference"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving peer SNG analysis for: {SNG}", sng);
                return Json(new { success = false, message = "Error retrieving peer SNG analysis data" });
            }
        }

        /// <summary>
        /// Reset Peers_SNG table to correct Excel data
        /// Call this endpoint to fix corrupted peer data: /Rosra/ResetPeerSNGData
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> ResetPeerSNGData()
        {
            try
            {
                // Delete all existing peer data
                var existingPeers = await _context.Peers_SNG.ToListAsync();
                _context.Peers_SNG.RemoveRange(existingPeers);
                await _context.SaveChangesAsync();

                // Insert correct data — full KES values with KNBS 2025 population
                var correctPeers = new List<PeerSNG>
                {
                    new PeerSNG { CountryCode = "KEN", SNG = "Baringo", OSR = 313351637m, GCP = 75459000000m, Population = 759000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Bomet", OSR = 242395023m, GCP = 151153000000m, Population = 973000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Bungoma", OSR = 379716358m, GCP = 205542000000m, Population = 2073000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Busia", OSR = 201772364m, GCP = 88731000000m, Population = 1003000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Elgeyo/Marakwet", OSR = 217350490m, GCP = 117229000000m, Population = 509000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Embu", OSR = 383178337m, GCP = 149912000000m, Population = 671000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Garissa", OSR = 81361298m, GCP = 58634000000m, Population = 960000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Homa Bay", OSR = 491496550m, GCP = 120751000000m, Population = 1275000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Isiolo", OSR = 151805623m, GCP = 26555000000m, Population = 330000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Kajiado", OSR = 875281130m, GCP = 150709000000m, Population = 1313000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Kakamega", OSR = 1309679900m, GCP = 214365000000m, Population = 2073000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Kericho", OSR = 501354545m, GCP = 163543000000m, Population = 988000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Kiambu", OSR = 2424634382m, GCP = 554515000000m, Population = 2754000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Kilifi", OSR = 661686660m, GCP = 199953000000m, Population = 1737000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Kirinyaga", OSR = 399321046m, GCP = 123709000000m, Population = 676000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Kisii", OSR = 413988597m, GCP = 198192000000m, Population = 1370000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Kisumu", OSR = 731449033m, GCP = 247324000000m, Population = 1292000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Kitui", OSR = 464354467m, GCP = 154345000000m, Population = 1273000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Kwale", OSR = 392952872m, GCP = 119001000000m, Population = 978000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Laikipia", OSR = 504274788m, GCP = 94639000000m, Population = 583000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Lamu", OSR = 156907612m, GCP = 32747000000m, Population = 176000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Machakos", OSR = 1429791260m, GCP = 309164000000m, Population = 1518000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Makueni", OSR = 418752940m, GCP = 110207000000m, Population = 1079000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Mandera", OSR = 122528934m, GCP = 56964000000m, Population = 993000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Marsabit", OSR = 58565723m, GCP = 60486000000m, Population = 539000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Meru", OSR = 418801954m, GCP = 329977000000m, Population = 1666000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Migori", OSR = 406364909m, GCP = 120639000000m, Population = 1277000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Mombasa", OSR = 3998628848m, GCP = 468749000000m, Population = 1368000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Murang'a", OSR = 534416925m, GCP = 200539000000m, Population = 1151000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Nairobi", OSR = 10237263780m, GCP = 2682701000000m, Population = 4906000, Include = false },
                    new PeerSNG { CountryCode = "KEN", SNG = "Nakuru", OSR = 1611062682m, GCP = 483938000000m, Population = 2445000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Nandi", OSR = 200737628m, GCP = 149117000000m, Population = 985000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Narok", OSR = 3061007640m, GCP = 165462000000m, Population = 1355000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Nyamira", OSR = 113484901m, GCP = 116992000000m, Population = 681000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Nyandarua", OSR = 505913306m, GCP = 149707000000m, Population = 720000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Nyeri", OSR = 610656883m, GCP = 209626000000m, Population = 865000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Samburu", OSR = 226516961m, GCP = 29090000000m, Population = 367000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Siaya", OSR = 402229607m, GCP = 103899000000m, Population = 1097000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Taita/Taveta", OSR = 265254255m, GCP = 63592000000m, Population = 373000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Tana River", OSR = 59173171m, GCP = 29460000000m, Population = 370000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Tharaka-Nithi", OSR = 164200787m, GCP = 61461000000m, Population = 425000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Trans Nzoia", OSR = 267760051m, GCP = 165700000000m, Population = 1106000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Turkana", OSR = 177717811m, GCP = 107450000000m, Population = 1059000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Uasin Gishu", OSR = 936606563m, GCP = 227871000000m, Population = 1301000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Vihiga", OSR = 108347382m, GCP = 83773000000m, Population = 636000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "Wajir", OSR = 46746101m, GCP = 49159000000m, Population = 901000, Include = true },
                    new PeerSNG { CountryCode = "KEN", SNG = "West Pokot", OSR = 128195210m, GCP = 79417000000m, Population = 706000, Include = true }
                };

                await _context.Peers_SNG.AddRangeAsync(correctPeers);
                await _context.SaveChangesAsync();

                return Json(new
                {
                    success = true,
                    message = $"Peer SNG data reset successfully. Deleted {existingPeers.Count} old records, inserted {correctPeers.Count} correct records.",
                    deletedCount = existingPeers.Count,
                    insertedCount = correctPeers.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting peer SNG data");
                return Json(new { success = false, message = $"Error resetting peer SNG data: {ex.Message}" });
            }
        }

        /// <summary>
        /// Admin-only endpoint to save peer SNG data as global reference data
        /// Requires CanUploadPeerSNGData permission
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "CanUploadPeerSNGData")]
        public async Task<IActionResult> AdminSavePeerSNGs([FromBody] SavePeerSNGsRequest request)
        {
            try
            {
                if (request == null || request.Peers == null || !request.Peers.Any())
                {
                    return Json(new { success = false, message = "No peer data provided" });
                }

                if (string.IsNullOrEmpty(request.CountryCode) || request.CountryCode.Length != 3)
                {
                    return Json(new { success = false, message = "Valid 3-letter country code is required" });
                }

                var countryCode = request.CountryCode.ToUpper();

                // Delete existing peers for this country
                var existingPeers = await _context.Peers_SNG
                    .Where(p => p.CountryCode == countryCode)
                    .ToListAsync();

                if (existingPeers.Any())
                {
                    _context.Peers_SNG.RemoveRange(existingPeers);
                    _logger.LogInformation("Admin deleted {Count} existing peers for {Country}", existingPeers.Count, countryCode);
                }

                // Add new reference peers
                var peers = request.Peers.Select(p => new PeerSNG
                {
                    CountryCode = countryCode,
                    SNG = p.SNG,
                    OSR = p.OSR,
                    GCP = p.GCP,
                    Include = true
                }).ToList();

                await _context.Peers_SNG.AddRangeAsync(peers);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Admin saved {Count} reference peers for {Country}", peers.Count, countryCode);

                return Json(new {
                    success = true,
                    message = $"Reference data updated: {peers.Count} peer SNGs for {countryCode}",
                    count = peers.Count,
                    deletedCount = existingPeers.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AdminSavePeerSNGs");
                return Json(new { success = false, message = "Error saving reference data: " + ex.Message });
            }
        }
    }
}
