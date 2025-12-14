using SupportDesk.Application.DTOs.Tickets;

namespace SupportDesk.Application.Interfaces
{
    public interface IReplyService
    {
        Task<IReadOnlyList<ReplyResponseDto>> GetRepliesByTicketIdAsync(Guid ticketId, bool isAuthenticated);
        Task<bool> AddReplyAsync(Guid ticketId, string userId, CreateReplyDto dto);
    }
}
