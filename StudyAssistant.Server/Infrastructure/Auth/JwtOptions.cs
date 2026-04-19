namespace StudyAssistant.Server.Infrastructure.Auth;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "StudyAssistant";

    public string Audience { get; set; } = "StudyAssistant.Client";

    public string SigningKey { get; set; } = "change-this-in-production-minimum-32-characters";

    public int ExpiryMinutes { get; set; } = 120;
}
