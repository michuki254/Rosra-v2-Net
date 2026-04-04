using Microsoft.EntityFrameworkCore;
using RosraApp.Data;
using RosraApp.Models;
using RosraApp.Models.Enums;

namespace RosraApp.Services
{
    public class ArtifactService
    {
        private readonly ApplicationDbContext _context;
        private readonly SnapshotService _snapshotService;
        private readonly ReportExportService _pdfExportService;
        private readonly ExcelExportService _excelExportService;
        private readonly IWebHostEnvironment _environment;

        public ArtifactService(
            ApplicationDbContext context,
            SnapshotService snapshotService,
            ReportExportService pdfExportService,
            ExcelExportService excelExportService,
            IWebHostEnvironment environment)
        {
            _context = context;
            _snapshotService = snapshotService;
            _pdfExportService = pdfExportService;
            _excelExportService = excelExportService;
            _environment = environment;
        }

        public async Task<int> GeneratePdfArtifact(int reportId, int snapshotId, string userId)
        {
            var formData = await _snapshotService.GetSnapshot(snapshotId);
            if (formData == null)
                return 0;

            var pdfBytes = _pdfExportService.GeneratePdfReport(formData, formData.Title);
            return await SaveArtifact(reportId, snapshotId, userId, pdfBytes, "pdf", ArtifactFileType.PDF);
        }

        public async Task<int> GenerateExcelArtifact(int reportId, int snapshotId, string userId)
        {
            var formData = await _snapshotService.GetSnapshot(snapshotId);
            if (formData == null)
                return 0;

            var excelBytes = _excelExportService.GenerateExcelReport(formData, formData.Title);
            return await SaveArtifact(reportId, snapshotId, userId, excelBytes, "xlsx", ArtifactFileType.Excel);
        }

        private async Task<int> SaveArtifact(int reportId, int snapshotId, string userId, byte[] fileBytes, string extension, ArtifactFileType fileType)
        {
            // Create artifacts directory
            var artifactsDir = Path.Combine(_environment.ContentRootPath, "App_Data", "artifacts", reportId.ToString());
            Directory.CreateDirectory(artifactsDir);

            var fileName = $"assessment_{reportId}_snap{snapshotId}_{DateTime.UtcNow:yyyyMMddHHmmss}.{extension}";
            var filePath = Path.Combine(artifactsDir, fileName);

            await File.WriteAllBytesAsync(filePath, fileBytes);

            var artifact = new ReportArtifact
            {
                ReportId = reportId,
                SnapshotId = snapshotId,
                FileName = fileName,
                FilePath = filePath,
                FileType = (int)fileType,
                FileSizeBytes = fileBytes.Length,
                GeneratedAt = DateTime.UtcNow,
                GeneratedByUserId = userId
            };

            _context.ReportArtifacts.Add(artifact);
            await _context.SaveChangesAsync();
            return artifact.Id;
        }

        public async Task<(Stream? FileStream, string? FileName, string? ContentType)> GetArtifactStream(int artifactId)
        {
            var artifact = await _context.ReportArtifacts.FindAsync(artifactId);
            if (artifact == null || !File.Exists(artifact.FilePath))
                return (null, null, null);

            var contentType = artifact.FileType == (int)ArtifactFileType.PDF
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

            var stream = new FileStream(artifact.FilePath, FileMode.Open, FileAccess.Read);
            return (stream, artifact.FileName, contentType);
        }

        public async Task<List<ReportArtifact>> GetArtifactsForReport(int reportId)
        {
            return await _context.ReportArtifacts
                .Where(a => a.ReportId == reportId)
                .OrderByDescending(a => a.GeneratedAt)
                .ToListAsync();
        }
    }
}
