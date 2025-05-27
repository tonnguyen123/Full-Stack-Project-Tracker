using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ProjectTrackerAPI.Models; 


namespace ProjectTrackerAPI.Models{

    [Table("Teams")]
public class Team {
    public int Id {get; set;}
    public string ? Name {get;set;}

    public int ? OwnerId {get;set;}
    public User ? Owner {get;set;}
    public ICollection<User> ? Members{get;set;}
    public ICollection<Project> ? Projects { get; set; }

}

}
