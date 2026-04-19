using System.ComponentModel.DataAnnotations;

namespace StudyAssistant.Server.Contracts.Auth;

public sealed class LoginRequest
{
    [Required]
    [MaxLength(64)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string Password { get; set; } = string.Empty;
}
