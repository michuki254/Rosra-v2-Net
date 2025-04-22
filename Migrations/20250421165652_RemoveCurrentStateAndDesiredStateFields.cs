using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCurrentStateAndDesiredStateFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DesiredState",
                table: "RosraReports",
                newName: "TotalEstimateData");

            migrationBuilder.RenameColumn(
                name: "CurrentState",
                table: "RosraReports",
                newName: "ShortTermUserChargeData");

            migrationBuilder.AddColumn<decimal>(
                name: "ActualOsr",
                table: "RosraReports",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BudgetedOsr",
                table: "RosraReports",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrencySymbol",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinancialYear",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "GdpPerCapita",
                table: "RosraReports",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LicenseData",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LongTermUserChargeData",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MixedUserChargeData",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Population",
                table: "RosraReports",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropertyTaxData",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActualOsr",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "BudgetedOsr",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "City",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "CurrencySymbol",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "FinancialYear",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "GdpPerCapita",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "LicenseData",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "LongTermUserChargeData",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "MixedUserChargeData",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "Population",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "PropertyTaxData",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "RosraReports");

            migrationBuilder.RenameColumn(
                name: "TotalEstimateData",
                table: "RosraReports",
                newName: "DesiredState");

            migrationBuilder.RenameColumn(
                name: "ShortTermUserChargeData",
                table: "RosraReports",
                newName: "CurrentState");
        }
    }
}
