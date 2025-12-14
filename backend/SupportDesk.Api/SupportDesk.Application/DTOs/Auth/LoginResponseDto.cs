namespace SupportDesk.Application.DTOs.Auth
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public string Role { get; set; } = null!;
    }
}
