using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyAssistant.Server.Contracts.HomeworkAnalysis;
using StudyAssistant.Server.Data;
using StudyAssistant.Server.Models;

namespace StudyAssistant.Server.Controllers;

[ApiController]
[Route("api/homework-analyses")]
[Authorize]
public sealed class HomeworkAnalysesController(
    StudyAssistantDbContext dbContext,
    IWebHostEnvironment environment) : ControllerBase
{
    [HttpPost("uploads")]
    [RequestFormLimits(MultipartBodyLengthLimit = 10 * 1024 * 1024)]
    public async Task<ActionResult<UploadHomeworkResponse>> UploadHomework(
        IFormFile file,
        [FromForm] string subject,
        [FromForm] string grade)
    {
        if (file.Length == 0)
        {
            return BadRequest("上传文件不能为空。");
        }

        var uploadDirectory = Path.Combine(environment.ContentRootPath, "App_Data", "uploads", "homework");
        Directory.CreateDirectory(uploadDirectory);

        var taskId = Guid.NewGuid();
        var storedFileName = $"{taskId:N}{Path.GetExtension(file.FileName)}";
        var storedFilePath = Path.Combine(uploadDirectory, storedFileName);

        await using (var stream = System.IO.File.Create(storedFilePath))
        {
            await file.CopyToAsync(stream);
        }

        var userName = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.UserName == userName);

        var submission = new HomeworkSubmission
        {
            TaskId = taskId,
            UserId = user?.Id,
            UserName = userName,
            FileName = file.FileName,
            StoredFilePath = storedFilePath,
            Subject = subject,
            Grade = grade,
            Status = "Uploaded",
            FileSizeBytes = file.Length,
            CreatedAtUtc = DateTimeOffset.UtcNow
        };

        dbContext.Add(submission);
        await dbContext.SaveChangesAsync();

        return Ok(new UploadHomeworkResponse
        {
            TaskId = submission.TaskId,
            FileName = submission.FileName,
            Subject = submission.Subject,
            Grade = submission.Grade,
            Status = submission.Status,
            UploadedAtUtc = submission.CreatedAtUtc
        });
    }

    [HttpGet("{taskId:guid}")]
    public async Task<ActionResult<HomeworkAnalysisResultResponse>> GetAnalysisResult(Guid taskId)
    {
        var userName = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
        var submission = await dbContext.Set<HomeworkSubmission>()
            .SingleOrDefaultAsync(s => s.TaskId == taskId && s.UserName == userName);

        if (submission is null)
        {
            return NotFound();
        }

        if (submission.Status != "Completed")
        {
            submission.Status = "Completed";
            submission.CompletedAtUtc = DateTimeOffset.UtcNow;
            await dbContext.SaveChangesAsync();
        }

        return Ok(BuildMockResult(submission));
    }

    private static HomeworkAnalysisResultResponse BuildMockResult(HomeworkSubmission submission)
    {
        var weakPoints = BuildWeakPoints(submission.Subject);
        var wrongCount = weakPoints.Sum(item => item.WrongQuestionCount);
        var recognizedQuestionCount = Math.Max(10, wrongCount + 6);
        var correctRate = Math.Round((recognizedQuestionCount - wrongCount) / (decimal)recognizedQuestionCount, 2);

        return new HomeworkAnalysisResultResponse
        {
            TaskId = submission.TaskId,
            Status = submission.Status,
            Subject = submission.Subject,
            Grade = submission.Grade,
            RecognizedQuestionCount = recognizedQuestionCount,
            CorrectRate = correctRate,
            WeakKnowledgePoints = weakPoints,
            RecommendedActions = BuildRecommendations(submission.Subject),
            Summary = $"已完成 {submission.Subject} 作业识别，共识别 {recognizedQuestionCount} 题，当前薄弱点集中在 {string.Join('、', weakPoints.Select(x => x.Name))}。",
            GeneratedAtUtc = submission.CompletedAtUtc ?? DateTimeOffset.UtcNow
        };
    }

    private static IReadOnlyList<WeakKnowledgePointItem> BuildWeakPoints(string subject)
    {
        return subject switch
        {
            "数学" =>
            [
                new WeakKnowledgePointItem
                {
                    Name = "一次函数",
                    AccuracyRate = 0.45m,
                    WrongQuestionCount = 4,
                    Suggestion = "先复习斜率与截距定义，再完成 5 道同类基础题。"
                },
                new WeakKnowledgePointItem
                {
                    Name = "全等三角形",
                    AccuracyRate = 0.58m,
                    WrongQuestionCount = 3,
                    Suggestion = "重点辨析判定条件，整理典型题型到错题本。"
                }
            ],
            "英语" =>
            [
                new WeakKnowledgePointItem
                {
                    Name = "一般过去时",
                    AccuracyRate = 0.5m,
                    WrongQuestionCount = 4,
                    Suggestion = "复习规则动词与不规则动词变形，完成句型转换练习。"
                },
                new WeakKnowledgePointItem
                {
                    Name = "阅读主旨判断",
                    AccuracyRate = 0.6m,
                    WrongQuestionCount = 2,
                    Suggestion = "加强段落主题句定位训练。"
                }
            ],
            _ =>
            [
                new WeakKnowledgePointItem
                {
                    Name = "基础概念理解",
                    AccuracyRate = 0.55m,
                    WrongQuestionCount = 3,
                    Suggestion = "先回顾课堂笔记，再完成 5 道针对练习。"
                },
                new WeakKnowledgePointItem
                {
                    Name = "综合应用",
                    AccuracyRate = 0.62m,
                    WrongQuestionCount = 2,
                    Suggestion = "从例题到变式题逐步练习，关注解题步骤。"
                }
            ]
        };
    }

    private static IReadOnlyList<string> BuildRecommendations(string subject)
    {
        return
        [
            $"优先完成 {subject} 薄弱知识点专项练习。",
            "根据错题自动生成复习笔记并在 24 小时内回顾一次。",
            "连续 3 天跟踪同知识点正确率变化。"
        ];
    }
}
