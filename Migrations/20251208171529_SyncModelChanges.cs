using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class SyncModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Country",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Capital = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Currency = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Region = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Subregion = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Statesname = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Statesstate_code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Statescity = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Country", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DB_Frontiers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Income_Level = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Government_Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SNG_total_rev_pc_frontier = table.Column<decimal>(type: "decimal(18,8)", nullable: true),
                    OSR_pc_frontier = table.Column<decimal>(type: "decimal(18,8)", nullable: true),
                    Revenue_Autonomy_frontier = table.Column<decimal>(type: "decimal(18,9)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DB_Frontiers", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Country");

            migrationBuilder.DropTable(
                name: "DB_Frontiers");
        }
    }
}
