using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SupportDesk.Application.DTOs.Auth;
using SupportDesk.Application.Interfaces;

namespace SupportDesk.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [Authorize]
        [HttpGet("secure-test")]
        public IActionResult SecureTest()
        {
            return Ok("You are authenticated");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto requestModel)
        {
            var response = await _authService.LoginAsync(requestModel.Email, requestModel.Password);
            if (response == null) return Unauthorized("Invalid Credentials");
            return Ok(response);
        }
    }
}
