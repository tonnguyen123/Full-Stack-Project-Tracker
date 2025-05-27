using System.ComponentModel.DataAnnotations;  // Add this line

namespace ProjectTrackerAPI.Models
{
    public class TaskItem
    {
        [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "pending"; // pending, in_progress, completed

    public int ? ProjectId { get; set; }

    public DateTime Due {get; set;}

    public string ? Priority {get; set;}

    public int AssignedId { get; set; } 

    public int percentage { get; set; }

   
    public Project? Project { get; set; }


    }
}
