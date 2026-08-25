namespace Backend.DTOs
{
    public class VerifyEmailDto
    {
        public string Email { get; set; } = string.Empty;
        public string VerificationCode { get; set; } = string.Empty;
    }
}
