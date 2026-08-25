using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Yönetici,Admin")]
public class AuditLogController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuditLogController(AppDbContext context)
    {
        _context = context;
    }

    // ==========================================
    // TÜM AUDIT LOGLARI GETİR
    // ==========================================

    [HttpGet]
    public async Task<IActionResult> GetLogs()
    {
        var logs = await _context.AuditLogs
            .OrderByDescending(log => log.CreatedAt)
            .Select(log => new
            {
                log.Id,
                log.UserId,
                log.Action,
                log.EntityType,
                log.EntityId,
                log.Details,
                log.IpAddress,
                log.CreatedAt
            })
            .ToListAsync();

        return Ok(logs);
    }


    // ==========================================
    // BELİRLİ KULLANICININ LOGLARI
    // ==========================================

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserLogs(
        int userId)
    {
        var logs = await _context.AuditLogs
            .Where(log => log.UserId == userId)
            .OrderByDescending(log => log.CreatedAt)
            .Select(log => new
            {
                log.Id,
                log.UserId,
                log.Action,
                log.EntityType,
                log.EntityId,
                log.Details,
                log.IpAddress,
                log.CreatedAt
            })
            .ToListAsync();

        return Ok(logs);
    }


    // ==========================================
    // BELİRLİ ACTION'A GÖRE LOGLAR
    // ==========================================

    [HttpGet("action/{action}")]
    public async Task<IActionResult> GetLogsByAction(
        string action)
    {
        var logs = await _context.AuditLogs
            .Where(log => log.Action == action)
            .OrderByDescending(log => log.CreatedAt)
            .Select(log => new
            {
                log.Id,
                log.UserId,
                log.Action,
                log.EntityType,
                log.EntityId,
                log.Details,
                log.IpAddress,
                log.CreatedAt
            })
            .ToListAsync();

        return Ok(logs);
    }
}