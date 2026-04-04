using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
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
        private readonly IMemoryCache _cache;

        public PermissionAuthorizationHandler(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context,
            IMemoryCache cache)
        {
            _userManager = userManager;
            _context = context;
            _cache = cache;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            {
                return;
            }

            var user = await _userManager.GetUserAsync(context.User);
            if (user == null)
            {
                return;
            }

            // Cache user permissions for 5 minutes to avoid DB hits on every request
            var cacheKey = $"user_permissions_{user.Id}";
            if (!_cache.TryGetValue(cacheKey, out HashSet<string>? userPermissions))
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                if (!userRoles.Any())
                {
                    return;
                }

                var roleIds = await _context.Roles
                    .Where(r => userRoles.Contains(r.Name))
                    .Select(r => r.Id)
                    .ToListAsync();

                var permissions = await _context.RolePermissions
                    .Include(rp => rp.Permission)
                    .Where(rp => roleIds.Contains(rp.RoleId))
                    .Select(rp => rp.Permission.Name)
                    .ToListAsync();

                userPermissions = new HashSet<string>(permissions);
                _cache.Set(cacheKey, userPermissions, TimeSpan.FromMinutes(5));
            }

            if (userPermissions != null && userPermissions.Contains(requirement.PermissionName))
            {
                context.Succeed(requirement);
            }
        }
    }
}
