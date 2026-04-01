using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddPeersSNGTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Peers_SNG",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CountyName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    OSRValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Population = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<int>(type: "int", nullable: false),
                    PerCapitaRatio1 = table.Column<decimal>(type: "decimal(18,9)", nullable: false),
                    PerCapitaRatio2 = table.Column<decimal>(type: "decimal(18,9)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Peers_SNG", x => x.Id);
                });

            // Seed data
            migrationBuilder.InsertData(
                table: "Peers_SNG",
                columns: new[] { "CountyName", "OSRValue", "Population", "IsActive", "PerCapitaRatio1", "PerCapitaRatio2" },
                values: new object[,]
                {
                    { "Baringo", 321.4m, 75459, 1, 0.004259267m, 0.004259267m },
                    { "Bomet", 196.8m, 151153, 1, 0.001301992m, 0.001301992m },
                    { "Bungoma", 670.5m, 205542, 1, 0.003262107m, 0.003262107m },
                    { "Busia", 205.9m, 88731, 1, 0.002320497m, 0.002320497m },
                    { "Elgeyo/Marakwet", 105.9m, 117229, 1, 0.00090336m, 0.00090336m },
                    { "Embu", 236.7m, 149912, 1, 0.001578926m, 0.001578926m },
                    { "Garissa", 75.4m, 58634, 1, 0.001285943m, 0.001285943m },
                    { "Homa Bay", 166m, 120751, 1, 0.00137473m, 0.00137473m },
                    { "Isiolo", 125.1m, 26555, 1, 0.004710977m, 0.004710977m },
                    { "Kajiado", 544.5m, 150709, 1, 0.003612923m, 0.003612923m },
                    { "Kakamega", 639.8m, 214365, 1, 0.002984629m, 0.002984629m },
                    { "Kericho", 405.5m, 163543, 1, 0.00247947m, 0.00247947m },
                    { "Kiambu", 2192.1m, 554515, 1, 0.003953184m, 0.003953184m },
                    { "Kilifi", 685.5m, 199953, 1, 0.003428306m, 0.003428306m },
                    { "Kirinyaga", 312.9m, 123709, 1, 0.002529323m, 0.002529323m },
                    { "Kisii", 472.9m, 198192, 1, 0.00238607m, 0.00238607m },
                    { "Kisumu", 728.3m, 247324, 1, 0.00294472m, 0.00294472m },
                    { "Kitui", 244.4m, 154345, 1, 0.001583466m, 0.001583466m },
                    { "Kwale", 349.5m, 119001, 1, 0.00293695m, 0.00293695m },
                    { "Laikipia", 549.7m, 94639, 1, 0.005808388m, 0.005808388m },
                    { "Lamu", 89.6m, 32747, 1, 0.002736129m, 0.002736129m },
                    { "Machakos", 1075.9m, 309164, 1, 0.00348003m, 0.00348003m },
                    { "Makueni", 259.5m, 110207, 1, 0.00235466m, 0.00235466m },
                    { "Mandera", 78m, 56964, 1, 0.001369286m, 0.001369286m },
                    { "Marsabit", 81.8m, 60486, 1, 0.001352379m, 0.001352379m },
                    { "Meru", 551.3m, 329977, 1, 0.001670723m, 0.001670723m },
                    { "Migori", 292.8m, 120639, 1, 0.002427076m, 0.002427076m },
                    { "Mombasa", 3271.2m, 468749, 1, 0.006978575m, 0.006978575m },
                    { "Murang'a", 567.8m, 200539, 1, 0.002831369m, 0.002831369m },
                    { "Nairobi", 6733.3m, 2682701, 1, 0.002509896m, 0.002509896m },
                    { "Nakuru", 1511.6m, 483938, 1, 0.003123541m, 0.003123541m },
                    { "Nandi", 217m, 149117, 1, 0.001455233m, 0.001455233m },
                    { "Narok", 2310.9m, 165462, 1, 0.013966349m, 0.013966349m },
                    { "Nyamira", 133.1m, 116992, 1, 0.001137685m, 0.001137685m },
                    { "Nyandarua", 307.5m, 149707, 1, 0.002054012m, 0.002054012m },
                    { "Nyeri", 659.2m, 209626, 1, 0.003144648m, 0.003144648m },
                    { "Samburu", 192.6m, 29090, 1, 0.006620832m, 0.006620832m },
                    { "Siaya", 213.1m, 103899, 1, 0.00205103m, 0.00205103m },
                    { "Taita/Taveta", 216m, 63592, 1, 0.003396654m, 0.003396654m },
                    { "Tana River", 55.5m, 29460, 1, 0.00188391m, 0.00188391m },
                    { "Tharaka-Nithi", 190.4m, 61461, 1, 0.003097899m, 0.003097899m },
                    { "Trans Nzoia", 320.7m, 165700, 1, 0.001935425m, 0.001935425m },
                    { "Turkana", 157.2m, 107450, 1, 0.001463006m, 0.001463006m },
                    { "Uasin Gishu", 791.8m, 227871, 1, 0.003474773m, 0.003474773m },
                    { "Vihiga", 132.8m, 83773, 1, 0.001585236m, 0.001585236m },
                    { "Wajir", 58m, 49159, 1, 0.001179845m, 0.001179845m },
                    { "West Pokot", 90.7m, 79417, 1, 0.001142073m, 0.001142073m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Peers_SNG");
        }
    }
}
