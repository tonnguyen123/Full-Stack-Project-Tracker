using Microsoft.AspNetCore.Mvc;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Data;
using System;
using System.Linq;
using ProjectTrackerAPI.Helpers;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; 


namespace ProjectTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ProjectDbContext _context;
         private readonly IConfiguration _configuration;

        public LoginController(ProjectDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("all-users")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

[HttpPost]
public async Task<IActionResult> LoginUser([FromBody] LoginRequest login)
{
    try
    {
        Console.WriteLine("Received login attempt:");
        Console.WriteLine("Username from user input: " + login.Username);
        Console.WriteLine("Password from user input: " + login.Password);

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == login.Username);

        if (existingUser == null)
        {
            return BadRequest(new { message = "Invalid Username or Password" });
        }

        if (!existingUser.Verified)
        {
            return BadRequest(new { message = "No account associated with this information" });
        }

        if (string.IsNullOrWhiteSpace(login.Password))
        {
            return BadRequest(new { message = "Password is required" });
        }

        if (CreateHash.VerifyPasswordHas(login.Password, existingUser.PasswordHash, existingUser.PasswordSalt))
        {
            var token = TokenService.GenerateToken(existingUser, _configuration);
            return Ok(new { token, userId = existingUser.Id, userName = existingUser.Username });
        }
        else
        {
            return BadRequest(new { message = "Invalid Username or Password" });
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Login failed: " + ex.Message); // Log the reason
        return StatusCode(500, new { error = "Internal Server Error", details = ex.Message });
    }
}


    }
}
