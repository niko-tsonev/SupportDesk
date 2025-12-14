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

        public ReplyService(SupportDeskDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<ReplyResponseDto>> GetRepliesByTicketIdAsync(Guid ticketId)
        {
            var replies = await _context.TicketReplies
                .Where(r => r.TicketId == ticketId)
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
            // Check if ticket exists
            var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == ticketId);
            if (!ticketExists)
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

            return true;
        }
    }
}
