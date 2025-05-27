using System.ComponentModel.DataAnnotations;  // Add this line

namespace ProjectTrackerAPI.Models
{
    public class VerificationDto
    {
       [Required]  // Ensure that Email is required
    public string Email { get; set; }

    [Required]  // Ensure that VerificationCode is required
    public string VerificationCode { get; set; }

    // Constructor to initialize non-nullable properties
    public VerificationDto(string email, string verificationCode)
    {
        Email = email;
        VerificationCode = verificationCode;
    }
    }
}
