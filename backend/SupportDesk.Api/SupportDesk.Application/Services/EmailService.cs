using Microsoft.Extensions.Configuration;
using SupportDesk.Application.Interfaces;
using System.Net;
using System.Net.Mail;

namespace SupportDesk.Application.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendReplyNotificationAsync(string toEmail, string ticketSubject, string replyMessage)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            var fromEmail = smtpSettings["FromEmail"];
            var fromName = smtpSettings["FromName"];
            var host = smtpSettings["Host"];
            var port = int.Parse(smtpSettings["Port"] ?? "587");
            var username = smtpSettings["Username"];
            var password = smtpSettings["Password"];
            var enableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true");

            using var smtpClient = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = enableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail!, fromName),
                Subject = $"Re: {ticketSubject}",
                Body = $@"
Hello,

You have received a new reply to your support ticket: {ticketSubject}

Reply:
{replyMessage}

---
This is an automated message from SupportDesk.
",
                IsBodyHtml = false
            };

            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
