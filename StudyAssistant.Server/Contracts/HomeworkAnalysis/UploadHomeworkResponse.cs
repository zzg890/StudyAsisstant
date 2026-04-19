namespace StudyAssistant.Server.Contracts.HomeworkAnalysis;

public sealed class UploadHomeworkResponse
{
    public required Guid TaskId { get; set; }

    public required string FileName { get; set; }

    public required string Subject { get; set; }

    public required string Grade { get; set; }

    public required string Status { get; set; }

    public required DateTimeOffset UploadedAtUtc { get; set; }
}
