using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddReportTabsData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImplementationProgressData",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrioritizationData",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SelectedSolutionsData",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImplementationProgressData",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "PrioritizationData",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "SelectedSolutionsData",
                table: "RosraReports");
        }
    }
}
