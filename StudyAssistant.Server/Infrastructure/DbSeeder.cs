using Microsoft.EntityFrameworkCore;
using StudyAssistant.Server.Data;
using StudyAssistant.Server.Infrastructure.Auth;
using StudyAssistant.Server.Models;

namespace StudyAssistant.Server.Infrastructure;

public static class DbSeeder
{
    public static async Task SeedAsync(StudyAssistantDbContext dbContext)
    {
        await UpsertDefaultUserAsync(
            dbContext,
            userName: "admin",
            password: "abc@123",
            role: "Admin",
            displayName: "System Admin",
            grade: string.Empty,
            subjectPreference: string.Empty);

        await UpsertDefaultUserAsync(
            dbContext,
            userName: "student1",
            password: "abc@123",
            role: "Student",
            displayName: "Demo Student",
            grade: "初二",
            subjectPreference: "数学");

        if (!await dbContext.AiModelConfigs.AnyAsync())
        {
            dbContext.AiModelConfigs.Add(new AiModelConfig
            {
                Name = "Default Notebook Model",
                Provider = "OpenAI",
                ModelName = "gpt-4o-mini",
                Scenario = "notes",
                BaseUrl = "",
                ApiKey = "",
                Temperature = 0.2m,
                MaxTokens = 2048,
                Priority = 1,
                IsActive = true
            });
        }

        await dbContext.SaveChangesAsync();
    }

    private static async Task UpsertDefaultUserAsync(
        StudyAssistantDbContext dbContext,
        string userName,
        string password,
        string role,
        string displayName,
        string grade,
        string subjectPreference)
    {
        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.UserName == userName);
        if (user is null)
        {
            dbContext.Users.Add(new User
            {
                UserName = userName,
                PasswordHash = PasswordHasher.HashPassword(password),
                Role = role,
                DisplayName = displayName,
                Grade = grade,
                SubjectPreference = subjectPreference,
                IsActive = true
            });

            return;
        }

        user.PasswordHash = PasswordHasher.HashPassword(password);
        user.Role = role;
        user.DisplayName = displayName;
        user.Grade = grade;
        user.SubjectPreference = subjectPreference;
        user.IsActive = true;
    }
}
