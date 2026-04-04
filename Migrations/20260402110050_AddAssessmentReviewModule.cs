using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddAssessmentReviewModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CompletionLevel",
                table: "RosraReports",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewStartedAt",
                table: "RosraReports",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReviewerUserId",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RevisionReason",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "RosraReports",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedAt",
                table: "RosraReports",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ValidatedAt",
                table: "RosraReports",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ValidatedByUserId",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "AuditLogs",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatusFrom",
                table: "AuditLogs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatusTo",
                table: "AuditLogs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AnalysisSnapshots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportId = table.Column<int>(type: "int", nullable: false),
                    SnapshotType = table.Column<int>(type: "int", nullable: false),
                    FormDataJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Label = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalysisSnapshots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnalysisSnapshots_RosraReports_ReportId",
                        column: x => x.ReportId,
                        principalTable: "RosraReports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReviewNotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportId = table.Column<int>(type: "int", nullable: false),
                    AuthorUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    NoteType = table.Column<int>(type: "int", nullable: false),
                    StreamReference = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsInternal = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewNotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReviewNotes_AspNetUsers_AuthorUserId",
                        column: x => x.AuthorUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReviewNotes_RosraReports_ReportId",
                        column: x => x.ReportId,
                        principalTable: "RosraReports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReportArtifacts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportId = table.Column<int>(type: "int", nullable: false),
                    SnapshotId = table.Column<int>(type: "int", nullable: true),
                    FileName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FileType = table.Column<int>(type: "int", nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    GeneratedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GeneratedByUserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportArtifacts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReportArtifacts_AnalysisSnapshots_SnapshotId",
                        column: x => x.SnapshotId,
                        principalTable: "AnalysisSnapshots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ReportArtifacts_RosraReports_ReportId",
                        column: x => x.ReportId,
                        principalTable: "RosraReports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnalysisSnapshots_ReportId",
                table: "AnalysisSnapshots",
                column: "ReportId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportArtifacts_ReportId",
                table: "ReportArtifacts",
                column: "ReportId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportArtifacts_SnapshotId",
                table: "ReportArtifacts",
                column: "SnapshotId");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewNotes_AuthorUserId",
                table: "ReviewNotes",
                column: "AuthorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewNotes_ReportId",
                table: "ReviewNotes",
                column: "ReportId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReportArtifacts");

            migrationBuilder.DropTable(
                name: "ReviewNotes");

            migrationBuilder.DropTable(
                name: "AnalysisSnapshots");

            migrationBuilder.DropColumn(
                name: "CompletionLevel",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "ReviewStartedAt",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "ReviewerUserId",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "RevisionReason",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "SubmittedAt",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "ValidatedAt",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "ValidatedByUserId",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "Reason",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "StatusFrom",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "StatusTo",
                table: "AuditLogs");
        }
    }
}
