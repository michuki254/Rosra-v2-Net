using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class CreateDBCountriesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DB_Countries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SNG_total_revenue_pct_gdp = table.Column<decimal>(type: "decimal(18,4)", nullable: true),
                    SNG_grants_subsidies_pct_gdp = table.Column<decimal>(type: "decimal(18,4)", nullable: true),
                    OSR_pct_gdp = table.Column<decimal>(type: "decimal(18,4)", nullable: true),
                    GDP_nominal_usd = table.Column<decimal>(type: "decimal(22,2)", nullable: true),
                    Population_total = table.Column<long>(type: "bigint", nullable: true),
                    OSR_pc_proxy_usd = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Government_Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    OSR_Data_Complete = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Income_Level = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Income_Group = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SNG_total_rev_pc_usd = table.Column<decimal>(type: "decimal(18,4)", nullable: true),
                    Revenue_Autonomy = table.Column<decimal>(type: "decimal(18,9)", nullable: true),
                    OSR_pc_derived_usd = table.Column<decimal>(type: "decimal(18,4)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DB_Countries", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DB_Countries");
        }
    }
}
