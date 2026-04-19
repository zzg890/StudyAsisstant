using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyAssistant.Server.Contracts.Auth;
using StudyAssistant.Server.Data;
using StudyAssistant.Server.Infrastructure.Auth;

namespace StudyAssistant.Server.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(StudyAssistantDbContext dbContext, JwtTokenFactory tokenFactory) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.UserName == request.UserName);
        if (user is null || !user.IsActive || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized("用户名或密码错误。");
        }

        var token = tokenFactory.CreateToken(user);

        return Ok(new LoginResponse
        {
            Token = token,
            UserName = user.UserName,
            Role = user.Role,
            DisplayName = user.DisplayName
        });
    }
}
