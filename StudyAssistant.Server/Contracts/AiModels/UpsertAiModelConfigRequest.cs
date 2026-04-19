using System.ComponentModel.DataAnnotations;

namespace StudyAssistant.Server.Contracts.AiModels;

public sealed class UpsertAiModelConfigRequest
{
    [Required]
    [MaxLength(64)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string Provider { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string ModelName { get; set; } = string.Empty;

    [MaxLength(256)]
    public string BaseUrl { get; set; } = string.Empty;

    [MaxLength(256)]
    public string ApiKey { get; set; } = string.Empty;

    [MaxLength(64)]
    public string Scenario { get; set; } = "general";

    [Range(0.0, 2.0)]
    public decimal Temperature { get; set; } = 0.2m;

    [Range(1, 32768)]
    public int MaxTokens { get; set; } = 1024;

    public int Priority { get; set; } = 0;

    public bool IsActive { get; set; } = true;
}
