-- Create DB_Frontiers table if not exists
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DB_Frontiers' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[DB_Frontiers] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Income_Level] NVARCHAR(50) NOT NULL,
        [Government_Type] NVARCHAR(50) NULL,
        [SNG_total_rev_pc_frontier] DECIMAL(18, 8) NULL,
        [OSR_pc_frontier] DECIMAL(18, 8) NULL,
        [Revenue_Autonomy_frontier] DECIMAL(18, 9) NULL
    );
END

-- Clear existing data
DELETE FROM [dbo].[DB_Frontiers];

-- Insert Unitary Countries data
INSERT INTO [dbo].[DB_Frontiers] ([Income_Level], [Government_Type], [SNG_total_rev_pc_frontier], [OSR_pc_frontier], [Revenue_Autonomy_frontier])
VALUES
    ('Low', 'Unitary', 41.00480178, 4.03, 0.098281173),
    ('Lower-middle', 'Unitary', 313.6863837, 187.87, 0.59891028),
    ('Upper-middle', 'Unitary', 1452.013275, 657.445, 0.452781673),
    ('High', 'Unitary', 13860.11906, 7466.65, 0.538714709);

-- Insert Federal Countries data (only Upper-middle has data)
INSERT INTO [dbo].[DB_Frontiers] ([Income_Level], [Government_Type], [SNG_total_rev_pc_frontier], [OSR_pc_frontier], [Revenue_Autonomy_frontier])
VALUES
    ('Upper-middle', 'Federal', 2385.00, 1759.35, 0.88);

-- Verify the data
SELECT * FROM [dbo].[DB_Frontiers];
