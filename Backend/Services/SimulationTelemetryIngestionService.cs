using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class SimulationTelemetryIngestionService : ITelemetryIngestionService
    {
        public Task StartAsync(CancellationToken ct)
        {
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken ct)
        {
            return Task.CompletedTask;
        }

        public Task<RawTelemetryDto> ProcessIncomingAsync(
            string rawPayload,
            string deviceId)
        {
            if (string.IsNullOrWhiteSpace(deviceId))
            {
                throw new ArgumentException(
                    "Device ID cannot be empty",
                    nameof(deviceId));
            }

            var value = Random.Shared.NextDouble() * 100;

            var telemetry = new RawTelemetryDto(
                deviceId,
                value);

            return Task.FromResult(telemetry);
        }
    }
}
