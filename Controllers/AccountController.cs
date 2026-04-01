using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RosraApp.Models;
using RosraApp.Models.ViewModels;
using System.Linq;
using System.Threading.Tasks;

namespace RosraApp.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
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
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            
            if (ModelState.IsValid)
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);
                
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

            var result = await _signInManager.PasswordSignInAsync(
                model.Email,
                model.Password,
                model.RememberMe,
                lockoutOnFailure: false);

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
    }
}
