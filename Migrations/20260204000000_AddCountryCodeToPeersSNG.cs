using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddCountryCodeToPeersSNG : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CountryCode",
                table: "Peers_SNG",
                type: "nvarchar(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "KEN");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountryCode",
                table: "Peers_SNG");
        }
    }
}
