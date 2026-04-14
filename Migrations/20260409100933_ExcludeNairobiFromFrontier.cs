using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class ExcludeNairobiFromFrontier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE Peers_SNG SET [Include] = 0 WHERE SNG = 'Nairobi'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE Peers_SNG SET [Include] = 1 WHERE SNG = 'Nairobi'");
        }
    }
}
