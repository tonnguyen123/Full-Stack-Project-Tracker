using Microsoft.AspNetCore.Mvc;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Services;
using ProjectTrackerAPI.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UpdateemailController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly ProjectDbContext _context;

        public UpdateemailController(EmailService emailService, ProjectDbContext context)
        {
            _emailService = emailService;
            _context = context;
        }

        [HttpPost("send-email")]
public async Task<IActionResult> SendEmail([FromBody] EmailUpdateModel currUser)
{
    if (string.IsNullOrWhiteSpace(currUser.Id) || !int.TryParse(currUser.Id, out int userId))
        return BadRequest(new { message = "Invalid or missing user ID." });

    if (string.IsNullOrWhiteSpace(currUser.NewEmail))
        return BadRequest(new { message = "Email cannot be empty." });

    var user = _context.Users.FirstOrDefault(u => u.Id == userId);
    if (user == null)
        return BadRequest(new { message = "User not found." });

    string verificationCode = new Random().Next(100000, 999999).ToString();
    bool emailSent = await _emailService.SendVerificationEmail(currUser.NewEmail, verificationCode);

    if (!emailSent)
        return BadRequest(new { message = "Something went wrong. Please try again." });

    user.VerificationCode = verificationCode;
    await _context.SaveChangesAsync();

    return Ok(new { message = "Verification code sent to your email." });
}


        [HttpPost("save-email")]
        public async Task<IActionResult> SaveEmail([FromBody] EmailUpdateModel currUser)

        {
            if (string.IsNullOrWhiteSpace(currUser.Id) || !int.TryParse(currUser.Id, out int userId)){
            return BadRequest(new { message = "Invalid or missing user ID." });
            }

        if (string.IsNullOrWhiteSpace(currUser.NewEmail))
        {
            return BadRequest(new { message = "Email cannot be empty." });
        }

        if (string.IsNullOrWhiteSpace(currUser.VerificationCode))
        {
            return BadRequest(new { message = "Verification code is required." });
        }

        var user = _context.Users.FirstOrDefault(u => u.Id == userId);
        

            Console.WriteLine("email " + currUser.NewEmail + " id is " + currUser.Id + " verification is " + currUser.VerificationCode);

            if (user == null){
                return BadRequest(new { message = "User not found." });
            }

            if (currUser.VerificationCode != user.VerificationCode){
                return BadRequest(new { message = "The code does not match." });
                
        }

            user.Email = currUser.NewEmail; 

            await _context.SaveChangesAsync();

            return Ok(new { message = "Email changed successfully!" });
        }
    }
}
