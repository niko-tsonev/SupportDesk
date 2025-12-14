using SupportDesk.Domain.Enums;
using SupportDesk.Domain.Identity;

namespace SupportDesk.Domain.Entities
{
    public class Ticket
    {
        public Guid Id { get; set; }

        // Customer data
        public string Subject { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public string Description { get; set; } = null!;

        // Status & assignment
        public TicketStatus Status { get; set; } = TicketStatus.New;

        public string? AssignedToUserId { get; set; }
        public AppUser? AssignedToUser { get; set; }

        // Creator (agent who created ticket manually)
        public string CreatedByUserId { get; set; } = null!;
        public AppUser CreatedByUser { get; set; } = null!;

        // Navigation
        public ICollection<TicketReply> Replies { get; set; } = new List<TicketReply>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
