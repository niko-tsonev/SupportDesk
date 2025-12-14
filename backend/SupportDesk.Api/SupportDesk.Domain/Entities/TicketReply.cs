using SupportDesk.Domain.Identity;

namespace SupportDesk.Domain.Entities
{
    public class TicketReply
    {
        public Guid Id { get; set; }

        public Guid TicketId { get; set; }
        public Ticket Ticket { get; set; } = null!;

        public string UserId { get; set; } = null!;
        public AppUser User { get; set; } = null!;

        public string Message { get; set; } = null!;

        // Internal note vs customer-visible
        public bool IsInternal { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
