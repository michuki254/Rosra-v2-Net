-- First, remove the migration history entry so we can re-apply
DELETE FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20251207173718_CreateDBCountriesTable';

-- Create the DB_Countries table
CREATE TABLE [DB_Countries] (
    [Id] int NOT NULL IDENTITY(1,1),
    [Country] nvarchar(100) NOT NULL,
    [SNG_total_revenue_pct_gdp] decimal(18,4) NULL,
    [SNG_grants_subsidies_pct_gdp] decimal(18,4) NULL,
    [OSR_pct_gdp] decimal(18,4) NULL,
    [GDP_nominal_usd] decimal(22,2) NULL,
    [Population_total] bigint NULL,
    [OSR_pc_proxy_usd] decimal(18,2) NULL,
    [Government_Type] nvarchar(50) NULL,
    [OSR_Data_Complete] nvarchar(10) NULL,
    [Income_Level] nvarchar(50) NULL,
    [Income_Group] nvarchar(50) NULL,
    [SNG_total_rev_pc_usd] decimal(18,4) NULL,
    [Revenue_Autonomy] decimal(18,9) NULL,
    [OSR_pc_derived_usd] decimal(18,4) NULL,
    CONSTRAINT [PK_DB_Countries] PRIMARY KEY ([Id])
);

-- Record the migration as applied
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20251207173718_CreateDBCountriesTable', '9.0.4');

-- Verify
SELECT 'Table created successfully!' AS Status;
SELECT COUNT(*) AS MigrationCount FROM [__EFMigrationsHistory] WHERE [MigrationId] LIKE '%Countries%';
