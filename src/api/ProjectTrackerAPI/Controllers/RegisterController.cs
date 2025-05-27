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
    public class RegisterController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly ProjectDbContext _context;

        public RegisterController(EmailService emailService, ProjectDbContext context)
        {
            _emailService = emailService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationDto userRegistrationDto)
        {
            try
            {
                string verificationCode = new Random().Next(100000, 999999).ToString();

                // Check if the email is already registered
                var existingUser = _context.Users.FirstOrDefault(u => u.Email == userRegistrationDto.Email);

                // If the user exists and is not verified, update the verification code
                if (existingUser != null)
                {
                    if (existingUser.Verified == true)
                    {
                        return BadRequest(new { message = "Email already registered and verified. Please use a different email." });
                    }
                    // Update the verification code for the existing user
                    existingUser.VerificationCode = verificationCode;
                   
                  
                    await _context.SaveChangesAsync(); // Save the updated verification code

                    // Send a new verification email to the user
                    bool emailSent = await _emailService.SendVerificationEmail(userRegistrationDto.Email, verificationCode);
                    if (emailSent)
                    {
                        return Ok(new { message = "Verification email sent." });
                    }
                    else
                    {
                        return BadRequest(new { message = "Something went wrong. Please try again." });
                    }
                }

                CreateHash.CreatePaswordHash(userRegistrationDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

                // If the user doesn't exist, create a new one
                var newUser = new User
                {
                    Username = userRegistrationDto.Username,
                    Password = userRegistrationDto.Password,
                    Email = userRegistrationDto.Email,
                    VerificationCode = verificationCode,
                    Verified = false,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                // Send the verification email for the new user
                bool emailSentForNewUser = await _emailService.SendVerificationEmail(userRegistrationDto.Email, verificationCode);
                if (emailSentForNewUser)
                {
                    return Ok(new { message = "Verification email sent." });
                }
                else
                {
                    return BadRequest(new { message = "Something went wrong. Please try again." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Register error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("verify")]
        public IActionResult VerifyCode([FromBody] VerificationDto verificationDto)
        {
            Console.WriteLine($"Email: {verificationDto.Email}, Code: {verificationDto.VerificationCode}");
            var user = _context.Users.FirstOrDefault(u => u.Email == verificationDto.Email);

            // Check if user exists
            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }

            Console.WriteLine("Email from user in MySQL is " + user.Email);
            Console.WriteLine("Verification code from user in MySQL is " + user.VerificationCode);

            // Verify the code
            if (user.VerificationCode != verificationDto.VerificationCode)
            {
                return BadRequest(new { message = "Invalid verification code." });
            }

            user.Verified = true;
            _context.SaveChanges();
            return Ok(new { message = "User verified successfully!" });
        }
    }
}
