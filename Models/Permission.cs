using System.ComponentModel.DataAnnotations;

namespace RosraApp.Models
{
    public class Permission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}
