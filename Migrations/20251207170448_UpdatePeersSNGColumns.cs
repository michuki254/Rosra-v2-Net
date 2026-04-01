using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePeersSNGColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Peers_SNG");

            migrationBuilder.DropColumn(
                name: "PerCapitaRatio1",
                table: "Peers_SNG");

            migrationBuilder.DropColumn(
                name: "PerCapitaRatio2",
                table: "Peers_SNG");

            migrationBuilder.DropColumn(
                name: "Population",
                table: "Peers_SNG");

            migrationBuilder.RenameColumn(
                name: "OSRValue",
                table: "Peers_SNG",
                newName: "OSR");

            migrationBuilder.RenameColumn(
                name: "CountyName",
                table: "Peers_SNG",
                newName: "SNG");

            migrationBuilder.AddColumn<decimal>(
                name: "GCP",
                table: "Peers_SNG",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "Include",
                table: "Peers_SNG",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GCP",
                table: "Peers_SNG");

            migrationBuilder.DropColumn(
                name: "Include",
                table: "Peers_SNG");

            migrationBuilder.RenameColumn(
                name: "SNG",
                table: "Peers_SNG",
                newName: "CountyName");

            migrationBuilder.RenameColumn(
                name: "OSR",
                table: "Peers_SNG",
                newName: "OSRValue");

            migrationBuilder.AddColumn<int>(
                name: "IsActive",
                table: "Peers_SNG",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "PerCapitaRatio1",
                table: "Peers_SNG",
                type: "decimal(18,9)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PerCapitaRatio2",
                table: "Peers_SNG",
                type: "decimal(18,9)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Population",
                table: "Peers_SNG",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
