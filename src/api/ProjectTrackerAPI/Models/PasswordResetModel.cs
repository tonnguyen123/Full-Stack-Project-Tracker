using System.ComponentModel.DataAnnotations;  // Add this line

namespace ProjectTrackerAPI.Models
{
    public class PasswordResetModel
    {
       [Required]  // Ensure that Email is required
    public string Token { get; set; }

    [Required]  // Ensure that VerificationCode is required
    public string NewPassword { get; set; }

    // Constructor to initialize non-nullable properties
    public PasswordResetModel(string token, string newpassword)
    {
        Token = token;
        NewPassword = newpassword;
    }
    }
}
