namespace Backend.Services.Interfaces;

public interface ITelemetryIngestionService
{
    Task StartAsync(CancellationToken ct);

    Task StopAsync(CancellationToken ct);

    Task<RawTelemetryDto> ProcessIncomingAsync(
        string rawPayload,
        string deviceId
        );
}

public record RawTelemetryDto(string DeviceId, double Value);
