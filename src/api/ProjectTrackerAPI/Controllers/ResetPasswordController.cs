using Microsoft.AspNetCore.Mvc;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Data;
using ProjectTrackerAPI.Services; // ✅ Make sure this is here to find EmailUsername
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ProjectTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResetPasswordController : ControllerBase // ✅ Controller class name fixed
    {
        private readonly EmailPasswordLink _emailService;
        private readonly ProjectDbContext _context;

        public ResetPasswordController(EmailPasswordLink emailService, ProjectDbContext context)
        {
            _emailService = emailService;
            _context = context;
        }

       [HttpPost("request-password-reset")]
public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordRequestModel user)
{
    try
    {
        if (string.IsNullOrWhiteSpace(user.Email))
        {
            return BadRequest(new { message = "Email is required." });
        }
        var existingUser = await _context.Users
            .Where(u => u.Email == user.Email)
            .FirstOrDefaultAsync();

        if (existingUser != null)
        {
            // Ensure ResetPasswordToken is not DBNull
            var resetToken = new ResetToken(_context).GeneratePasswordResetToken(existingUser.Id);
            var resetLink = $"http://localhost:5173/reset-password?token={resetToken}";
            
            var emailSent = await _emailService.SendPasswordResetEmail(user.Email, resetLink);
            Console.WriteLine(emailSent);
            if (emailSent)
            {
                existingUser.ResetPasswordToken = resetToken;
                existingUser.ResetPasswordTokenExpiration = DateTime.Now.AddHours(1);
                await _context.SaveChangesAsync();
                Console.WriteLine("Saved reset link successfully!");
                return Ok(new { message = "Link to reset your password has been sent to your email. Please check it." });
            }
            else
            {
                return BadRequest(new { message = "Something went wrong. Please try again." });
            }
        }
        else
        {
            return BadRequest(new { message = "There is no registered account associated with the email you entered." });
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordResetModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ResetPasswordToken == model.Token);

            if (user == null || user.ResetPasswordTokenExpiration < DateTime.Now)
            {
                return BadRequest(new { message = "Invalid or expired reset token." });
            }

            user.Password = model.NewPassword; // Make sure to hash the password before saving it.
            user.ResetPasswordToken = ""; // Clear the token after reset
            user.ResetPasswordTokenExpiration = null;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Password has been reset successfully." });
        }
    }
}
