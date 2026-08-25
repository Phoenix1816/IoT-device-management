using System.Globalization;
using System.Text.Json;

namespace Backend.Services;

public class OpenMeteoService
{
    private readonly HttpClient _httpClient;

    public OpenMeteoService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<OpenMeteoResponse?> GetCurrentWeatherAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken = default)
    {
        var latitudeText =
            latitude.ToString(
                CultureInfo.InvariantCulture);

        var longitudeText =
            longitude.ToString(
                CultureInfo.InvariantCulture);

        var url =
            $"https://api.open-meteo.com/v1/forecast" +
            $"?latitude={latitudeText}" +
            $"&longitude={longitudeText}" +
            $"&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m" +
            $"&timezone=auto";

        var response = await _httpClient.GetAsync(
            url,
            cancellationToken);

        var responseBody =
            await response.Content.ReadAsStringAsync(
                cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException(
                $"Open-Meteo API hatası: " +
                $"{(int)response.StatusCode} - " +
                $"{responseBody}"
            );
        }

        return JsonSerializer.Deserialize<OpenMeteoResponse>(
            responseBody,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
    }
}

public class OpenMeteoResponse
{
    public OpenMeteoCurrent? Current { get; set; }
}

public class OpenMeteoCurrent
{
    public double Temperature_2m { get; set; }

    public double Relative_Humidity_2m { get; set; }

    public double Pressure_Msl { get; set; }

    public double Wind_Speed_10m { get; set; }
}