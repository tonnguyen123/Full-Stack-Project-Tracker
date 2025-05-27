using Microsoft.AspNetCore.Mvc;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Data;
using ProjectTrackerAPI.Services; 
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ProjectTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SendUserNameController : ControllerBase 
    {
        private readonly EmailUsername _emailService;
        private readonly ProjectDbContext _context;

        // ✅ Constructor name must match class name
        public SendUserNameController(EmailUsername emailService, ProjectDbContext context)
        {
            _emailService = emailService;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] PasswordRequestModel user)
        {
            try
            {
                if(string.IsNullOrEmpty(user.Email)){
                    return BadRequest(new { message = "Email is required." });
                }
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
                Console.WriteLine(user.Email);
                if (existingUser != null)
                {
                    bool emailSent = await _emailService.SendVerificationEmail(user.Email, existingUser.Username);
                    if (emailSent)
                    {
                        return Ok(new { message = "Your username has been sent to your email. Please check it." });
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
                Console.WriteLine($"Username recovery error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
