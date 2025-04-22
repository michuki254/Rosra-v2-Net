-- This script documents the removal of the EstimatedBudget field from the UI
-- Note: We're keeping the field in the database for backward compatibility
-- but it's no longer displayed or used in the application UI

USE [RosraDB];
GO

-- Check if the EstimatedBudget column exists
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RosraReports]') AND name = 'EstimatedBudget')
BEGIN
    PRINT 'The EstimatedBudget column exists in the RosraReports table.';
    PRINT 'This field has been removed from the UI but is being kept in the database for backward compatibility.';
END
ELSE
BEGIN
    PRINT 'The EstimatedBudget column does not exist in the RosraReports table.';
END

GO
