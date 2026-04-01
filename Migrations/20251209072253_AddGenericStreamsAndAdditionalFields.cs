using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddGenericStreamsAndAdditionalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GenericStreamsData",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GovernmentType",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IncomeLevel",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OtherRevenue",
                table: "RosraReports",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GenericStreamsData",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "GovernmentType",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "IncomeLevel",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "OtherRevenue",
                table: "RosraReports");
        }
    }
}
