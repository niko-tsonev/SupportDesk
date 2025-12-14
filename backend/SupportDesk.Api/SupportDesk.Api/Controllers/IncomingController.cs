using Microsoft.AspNetCore.Mvc;
using SupportDesk.Application.DTOs.Email;
using SupportDesk.Domain.Entities;
using SupportDesk.Domain.Enums;
using SupportDesk.Infrastructure.Data;

namespace SupportDesk.Api.Controllers
{
    [ApiController]
    [Route("api/incoming")]
    public class IncomingController : ControllerBase
    {
        private readonly SupportDeskDbContext _context;

        public IncomingController(SupportDeskDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Simulates an incoming email webhook (e.g. AWS SES, SendGrid)
        /// </summary>
        [HttpPost("email")]
        public async Task<IActionResult> IncomingEmail([FromBody] IncomingEmailDto dto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var fromEmail = dto.FromEmail?.Trim();
            var subject = dto.Subject?.Trim();
            var body = dto.Body?.Trim();

            if (string.IsNullOrWhiteSpace(fromEmail) ||
                string.IsNullOrWhiteSpace(subject) ||
                string.IsNullOrWhiteSpace(body))
            {
                return BadRequest("Invalid email payload");
            }

            // Enforce additional server-side limits to protect DB
            const int MaxSubjectLength = 200;
            const int MaxBodyLength = 5000;
            const int MaxEmailLength = 256;

            if (subject.Length > MaxSubjectLength)
            {
                subject = subject.Substring(0, MaxSubjectLength);
            }
            if (body.Length > MaxBodyLength)
            {
                body = body.Substring(0, MaxBodyLength);
            }
            if (fromEmail.Length > MaxEmailLength)
            {
                fromEmail = fromEmail.Substring(0, MaxEmailLength);
            }

            var ticket = new Ticket
            {
                Subject = subject,
                CustomerEmail = fromEmail,
                Description = body,
                Status = TicketStatus.New,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = "EMAIL"
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                ticket.Id,
                Message = "Ticket created from email"
            });
        }
    }
}
