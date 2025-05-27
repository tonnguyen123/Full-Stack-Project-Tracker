using System.ComponentModel.DataAnnotations;  // Add this line

namespace ProjectTrackerAPI.Models
{
    public class VerifyCode
    {
       [Required]  
    public int Id { get; set; }

    [Required]  
    public string VerificationCode { get; set; }

    // Constructor to initialize non-nullable properties
    public VerifyCode(int ID, string verificationCode)
    {
        Id = ID;
        VerificationCode = verificationCode;
    }
    }
}
