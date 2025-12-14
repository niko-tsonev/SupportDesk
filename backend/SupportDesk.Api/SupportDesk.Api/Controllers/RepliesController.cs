using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupportDesk.Api.Extensions;
using SupportDesk.Application.DTOs.Tickets;
using SupportDesk.Domain.Entities;
using SupportDesk.Infrastructure.Data;

namespace SupportDesk.Api.Controllers
{
    [ApiController]
    [Route("api/tickets/{ticketId}/replies")]
    public class RepliesController : ControllerBase
    {
        private readonly SupportDeskDbContext _context;

        public RepliesController(SupportDeskDbContext context)
        {
            _context = context;
        }

        // GET replies
        [HttpGet]
        public async Task<IActionResult> GetReplies(Guid ticketId)
        {
            var replies = await _context.TicketReplies
                .Where(r => r.TicketId == ticketId)
                .OrderBy(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Message,
                    r.IsInternal,
                    r.CreatedAt,
                    r.UserId
                })
                .ToListAsync();

            return Ok(replies);
        }

        // POST reply
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddReply(Guid ticketId, [FromBody] CreateReplyDto dto)
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized();

            var reply = new TicketReply
            {
                TicketId = ticketId,
                UserId = userId,
                Message = dto.Message,
                IsInternal = dto.IsInternal
            };

            _context.TicketReplies.Add(reply);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
