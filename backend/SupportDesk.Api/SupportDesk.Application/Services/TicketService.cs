using Microsoft.EntityFrameworkCore;
using SupportDesk.Application.DTOs.Tickets;
using SupportDesk.Application.Interfaces;
using SupportDesk.Domain.Entities;
using SupportDesk.Domain.Enums;
using SupportDesk.Infrastructure.Data;

namespace SupportDesk.Application.Services
{
    public class TicketService : ITicketService
    {
        private readonly SupportDeskDbContext _context;

        public TicketService(SupportDeskDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<TicketResponseDto>> GetAllAsync()
        {
            return await _context.Tickets
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TicketResponseDto
                {
                    Id = t.Id,
                    Subject = t.Subject,
                    CustomerEmail = t.CustomerEmail,
                    Description = t.Description,
                    Status = t.Status,
                    AssignedToUserId = t.AssignedToUserId,
                    CreatedByUserId = t.CreatedByUserId,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<TicketResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.Tickets
                .Where(t => t.Id == id)
                .Select(t => new TicketResponseDto
                {
                    Id = t.Id,
                    Subject = t.Subject,
                    CustomerEmail = t.CustomerEmail,
                    Description = t.Description,
                    Status = t.Status,
                    AssignedToUserId = t.AssignedToUserId,
                    CreatedByUserId = t.CreatedByUserId,
                    CreatedAt = t.CreatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<Guid?> CreateAsync(string? userId, CreateTicketDto dto)
        {
            if (string.IsNullOrEmpty(userId))
                return null;

            var ticket = new Ticket
            {
                Subject = dto.Subject,
                CustomerEmail = dto.CustomerEmail,
                Description = dto.Description,
                CreatedByUserId = userId,
                Status = TicketStatus.New
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            return ticket.Id;
        }

        public async Task<bool> UpdateAsync(Guid id, string? userId, bool isAdmin, UpdateTicketDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return false;

            if (ticket.CreatedByUserId != userId && !isAdmin)
                return false;

            ticket.Subject = dto.Subject;
            ticket.Description = dto.Description;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return false;

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AssignAsync(Guid id, string? userId)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return false;

            ticket.AssignedToUserId = userId;
            ticket.Status = TicketStatus.InProgress;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CloseAsync(Guid id, string? userId, bool isAdmin)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return false;

            if (ticket.AssignedToUserId != userId && !isAdmin)
                return false;

            ticket.Status = TicketStatus.Closed;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}