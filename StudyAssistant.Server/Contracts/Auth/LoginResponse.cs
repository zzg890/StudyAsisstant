namespace StudyAssistant.Server.Contracts.Auth;

public sealed class LoginResponse
{
    public required string Token { get; set; }

    public required string UserName { get; set; }

    public required string Role { get; set; }

    public required string DisplayName { get; set; }
}
