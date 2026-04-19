using System.ComponentModel.DataAnnotations;

namespace StudyAssistant.Server.Models;

public sealed class AiModelConfig
{
    public int Id { get; set; }

    [MaxLength(64)]
    public required string Name { get; set; }

    [MaxLength(32)]
    public required string Provider { get; set; }

    [MaxLength(128)]
    public required string ModelName { get; set; }

    [MaxLength(256)]
    public string BaseUrl { get; set; } = string.Empty;

    [MaxLength(256)]
    public string ApiKey { get; set; } = string.Empty;

    [MaxLength(64)]
    public string Scenario { get; set; } = "general";

    public decimal Temperature { get; set; } = 0.2m;

    public int MaxTokens { get; set; } = 1024;

    public int Priority { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}
