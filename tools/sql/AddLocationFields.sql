-- Add location fields to the RosraReports table
USE [RosraDB];
GO

-- Check if the columns already exist before adding them
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'Country')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [Country] nvarchar(50) NULL;
    PRINT 'Added Country column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'Country column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'Region')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [Region] nvarchar(50) NULL;
    PRINT 'Added Region column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'Region column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'City')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [City] nvarchar(100) NULL;
    PRINT 'Added City column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'City column already exists in RosraReports table.';
END

GO
