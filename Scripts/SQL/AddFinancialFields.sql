-- Add financial year and currency fields to the RosraReports table
USE [RosraDB];
GO

-- Check if the columns already exist before adding them
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'Currency')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [Currency] nvarchar(100) NULL;
    PRINT 'Added Currency column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'Currency column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'CurrencySymbol')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [CurrencySymbol] nvarchar(10) NULL;
    PRINT 'Added CurrencySymbol column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'CurrencySymbol column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'FinancialYear')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [FinancialYear] nvarchar(20) NULL;
    PRINT 'Added FinancialYear column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'FinancialYear column already exists in RosraReports table.';
END

GO
