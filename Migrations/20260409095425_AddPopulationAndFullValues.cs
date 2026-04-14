using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddPopulationAndFullValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add Population column
            migrationBuilder.AddColumn<long>(
                name: "Population",
                table: "Peers_SNG",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            // Expand decimal precision for full KES values (not millions)
            migrationBuilder.AlterColumn<decimal>(
                name: "OSR",
                table: "Peers_SNG",
                type: "decimal(28,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "GCP",
                table: "Peers_SNG",
                type: "decimal(28,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            // Convert existing data from millions to full values
            migrationBuilder.Sql("UPDATE Peers_SNG SET OSR = OSR * 1000000, GCP = GCP * 1000000");

            // Update population data (KNBS 2025 projections)
            migrationBuilder.Sql(@"
                UPDATE Peers_SNG SET Population = CASE SNG
                    WHEN 'Baringo' THEN 759000
                    WHEN 'Bomet' THEN 973000
                    WHEN 'Bungoma' THEN 2073000
                    WHEN 'Busia' THEN 1003000
                    WHEN 'Elgeyo/Marakwet' THEN 509000
                    WHEN 'Embu' THEN 671000
                    WHEN 'Garissa' THEN 960000
                    WHEN 'Homa Bay' THEN 1275000
                    WHEN 'Isiolo' THEN 330000
                    WHEN 'Kajiado' THEN 1313000
                    WHEN 'Kakamega' THEN 2073000
                    WHEN 'Kericho' THEN 988000
                    WHEN 'Kiambu' THEN 2754000
                    WHEN 'Kilifi' THEN 1737000
                    WHEN 'Kirinyaga' THEN 676000
                    WHEN 'Kisii' THEN 1370000
                    WHEN 'Kisumu' THEN 1292000
                    WHEN 'Kitui' THEN 1273000
                    WHEN 'Kwale' THEN 978000
                    WHEN 'Laikipia' THEN 583000
                    WHEN 'Lamu' THEN 176000
                    WHEN 'Machakos' THEN 1518000
                    WHEN 'Makueni' THEN 1079000
                    WHEN 'Mandera' THEN 993000
                    WHEN 'Marsabit' THEN 539000
                    WHEN 'Meru' THEN 1666000
                    WHEN 'Migori' THEN 1277000
                    WHEN 'Mombasa' THEN 1368000
                    WHEN N'Murang''a' THEN 1151000
                    WHEN 'Nairobi' THEN 4906000
                    WHEN 'Nakuru' THEN 2445000
                    WHEN 'Nandi' THEN 985000
                    WHEN 'Narok' THEN 1355000
                    WHEN 'Nyamira' THEN 681000
                    WHEN 'Nyandarua' THEN 720000
                    WHEN 'Nyeri' THEN 865000
                    WHEN 'Samburu' THEN 367000
                    WHEN 'Siaya' THEN 1097000
                    WHEN 'Taita/Taveta' THEN 373000
                    WHEN 'Tana River' THEN 370000
                    WHEN 'Tharaka-Nithi' THEN 425000
                    WHEN 'Trans Nzoia' THEN 1106000
                    WHEN 'Turkana' THEN 1059000
                    WHEN 'Uasin Gishu' THEN 1301000
                    WHEN 'Vihiga' THEN 636000
                    WHEN 'Wajir' THEN 901000
                    WHEN 'West Pokot' THEN 706000
                    ELSE 0
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Convert back from full values to millions
            migrationBuilder.Sql("UPDATE Peers_SNG SET OSR = OSR / 1000000, GCP = GCP / 1000000");

            migrationBuilder.DropColumn(
                name: "Population",
                table: "Peers_SNG");

            migrationBuilder.AlterColumn<decimal>(
                name: "OSR",
                table: "Peers_SNG",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(28,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "GCP",
                table: "Peers_SNG",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(28,2)");
        }
    }
}
