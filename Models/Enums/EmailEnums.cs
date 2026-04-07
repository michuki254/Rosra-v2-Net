namespace RosraApp.Models.Enums
{
    public enum NotificationType
    {
        ReportSubmitted = 0,
        ReportClaimed = 1,
        ReportValidated = 2,
        ReportRejected = 3,
        ReportUnlocked = 4,
        WelcomeEmail = 5,
        TestEmail = 6
    }

    public enum EmailStatus
    {
        Pending = 0,
        Sent = 1,
        Failed = 2
    }
}
