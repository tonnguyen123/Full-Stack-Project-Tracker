using Microsoft.AspNetCore.Mvc;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Data;
using System;
using System.Linq;
using ProjectTrackerAPI.Helpers;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; 


namespace ProjectTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ProjectDbContext _context;
        private readonly IConfiguration _configuration;

        public ProjectsController(ProjectDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> Projects(int userId)
        {
            try
            {

                var UsersProjects = await _context.Projects.Where(p => p.UserId == userId).ToListAsync();

                if (UsersProjects == null || !UsersProjects.Any())
                {
                    return NotFound(new { message = "No projects created yet!" });
                }
                else
                {
                    return Ok(new { projects = UsersProjects });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting projects: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("delete/{userId}/{projectName}")]
        public async Task<IActionResult> DeleteProject(int userId, string projectName)
        {
            try
            {
                var project = await _context.Projects.FirstOrDefaultAsync(p => p.UserId == userId && p.Name == projectName);
                if (project == null)
                {
                    return NotFound(new { message = "Project not found." });
                }
                else
                {
                    _context.Projects.Remove(project);
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Project deleted successfully!" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error get projects");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("shared-projects/{userId}")]
        public async Task<IActionResult> SharedProjects(int userId)
        {

            try
            {
                var allTeams = await _context.Teams
                    .Include(t => t.Projects)
                    .Include(t => t.Members)
                    .ToListAsync();

                // Filter only the teams where this user is a member
                var userTeams = allTeams
                    .Where(t => t.Members != null && t.Members.Any(m => m.Id == userId))
                    .ToList();

                // Safely collect all the projects from those teams
                var sharedProjects = userTeams
                    .Where(t => t.Projects != null)
                    .SelectMany(t => t.Projects!)
                    .Distinct()
                    .ToList();

                return Ok(new { projects = sharedProjects });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error get shared projects: {ex}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


       [HttpPost("update-percentage")]
        public async Task<IActionResult> UpdatePercentage([FromBody] UpdateProjectPercentage data)
        {
            if (data == null || data.ProjectID <= 0)
            {
                return BadRequest(new { message = "Invalid data" });
            }

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == data.ProjectID && p.UserId == data.UserID);

            if (project == null)
            {
                return NotFound(new { message = "Project not found" });
            }

            project.percentage = data.percentage;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Project percentage updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }



        }
}
