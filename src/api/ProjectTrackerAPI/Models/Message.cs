using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectTrackerAPI.Models
{
    public class Message
{
    public int Id { get; set; }
    public int  ? SenderId { get; set; }
    public int  ?ReceiverId { get; set; }
    public int  ? ProjectId { get; set; }
    public string  ? MessageText { get; set; }
    public DateTime ? Timestamp { get; set; } = DateTime.UtcNow;

    public string ? FileName{get;set;}
    public string ? FilePath{get;set;}

     public User ? Sender { get; set; }
    public User ? Receiver { get; set; }
    public Project ? Project { get; set; }
}


}


