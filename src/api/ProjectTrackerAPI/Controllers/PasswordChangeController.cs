using Microsoft.AspNetCore.Mvc;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Services;
using ProjectTrackerAPI.Helpers;
using System;
using System.Linq;
using System.Threading.Tasks;
using ProjectTrackerAPI.Data;

namespace ProjectTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordChangeController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly ProjectDbContext _context;

        public PasswordChangeController(EmailService emailService, ProjectDbContext context)
        {
            _emailService = emailService;
            _context = context;
        }

 [HttpPost("send-email")]
public async Task<IActionResult> Send([FromBody] PasswordChangeRequest user)
{
    try
    {
        if (string.IsNullOrWhiteSpace(user.UserID) || !int.TryParse(user.UserID, out int userId))
        {
            return BadRequest(new { message = "Invalid user ID." });
        }

        string verificationCode = new Random().Next(100000, 999999).ToString();

        var existingUser = _context.Users.FirstOrDefault(u => u.Id == userId);

        if (existingUser != null)
        {
            existingUser.VerificationCode = verificationCode;
            await _context.SaveChangesAsync();

            bool emailSent = await _emailService.SendVerificationEmail(existingUser.Email, verificationCode);
            if (emailSent)
            {
                return Ok(new { message = "Verification email sent." });
            }
            else
            {
                return BadRequest(new { message = "Something went wrong. Please try again." });
            }
        }

        return BadRequest(new { message = "User not found." }); // Safe fallback
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Register error: {ex.Message}");
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}


        [HttpPost("verify-code")]
        public IActionResult VerifyCode([FromBody] VerifyCode currUser)
        {
           
            var user = _context.Users.FirstOrDefault(u => u.Id == currUser.Id);

            // Check if user exists
            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }


            // Verify the code
            if (user.VerificationCode != currUser.VerificationCode)
            {
                return BadRequest(new { message = "Invalid verification code." });
            }

            user.Verified = true;
            _context.SaveChanges();
           
            return Ok(new { message = "User verified successfully!" });
        }


       [HttpPost("password-change")]
public IActionResult ChangePassword([FromBody] PasswordChangeRequest info)
{
    if (string.IsNullOrWhiteSpace(info.UserID) || !int.TryParse(info.UserID, out int userId))
    {
        return BadRequest(new { message = "Invalid user ID." });
    }

    if (string.IsNullOrWhiteSpace(info.OldPass))
    {
        return BadRequest(new { message = "Old password is required." });
    }

    if (string.IsNullOrWhiteSpace(info.NewPass))
    {
        return BadRequest(new { message = "New password is required." });
    }

    var user = _context.Users.FirstOrDefault(u => u.Id == userId);
    if (user == null)
    {
        return BadRequest(new { message = "User not found" });
    }

    if (CreateHash.VerifyPasswordHas(info.OldPass, user.PasswordHash, user.PasswordSalt))
    {
        CreateHash.CreatePaswordHash(info.NewPass, out byte[] passwordHash, out byte[] passwordSalt);
        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;
        _context.SaveChanges();
        return Ok(new { message = "Successful Password Change!" });
    }
    else
    {
        return BadRequest(new { message = "Unsuccessful Password Change" });
    }
}
}

}

