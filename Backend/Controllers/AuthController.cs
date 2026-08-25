using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IEmailService _emailService;
    private readonly IJwtService _jwtService;


    public AuthController(
        AppDbContext context,
        IPasswordHasher<User> passwordHasher,
        IEmailService emailService,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _emailService = emailService;
        _jwtService = jwtService;
    }


    // REGISTER

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterDto request)
    {
        var existingUser =
            await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Email == request.Email
                );


        if (existingUser != null)
        {
            return BadRequest(
                "Bu e-mail adresi zaten kayıtlı."
            );
        }


        var verificationCode =
            Random.Shared
                .Next(100000, 1000000)
                .ToString();


        var user = new User
        {
            Name = request.Name,

            Email = request.Email,

            Role = "Personel",

            IsEmailVerified = false,

            VerificationCode =
                verificationCode,

            VerificationCodeExpiresAt =
                DateTime.UtcNow.AddMinutes(1),

            IsActive = true
        };


        user.PasswordHash =
            _passwordHasher.HashPassword(
                user,
                request.Password
            );


        _context.Users.Add(user);

        await _context.SaveChangesAsync();


        await _emailService
            .SendVerificationEmailAsync(
                user.Email,
                verificationCode
            );


        return Ok(new
        {
            message =
                "Kullanıcı başarıyla oluşturuldu.",

            user.Id,

            user.Name,

            user.Email,

            user.Role,

            verificationCode
        });
    }


    // EMAIL VERIFICATION

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(
        VerifyEmailDto request)
    {
        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Email == request.Email
                );


        if (user == null)
        {
            return NotFound(
                "Kullanıcı bulunamadı."
            );
        }


        if (user.IsEmailVerified)
        {
            return BadRequest(
                "E-mail zaten doğrulanmış."
            );
        }


        if (
            user.VerificationCode !=
            request.VerificationCode
        )
        {
            return BadRequest(
                "Doğrulama kodu hatalı."
            );
        }


        if (
            user.VerificationCodeExpiresAt == null ||
            user.VerificationCodeExpiresAt <
                DateTime.UtcNow
        )
        {
            return BadRequest(
                "Doğrulama kodu süresi dolmuş."
            );
        }


        user.IsEmailVerified = true;

        user.VerificationCode = null;

        user.VerificationCodeExpiresAt = null;


        await _context.SaveChangesAsync();


        return Ok(new
        {
            message =
                "E-mail başarıyla doğrulandı."
        });
    }


    // FORGOT PASSWORD

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordDto request)
    {
        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Email == request.Email
                );


        // Kullanıcı bulunamasa bile aynı cevabı
        // dönüyoruz.
        // Böylece sistemde kayıtlı e-mail
        // adreslerini dışarıya açık etmiyoruz.

        if (user == null)
        {
            return Ok(new
            {
                message =
                    "Eğer bu e-mail adresi kayıtlıysa " +
                    "şifre sıfırlama kodu gönderildi."
            });
        }


        // E-mail doğrulanmamışsa reset
        // işlemini başlatmıyoruz.

        if (!user.IsEmailVerified)
        {
            return BadRequest(
                "Önce e-mail adresinizi doğrulamalısınız."
            );
        }


        // 6 haneli reset kodu

        var resetCode =
            Random.Shared
                .Next(100000, 1000000)
                .ToString();


        user.PasswordResetCode =
            resetCode;

        user.PasswordResetCodeExpiresAt =
            DateTime.UtcNow.AddMinutes(10);


        await _context.SaveChangesAsync();


        await _emailService
            .SendPasswordResetEmailAsync(
                user.Email,
                resetCode
            );


        return Ok(new
        {
            message =
                "Eğer bu e-mail adresi kayıtlıysa " +
                "şifre sıfırlama kodu gönderildi."
        });
    }


    // RESET PASSWORD

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        ResetPasswordDto request)
    {
        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Email == request.Email
                );


        if (user == null)
        {
            return BadRequest(
                "Şifre sıfırlama işlemi başarısız."
            );
        }


        if (
            string.IsNullOrWhiteSpace(
                user.PasswordResetCode
            )
        )
        {
            return BadRequest(
                "Geçerli bir şifre sıfırlama kodu bulunamadı."
            );
        }


        if (
            user.PasswordResetCode !=
            request.ResetCode
        )
        {
            return BadRequest(
                "Şifre sıfırlama kodu hatalı."
            );
        }


        if (
            user.PasswordResetCodeExpiresAt == null ||
            user.PasswordResetCodeExpiresAt <
                DateTime.UtcNow
        )
        {
            return BadRequest(
                "Şifre sıfırlama kodunun süresi dolmuş."
            );
        }


        // Yeni şifreyi hashle

        user.PasswordHash =
            _passwordHasher.HashPassword(
                user,
                request.NewPassword
            );


        // Kullanılmış reset kodunu temizle

        user.PasswordResetCode = null;

        user.PasswordResetCodeExpiresAt = null;


        await _context.SaveChangesAsync();


        return Ok(new
        {
            message =
                "Şifreniz başarıyla değiştirildi."
        });
    }


    // LOGIN

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginDto request)
    {
        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Email == request.Email
                );


        if (user == null)
        {
            return Unauthorized(
                "E-mail veya şifre hatalı."
            );
        }


        if (!user.IsActive)
        {
            return Unauthorized(
                "Kullanıcı hesabı aktif değil."
            );
        }


        if (!user.IsEmailVerified)
        {
            return Unauthorized(
                "Önce e-mail adresinizi doğrulamalısınız."
            );
        }


        var passwordResult =
            _passwordHasher
                .VerifyHashedPassword(
                    user,
                    user.PasswordHash,
                    request.Password
                );


        if (
            passwordResult ==
            PasswordVerificationResult.Failed
        )
        {
            return Unauthorized(
                "E-mail veya şifre hatalı."
            );
        }


        var token =
            _jwtService.GenerateToken(
                user
            );


        return Ok(new
        {
            message =
                "Giriş başarılı.",

            token,

            user = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role
            }
        });
    }
}