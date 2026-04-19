using Microsoft.EntityFrameworkCore;
using StudyAssistant.Server.Data;

namespace StudyAssistant.Server.Infrastructure;

public static class DbSchemaUpdater
{
    public static async Task EnsureLatestSchemaAsync(StudyAssistantDbContext dbContext)
    {
        await dbContext.Database.EnsureCreatedAsync();

        await dbContext.Database.ExecuteSqlRawAsync(
            @"
            CREATE TABLE IF NOT EXISTS HomeworkSubmissions (
                Id INTEGER NOT NULL CONSTRAINT PK_HomeworkSubmissions PRIMARY KEY AUTOINCREMENT,
                TaskId TEXT NOT NULL,
                UserId INTEGER NULL,
                UserName TEXT NOT NULL,
                FileName TEXT NOT NULL,
                StoredFilePath TEXT NOT NULL,
                Subject TEXT NOT NULL,
                Grade TEXT NOT NULL,
                Status TEXT NOT NULL,
                FileSizeBytes INTEGER NOT NULL,
                CreatedAtUtc TEXT NOT NULL,
                CompletedAtUtc TEXT NULL
            );
            ");

        await dbContext.Database.ExecuteSqlRawAsync(
            @"
            CREATE UNIQUE INDEX IF NOT EXISTS IX_HomeworkSubmissions_TaskId
            ON HomeworkSubmissions (TaskId);
            ");
    }
}
