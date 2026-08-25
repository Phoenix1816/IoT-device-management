using Backend.Data;
using Backend.Models;
using Backend.Hubs;
using Backend.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Backend.BackgroundServices;

public class TelemetrySimulationWorker : BackgroundService
{
    private readonly IHubContext<TelemetryHub> _hubContext;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<TelemetrySimulationWorker> _logger;
    private readonly OpenMeteoService _openMeteoService;

    public TelemetrySimulationWorker(
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration,
        ILogger<TelemetrySimulationWorker> logger,
        IHubContext<TelemetryHub> hubContext,
        OpenMeteoService openMeteoService)
    {
        _scopeFactory = scopeFactory;
        _configuration = configuration;
        _logger = logger;
        _hubContext = hubContext;
        _openMeteoService = openMeteoService;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        var intervalMs =
            _configuration.GetValue<int>(
                "Simulation:IntervalMs");

        // İstanbul koordinatları
        const double latitude = 41.0082;
        const double longitude = 28.9784;

        _logger.LogInformation(
            "Telemetry worker started. " +
            "Real data source: Open-Meteo. " +
            "Interval: {Interval}ms",
            intervalMs);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {

                // OPEN-METEO'DAN GERÇEK VERİYİ AL

                var weather =
                    await _openMeteoService
                        .GetCurrentWeatherAsync(
                            latitude,
                            longitude,
                            stoppingToken);

                if (weather?.Current == null)
                {
                    _logger.LogWarning(
                        "Open-Meteo'dan telemetry verisi alınamadı.");

                    await Task.Delay(
                        1000,
                        stoppingToken);

                    continue;
                }

                var temperature =
                    weather.Current.Temperature_2m;

                _logger.LogInformation(
                    "Open-Meteo temperature: {Temperature} °C",
                    temperature);

                // DATABASE SCOPE

                using var scope =
                    _scopeFactory.CreateScope();

                var context =
                    scope.ServiceProvider
                        .GetRequiredService<AppDbContext>();

                // AKTİF CİHAZLARI AL

                var devices =
                    await context.Devices
                        .Where(d => d.IsActive)
                        .ToListAsync(
                            stoppingToken);

                // HER CİHAZA GERÇEK TELEMETRY GÖNDER

                foreach (var device in devices)
                {
                    var telemetry = new TelemetryLog
                    {
                        DeviceId = device.Id,
                        Metric = "Temperature",
                        Value = temperature,
                        Unit = "°C",
                        Timestamp = DateTime.UtcNow
                    };

                    context.TelemetryLogs.Add(telemetry);

                    // Cihazın son görülme zamanını güncelle
                    device.LastSeen = telemetry.Timestamp;

                    await _hubContext.Clients.All.SendAsync(
                        "ReceiveTelemetry",
                        new
                        {
                            DeviceId = device.Id,
                            Metric = telemetry.Metric,
                            Value = telemetry.Value,
                            Unit = telemetry.Unit,
                            Timestamp = telemetry.Timestamp,
                            Threshold = device.Threshold,
                            LastSeen = device.LastSeen
                        },
                        stoppingToken);
                }

                // DATABASE SAVE

                await context.SaveChangesAsync(
                    stoppingToken);


                // BİR SONRAKİ VERİYİ BEKLE

                await Task.Delay(
                    intervalMs,
                    stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Gerçek telemetry verisi alınırken hata oluştu.");

                await Task.Delay(
                    5000,
                    stoppingToken);
            }
        }

        _logger.LogInformation(
            "Telemetry worker stopped.");
    }
}