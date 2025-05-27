using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectTrackerAPI.Models
{
    public class Task
    {
        [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "pending"; // pending, in_progress, completed

    public int ProjectId { get; set; }

    public DateTime Due {get; set;}

    public string ? Priority {get; set;}
    
    public int ? Percentage{ get; set; }

    public int AssginedId { get; set; }

    [Required]  // Mark Project as required
    public Project Project { get; set; }

    // Constructor to initialize non-nullable properties
    public Task()
    {
        Project = new Project();  // Initialize Project if needed
    }
    }
}
