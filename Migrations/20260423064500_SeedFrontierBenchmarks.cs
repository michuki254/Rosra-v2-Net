using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class SeedFrontierBenchmarks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Idempotent seed for DB_Frontiers. Only inserts rows that are not already present
            // (matched by Income_Level + Government_Type). This preserves any row that has been
            // manually edited in place.
            migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT 1 FROM [dbo].[DB_Frontiers] WHERE [Income_Level] = 'Low' AND [Government_Type] = 'Unitary')
    INSERT INTO [dbo].[DB_Frontiers] ([Income_Level], [Government_Type], [SNG_total_rev_pc_frontier], [OSR_pc_frontier], [Revenue_Autonomy_frontier])
    VALUES ('Low', 'Unitary', 41.00480178, 4.03, 0.098281173);

IF NOT EXISTS (SELECT 1 FROM [dbo].[DB_Frontiers] WHERE [Income_Level] = 'Lower-middle' AND [Government_Type] = 'Unitary')
    INSERT INTO [dbo].[DB_Frontiers] ([Income_Level], [Government_Type], [SNG_total_rev_pc_frontier], [OSR_pc_frontier], [Revenue_Autonomy_frontier])
    VALUES ('Lower-middle', 'Unitary', 313.6863837, 187.87, 0.59891028);

IF NOT EXISTS (SELECT 1 FROM [dbo].[DB_Frontiers] WHERE [Income_Level] = 'Upper-middle' AND [Government_Type] = 'Unitary')
    INSERT INTO [dbo].[DB_Frontiers] ([Income_Level], [Government_Type], [SNG_total_rev_pc_frontier], [OSR_pc_frontier], [Revenue_Autonomy_frontier])
    VALUES ('Upper-middle', 'Unitary', 1452.013275, 657.445, 0.452781673);

IF NOT EXISTS (SELECT 1 FROM [dbo].[DB_Frontiers] WHERE [Income_Level] = 'High' AND [Government_Type] = 'Unitary')
    INSERT INTO [dbo].[DB_Frontiers] ([Income_Level], [Government_Type], [SNG_total_rev_pc_frontier], [OSR_pc_frontier], [Revenue_Autonomy_frontier])
    VALUES ('High', 'Unitary', 13860.11906, 7466.65, 0.538714709);

IF NOT EXISTS (SELECT 1 FROM [dbo].[DB_Frontiers] WHERE [Income_Level] = 'Upper-middle' AND [Government_Type] = 'Federal')
    INSERT INTO [dbo].[DB_Frontiers] ([Income_Level], [Government_Type], [SNG_total_rev_pc_frontier], [OSR_pc_frontier], [Revenue_Autonomy_frontier])
    VALUES ('Upper-middle', 'Federal', 2385.00, 1759.35, 0.88);
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
DELETE FROM [dbo].[DB_Frontiers]
WHERE ([Income_Level] = 'Low' AND [Government_Type] = 'Unitary')
   OR ([Income_Level] = 'Lower-middle' AND [Government_Type] = 'Unitary')
   OR ([Income_Level] = 'Upper-middle' AND [Government_Type] = 'Unitary')
   OR ([Income_Level] = 'High' AND [Government_Type] = 'Unitary')
   OR ([Income_Level] = 'Upper-middle' AND [Government_Type] = 'Federal');
");
        }
    }
}
