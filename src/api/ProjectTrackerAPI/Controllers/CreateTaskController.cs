using Microsoft.AspNetCore.Mvc;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

using TaskModel = ProjectTrackerAPI.Models.TaskItem; 

namespace ProjectTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CreateTaskController : ControllerBase
    {
        private readonly ProjectDbContext _context;

        public CreateTaskController(ProjectDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskItem task)
        {
            try
            {
                var existingTask = await _context.Tasks
                    .FirstOrDefaultAsync(t => t.Name == task.Name && t.ProjectId == task.ProjectId);

                if (existingTask == null)
                {
                    var newTask = new TaskModel
                    {
                        Name = task.Name,
                        Description = task.Description,
                        Status = "pending",
                        ProjectId = task.ProjectId,
                        Due = task.Due,
                        Priority = task.Priority,
                        AssignedId = task.AssignedId,
                        percentage = task.percentage
                    };

                    _context.Tasks.Add(newTask);
                    await _context.SaveChangesAsync();

                    return Ok(new { ProjectId = newTask.ProjectId, TaskName = newTask.Name });
                }
                else
                {
                if (task.Description == existingTask.Description &&
                        task.Due == existingTask.Due &&
                        task.Priority == existingTask.Priority &&
                        task.AssignedId == existingTask.AssignedId
                        && task.Status == existingTask.Status
                        && task.percentage == existingTask.percentage)
                    {
                        return BadRequest(new { message = "Task with the same name already exists in this project." });
                    }

                    // Only update if something is different
                    existingTask.Description = task.Description;
                    existingTask.Due = task.Due;
                    existingTask.Priority = task.Priority;
                    existingTask.AssignedId = task.AssignedId;
                    existingTask.Status = task.Status;
                    existingTask.percentage = task.percentage;

                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Task updated successfully." });

                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
