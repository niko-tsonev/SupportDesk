using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SupportDesk.Api.Extensions;
using SupportDesk.Application.DTOs.Tickets;
using SupportDesk.Application.Interfaces;

namespace SupportDesk.Api.Controllers
{
    [ApiController]
    [Route("api/tickets/{ticketId}/replies")]
    public class RepliesController : ControllerBase
    {
        private readonly IReplyService _replyService;

        public RepliesController(IReplyService replyService)
        {
            _replyService = replyService;
        }

        // GET replies
        [HttpGet]
        public async Task<IActionResult> GetReplies(Guid ticketId)
        {
            var replies = await _replyService.GetRepliesByTicketIdAsync(ticketId);
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

            var result = await _replyService.AddReplyAsync(ticketId, userId, dto);
            
            if (!result)
                return NotFound("Ticket not found");

            return Ok();
        }
    }
}
