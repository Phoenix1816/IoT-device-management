namespace Backend.Models;

public class Device
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Threshold { get; set; }
    public bool IsActive { get; set; }

    public DateTime? LastSeen { get; set; }
}