-- Add CountryCode column to Peers_SNG table
-- Run this script to fix the "Invalid column name 'CountryCode'" error

-- Check if column exists before adding
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_NAME = 'Peers_SNG' AND COLUMN_NAME = 'CountryCode')
BEGIN
    ALTER TABLE [Peers_SNG]
    ADD [CountryCode] NVARCHAR(3) NOT NULL DEFAULT 'KEN';

    PRINT 'CountryCode column added successfully with default value KEN';
END
ELSE
BEGIN
    PRINT 'CountryCode column already exists';
END

-- Update the EF migrations history to mark this migration as applied
-- (Only run this if you applied the SQL manually instead of using dotnet ef database update)
IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260204000000_AddCountryCodeToPeersSNG')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20260204000000_AddCountryCodeToPeersSNG', '9.0.4');

    PRINT 'Migration history updated';
END
