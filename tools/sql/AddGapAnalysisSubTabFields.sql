-- Add Gap Analysis Sub-Tab fields to the RosraReports table
USE [RosraDB];
GO

-- Check if the columns already exist before adding them
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'PropertyTaxData')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [PropertyTaxData] nvarchar(max) NULL;
    PRINT 'Added PropertyTaxData column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'PropertyTaxData column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'LicenseData')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [LicenseData] nvarchar(max) NULL;
    PRINT 'Added LicenseData column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'LicenseData column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'ShortTermUserChargeData')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [ShortTermUserChargeData] nvarchar(max) NULL;
    PRINT 'Added ShortTermUserChargeData column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'ShortTermUserChargeData column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'LongTermUserChargeData')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [LongTermUserChargeData] nvarchar(max) NULL;
    PRINT 'Added LongTermUserChargeData column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'LongTermUserChargeData column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'MixedUserChargeData')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [MixedUserChargeData] nvarchar(max) NULL;
    PRINT 'Added MixedUserChargeData column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'MixedUserChargeData column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'TotalEstimateData')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [TotalEstimateData] nvarchar(max) NULL;
    PRINT 'Added TotalEstimateData column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'TotalEstimateData column already exists in RosraReports table.';
END

-- Add migration record for the new fields
IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20250415192300_AddGapAnalysisSubTabFields')
BEGIN
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250415192300_AddGapAnalysisSubTabFields', N'9.0.0');
    
    PRINT 'Migration record added for AddGapAnalysisSubTabFields.';
END
ELSE
BEGIN
    PRINT 'Migration record for AddGapAnalysisSubTabFields already exists.';
END

GO
