using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Yönetici,Admin")]
public class UserDevicePermissionController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AuditLogService _auditLogService;

    public UserDevicePermissionController(
        AppDbContext context,
        AuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }


    // ==========================================
    // PERSONELİN CİHAZ YETKİLERİNİ GETİR
    // ==========================================

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetPermissions(
        int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(
                "Kullanıcı bulunamadı."
            );
        }

        if (user.Role != "Personel")
        {
            return BadRequest(
                "Sadece Personel kullanıcılar için cihaz yetkisi atanabilir."
            );
        }

        var deviceIds =
            await _context.UserDevicePermissions
                .Where(p => p.UserId == userId)
                .Select(p => p.DeviceId)
                .ToListAsync();

        return Ok(new
        {
            UserId = userId,
            DeviceIds = deviceIds
        });
    }


    // ==========================================
    // PERSONELİN CİHAZ YETKİLERİNİ GÜNCELLE
    // ==========================================

    [HttpPut("{userId}")]
    public async Task<IActionResult> UpdatePermissions(
        int userId,
        [FromBody] List<int> deviceIds)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(
                "Kullanıcı bulunamadı."
            );
        }

        if (user.Role != "Personel")
        {
            return BadRequest(
                "Sadece Personel kullanıcılar için cihaz yetkisi atanabilir."
            );
        }


        // ==========================================
        // CİHAZLARIN VARLIĞINI KONTROL ET
        // ==========================================

        var distinctDeviceIds =
            deviceIds
                .Distinct()
                .ToList();

        var existingDeviceIds =
            await _context.Devices
                .Where(d =>
                    distinctDeviceIds.Contains(d.Id))
                .Select(d => d.Id)
                .ToListAsync();

        if (existingDeviceIds.Count !=
            distinctDeviceIds.Count)
        {
            return BadRequest(
                "Geçersiz cihaz ID'si gönderildi."
            );
        }


        // ==========================================
        // ESKİ YETKİLERİ SİL
        // ==========================================

        var existingPermissions =
            await _context.UserDevicePermissions
                .Where(p => p.UserId == userId)
                .ToListAsync();

        _context.UserDevicePermissions
            .RemoveRange(existingPermissions);


        // ==========================================
        // YENİ YETKİLERİ OLUŞTUR
        // ==========================================

        var newPermissions =
            existingDeviceIds
                .Select(deviceId =>
                    new UserDevicePermission
                    {
                        UserId = userId,
                        DeviceId = deviceId
                    })
                .ToList();

        await _context.UserDevicePermissions
            .AddRangeAsync(newPermissions);

        await _context.SaveChangesAsync();


        // ==========================================
        // AUDIT LOG
        // ==========================================

        await _auditLogService.LogAsync(
            action: "DEVICE_PERMISSION_UPDATED",
            entityType: "UserDevicePermission",
            entityId: userId,
            details:
                $"User {userId} için cihaz yetkileri " +
                $"[{string.Join(", ", existingDeviceIds)}] " +
                "olarak güncellendi."
        );


        // ==========================================
        // RESPONSE
        // ==========================================

        return Ok(new
        {
            message =
                "Cihaz yetkileri güncellendi.",

            UserId =
                userId,

            DeviceIds =
                existingDeviceIds
        });
    }
}