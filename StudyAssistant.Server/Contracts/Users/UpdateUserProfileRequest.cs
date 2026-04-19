using System.ComponentModel.DataAnnotations;

namespace StudyAssistant.Server.Contracts.Users;

public sealed class UpdateUserProfileRequest
{
    [MaxLength(64)]
    public string DisplayName { get; set; } = string.Empty;

    [MaxLength(32)]
    public string Grade { get; set; } = string.Empty;

    [MaxLength(64)]
    public string SubjectPreference { get; set; } = string.Empty;
}
