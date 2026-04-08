using Microsoft.EntityFrameworkCore;
using RosraApp.Data;

namespace RosraApp.Services
{
    /// <summary>
    /// Background service that purges soft-deleted records older than the retention period.
    /// Runs once daily at startup and every 24 hours thereafter.
    /// </summary>
    public class DataRetentionService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<DataRetentionService> _logger;
        private const int RetentionDays = 90;

        public DataRetentionService(IServiceScopeFactory scopeFactory, ILogger<DataRetentionService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Wait 30 seconds after startup before first run
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await PurgeExpiredRecords();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during data retention purge");
                }

                // Run every 24 hours
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        public async Task<(int PurgedReports, int PurgedSnapshots, int PurgedArtifacts, int PurgedNotes)> PurgeExpiredRecords()
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var cutoff = DateTime.UtcNow.AddDays(-RetentionDays);

            // Find soft-deleted reports older than retention period
            var expiredReports = await context.RosraReports
                .IgnoreQueryFilters()
                .Where(r => r.IsDeleted && r.DeletedAt.HasValue && r.DeletedAt < cutoff)
                .ToListAsync();

            if (!expiredReports.Any())
            {
                _logger.LogInformation("Data retention: no expired records to purge");
                return (0, 0, 0, 0);
            }

            var reportIds = expiredReports.Select(r => r.Id).ToList();
            int purgedSnapshots = 0, purgedArtifacts = 0, purgedNotes = 0;

            // Delete child records first (FK constraints)
            var artifacts = await context.ReportArtifacts.Where(a => reportIds.Contains(a.ReportId)).ToListAsync();
            foreach (var a in artifacts)
            {
                if (!string.IsNullOrEmpty(a.FilePath) && File.Exists(a.FilePath))
                {
                    try { File.Delete(a.FilePath); } catch { }
                }
            }
            context.ReportArtifacts.RemoveRange(artifacts);
            purgedArtifacts = artifacts.Count;

            var snapshots = await context.AnalysisSnapshots.Where(s => reportIds.Contains(s.ReportId)).ToListAsync();
            context.AnalysisSnapshots.RemoveRange(snapshots);
            purgedSnapshots = snapshots.Count;

            var notes = await context.ReviewNotes.Where(n => reportIds.Contains(n.ReportId)).ToListAsync();
            context.ReviewNotes.RemoveRange(notes);
            purgedNotes = notes.Count;

            // Delete the reports
            context.RosraReports.RemoveRange(expiredReports);

            // Log the purge
            context.AuditLogs.Add(new Models.AuditLog
            {
                Action = "DataRetentionPurge",
                EntityType = "RosraReport",
                Details = $"Purged {expiredReports.Count} reports, {purgedSnapshots} snapshots, {purgedArtifacts} artifacts, {purgedNotes} notes (retention: {RetentionDays} days)",
                Timestamp = DateTime.UtcNow,
                UserEmail = "system"
            });

            await context.SaveChangesAsync();

            _logger.LogInformation(
                "Data retention: purged {Reports} reports, {Snapshots} snapshots, {Artifacts} artifacts, {Notes} notes older than {Days} days",
                expiredReports.Count, purgedSnapshots, purgedArtifacts, purgedNotes, RetentionDays);

            return (expiredReports.Count, purgedSnapshots, purgedArtifacts, purgedNotes);
        }
    }
}
