using SupportDesk.Domain.Enums;

namespace SupportDesk.Application.DTOs.Tickets
{
    public class TicketResponseDto
    {
        public Guid Id { get; set; }
        public string Subject { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public string Description { get; set; } = null!;
        public TicketStatus Status { get; set; }

        public string? AssignedToUserEmail { get; set; }
        public string? AssignedToUserName { get; set; }
        public string? AssignedToUserId { get; set; }

        public string CreatedByUserId { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
