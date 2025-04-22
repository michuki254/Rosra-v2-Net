using Microsoft.AspNetCore.Identity;

namespace RosraApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Organization { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
