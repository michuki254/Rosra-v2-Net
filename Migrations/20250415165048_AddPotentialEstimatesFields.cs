using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddPotentialEstimatesFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "RosraReports",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "KeyObjectives",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectDescription",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "RosraReports",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "KeyObjectives",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "ProjectDescription",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "RosraReports");
        }
    }
}
