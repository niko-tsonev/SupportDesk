using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SupportDesk.Application.DTOs.Tickets;
using SupportDesk.Application.Interfaces;
using SupportDesk.Domain.Entities;
using SupportDesk.Domain.Enums;
using SupportDesk.Domain.Identity;
using SupportDesk.Infrastructure.Data;

namespace SupportDesk.Application.Services
{
    public class TicketService : ITicketService
    {
        private readonly SupportDeskDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public TicketService(SupportDeskDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<IReadOnlyList<TicketResponseDto>> GetAllAsync()
        {
            var tickets = await _context.Tickets
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TicketResponseDto
                {
                    Id = t.Id,
                    Subject = t.Subject,
                    CustomerEmail = t.CustomerEmail,
                    Description = t.Description,
                    Status = t.Status,
                    IsPriority = t.IsPriority,
                    AssignedToUserId = t.AssignedToUserId,
                    CreatedByUserId = t.CreatedByUserId,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            foreach (var ticket in tickets.Where(t => t.AssignedToUserId != null))
            {
                var user = await _userManager.FindByIdAsync(ticket.AssignedToUserId!);
                if (user != null)
                {
                    ticket.AssignedToUserEmail = user.Email;
                    ticket.AssignedToUserName = user.UserName;
                }
            }

            return tickets;
        }

        public async Task<TicketResponseDto?> GetByIdAsync(Guid id)
        {
            var ticket = await _context.Tickets
            .Where(t => t.Id == id)
            .Select(t => new TicketResponseDto
            {
                Id = t.Id,
                Subject = t.Subject,
                CustomerEmail = t.CustomerEmail,
                Description = t.Description,
                Status = t.Status,
                IsPriority = t.IsPriority,
                AssignedToUserId = t.AssignedToUserId,
                CreatedByUserId = t.CreatedByUserId,
                CreatedAt = t.CreatedAt
            })
            .FirstOrDefaultAsync();

            if (ticket == null)
                return null;
            
            if (ticket.AssignedToUserId != null)
            {
                var user = await _userManager.FindByIdAsync(ticket.AssignedToUserId);
                if (user != null)
                {
                    ticket.AssignedToUserEmail = user.Email;
                    ticket.AssignedToUserName = user.UserName;
                }
            }

            return ticket;
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
                IsPriority = dto.IsPriority,
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
            ticket.IsPriority = dto.IsPriority;
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

        public async Task<bool> UnassignAsync(Guid id, string? userId)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return false;

            // Only allow unassigning if the ticket is assigned to the current user
            if (ticket.AssignedToUserId != userId)
                return false;

            ticket.AssignedToUserId = null;
            ticket.Status = TicketStatus.New;
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

        public async Task<IReadOnlyList<TicketResponseDto>> GetMyAssignedTicketsAsync(string userId)
        {
            var tickets = await _context.Tickets
                .Where(t => t.AssignedToUserId == userId && t.Status != TicketStatus.Closed)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TicketResponseDto
                {
                    Id = t.Id,
                    Subject = t.Subject,
                    CustomerEmail = t.CustomerEmail,
                    Description = t.Description,
                    Status = t.Status,
                    IsPriority = t.IsPriority,
                    AssignedToUserId = t.AssignedToUserId,
                    CreatedByUserId = t.CreatedByUserId,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            foreach (var ticket in tickets.Where(t => t.AssignedToUserId != null))
            {
                var user = await _userManager.FindByIdAsync(ticket.AssignedToUserId!);
                if (user != null)
                {
                    ticket.AssignedToUserEmail = user.Email;
                    ticket.AssignedToUserName = user.UserName;
                }
            }

            return tickets;
        }
    }
}