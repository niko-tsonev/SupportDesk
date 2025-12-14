namespace SupportDesk.Application.DTOs.Tickets
{
    public class ReplyResponseDto
    {
        public Guid Id { get; set; }
        public string Message { get; set; } = null!;
        public bool IsInternal { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; } = null!;
    }
}
