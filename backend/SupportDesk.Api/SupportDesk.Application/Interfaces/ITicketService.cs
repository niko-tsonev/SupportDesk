using SupportDesk.Application.DTOs.Tickets;

namespace SupportDesk.Application.Interfaces
{
    public interface ITicketService
    {
        Task<IReadOnlyList<TicketResponseDto>> GetAllAsync();
        Task<TicketResponseDto?> GetByIdAsync(Guid id);
        Task<Guid?> CreateAsync(string? userId, CreateTicketDto dto);
        Task<bool> UpdateAsync(Guid id, string? userId, bool isAdmin, UpdateTicketDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> AssignAsync(Guid id, string? userId);
        Task<bool> CloseAsync(Guid id, string? userId, bool isAdmin);
    }
}