using System.ComponentModel.DataAnnotations;  // Add this line

namespace ProjectTrackerAPI.Models
{
    public class TeamInfo
    {
        [Key]
    public string Name { get; set; } = string.Empty;
    public List<string> Members { get; set; } = new();

    public List<int> ProjectIds { get; set; } = new();

   public int ? OwnerId {get; set;}

    }
}
