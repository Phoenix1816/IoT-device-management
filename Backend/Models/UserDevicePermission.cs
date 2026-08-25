namespace Backend.Models
{
    public class UserDevicePermission
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null;

        public int DeviceId { get; set; }
        public Device Device { get; set; } = null;
    }
}
