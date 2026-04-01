--- Add new fields to the RosraReports table
USE [RosraDB];
GO

-- Check if the columns already exist before adding them
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'ProjectDescription')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [ProjectDescription] nvarchar(max) NULL;
    PRINT 'Added ProjectDescription column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'ProjectDescription column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'KeyObjectives')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [KeyObjectives] nvarchar(max) NULL;
    PRINT 'Added KeyObjectives column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'KeyObjectives column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'StartDate')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [StartDate] datetime2 NULL;
    PRINT 'Added StartDate column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'StartDate column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'EndDate')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [EndDate] datetime2 NULL;
    PRINT 'Added EndDate column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'EndDate column already exists in RosraReports table.';
END

-- Add migration record for the new fields
IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20250415164800_AddPotentialEstimatesFields')
BEGIN
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250415164800_AddPotentialEstimatesFields', N'9.0.0');
    
    PRINT 'Migration record added for AddPotentialEstimatesFields.';
END
ELSE
BEGIN
    PRINT 'Migration record for AddPotentialEstimatesFields already exists.';
END
GO
