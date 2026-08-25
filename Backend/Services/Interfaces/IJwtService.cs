using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}