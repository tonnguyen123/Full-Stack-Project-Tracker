using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectTrackerAPI.Migrations
{
    /// <inheritdoc />
    public partial class SyncExistingTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Team_Users_OwnerId",
                table: "Team");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_Team_TeamsId",
                table: "TeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamProjects_Team_TeamsId",
                table: "TeamProjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Team",
                table: "Team");

            migrationBuilder.RenameTable(
                name: "Team",
                newName: "team");

            migrationBuilder.RenameIndex(
                name: "IX_Team_OwnerId",
                table: "team",
                newName: "IX_team_OwnerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_team",
                table: "team",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_team_Users_OwnerId",
                table: "team",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_team_TeamsId",
                table: "TeamMembers",
                column: "TeamsId",
                principalTable: "team",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_team_Users_OwnerId",
                table: "team");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_team_TeamsId",
                table: "TeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamProjects_team_TeamsId",
                table: "TeamProjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_team",
                table: "team");

            migrationBuilder.RenameTable(
                name: "team",
                newName: "Team");

            migrationBuilder.RenameIndex(
                name: "IX_team_OwnerId",
                table: "Team",
                newName: "IX_Team_OwnerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Team",
                table: "Team",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Team_Users_OwnerId",
                table: "Team",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_Team_TeamsId",
                table: "TeamMembers",
                column: "TeamsId",
                principalTable: "Team",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamProjects_Team_TeamsId",
                table: "TeamProjects",
                column: "TeamsId",
                principalTable: "Team",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
