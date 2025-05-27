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
    public class TasksController : ControllerBase
    {
        private readonly ProjectDbContext _context;

        public TasksController(ProjectDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> GetTask([FromBody] CurrentProject project)
        {
            try
            {
                Console.WriteLine("current project's UserID is " + project.UserID);
                Console.WriteLine("current project's UserID is " + project.UserID);
                if (!int.TryParse(project.UserID, out int userId))
                {
                    return BadRequest(new { message = "Invalid or missing UserID" });
                }
                var tasks = await _context.Tasks
                    .Where(t => t.ProjectId == int.Parse(project.UserID))
                    .ToListAsync();


                if (tasks == null)
                {
                    return NotFound(new { message = "No task created yet!" });
                }
                else
                {
                    
                    return Ok(tasks);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting projects: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteTask([FromBody] TaskItem task){
            var existingTask = new TaskItem();
            try{
                if(task.ProjectId != 0d){
                    existingTask = await _context.Tasks
                    .FirstOrDefaultAsync(t => t.Name == task.Name && t.ProjectId == task.ProjectId
                    && t.Description == task.Description && t.Priority == task.Priority && t.Status == task.Status);

                }
                else{
                    existingTask = await _context.Tasks
                    .FirstOrDefaultAsync(t => t.Name == task.Name && t.Description == task.Description && t.Priority == task.Priority && t.Status == task.Status);
                }
                

                if (task == null) {
                    return NotFound();
                }

                if(existingTask == null){
                    return NotFound (new{message = "Task not found."});
                }
                _context.Tasks.Remove(existingTask);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Task deleted successfully." });

            }
            catch  (Exception ex)
            {
                Console.WriteLine($"Error getting projects: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("individual-tasks/{userId}")]

        public async Task<IActionResult> GetIndividualTasksk(int userId){
            try{
                var IndividualTasks = await _context.Tasks.Where(t => t.AssignedId == userId).ToListAsync();
                if(IndividualTasks == null){
                    return NotFound(new {message = "No individual task!"});
                }
                else{
                    return Ok(IndividualTasks);
                }
            }
            catch (Exception ex){
                Console.WriteLine($"Error getting projects: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");

            }
        }

    }
}