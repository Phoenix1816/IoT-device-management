namespace Backend.Models;

public class TelemetryLog
{
    public int Id { get; set; }

    public int DeviceId { get; set; }

    public string Metric { get; set; } = string.Empty;

    public double Value { get; set; }

    public string Unit { get; set; } = string.Empty;

    public DateTime Timestamp { get; set; }

    public Device? Device { get; set; }
}