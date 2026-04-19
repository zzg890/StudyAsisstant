namespace StudyAssistant.Server.Contracts.HomeworkAnalysis;

public sealed class HomeworkAnalysisResultResponse
{
    public required Guid TaskId { get; set; }

    public required string Status { get; set; }

    public required string Subject { get; set; }

    public required string Grade { get; set; }

    public required int RecognizedQuestionCount { get; set; }

    public required decimal CorrectRate { get; set; }

    public required IReadOnlyList<WeakKnowledgePointItem> WeakKnowledgePoints { get; set; }

    public required IReadOnlyList<string> RecommendedActions { get; set; }

    public required string Summary { get; set; }

    public required DateTimeOffset GeneratedAtUtc { get; set; }
}

public sealed class WeakKnowledgePointItem
{
    public required string Name { get; set; }

    public required decimal AccuracyRate { get; set; }

    public required int WrongQuestionCount { get; set; }

    public required string Suggestion { get; set; }
}
