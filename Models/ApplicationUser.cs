using Microsoft.AspNetCore.Identity;

namespace RosraApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Organization { get; set; }
        public bool ConsentToBeContacted { get; set; }
        public DateTime? ConsentToBeContactedAt { get; set; }
        public bool PrivacyDataUseAcknowledged { get; set; }
        public string? PrivacyDataUseConsentVersion { get; set; }
        public DateTime? PrivacyDataUseAcknowledgedAt { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
