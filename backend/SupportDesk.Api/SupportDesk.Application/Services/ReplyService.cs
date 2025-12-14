using Microsoft.EntityFrameworkCore;
using SupportDesk.Application.DTOs.Tickets;
using SupportDesk.Application.Interfaces;
using SupportDesk.Domain.Entities;
using SupportDesk.Infrastructure.Data;

namespace SupportDesk.Application.Services
{
    public class ReplyService : IReplyService
    {
        private readonly SupportDeskDbContext _context;
        private readonly IEmailService _emailService;

        public ReplyService(SupportDeskDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<IReadOnlyList<ReplyResponseDto>> GetRepliesByTicketIdAsync(Guid ticketId, bool isAuthenticated)
        {
            var query = _context.TicketReplies
                .Where(r => r.TicketId == ticketId);

            // Filter out internal replies if user is not authenticated
            if (!isAuthenticated)
            {
                query = query.Where(r => !r.IsInternal);
            }

            var replies = await query
                .OrderBy(r => r.CreatedAt)
                .Select(r => new ReplyResponseDto
                {
                    Id = r.Id,
                    Message = r.Message,
                    IsInternal = r.IsInternal,
                    CreatedAt = r.CreatedAt,
                    UserId = r.UserId
                })
                .ToListAsync();

            return replies;
        }

        public async Task<bool> AddReplyAsync(Guid ticketId, string userId, CreateReplyDto dto)
        {
            // Get the ticket
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null)
                return false;

            var reply = new TicketReply
            {
                TicketId = ticketId,
                UserId = userId,
                Message = dto.Message,
                IsInternal = dto.IsInternal
            };

            _context.TicketReplies.Add(reply);
            await _context.SaveChangesAsync();

            // Send email notification if reply is not internal
            if (!dto.IsInternal)
            {
                try
                {
                    await _emailService.SendReplyNotificationAsync(
                        ticket.CustomerEmail,
                        ticket.Subject,
                        dto.Message
                    );
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the reply creation
                    // In production, you should use proper logging
                    Console.WriteLine($"Failed to send email: {ex.Message}");
                }
            }

            return true;
        }
    }
}
