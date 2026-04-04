namespace RosraApp.Models.Enums
{
    public enum ReportStatus
    {
        Draft = 0,
        Submitted = 1,
        UnderReview = 2,
        NeedsRevision = 3,
        Validated = 4
    }

    public enum CompletionLevel
    {
        Metadata = 0,
        Partial = 1,
        Full = 2
    }

    public enum SnapshotType
    {
        Submission = 0,
        Validation = 1,
        PreEditBackup = 2
    }

    public enum NoteType
    {
        General = 0,
        CorrectionRequest = 1,
        ValidationComment = 2,
        RevisionReason = 3
    }

    public enum ArtifactFileType
    {
        PDF = 0,
        Excel = 1
    }
}
