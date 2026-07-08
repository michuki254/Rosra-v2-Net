using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddRegistrationConsentFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ConsentToBeContacted",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ConsentToBeContactedAt",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PrivacyDataUseAcknowledged",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "PrivacyDataUseAcknowledgedAt",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrivacyDataUseConsentVersion",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConsentToBeContacted",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ConsentToBeContactedAt",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PrivacyDataUseAcknowledged",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PrivacyDataUseAcknowledgedAt",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PrivacyDataUseConsentVersion",
                table: "AspNetUsers");
        }
    }
}
