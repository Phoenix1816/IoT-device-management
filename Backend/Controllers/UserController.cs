using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin, Yönetici")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AuditLogService _auditLogService;

    public UserController(
        AppDbContext context,
        AuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }


    // ==========================================
    // TÜM KULLANICILARI GETİR
    // ==========================================

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(user => new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role,
                user.IsEmailVerified,
                user.IsActive
            })
            .ToListAsync();

        return Ok(users);
    }


    // ==========================================
    // TEK KULLANICI GETİR
    // ==========================================

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Role,
                u.IsEmailVerified,
                u.IsActive
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(
                "Kullanıcı bulunamadı."
            );
        }

        return Ok(user);
    }


    // ==========================================
    // ROL DEĞİŞTİR
    // ==========================================

    [HttpPut("{id}/role")]
    public async Task<IActionResult> ChangeRole(
        int id,
        [FromBody] string role)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(
                u => u.Id == id
            );

        if (user == null)
        {
            return NotFound(
                "Kullanıcı bulunamadı."
            );
        }

        // ==========================================
        // GEÇERLİ ROLLER
        // ==========================================

        var validRoles = new[]
        {
            "Admin",
            "Yönetici",
            "Personel"
        };

        if (!validRoles.Contains(role))
        {
            return BadRequest(
                "Geçersiz kullanıcı rolü."
            );
        }

        // ==========================================
        // ESKİ ROLÜ SAKLA
        // ==========================================

        var oldRole = user.Role;

        // ==========================================
        // ROL DEĞİŞMEDİYSE
        // ==========================================

        if (oldRole == role)
        {
            return BadRequest(
                "Kullanıcının rolü zaten bu rolde."
            );
        }

        // ==========================================
        // ROLÜ GÜNCELLE
        // ==========================================

        user.Role = role;

        await _context.SaveChangesAsync();

        // ==========================================
        // AUDIT LOG
        // ==========================================

        await _auditLogService.LogAsync(
            action: "ROLE_CHANGED",
            entityType: "User",
            entityId: user.Id,
            details:
                $"User {user.Id} rolü " +
                $"{oldRole} -> {user.Role} " +
                $"olarak değiştirildi."
        );

        return Ok(new
        {
            message =
                "Kullanıcı rolü güncellendi.",

            user.Id,
            user.Name,
            user.Role
        });
    }


    // ==========================================
    // KULLANICI BANLA
    // ==========================================

    [HttpPut("{id}/ban")]
    public async Task<IActionResult> BanUser(int id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(
                u => u.Id == id
            );

        if (user == null)
        {
            return NotFound(
                "Kullanıcı bulunamadı."
            );
        }

        // ==========================================
        // KENDİNİ BANLAMAYI ENGELLE
        // ==========================================

        var currentUserId =
            User.FindFirst(
                System.Security.Claims.ClaimTypes.NameIdentifier
            )?.Value;

        if (currentUserId ==
            user.Id.ToString())
        {
            return BadRequest(
                "Kendi hesabınızı banlayamazsınız."
            );
        }

        // ==========================================
        // ZATEN BANLI MI?
        // ==========================================

        if (!user.IsActive)
        {
            return BadRequest(
                "Kullanıcı zaten banlı."
            );
        }

        // ==========================================
        // KULLANICIYI BANLA
        // ==========================================

        user.IsActive = false;

        await _context.SaveChangesAsync();

        // ==========================================
        // AUDIT LOG
        // ==========================================

        await _auditLogService.LogAsync(
            action: "USER_BANNED",
            entityType: "User",
            entityId: user.Id,
            details:
                $"User {user.Id} banlandı. " +
                $"Name: {user.Name}, " +
                $"Email: {user.Email}"
        );

        return Ok(new
        {
            message =
                "Kullanıcı banlandı.",

            user.Id,
            user.Name,
            user.IsActive
        });
    }


    // ==========================================
    // BAN KALDIR
    // ==========================================

    [HttpPut("{id}/unban")]
    public async Task<IActionResult> UnbanUser(int id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(
                u => u.Id == id
            );

        if (user == null)
        {
            return NotFound(
                "Kullanıcı bulunamadı."
            );
        }

        // ==========================================
        // ZATEN AKTİF Mİ?
        // ==========================================

        if (user.IsActive)
        {
            return BadRequest(
                "Kullanıcının banı zaten kaldırılmış."
            );
        }

        // ==========================================
        // BAN KALDIR
        // ==========================================

        user.IsActive = true;

        await _context.SaveChangesAsync();

        // ==========================================
        // AUDIT LOG
        // ==========================================

        await _auditLogService.LogAsync(
            action: "USER_UNBANNED",
            entityType: "User",
            entityId: user.Id,
            details:
                $"User {user.Id} banı kaldırıldı. " +
                $"Name: {user.Name}, " +
                $"Email: {user.Email}"
        );

        return Ok(new
        {
            message =
                "Kullanıcının banı kaldırıldı.",

            user.Id,
            user.Name,
            user.IsActive
        });
    }
}