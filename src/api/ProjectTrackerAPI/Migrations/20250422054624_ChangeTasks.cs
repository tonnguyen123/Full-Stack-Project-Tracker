using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectTrackerAPI.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AssginedId",
                table: "Tasks",
                newName: "AssignedId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AssignedId",
                table: "Tasks",
                newName: "AssginedId");
        }
    }
}
