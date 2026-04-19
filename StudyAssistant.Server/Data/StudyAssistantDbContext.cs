using Microsoft.EntityFrameworkCore;
using StudyAssistant.Server.Models;

namespace StudyAssistant.Server.Data;

public sealed class StudyAssistantDbContext(DbContextOptions<StudyAssistantDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<AiModelConfig> AiModelConfigs => Set<AiModelConfig>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.UserName)
            .IsUnique();

        modelBuilder.Entity<AiModelConfig>()
            .HasIndex(c => new { c.Provider, c.ModelName, c.Scenario, c.Priority });

        base.OnModelCreating(modelBuilder);
    }
}
