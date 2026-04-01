using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RosraApp.Models
{
    public class RolePermission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string RoleId { get; set; } = string.Empty;

        [Required]
        public int PermissionId { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey(nameof(RoleId))]
        public IdentityRole Role { get; set; } = null!;

        [ForeignKey(nameof(PermissionId))]
        public Permission Permission { get; set; } = null!;
    }
}
