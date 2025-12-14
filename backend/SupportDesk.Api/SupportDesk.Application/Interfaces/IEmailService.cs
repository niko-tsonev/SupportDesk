namespace SupportDesk.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendReplyNotificationAsync(string toEmail, string ticketSubject, string replyMessage);
    }
}
