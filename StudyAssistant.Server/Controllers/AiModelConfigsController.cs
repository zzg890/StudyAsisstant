using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyAssistant.Server.Contracts.AiModels;
using StudyAssistant.Server.Data;
using StudyAssistant.Server.Models;

namespace StudyAssistant.Server.Controllers;

[ApiController]
[Route("api/admin/ai-model-configs")]
[Authorize(Roles = "Admin")]
public sealed class AiModelConfigsController(StudyAssistantDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AiModelConfig>>> GetConfigs()
    {
        var configs = await dbContext.AiModelConfigs
            .OrderBy(c => c.Scenario)
            .ThenBy(c => c.Priority)
            .ToListAsync();

        return Ok(configs);
    }

    [HttpPost]
    public async Task<ActionResult<AiModelConfig>> CreateConfig([FromBody] UpsertAiModelConfigRequest request)
    {
        var entity = new AiModelConfig
        {
            Name = request.Name,
            Provider = request.Provider,
            ModelName = request.ModelName,
            BaseUrl = request.BaseUrl,
            ApiKey = request.ApiKey,
            Scenario = request.Scenario,
            Temperature = request.Temperature,
            MaxTokens = request.MaxTokens,
            Priority = request.Priority,
            IsActive = request.IsActive
        };

        dbContext.AiModelConfigs.Add(entity);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetConfigs), new { id = entity.Id }, entity);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateConfig(int id, [FromBody] UpsertAiModelConfigRequest request)
    {
        var entity = await dbContext.AiModelConfigs.SingleOrDefaultAsync(c => c.Id == id);
        if (entity is null)
        {
            return NotFound();
        }

        entity.Name = request.Name;
        entity.Provider = request.Provider;
        entity.ModelName = request.ModelName;
        entity.BaseUrl = request.BaseUrl;
        entity.ApiKey = request.ApiKey;
        entity.Scenario = request.Scenario;
        entity.Temperature = request.Temperature;
        entity.MaxTokens = request.MaxTokens;
        entity.Priority = request.Priority;
        entity.IsActive = request.IsActive;

        await dbContext.SaveChangesAsync();
        return NoContent();
    }
}
