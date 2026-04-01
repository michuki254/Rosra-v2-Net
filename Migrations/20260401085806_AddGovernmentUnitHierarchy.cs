using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddGovernmentUnitHierarchy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FinalUnitLevel",
                table: "RosraReports",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GovUnitLevel3",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinalUnitLevel",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "GovUnitLevel3",
                table: "RosraReports");
        }
    }
}
