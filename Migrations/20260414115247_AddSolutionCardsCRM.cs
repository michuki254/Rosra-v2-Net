using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RosraApp.Migrations
{
    /// <inheritdoc />
    public partial class AddSolutionCardsCRM : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CardSets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    TargetContext = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CardIds = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardSets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CardSets_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SolutionCards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SolutionId = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Stream = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StreamType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Subgroup = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    Gap = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ShortTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Timeline = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DeliveryDifficulty = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    PoliticalSensitivity = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    OverviewData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullDetailsData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolutionCards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolutionCards_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SolutionCards_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SystemSettings",
                columns: table => new
                {
                    Key = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedByUserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSettings", x => x.Key);
                });

            migrationBuilder.CreateTable(
                name: "SolutionCardHistory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SolutionCardId = table.Column<int>(type: "int", nullable: false),
                    ChangeType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PreviousData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ChangedByUserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolutionCardHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolutionCardHistory_AspNetUsers_ChangedByUserId",
                        column: x => x.ChangedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SolutionCardHistory_SolutionCards_SolutionCardId",
                        column: x => x.SolutionCardId,
                        principalTable: "SolutionCards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CardSets_CreatedByUserId",
                table: "CardSets",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SolutionCardHistory_ChangedByUserId",
                table: "SolutionCardHistory",
                column: "ChangedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SolutionCardHistory_SolutionCardId",
                table: "SolutionCardHistory",
                column: "SolutionCardId");

            migrationBuilder.CreateIndex(
                name: "IX_SolutionCards_CreatedByUserId",
                table: "SolutionCards",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SolutionCards_SolutionId",
                table: "SolutionCards",
                column: "SolutionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SolutionCards_UpdatedByUserId",
                table: "SolutionCards",
                column: "UpdatedByUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CardSets");

            migrationBuilder.DropTable(
                name: "SolutionCardHistory");

            migrationBuilder.DropTable(
                name: "SystemSettings");

            migrationBuilder.DropTable(
                name: "SolutionCards");
        }
    }
}
