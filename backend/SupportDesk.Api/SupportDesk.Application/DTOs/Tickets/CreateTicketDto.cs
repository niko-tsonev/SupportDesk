namespace SupportDesk.Application.DTOs.Tickets
{
    public class CreateTicketDto
    {
        public string Subject { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}
