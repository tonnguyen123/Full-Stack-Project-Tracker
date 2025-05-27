namespace ProjectTrackerAPI.Models
{
    public class UpdatedProject
    {
        public int ? UserID { get; set; }
        public string ? ProjectName { get; set; }
        public string ? UpdatedDescription { get; set; }

        public DateTime ? UpdatedDue { get; set; }

    }
}