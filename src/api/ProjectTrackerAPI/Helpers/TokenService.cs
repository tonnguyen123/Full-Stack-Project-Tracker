using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ProjectTrackerAPI.Models;
using Microsoft.Extensions.Configuration;

public static class TokenService
{
    public static string GenerateToken(User user, IConfiguration configuration)
    {
        // Define the claims to be included in the token.  
        // These can include user id, username, roles, etc.
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        // Get the secret key from configuration and create a symmetric key.
        var jwtKey = configuration["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key", "JWT key is missing in configuration.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        // Create the token.
        var tokenDescriptor = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );

        // Return the token string.
        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }
}
