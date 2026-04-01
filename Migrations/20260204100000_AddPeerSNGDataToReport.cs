using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddPeerSNGDataToReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PeerSNGData",
                table: "RosraReports",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PeerSNGData",
                table: "RosraReports");
        }
    }
}
