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
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;
    public DbSet<ReviewNote> ReviewNotes { get; set; } = null!;
    public DbSet<AnalysisSnapshot> AnalysisSnapshots { get; set; } = null!;
    public DbSet<ReportArtifact> ReportArtifacts { get; set; } = null!;
    public DbSet<EmailSettings> EmailSettings { get; set; } = null!;
    public DbSet<EmailLog> EmailLogs { get; set; } = null!;
    public DbSet<DataUploadHistory> DataUploadHistory { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure RolePermission composite unique constraint
        builder.Entity<RolePermission>()
            .HasIndex(rp => new { rp.RoleId, rp.PermissionId })
            .IsUnique();

        // Unique index on PublicId for URL lookups
        builder.Entity<RosraReport>()
            .HasIndex(r => r.PublicId)
            .IsUnique();

        // Global query filter: exclude soft-deleted reports from all queries
        builder.Entity<RosraReport>()
            .HasQueryFilter(r => !r.IsDeleted);

        // ReviewNote FK
        builder.Entity<ReviewNote>()
            .HasOne(rn => rn.Report)
            .WithMany(r => r.ReviewNotes)
            .HasForeignKey(rn => rn.ReportId)
            .OnDelete(DeleteBehavior.Cascade);

        // AnalysisSnapshot FK — Restrict to avoid cascade cycles with SQL Server
        builder.Entity<AnalysisSnapshot>()
            .HasOne(s => s.Report)
            .WithMany(r => r.Snapshots)
            .HasForeignKey(s => s.ReportId)
            .OnDelete(DeleteBehavior.Restrict);

        // ReportArtifact FKs — Restrict to avoid cascade cycles
        builder.Entity<ReportArtifact>()
            .HasOne(a => a.Report)
            .WithMany(r => r.Artifacts)
            .HasForeignKey(a => a.ReportId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<ReportArtifact>()
            .HasOne(a => a.Snapshot)
            .WithMany()
            .HasForeignKey(a => a.SnapshotId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var auditEntries = new List<AuditLog>();

        foreach (var entry in ChangeTracker.Entries<RosraReport>())
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }

            // Audit logging for RosraReport changes
            if (entry.State == EntityState.Added || entry.State == EntityState.Modified || entry.State == EntityState.Deleted)
            {
                var action = entry.State switch
                {
                    EntityState.Added => "Created",
                    EntityState.Modified => entry.Entity.IsDeleted && entry.OriginalValues.GetValue<bool>(nameof(RosraReport.IsDeleted)) == false
                        ? "Deleted"
                        : !entry.Entity.IsDeleted && entry.OriginalValues.GetValue<bool>(nameof(RosraReport.IsDeleted)) == true
                            ? "Restored"
                            : "Updated",
                    EntityState.Deleted => "PermanentlyDeleted",
                    _ => "Unknown"
                };

                // Track status transitions
                string? statusFrom = null;
                string? statusTo = null;
                if (entry.State == EntityState.Modified)
                {
                    var originalStatus = entry.OriginalValues.GetValue<int>(nameof(RosraReport.Status));
                    var currentStatus = entry.Entity.Status;
                    if (originalStatus != currentStatus)
                    {
                        statusFrom = ((Models.Enums.ReportStatus)originalStatus).ToString();
                        statusTo = ((Models.Enums.ReportStatus)currentStatus).ToString();
                        action = "StatusChanged";
                    }
                }

                var auditLog = new AuditLog
                {
                    Action = action,
                    EntityType = "RosraReport",
                    EntityId = entry.Entity.Id.ToString(),
                    Timestamp = DateTime.UtcNow,
                    UserId = entry.Entity.LastModifiedByUserId ?? entry.Entity.UserId,
                    Details = GetChangedProperties(entry),
                    StatusFrom = statusFrom,
                    StatusTo = statusTo
                };

                auditEntries.Add(auditLog);
            }
        }

        var result = await base.SaveChangesAsync(cancellationToken);

        // Save audit entries after the main save (so we have generated IDs for new entities)
        if (auditEntries.Any())
        {
            // Update EntityId for newly created reports
            foreach (var auditEntry in auditEntries.Where(a => a.Action == "Created"))
            {
                var report = ChangeTracker.Entries<RosraReport>()
                    .FirstOrDefault(e => e.Entity.Id.ToString() != "0" && e.Entity.CreatedAt == DateTime.Parse(auditEntry.Timestamp.ToString("O")));
                if (report != null)
                {
                    auditEntry.EntityId = report.Entity.Id.ToString();
                }
            }

            AuditLogs.AddRange(auditEntries);
            await base.SaveChangesAsync(cancellationToken);
        }

        return result;
    }

    private static string GetChangedProperties(Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<RosraReport> entry)
    {
        if (entry.State == EntityState.Added)
        {
            return $"Report '{entry.Entity.Title}' created";
        }

        if (entry.State == EntityState.Deleted)
        {
            return $"Report '{entry.Entity.Title}' permanently deleted";
        }

        var changes = new List<string>();
        foreach (var property in entry.OriginalValues.Properties)
        {
            var originalValue = entry.OriginalValues[property];
            var currentValue = entry.CurrentValues[property];

            if (!Equals(originalValue, currentValue))
            {
                // Skip large JSON fields — just note they changed
                if (property.Name.EndsWith("Data") || property.Name == "RootCauses" || property.Name == "ActionItems")
                {
                    changes.Add($"{property.Name}: [modified]");
                }
                else
                {
                    changes.Add($"{property.Name}: '{originalValue}' -> '{currentValue}'");
                }
            }
        }

        return changes.Any() ? string.Join("; ", changes) : "No property changes detected";
    }
}
