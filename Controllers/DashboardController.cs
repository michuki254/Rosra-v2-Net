using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;
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

        public async Task<IActionResult> Index()
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
            
            // Get reports for the current user
            var reports = await _context.RosraReports
                .Where(r => r.UserId == user.Id)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
            
            // Create view model
            var viewModel = new DashboardViewModel
            {
                Reports = reports.Select(RosraReportViewModel.FromRosraReport).ToList()
            };
            
            return View(viewModel);
        }
        
        public async Task<IActionResult> ViewReport(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            
            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }
            
            // Get the report
            var report = await _context.RosraReports
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
            
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
            return RedirectToAction("View", "Rosra", new { id = report.Id });
        }
    }
}
