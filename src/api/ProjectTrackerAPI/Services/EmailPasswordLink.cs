using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace ProjectTrackerAPI.Services{

    public class EmailPasswordLink{
        private readonly string _sendGridApiKey;
        public EmailPasswordLink(IConfiguration configuration){
            _sendGridApiKey = configuration["SendGrid:ApiKey"] ?? throw new Exception("SendGrid API Key is missing from appsettings.json!");

        
        if (string.IsNullOrEmpty(_sendGridApiKey)){
            throw new Exception("SendGrid API Key is missing from appsettings.json!");
        }

        
    }

     public async Task<bool> SendPasswordResetEmail(string userEmail, string resetLink)
    {   Console.WriteLine(resetLink);
        var client = new SendGridClient(_sendGridApiKey);
        var from = new EmailAddress("tontaro2802@gmail.com", "Project Tracker");
        var subject = "Reset Your Password";
        var to = new EmailAddress(userEmail);
        var plainTextContent = $"To reset your password, click the link below:\n{resetLink}";
        var htmlContent = $"<p>To reset your password, click the link below:</p><a href='{resetLink}'>Reset Password</a>";

        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
        var response = await client.SendEmailAsync(msg);
        Console.WriteLine(response.StatusCode);
        return response.StatusCode == System.Net.HttpStatusCode.Accepted;
    }

}

}