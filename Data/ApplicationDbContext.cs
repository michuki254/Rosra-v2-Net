using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RosraApp.Models;

namespace RosraApp.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<RosraReport> RosraReports { get; set; } = null!;
    public DbSet<PeerSNG> Peers_SNG { get; set; } = null!;
    public DbSet<CountryData> DB_Countries { get; set; } = null!;
    public DbSet<Country> Countries { get; set; } = null!;
    public DbSet<Frontier> DB_Frontiers { get; set; } = null!;
    public DbSet<Permission> Permissions { get; set; } = null!;
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure RolePermission composite unique constraint
        builder.Entity<RolePermission>()
            .HasIndex(rp => new { rp.RoleId, rp.PermissionId })
            .IsUnique();
    }
}
