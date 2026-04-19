using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyAssistant.Server.Contracts.Users;
using StudyAssistant.Server.Data;
using StudyAssistant.Server.Infrastructure.Auth;
using StudyAssistant.Server.Models;

namespace StudyAssistant.Server.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public sealed class UsersController(StudyAssistantDbContext dbContext) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<object>> GetMyProfile()
    {
        var userName = User.FindFirstValue(ClaimTypes.Name);
        if (string.IsNullOrWhiteSpace(userName))
        {
            return Unauthorized();
        }

        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.UserName == userName);
        if (user is null)
        {
            return NotFound();
        }

        return Ok(ToUserView(user));
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateUserProfileRequest request)
    {
        var userName = User.FindFirstValue(ClaimTypes.Name);
        if (string.IsNullOrWhiteSpace(userName))
        {
            return Unauthorized();
        }

        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.UserName == userName);
        if (user is null)
        {
            return NotFound();
        }

        user.DisplayName = request.DisplayName;
        user.Grade = request.Grade;
        user.SubjectPreference = request.SubjectPreference;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<object>>> GetUsers()
    {
        var users = await dbContext.Users
            .OrderBy(u => u.Id)
            .Select(u => ToUserView(u))
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> CreateUser([FromBody] CreateUserRequest request)
    {
        var exists = await dbContext.Users.AnyAsync(u => u.UserName == request.UserName);
        if (exists)
        {
            return Conflict("用户名已存在。");
        }

        var user = new User
        {
            UserName = request.UserName,
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            Role = request.Role,
            DisplayName = request.DisplayName,
            Grade = request.Grade,
            SubjectPreference = request.SubjectPreference,
            IsActive = true
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUsers), ToUserView(user));
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UpdateUserStatusRequest request)
    {
        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Id == id);
        if (user is null)
        {
            return NotFound();
        }

        user.IsActive = request.IsActive;
        await dbContext.SaveChangesAsync();
        return NoContent();
    }

    private static object ToUserView(User user) => new
    {
        user.Id,
        user.UserName,
        user.Role,
        user.DisplayName,
        user.Grade,
        user.SubjectPreference,
        user.IsActive,
        user.CreatedAtUtc
    };
}
