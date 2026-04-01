using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class RemovePropertyTaxPayersColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RegisteredPropertyTaxPayers",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "TotalPropertyTaxPayers",
                table: "RosraReports");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RegisteredPropertyTaxPayers",
                table: "RosraReports",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalPropertyTaxPayers",
                table: "RosraReports",
                type: "int",
                nullable: true);
        }
    }
}
