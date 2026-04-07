namespace RosraApp.Models.ViewModels
{
    public class EmailManagementViewModel
    {
        public EmailSettings Settings { get; set; } = new();
        public List<EmailLog> RecentLogs { get; set; } = new();
        public int LogPageNumber { get; set; } = 1;
        public int LogTotalPages { get; set; } = 1;
        public int LogTotalCount { get; set; }
        public Dictionary<string, string> TemplatePreviews { get; set; } = new();

        // Stats
        public int TotalSent { get; set; }
        public int TotalFailed { get; set; }
        public int SentToday { get; set; }
    }
}
