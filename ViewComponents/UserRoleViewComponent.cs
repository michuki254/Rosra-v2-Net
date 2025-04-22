using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RosraApp.Models;
using System.Linq;
using System.Threading.Tasks;

namespace RosraApp.ViewComponents
{
    public class UserRoleViewComponent : ViewComponent
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserRoleViewComponent(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<IViewComponentResult> InvokeAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Content("User not found");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var roleName = roles.FirstOrDefault() ?? "No Role";

            return View(roleName);
        }
    }
}
