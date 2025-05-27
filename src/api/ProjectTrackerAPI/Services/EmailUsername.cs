using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace ProjectTrackerAPI.Services{

    public class EmailUsername{
        private readonly string _sendGridApiKey;
        public EmailUsername(IConfiguration configuration){
            _sendGridApiKey = configuration["SendGrid:ApiKey"] ?? throw new Exception("SendGrid API Key is missing from appsettings.json!");

        
        if (string.IsNullOrEmpty(_sendGridApiKey)){
            throw new Exception("SendGrid API Key is missing from appsettings.json!");
        }

        
    }

    public async Task<bool> SendVerificationEmail(string userEmail, string username){
         var client = new SendGridClient(_sendGridApiKey);
         var from = new EmailAddress("tontaro2802@gmail.com", "Ton's Project Tracker");
         var subject = "Your User name for Ton's Project Tracker";
         var to = new EmailAddress(userEmail);
         var plainTextContent = $"Your user name is: {username}";
         var htmlContent = $"<p>our user name is: <strong>{username}</strong></p>";
         var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent,htmlContent);
         var response = await client.SendEmailAsync(msg);
         Console.WriteLine(response.StatusCode);
         return response.StatusCode == System.Net.HttpStatusCode.Accepted;
    }

}

}