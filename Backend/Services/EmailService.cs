using System.Net;
using System.Net.Mail;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // EMAIL VERIFICATION

    public async Task SendVerificationEmailAsync(
        string email,
        string verificationCode)
    {
        var smtpHost =
            _configuration["Email:SmtpHost"];

        var smtpPort =
            _configuration.GetValue<int>(
                "Email:SmtpPort");

        var smtpUsername =
            _configuration["Email:Username"];

        var smtpPassword =
            _configuration["Email:Password"];

        var fromEmail =
            _configuration["Email:FromEmail"];

        var fromName =
            _configuration["Email:FromName"];


        ValidateEmailSettings(
            smtpUsername,
            smtpPassword
        );


        using var client = CreateSmtpClient(
            smtpHost,
            smtpPort,
            smtpUsername,
            smtpPassword
        );


        using var mail = new MailMessage
        {
            From = new MailAddress(
                fromEmail!,
                fromName
            ),

            Subject =
                "IoT Dashboard - E-mail Verification",

            Body = $"""
                Merhaba,

                IoT Dashboard hesabınızı doğrulamak için
                aşağıdaki kodu kullanabilirsiniz:

                {verificationCode}

                Bu kod 10 dakika boyunca geçerlidir.

                Eğer bu işlemi siz gerçekleştirmediyseniz
                bu e-maili dikkate almayabilirsiniz.

                İyi çalışmalar.
                """,

            IsBodyHtml = false
        };

        mail.To.Add(email);

        await client.SendMailAsync(mail);
    }


    // PASSWORD RESET

    public async Task SendPasswordResetEmailAsync(
        string email,
        string resetCode)
    {
        var smtpHost =
            _configuration["Email:SmtpHost"];

        var smtpPort =
            _configuration.GetValue<int>(
                "Email:SmtpPort");

        var smtpUsername =
            _configuration["Email:Username"];

        var smtpPassword =
            _configuration["Email:Password"];

        var fromEmail =
            _configuration["Email:FromEmail"];

        var fromName =
            _configuration["Email:FromName"];


        ValidateEmailSettings(
            smtpUsername,
            smtpPassword
        );


        using var client = CreateSmtpClient(
            smtpHost,
            smtpPort,
            smtpUsername,
            smtpPassword
        );


        using var mail = new MailMessage
        {
            From = new MailAddress(
                fromEmail!,
                fromName
            ),

            Subject =
                "IoT Dashboard - Password Reset",

            Body = $"""
                Merhaba,

                IoT Dashboard hesabınız için
                şifre sıfırlama talebinde bulunuldu.

                Şifre sıfırlama kodunuz:

                {resetCode}

                Bu kod 10 dakika boyunca geçerlidir.

                Eğer bu işlemi siz gerçekleştirmediyseniz
                bu e-maili dikkate almayabilirsiniz.

                İyi çalışmalar.
                """,

            IsBodyHtml = false
        };

        mail.To.Add(email);

        await client.SendMailAsync(mail);
    }


    // SMTP SETTINGS VALIDATION

    private static void ValidateEmailSettings(
        string? username,
        string? password)
    {
        if (
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password)
        )
        {
            throw new InvalidOperationException(
                "SMTP username veya password bulunamadı."
            );
        }
    }

    // SMTP CLIENT

    private static SmtpClient CreateSmtpClient(
        string? host,
        int port,
        string username,
        string password)
    {
        return new SmtpClient(
            host,
            port
        )
        {
            EnableSsl = true,
            UseDefaultCredentials = false,
            Credentials =
                new NetworkCredential(
                    username,
                    password
                )
        };
    }
}