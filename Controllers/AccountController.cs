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
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ApplicationDbContext context,
            IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _emailService = emailService;
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Organization = model.Organization,
                    PhoneNumber = model.PhoneNumber,
                    CreatedAt = System.DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    // Add the user to the User role
                    await _userManager.AddToRoleAsync(user, "User");

                    // Send welcome email
                    SendWelcomeEmail(user);

                    // Sign the user in
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return RedirectToAction("Index", "Home");
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        [HttpGet]
        public IActionResult Login(string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            if (ModelState.IsValid)
            {
                // Audit F-6: count failures toward the lockout policy configured in Program.cs
                // (5 attempts → 15 min lockout). Without lockoutOnFailure: true the policy is
                // configured but never enforced, leaving online brute-force unrestricted.
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: true);
                
                if (result.Succeeded)
                {
                    if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }
                    else
                    {
                        return RedirectToAction(nameof(HomeController.Index), "Home");
                    }
                }
                else if (result.IsLockedOut)
                {
                    ModelState.AddModelError(string.Empty, "Account temporarily locked due to too many failed sign-in attempts. Please try again in a few minutes.");
                    return View(model);
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    return View(model);
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        /// <summary>
        /// AJAX Login endpoint for modal authentication
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AjaxLogin([FromBody] LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            // Audit F-6: enforce the configured lockout policy on the AJAX login path too.
            var result = await _signInManager.PasswordSignInAsync(
                model.Email,
                model.Password,
                model.RememberMe,
                lockoutOnFailure: true);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                return Json(new {
                    success = true,
                    message = "Login successful",
                    userName = user?.FirstName ?? user?.Email,
                    userId = user?.Id
                });
            }

            if (result.IsLockedOut)
            {
                return Json(new { success = false, message = "Account temporarily locked due to too many failed sign-in attempts. Please try again in a few minutes." });
            }

            return Json(new { success = false, message = "Invalid email or password." });
        }

        /// <summary>
        /// AJAX Register endpoint for modal authentication
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AjaxRegister([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Organization = model.Organization,
                PhoneNumber = model.PhoneNumber,
                CreatedAt = System.DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Add the user to the User role
                await _userManager.AddToRoleAsync(user, "User");

                // Send welcome email
                SendWelcomeEmail(user);

                // Sign the user in
                await _signInManager.SignInAsync(user, isPersistent: false);

                return Json(new {
                    success = true,
                    message = "Registration successful",
                    userName = user.FirstName,
                    userId = user.Id
                });
            }

            var errorMessages = result.Errors.Select(e => e.Description).ToList();
            return Json(new { success = false, message = string.Join(" ", errorMessages) });
        }

        /// <summary>
        /// Check current authentication status
        /// </summary>
        [HttpGet]
        public IActionResult CheckAuthStatus()
        {
            if (User.Identity?.IsAuthenticated ?? false)
            {
                return Json(new {
                    isAuthenticated = true,
                    userName = User.Identity.Name
                });
            }

            return Json(new { isAuthenticated = false });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Profile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return RedirectToAction("Login");

            var roles = await _userManager.GetRolesAsync(user);
            var reportCount = await _context.RosraReports.CountAsync(r => r.UserId == user.Id);

            var model = new ProfileViewModel
            {
                FirstName = user.FirstName ?? "",
                LastName = user.LastName ?? "",
                Email = user.Email ?? "",
                Organization = user.Organization,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = user.CreatedAt,
                EmailConfirmed = user.EmailConfirmed,
                ReportCount = reportCount,
                Roles = roles.ToList()
            };

            return View(model);
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Profile(ProfileViewModel model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return RedirectToAction("Login");

            if (!ModelState.IsValid)
            {
                // Reload read-only fields
                var roles = await _userManager.GetRolesAsync(user);
                model.CreatedAt = user.CreatedAt;
                model.EmailConfirmed = user.EmailConfirmed;
                model.ReportCount = await _context.RosraReports.CountAsync(r => r.UserId == user.Id);
                model.Roles = roles.ToList();
                return View(model);
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Organization = model.Organization;
            user.PhoneNumber = model.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                TempData["ProfileSuccess"] = "Profile updated successfully.";
                return RedirectToAction("Profile");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            model.CreatedAt = user.CreatedAt;
            model.EmailConfirmed = user.EmailConfirmed;
            model.ReportCount = await _context.RosraReports.CountAsync(r => r.UserId == user.Id);
            model.Roles = userRoles.ToList();
            return View(model);
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Please fill in all fields correctly." });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Json(new { success = false, message = "User not found." });
            }

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (result.Succeeded)
            {
                await _signInManager.RefreshSignInAsync(user);
                return Json(new { success = true, message = "Password changed successfully." });
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return Json(new { success = false, message = string.Join(" ", errors) });
        }

        private void SendWelcomeEmail(ApplicationUser user)
        {
            try
            {
                if (string.IsNullOrEmpty(user.Email)) return;
                var html = EmailTemplateService.WelcomeEmail(user.FirstName ?? "User", "/Account/Login");
                _emailService.SendEmailInBackground(user.Email, user.FirstName, "Welcome to ROSRA",
                    html, NotificationType.WelcomeEmail, "User", user.Id);
            }
            catch { /* never fail registration */ }
        }
    }
}
