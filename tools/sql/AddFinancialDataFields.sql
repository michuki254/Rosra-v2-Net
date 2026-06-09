-- Add financial data fields to the RosraReports table
USE [RosraDB];
GO

-- Check if the columns already exist before adding them
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'ActualOsr')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [ActualOsr] decimal(18,2) NULL;
    PRINT 'Added ActualOsr column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'ActualOsr column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'BudgetedOsr')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [BudgetedOsr] decimal(18,2) NULL;
    PRINT 'Added BudgetedOsr column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'BudgetedOsr column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'Population')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [Population] int NULL;
    PRINT 'Added Population column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'Population column already exists in RosraReports table.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'GdpPerCapita')
BEGIN
    ALTER TABLE [dbo].[RosraReports] ADD [GdpPerCapita] decimal(18,2) NULL;
    PRINT 'Added GdpPerCapita column to RosraReports table.';
END
ELSE
BEGIN
    PRINT 'GdpPerCapita column already exists in RosraReports table.';
END

-- Update the EstimatedBudget column to have a specific type if it doesn't already
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'EstimatedBudget')
BEGIN
    -- Check if the column type is already decimal(18,2)
    IF NOT EXISTS (
        SELECT * FROM sys.columns c
        INNER JOIN sys.types t ON c.system_type_id = t.system_type_id
        WHERE c.object_id = OBJECT_ID(N'[dbo].[RosraReports]') 
        AND c.name = 'EstimatedBudget'
        AND t.name = 'decimal'
        AND c.precision = 18
        AND c.scale = 2
    )
    BEGIN
        -- Create a temporary table to hold the data
        SELECT * INTO #TempRosraReports FROM [dbo].[RosraReports];
        
        -- Drop the column and recreate it with the correct type
        ALTER TABLE [dbo].[RosraReports] ALTER COLUMN [EstimatedBudget] decimal(18,2) NULL;
        
        PRINT 'Updated EstimatedBudget column to decimal(18,2) in RosraReports table.';
    END
    ELSE
    BEGIN
        PRINT 'EstimatedBudget column already has the correct type in RosraReports table.';
    END
END

GO
