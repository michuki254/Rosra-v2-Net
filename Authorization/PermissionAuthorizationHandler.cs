using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;
using System.Linq;
using System.Threading.Tasks;

namespace RosraApp.Authorization
{
    public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public PermissionAuthorizationHandler(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            {
                return;
            }

            // Get the user
            var user = await _userManager.GetUserAsync(context.User);
            if (user == null)
            {
                return;
            }

            // Get user's roles
            var userRoles = await _userManager.GetRolesAsync(user);
            if (!userRoles.Any())
            {
                return;
            }

            // Get role IDs
            var roleIds = await _context.Roles
                .Where(r => userRoles.Contains(r.Name))
                .Select(r => r.Id)
                .ToListAsync();

            // Check if any of the user's roles have the required permission
            var hasPermission = await _context.RolePermissions
                .Include(rp => rp.Permission)
                .AnyAsync(rp => roleIds.Contains(rp.RoleId) && rp.Permission.Name == requirement.PermissionName);

            if (hasPermission)
            {
                context.Succeed(requirement);
            }
        }
    }
}
