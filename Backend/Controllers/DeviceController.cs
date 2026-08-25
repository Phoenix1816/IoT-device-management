using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Personel,Yönetici,Admin")]
public class DeviceController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AuditLogService _auditLogService;

    public DeviceController(
        AppDbContext context,
        AuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }

    // ==========================================
    // GET - CİHAZLARI GÖRÜNTÜLE
    // ==========================================
    //
    // Admin + Yönetici → Tüm cihazlar
    // Personel → Sadece kendisine atanmış cihazlar
    //

    [HttpGet]
    [Authorize(Roles = "Personel,Yönetici,Admin")]
    public async Task<IActionResult> GetDevices()
    {
        // Kullanıcının rolünü al
        var role = User.FindFirst(
            System.Security.Claims.ClaimTypes.Role
        )?.Value;

        // ==========================================
        // ADMIN + YÖNETİCİ
        // ==========================================

        if (role == "Admin" || role == "Yönetici")
        {
            var allDevices =
                await _context.Devices
                    .ToListAsync();

            return Ok(allDevices);
        }

        // ==========================================
        // PERSONEL
        // ==========================================

        var userIdClaim = User.FindFirst(
            System.Security.Claims.ClaimTypes.NameIdentifier
        )?.Value;

        if (!int.TryParse(
                userIdClaim,
                out var userId))
        {
            return Unauthorized(
                "Kullanıcı kimliği bulunamadı."
            );
        }

        // Personelin sadece yetkili olduğu
        // cihazları getir

        var assignedDevices =
            await _context.UserDevicePermissions
                .Where(p => p.UserId == userId)
                .Select(p => p.Device)
                .ToListAsync();

        return Ok(assignedDevices);
    }


    // ==========================================
    // POST - CİHAZ EKLE
    // ==========================================
    //
    // Yönetici + Admin
    //

    [HttpPost]
    [Authorize(Roles = "Yönetici,Admin")]
    public async Task<IActionResult> CreateDevice(
        Device device)
    {
        _context.Devices.Add(device);

        await _context.SaveChangesAsync();

        // ==========================================
        // AUDIT LOG
        // ==========================================

        await _auditLogService.LogAsync(
            action: "DEVICE_CREATED",
            entityType: "Device",
            entityId: device.Id,
            details:
                $"Device {device.Id} oluşturuldu. Name: {device.Name}"
        );

        return Ok(device);
    }


    // ==========================================
    // PUT - CİHAZ GÜNCELLE
    // ==========================================
    //
    // Yönetici + Admin
    //

    [HttpPut("{id}")]
    [Authorize(Roles = "Yönetici,Admin")]
    public async Task<IActionResult> UpdateDevice(
        int id,
        Device device)
    {
        // ==========================================
        // ID KONTROLÜ
        // ==========================================

        if (id != device.Id)
        {
            return BadRequest(
                "Device ID uyuşmuyor."
            );
        }

        // ==========================================
        // CİHAZI BUL
        // ==========================================

        var existingDevice =
            await _context.Devices
                .FindAsync(id);

        if (existingDevice == null)
        {
            return NotFound(
                "Device bulunamadı."
            );
        }

        // ==========================================
        // CİHAZ BİLGİLERİNİ GÜNCELLE
        // ==========================================

        existingDevice.Name =
            device.Name;

        existingDevice.Threshold =
            device.Threshold;

        existingDevice.IsActive =
            device.IsActive;

        await _context.SaveChangesAsync();

        // ==========================================
        // AUDIT LOG
        // ==========================================

        await _auditLogService.LogAsync(
            action: "DEVICE_UPDATED",
            entityType: "Device",
            entityId: existingDevice.Id,
            details:
                $"Device {existingDevice.Id} güncellendi. " +
                $"Name: {existingDevice.Name}, " +
                $"Threshold: {existingDevice.Threshold}, " +
                $"IsActive: {existingDevice.IsActive}"
        );

        return Ok(existingDevice);
    }


    // ==========================================
    // DELETE - CİHAZ SİL
    // ==========================================
    //
    // Sadece Admin
    //

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDevice(
        int id)
    {
        // ==========================================
        // CİHAZI BUL
        // ==========================================

        var device =
            await _context.Devices
                .FindAsync(id);

        if (device == null)
        {
            return NotFound(
                "Device bulunamadı."
            );
        }

        // Silmeden önce log için bilgileri al
        var deviceName = device.Name;

        // ==========================================
        // CİHAZI SİL
        // ==========================================

        _context.Devices.Remove(device);

        await _context.SaveChangesAsync();

        // ==========================================
        // AUDIT LOG
        // ==========================================

        await _auditLogService.LogAsync(
            action: "DEVICE_DELETED",
            entityType: "Device",
            entityId: id,
            details:
                $"Device {id} silindi. Name: {deviceName}"
        );

        return NoContent();
    }
}
