using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectTrackerAPI.Migrations
{
    /// <inheritdoc />
    public partial class SyncExistingTablesx : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_team_TeamsId",
                table: "TeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamProjects_Projects_ProjectsId",
                table: "TeamProjects");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamProjects_team_TeamsId",
                table: "TeamProjects");

            migrationBuilder.DropTable(
                name: "team");

            migrationBuilder.RenameColumn(
                name: "TeamsId",
                table: "TeamProjects",
                newName: "TeamId");

            migrationBuilder.RenameColumn(
                name: "ProjectsId",
                table: "TeamProjects",
                newName: "ProjectId");

            migrationBuilder.RenameIndex(
                name: "IX_TeamProjects_TeamsId",
                table: "TeamProjects",
                newName: "IX_TeamProjects_TeamId");

            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OwnerId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Teams_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_OwnerId",
                table: "Teams",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_Teams_TeamsId",
                table: "TeamMembers",
                column: "TeamsId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamProjects_Projects_ProjectId",
                table: "TeamProjects",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamProjects_Teams_TeamId",
                table: "TeamProjects",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_Teams_TeamsId",
                table: "TeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamProjects_Projects_ProjectId",
                table: "TeamProjects");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamProjects_Teams_TeamId",
                table: "TeamProjects");

            migrationBuilder.DropTable(
                name: "Teams");

            migrationBuilder.RenameColumn(
                name: "TeamId",
                table: "TeamProjects",
                newName: "TeamsId");

            migrationBuilder.RenameColumn(
                name: "ProjectId",
                table: "TeamProjects",
                newName: "ProjectsId");

            migrationBuilder.RenameIndex(
                name: "IX_TeamProjects_TeamId",
                table: "TeamProjects",
                newName: "IX_TeamProjects_TeamsId");

            migrationBuilder.CreateTable(
                name: "team",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    OwnerId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_team", x => x.Id);
                    table.ForeignKey(
                        name: "FK_team_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_team_OwnerId",
                table: "team",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_team_TeamsId",
                table: "TeamMembers",
                column: "TeamsId",
                principalTable: "team",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamProjects_Projects_ProjectsId",
                table: "TeamProjects",
                column: "ProjectsId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamProjects_team_TeamsId",
                table: "TeamProjects",
                column: "TeamsId",
                principalTable: "team",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
