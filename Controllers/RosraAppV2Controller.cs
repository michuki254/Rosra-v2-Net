using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RosraApp.Models;
using System.Threading.Tasks;

namespace RosraApp.Controllers
{
    public class RosraAppV2Controller : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public RosraAppV2Controller(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        public async Task<IActionResult> UserDetails()
        {
            var user = await _userManager.GetUserAsync(User);
            
            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            return View(user);
        }
    }
}
