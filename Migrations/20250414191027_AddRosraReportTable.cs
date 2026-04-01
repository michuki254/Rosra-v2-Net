using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddRosraReportTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Organization",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RosraReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ProjectName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EstimatedBudget = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CurrentState = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DesiredState = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProblemStatement = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RootCauses = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RecommendationSummary = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActionItems = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RosraReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RosraReports_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RosraReports_UserId",
                table: "RosraReports",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RosraReports");

            migrationBuilder.DropColumn(
                name: "Organization",
                table: "AspNetUsers");
        }
    }
}
