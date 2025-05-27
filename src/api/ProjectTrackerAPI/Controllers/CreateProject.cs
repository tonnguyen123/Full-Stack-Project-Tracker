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
public class CreateProject : ControllerBase
{
    private readonly ProjectDbContext _context;

    public CreateProject(ProjectDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Createproject([FromBody] Project project)
    {
        try
        {
            var existingProject = await _context.Projects
                .FirstOrDefaultAsync(p => p.Name == project.Name && p.UserId == project.UserId);

            if (existingProject == null)
            {
                var newProject = new Project
                {
                    Name = project.Name,
                    Description = project.Description,
                    UserId = project.UserId,
                    CreatedAt = project.CreatedAt,
                    DueTime = project.DueTime
                };

                _context.Projects.Add(newProject);
                await _context.SaveChangesAsync();
                Console.WriteLine(newProject.UserId);
                Console.WriteLine(newProject.Name);
               

                return Ok(new { UserID = newProject.UserId, ProjectName = newProject.Name });

            }
            else
            {
                return BadRequest(new { message = "Existing Project's name in your profile. Please choose different name" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
}


}
