using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Personel, Yönetici, Admin")]

public class OpenMeteoController : ControllerBase
{
    private readonly OpenMeteoService _openMeteoService;

    public OpenMeteoController(OpenMeteoService openMeteoService)
    {
        _openMeteoService = openMeteoService;
    }

    [HttpGet("İstanbul")]
    public async Task<IActionResult> GetIstanbulWeather(CancellationToken cancellationToken)
    {
        var result = await _openMeteoService.GetCurrentWeatherAsync(
            41.0082,
            28.9784,
            cancellationToken);

        if (result?.Current == null)
        {
            return BadRequest("Open-Meteo'dan veri alınamadı.");
        }

        return Ok(result.Current);
    }
}