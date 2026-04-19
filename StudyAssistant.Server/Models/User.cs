using System.ComponentModel.DataAnnotations;

namespace StudyAssistant.Server.Models;

public sealed class User
{
    public int Id { get; set; }

    [MaxLength(64)]
    public required string UserName { get; set; }

    [MaxLength(256)]
    public required string PasswordHash { get; set; }

    [MaxLength(32)]
    public required string Role { get; set; }

    [MaxLength(64)]
    public required string DisplayName { get; set; }

    [MaxLength(32)]
    public string Grade { get; set; } = string.Empty;

    [MaxLength(64)]
    public string SubjectPreference { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}
