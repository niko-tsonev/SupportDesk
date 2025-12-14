using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SupportDesk.Api.Extensions;
using SupportDesk.Application.DTOs.Tickets;
using SupportDesk.Application.Interfaces;
using SupportDesk.Domain.Identity;
using System.Security.Claims;

namespace SupportDesk.Api.Controllers
{
    [ApiController]
    [Route("api/tickets")]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketService _ticketService;
        private readonly UserManager<AppUser> _userManager;

        public TicketsController(
            ITicketService ticketService,
            UserManager<AppUser> userManager)
        {
            _ticketService = ticketService;
            _userManager = userManager;
        }

        // -------------------------------
        // GET: Catalog (Public)
        // -------------------------------
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tickets = await _ticketService.GetAllAsync();
            return Ok(tickets);
        }

        // -------------------------------
        // GET: Details (Public)
        // -------------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var ticket = await _ticketService.GetByIdAsync(id);
            if (ticket == null) return NotFound();
            return Ok(ticket);
        }

        // -------------------------------
        // POST: Create Ticket (Authenticated)
        // -------------------------------
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateTicketDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.GetUserId();

            var createdId = await _ticketService.CreateAsync(userId, dto);
            if (createdId == null) return Unauthorized();

            return CreatedAtAction(nameof(GetById), new { id = createdId.Value }, createdId.Value);
        }

        // -------------------------------
        // PUT: Update Ticket (Author or Admin)
        // -------------------------------
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateTicketDto dto)
        {
            var userId = User.GetUserId();
            var isAdmin = User.IsInRole("Admin");

            var ok = await _ticketService.UpdateAsync(id, userId, isAdmin, dto);
            if (!ok) return Forbid();
            return NoContent();
        }

        // -------------------------------
        // DELETE: Ticket (Admin only)
        // -------------------------------
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var ok = await _ticketService.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        // -------------------------------
        // POST: Assign Ticket
        // -------------------------------
        [Authorize]
        [HttpPost("{id}/assign")]
        public async Task<IActionResult> Assign(Guid id)
        {
            var userId = User.GetUserId();
            var ok = await _ticketService.AssignAsync(id, userId);
            if (!ok) return NotFound();
            return NoContent();
        }

        // -------------------------------
        // POST: Close Ticket
        // -------------------------------
        [Authorize]
        [HttpPost("{id}/close")]
        public async Task<IActionResult> Close(Guid id)
        {
            var userId = User.GetUserId();
            var isAdmin = User.IsInRole("Admin");

            var ok = await _ticketService.CloseAsync(id, userId, isAdmin);
            if (!ok) return Forbid();
            return NoContent();
        }
    }
}
