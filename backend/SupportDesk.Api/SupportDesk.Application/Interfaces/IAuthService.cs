using SupportDesk.Application.DTOs.Auth;

namespace SupportDesk.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(string email, string password);
    }
}