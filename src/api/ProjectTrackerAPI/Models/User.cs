using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ProjectTrackerAPI.Models; 

public class User
{
    [Key]
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string VerificationCode { get; set; } = string.Empty;
    public bool Verified { get; set; } = false;

    public string? ResetPasswordToken { get; set; }

    public DateTime? ResetPasswordTokenExpiration { get; set; }

    // Navigation property for Projects
    public List<Project> Projects { get; set; } = new List<Project>();  // Add this property
    public List<Project> SharedProjects { get; set; } = new List<Project>();  // Add this property

   public byte[] PasswordHash { get; set; } = default!;
    public byte[] PasswordSalt { get; set; } = default!;

     public ICollection<Team> ? Teams { get; set; } 


}
