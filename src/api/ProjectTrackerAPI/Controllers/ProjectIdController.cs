using Microsoft.AspNetCore.Mvc;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ProjectTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectIdController : ControllerBase
    {
        private readonly ProjectDbContext _context;

        public ProjectIdController(ProjectDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> GetProjectId([FromBody] CurrentProject project)
        {
            try
            {
                Console.WriteLine("current project's UserID is " + project.UserID);
                Console.WriteLine("current project's UserID is " + project.UserID);
                if (!int.TryParse(project.UserID, out int userId))
                {
                    return BadRequest(new { message = "Invalid or missing UserID" });
                }
                var userProjects = await _context.Projects
                    .Where(p => p.UserId == int.Parse(project.UserID) && p.Name == project.ProjectName)
                    .ToListAsync();

                if (userProjects == null || !userProjects.Any())
                {
                    return NotFound(new { message = "No projects created yet!" });
                }
                else
                {
                    
                    return Ok(new { projectid = userProjects.First().Id });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting projects: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("project")]
        public async Task<IActionResult> GetProject([FromBody] CurrentProject project)
        {
            try
            {
                Console.WriteLine("current project's UserID is " + project.UserID);
                Console.WriteLine("current project's UserID is " + project.UserID);
                if (!int.TryParse(project.UserID, out int userId))
                {
                    return BadRequest(new { message = "Invalid or missing UserID" });
                }
                var userProject = await _context.Projects
                    .FirstOrDefaultAsync(p => p.UserId == int.Parse(project.UserID) && p.Name == project.ProjectName);

                if (userProject == null)
                {
                    return NotFound(new { message = "No project matching yet!" });
                }
                else
                {
                    
                    return Ok(userProject);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting projects: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("update")]
public async Task<IActionResult> UpdateProject([FromBody] UpdatedProject project)
{
    try
    {

        var updatedProject = await _context.Projects
            .FirstOrDefaultAsync(p => p.UserId == project.UserID && p.Name == project.ProjectName);

        if (updatedProject == null)
        {
            return NotFound(new { message = "No project matching yet!" });
        }

        if (!string.IsNullOrWhiteSpace(project.UpdatedDescription) && project.UpdatedDescription != updatedProject.Description)
        {
            updatedProject.Description = project.UpdatedDescription;
        }

        if (project.UpdatedDue.HasValue && project.UpdatedDue.Value != updatedProject.DueTime)
        {
            updatedProject.DueTime = project.UpdatedDue.Value;
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "All information is updated!" });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error updating project: {ex.Message}");
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}

    }
}
