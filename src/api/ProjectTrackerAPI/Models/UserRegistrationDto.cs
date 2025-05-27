namespace ProjectTrackerAPI.Models
{
    public class UserRegistrationDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string VerificationCode { get; set; } = string.Empty;
        public bool Verified { get; set; }
    }

    public class ProjectDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<TaskDto> Tasks { get; set; } = new List<TaskDto>();
    }

    public class TaskDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "pending";
    }
}
