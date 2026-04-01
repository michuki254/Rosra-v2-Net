-- Add RosraReports table to the database
USE [RosraDB];
GO

-- Create RosraReports table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RosraReports')
BEGIN
    CREATE TABLE [dbo].[RosraReports] (
        [Id] int NOT NULL IDENTITY(1,1),
        [Title] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2(7) NOT NULL,
        [UserId] nvarchar(450) NULL,
        [ProjectName] nvarchar(max) NULL,
        [EstimatedBudget] decimal(18,2) NULL,
        [CurrentState] nvarchar(max) NULL,
        [DesiredState] nvarchar(max) NULL,
        [ProblemStatement] nvarchar(max) NULL,
        [RootCauses] nvarchar(max) NULL,
        [RecommendationSummary] nvarchar(max) NULL,
        [ActionItems] nvarchar(max) NULL,
        CONSTRAINT [PK_RosraReports] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_RosraReports_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION
    );
    
    -- Create index for UserId
    CREATE INDEX [IX_RosraReports_UserId] ON [dbo].[RosraReports] ([UserId]);
    
    PRINT 'RosraReports table created successfully.';
END
ELSE
BEGIN
    PRINT 'RosraReports table already exists.';
END
GO

-- Add migration record for RosraReports table
IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20250414191027_AddRosraReportTable')
BEGIN
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250414191027_AddRosraReportTable', N'9.0.0');
    
    PRINT 'Migration record added for RosraReportTable.';
END
ELSE
BEGIN
    PRINT 'Migration record for RosraReportTable already exists.';
END
GO
