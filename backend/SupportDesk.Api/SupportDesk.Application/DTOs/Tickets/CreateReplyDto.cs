namespace SupportDesk.Application.DTOs.Tickets
{
    public class CreateReplyDto
    {
        public string Message { get; set; } = null!;
        public bool IsInternal { get; set; }
    }
}
