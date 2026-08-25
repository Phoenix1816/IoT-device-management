using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Device> Devices { get; set; }

    public DbSet<TelemetryLog> TelemetryLogs { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<UserDevicePermission> UserDevicePermissions { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserDevicePermission>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserDevicePermission>()
            .HasOne(p => p.Device)
            .WithMany()
            .HasForeignKey(p => p.DeviceId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserDevicePermission>()
            .HasIndex(p => new
            {
                p.UserId,
                p.DeviceId
            })
            .IsUnique();
    }
}