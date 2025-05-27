using System;
using System.Security.Cryptography;
using System.Text;
using ProjectTrackerAPI.Models;
using ProjectTrackerAPI.Data;

public class ResetToken
{
    private readonly ProjectDbContext _context;

    public ResetToken(ProjectDbContext context)
    {
        _context = context;
    }
    

    public string GeneratePasswordResetToken(int userId)
    {
        // Create a unique token
        var token = Guid.NewGuid().ToString();

        // Get current time and set expiration to 1 hour from now
        var expirationTime = DateTime.Now.AddHours(1);

        var user = _context.Users.Find(userId);
        if (user != null)
        {   
            user.ResetPasswordToken = token;
            user.ResetPasswordTokenExpiration = expirationTime;
            _context.SaveChanges();
        }

        return token;
    }
}
