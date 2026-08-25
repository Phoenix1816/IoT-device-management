namespace Backend.Models;

public class AuditLog
{
    public int Id { get; set; }

    // İşlemi yapan kullanıcı
    public int? UserId { get; set; }

    // Örn: "Cihaz yetkisi güncellendi"
    public string Action { get; set; } = string.Empty;

    // İşlemin hangi entity üzerinde yapıldığı
    // Örn: "Device", "User", "UserDevicePermission"
    public string? EntityType { get; set; }

    // İşlem yapılan kaydın ID'si
    public int? EntityId { get; set; }

    // Ek bilgi
    public string? Details { get; set; }

    // İşlem zamanı
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // İşlemi yapan kullanıcının IP adresi
    public string? IpAddress { get; set; }
}