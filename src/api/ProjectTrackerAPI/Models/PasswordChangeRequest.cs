namespace ProjectTrackerAPI.Models
{
    public class PasswordChangeRequest
    {
        public string ? OldPass { get; set; }
        public string ? NewPass { get; set; }
        public string ? UserID { get; set; }
    }
}
