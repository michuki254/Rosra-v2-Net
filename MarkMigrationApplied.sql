-- Mark the currency columns migration as applied (columns already exist)
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20251207180335_AddCurrencyColumnsToDBCountries', '9.0.4');

-- Verify
SELECT * FROM [__EFMigrationsHistory] ORDER BY [MigrationId];
