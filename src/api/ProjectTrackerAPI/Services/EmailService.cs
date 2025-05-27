using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace ProjectTrackerAPI.Services{

    public class EmailService{
        private readonly string _sendGridApiKey;
        public EmailService(IConfiguration configuration){
            _sendGridApiKey = configuration["SendGrid:ApiKey"] ?? throw new Exception("SendGrid API Key is missing from appsettings.json!");

        
        if (string.IsNullOrEmpty(_sendGridApiKey)){
            throw new Exception("SendGrid API Key is missing from appsettings.json!");
        }

        
    }

    public async Task<bool> SendVerificationEmail(string userEmail, string code){
         var client = new SendGridClient(_sendGridApiKey);
         var from = new EmailAddress("tontaro2802@gmail.com", "Ton's Project Tracker");
         var subject = "Verification Code for your account";
         var to = new EmailAddress(userEmail);
         var plainTextContent = $"Your verification code is: {code}";
         var htmlContent = $"<p>Your verfication code is: <strong>{code}</strong></p>";
         var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent,htmlContent);
         var response = await client.SendEmailAsync(msg);
         return response.StatusCode == System.Net.HttpStatusCode.Accepted;
    }

}

}