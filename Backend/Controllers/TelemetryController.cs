using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TelemetryController : ControllerBase
{
    private readonly AppDbContext _context;

    public TelemetryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{deviceId}/history")]
    public async Task<IActionResult> GetHistory(
        int deviceId,
        [FromQuery] int points = 50)
    {
        if (points <= 0)
        {
            return BadRequest("Points must be greater than 0.");
        }

        var history = await _context.TelemetryLogs
            .Where(t => t.DeviceId == deviceId)
            .OrderByDescending(t => t.Timestamp)
            .Take(points)
            .OrderBy(t => t.Timestamp)
            .ToListAsync();

        return Ok(history);
    }
}