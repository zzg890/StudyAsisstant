using System.ComponentModel.DataAnnotations;

namespace StudyAssistant.Server.Models;

public sealed class HomeworkSubmission
{
    public int Id { get; set; }

    public Guid TaskId { get; set; } = Guid.NewGuid();

    public int? UserId { get; set; }

    [MaxLength(64)]
    public string UserName { get; set; } = string.Empty;

    [MaxLength(128)]
    public string FileName { get; set; } = string.Empty;

    [MaxLength(256)]
    public string StoredFilePath { get; set; } = string.Empty;

    [MaxLength(64)]
    public string Subject { get; set; } = string.Empty;

    [MaxLength(32)]
    public string Grade { get; set; } = string.Empty;

    [MaxLength(32)]
    public string Status { get; set; } = "Uploaded";

    public long FileSizeBytes { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? CompletedAtUtc { get; set; }
}
