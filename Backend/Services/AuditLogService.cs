using Backend.Data;
using Backend.Models;
using System.Security.Claims;

namespace Backend.Services;

public class AuditLogService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditLogService(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task LogAsync(
        string action,
        string? entityType = null,
        int? entityId = null,
        string? details = null)
    {
        var httpContext =
            _httpContextAccessor.HttpContext;

        var userIdClaim =
            httpContext?.User.FindFirst(
                ClaimTypes.NameIdentifier
            )?.Value;

        int? userId = null;

        if (int.TryParse(userIdClaim, out var parsedUserId))
        {
            userId = parsedUserId;
        }

        var ipAddress =
            httpContext?.Connection.RemoteIpAddress?
                .ToString();

        var auditLog = new AuditLog
        {
            UserId = userId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Details = details,
            IpAddress = ipAddress,
            CreatedAt = DateTime.UtcNow
        };

        _context.AuditLogs.Add(auditLog);

        await _context.SaveChangesAsync();
    }
}