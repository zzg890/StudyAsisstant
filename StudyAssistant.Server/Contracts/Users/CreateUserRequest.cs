using System.ComponentModel.DataAnnotations;

namespace StudyAssistant.Server.Contracts.Users;

public sealed class CreateUserRequest
{
    [Required]
    [MaxLength(64)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(64)]
    public string DisplayName { get; set; } = string.Empty;

    [MaxLength(32)]
    public string Role { get; set; } = "Student";

    [MaxLength(32)]
    public string Grade { get; set; } = string.Empty;

    [MaxLength(64)]
    public string SubjectPreference { get; set; } = string.Empty;
}
