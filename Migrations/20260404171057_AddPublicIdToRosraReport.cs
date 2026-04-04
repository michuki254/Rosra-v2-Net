using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicIdToRosraReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Add column with a default that generates unique GUIDs
            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                table: "RosraReports",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()");

            // Step 2: Backfill existing rows with unique GUIDs
            migrationBuilder.Sql("UPDATE RosraReports SET PublicId = NEWID() WHERE PublicId = '00000000-0000-0000-0000-000000000000'");

            // Step 3: Create unique index
            migrationBuilder.CreateIndex(
                name: "IX_RosraReports_PublicId",
                table: "RosraReports",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RosraReports_PublicId",
                table: "RosraReports");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "RosraReports");
        }
    }
}
