using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace RosraApp.Models.ViewModels
{
    public class AdminDashboardViewModel
    {
        public List<ApplicationUser>? Users { get; set; }
        public List<IdentityRole>? Roles { get; set; }
    }

    public class UserDetailsViewModel
    {
        public ApplicationUser? User { get; set; }
        public IList<string>? UserRoles { get; set; }
        public List<IdentityRole>? AllRoles { get; set; }
    }

    public class CreateRoleViewModel
    {
        public string? RoleName { get; set; }
    }
}
