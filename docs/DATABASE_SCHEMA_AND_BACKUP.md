# ROSRA V2 Database Schema And Backup Guide

This document explains how ROSRA V2 stores its data, where calculations live, and how to export, back up, and restore the database.

## 1. Database Overview

ROSRA V2 uses a SQL Server relational database through Entity Framework Core.

The database schema is defined mainly in:

- `Data/ApplicationDbContext.cs`
- `Models/*.cs`
- `Models/ViewModels/RosraFormViewModel.cs`
- `Migrations/ApplicationDbContextModelSnapshot.cs`
- `Migrations/*.cs`

There are no MongoDB-style collections in this project. The application uses SQL tables.

The main database connection is read from configuration in this order:

1. `CONNECTION_STRING`
2. `ConnectionStrings__DefaultConnection`
3. `ConnectionStrings:DefaultConnection`
4. Azure connection string names such as `DefaultConnection` or `AZURE_SQL_CONNECTIONSTRING`
5. `appsettings.json` fallback

The default local database name in `appsettings.json` is:

```text
unhab-rosra-db-prod
```

## 2. Main Database Tables

### User And Access Tables

These tables are created by ASP.NET Core Identity and store users, roles, login details, and role membership.

| Table | Purpose |
| --- | --- |
| `AspNetUsers` | User accounts, emails, password hashes, profile fields, and consent fields. |
| `AspNetRoles` | System roles such as Admin, Reviewer, Validator, or other configured roles. |
| `AspNetUserRoles` | Links users to roles. |
| `AspNetUserClaims` | Optional user claims. |
| `AspNetRoleClaims` | Optional role claims. |
| `AspNetUserLogins` | External login records, for example Microsoft Entra ID. |
| `AspNetUserTokens` | Identity tokens used by ASP.NET Core Identity. |

Application-specific access control is stored separately:

| Table | Purpose |
| --- | --- |
| `Permissions` | Permission names such as `CreateReports`, `ReviewReports`, `ExportReports`, and `ManagePermissions`. |
| `RolePermissions` | Links roles to permissions. Has a unique constraint on `RoleId + PermissionId`. |

### Report And Workflow Tables

| Table | Purpose |
| --- | --- |
| `RosraReports` | Main report table. Stores report metadata, location data, workflow status, and JSON payloads for the report tabs. |
| `ReviewNotes` | Reviewer notes attached to reports. |
| `AnalysisSnapshots` | Immutable report snapshots created during submission, validation, and pre-edit backup events. |
| `ReportArtifacts` | Metadata for generated files such as PDF or Excel exports. Stores file paths, not file binaries. |
| `AuditLogs` | Tracks report changes, status transitions, admin actions, and retention purges. |

### Reference Data Tables

| Table | Purpose |
| --- | --- |
| `Country` | Country, state, region, city, currency, and location lookup data. |
| `DB_Countries` | Country-level fiscal and economic reference data used in top-down analysis. |
| `DB_Frontiers` | Frontier benchmark values by income level and government type. |
| `Peers_SNG` | Admin-managed peer subnational government dataset for within-country frontier analysis. |
| `UserPeerSngs` | User-entered peer SNG records saved to a user's personal peer library. |
| `DataUploadHistory` | Upload history for reference datasets such as peer SNG data and country data. |

### Administration And Configuration Tables

| Table | Purpose |
| --- | --- |
| `EmailSettings` | SMTP server, sender, and notification toggle settings. |
| `EmailLogs` | Log of outgoing email attempts and delivery status. |
| `SystemSettings` | Key/value system-level settings. |
| `SolutionCards` | Reform recommendation cards used by the solution library. |
| `SolutionCardHistory` | Change history for solution cards. |
| `CardSets` | Named sets of solution cards for specific contexts. |

### Entity Framework Table

| Table | Purpose |
| --- | --- |
| `__EFMigrationsHistory` | Created by Entity Framework Core when migrations are applied. Tracks which migrations have already run. |

## 3. Core Schema Summary

### `RosraReports`

This is the central table. One row represents one ROSRA assessment report.

Important fields include:

| Field Group | Example Columns | Purpose |
| --- | --- | --- |
| Identity | `Id`, `PublicId`, `Title` | Internal ID, public URL-safe ID, and report title. |
| Ownership | `UserId`, `LastModifiedByUserId` | Report author and last editor. |
| Location | `Country`, `Region`, `City`, `GovUnitLevel3`, `FinalUnitLevel` | Geographic area being assessed. |
| Currency and year | `Currency`, `CurrencySymbol`, `FinancialYear` | Currency and reporting period. |
| Financial profile | `ActualOsr`, `BudgetedOsr`, `OtherRevenue`, `Population`, `GdpPerCapita`, `EconomicProfile` | Main financial and demographic inputs. |
| Top-down context | `GovernmentType`, `IncomeLevel`, `PeerSNGData`, `TopOsrConfigData` | Top-down analysis and peer comparison inputs/results. |
| Gap analysis JSON | `PropertyTaxData`, `LicenseData`, `ShortTermUserChargeData`, `LongTermUserChargeData`, `MixedUserChargeData`, `GenericStreamsData`, `TotalEstimateData` | Tab-specific report data stored as JSON. |
| Recommendations JSON | `RootCauses`, `ActionItems`, `PrioritizationData`, `SelectedSolutionsData`, `ImplementationProgressData` | Causes, action planning, prioritization, and selected reforms. |
| Workflow | `Status`, `CompletionLevel`, `SubmissionVersion`, `SubmittedAt`, `ReviewStartedAt`, `ValidatedAt`, `ReviewerUserId`, `ValidatedByUserId`, `RevisionReason` | Submission, review, revision, and validation state. |
| Soft delete/archive | `IsDeleted`, `DeletedAt`, `DeletedByUserId`, `IsArchived`, `ArchivedAt` | Trash/archive behavior. |
| Concurrency | `RowVersion` | Prevents conflicting saves from overwriting each other. |

The report lifecycle is:

```text
Draft -> Submitted -> UnderReview -> NeedsRevision -> Validated
```

### `AnalysisSnapshots`

Stores stable copies of a report at important workflow points.

Main fields:

- `ReportId`
- `SnapshotType`
- `FormDataJson`
- `CreatedAt`
- `CreatedByUserId`
- `Label`

`FormDataJson` contains a serialized `RosraFormViewModel`. This makes it possible to review or preserve the exact data state used for submission or validation.

### `ReportArtifacts`

Stores metadata for generated exports.

Main fields:

- `ReportId`
- `SnapshotId`
- `FileName`
- `FilePath`
- `FileType`
- `FileSizeBytes`
- `GeneratedAt`
- `GeneratedByUserId`

The actual generated file is stored on disk or hosting storage. The database stores the path and metadata only.

### `Peers_SNG`

Stores the global/admin-managed peer SNG dataset.

Main fields:

- `CountryCode`
- `SNG`
- `OSR`
- `GCP`
- `Population`
- `Include`
- `Band`
- `Watchlist`
- `Currency`

Calculated values such as `OSR / GCP` and `OSR per capita` are not stored in the database. They are calculated in the model from stored values.

### `UserPeerSngs`

Stores peer SNGs entered by users.

Main fields:

- `UserId`
- `ReportId`
- `CountryCode`
- `Sng`
- `Osr`
- `Gcp`
- `Population`
- `Include`
- `Band`
- `Currency`

This table is separate from `Peers_SNG` so user-entered peer data does not overwrite the admin-managed reference dataset.

### `DB_Countries`

Stores country-level fiscal reference data.

Main fields:

- `Country`
- `SNG_total_revenue_pct_gdp`
- `SNG_grants_subsidies_pct_gdp`
- `OSR_pct_gdp`
- `GDP_nominal_usd`
- `Population_total`
- `OSR_pc_proxy_usd`
- `Government_Type`
- `Income_Level`
- `Income_Group`
- `SNG_total_rev_pc_usd`
- `Revenue_Autonomy`
- `OSR_pc_derived_usd`
- `CurrencyCode`
- `CurrencySymbol`

### `SolutionCards`

Stores reform recommendation cards.

Main fields:

- `SolutionId`
- `Stream`
- `StreamType`
- `Subgroup`
- `Gap`
- `Title`
- `ShortTitle`
- `Timeline`
- `DeliveryDifficulty`
- `PoliticalSensitivity`
- `Category`
- `SortOrder`
- `IsActive`
- `OverviewData`
- `FullDetailsData`

`OverviewData` and `FullDetailsData` are JSON fields.

## 4. Where Formulas And Calculations Are Stored

The database does not store formulas as SQL stored procedures, computed columns, or spreadsheet cells.

Most formulas are stored in application code. The database stores:

- Raw user inputs
- Some calculated output values saved inside JSON fields
- Snapshots of completed report states
- Reference data used by the formulas

### Main Formula Locations

| Area | Location | Purpose |
| --- | --- | --- |
| Property tax gap math | `Services/GapCalculator.cs` | Server-side property tax calculations used by admin/export/report views. |
| Business license gap math | `Services/GapCalculator.cs` | Server-side business license calculations used by admin/export/report views. |
| Generic stream gap math | `Services/GapCalculationService.cs` | Server-side calculations for custom/non-property revenue streams. |
| Generic stream API | `Controllers/Api/GapsApiController.cs` | Exposes `POST /api/gaps/calculate` for server-side generic stream calculation. |
| WoFi/top-down potential estimate | `Services/WofiPotentialEstimator.cs` | Calculates top-down OSR potential using embedded WoFi reference data. |
| Live property tax UI calculations | `Views/Shared/_GapAnalysisPropertyTaxFixed.cshtml` | JavaScript formulas used while the user fills in property tax data. |
| Live business license UI calculations | `Views/Shared/_GapAnalysisLicense.cshtml` | JavaScript formulas used while the user fills in business license data. |
| Live generic stream UI calculations | `Views/Shared/_GapAnalysisGenericStream.cshtml` | JavaScript formulas used for custom revenue streams. |
| Short-term charges | `Views/Shared/_GapAnalysisShortTerm.cshtml` | JavaScript formulas for daily/short-term user charges. |
| Long-term charges | `Views/Shared/_GapAnalysisLongTerm.cshtml` | JavaScript formulas for monthly/long-term user charges. |
| Mixed user charges | `Views/Shared/_GapAnalysisMixed.cshtml` | JavaScript formulas for mixed fee models. |
| Total gap summary | `Views/Shared/_GapAnalysisTotal.cshtml` | Aggregates gap values across streams. |
| Potential estimates UI | `Views/Shared/_PotentialEstimates.cshtml` | Client-side top-down display and peer analysis behavior. |
| Recommendations and reform visuals | `wwwroot/js/recommendationsModule.js` | Uses gap outputs to build recommendation and action-plan views. |

### Embedded Formula Reference Data

The WoFi estimator loads these embedded JSON files:

- `Data/Wofi/wofi_country_proxy.json`
- `Data/Wofi/wofi_gni_atlas.json`
- `Data/Wofi/wofi_assumptions.json`
- `Data/Wofi/wofi_premium_rules.json`
- `Data/Wofi/wofi_national_data.json`

These files are embedded in the application through `RosraApp.csproj`, so they travel with the compiled application.

### Important Formula Design Note

Several calculations exist in both:

1. JavaScript, so users see live results while filling forms.
2. C#, so exports, admin views, and validation can reproduce the results server-side.

When a formula changes, both implementations should be checked so the saved report, the visible UI, and the exported report remain consistent.

## 5. JSON Data Stored In `RosraReports`

The main report table intentionally stores complex tab data as JSON. This keeps the report flexible as the form evolves.

| Column | Stored Content |
| --- | --- |
| `PropertyTaxData` | Property tax inputs and calculated values. |
| `LicenseData` | Business license inputs and calculated values. |
| `ShortTermUserChargeData` | Short-term user charge data. |
| `LongTermUserChargeData` | Long-term user charge data. |
| `MixedUserChargeData` | Mixed charge data. |
| `TotalEstimateData` | Aggregated total gap estimate data. |
| `RootCauses` | JSON list of root causes. |
| `ActionItems` | JSON list of action items. |
| `TopOsrConfigData` | Top OSR stream configuration. |
| `GenericStreamsData` | List of custom revenue streams. |
| `PrioritizationData` | Stream and gap prioritization data. |
| `SelectedSolutionsData` | Selected reform solution cards. |
| `ImplementationProgressData` | Progress tracking for implementation actions. |
| `PeerSNGData` | Peer SNG/top-down analysis data and results. |

## 6. Existing Application Exports

ROSRA V2 has several export features, but they are not all full database backups.

| Export | Location | What It Contains | Full Restore Backup? |
| --- | --- | --- | --- |
| Report PDF export | Report/export screens | Human-readable report output. | No |
| Report Excel export | Report/export screens | Human-readable report workbook. | No |
| Admin Data Management Excel export | `/Admin/DataManagement` | Filtered assessment data for analysis. | No |
| Admin backup Excel export | `/Admin/BackupData` | Report summary, latest audit logs, and upload history. | No |
| Solution card JSON export | `/Admin/ExportSolutionCards` | Solution card library content. | No |
| SQL Server `.bak` backup | SQL Server/DBA tooling | Full SQL Server database backup. | Yes, for SQL Server. |
| Azure SQL `.bacpac` export | Azure Portal or `SqlPackage` | Schema and data package for Azure SQL/SQL Server import. | Yes, for migration/restore workflows. |

Use the built-in Excel exports for reporting and analysis. Use `.bak` or `.bacpac` for real disaster recovery.

## 7. Full Database Backup Instructions

### Option A: SQL Server `.bak` Backup

Use this when the database is hosted on SQL Server or SQL Server in a container/VM.

1. Confirm the database name.
2. Make sure the backup directory exists and SQL Server can write to it.
3. Run:

```sql
BACKUP DATABASE [unhab-rosra-db-prod]
TO DISK = N'/var/opt/mssql/backups/rosra_YYYYMMDD_HHMM.bak'
WITH INIT, COMPRESSION, CHECKSUM;
```

4. Verify the backup:

```sql
RESTORE VERIFYONLY
FROM DISK = N'/var/opt/mssql/backups/rosra_YYYYMMDD_HHMM.bak'
WITH CHECKSUM;
```

Example using `sqlcmd` with SQL authentication:

```bash
sqlcmd -S localhost -U sa -P "<password>" -d master -Q "BACKUP DATABASE [unhab-rosra-db-prod] TO DISK = N'/var/opt/mssql/backups/rosra_YYYYMMDD_HHMM.bak' WITH INIT, COMPRESSION, CHECKSUM;"
```

### Option B: Azure SQL `.bacpac` Export

Azure SQL Database does not use normal SQL Server `.bak` backups in the same way. Use `.bacpac` export instead.

Example using `SqlPackage`:

```bash
SqlPackage /Action:Export \
  /SourceConnectionString:"<production-connection-string>" \
  /TargetFile:"backups/rosra_YYYYMMDD_HHMM.bacpac"
```

You can also export a `.bacpac` from the Azure Portal:

1. Open the Azure SQL Database.
2. Choose Export.
3. Select the target storage account/container.
4. Provide SQL admin credentials.
5. Start the export and confirm it completes.

## 8. Full Database Restore Instructions

### Restore From A SQL Server `.bak`

Recommended safe approach:

1. Stop the application or put it into maintenance mode.
2. Back up the current database before restoring over it.
3. Restore into a new database first, for example `rosra_restore_test`.
4. Verify row counts, users, reports, and key pages.
5. Point the application connection string to the restored database or replace the production database after verification.

To inspect logical file names:

```sql
RESTORE FILELISTONLY
FROM DISK = N'/var/opt/mssql/backups/rosra_YYYYMMDD_HHMM.bak';
```

Restore to a new database:

```sql
RESTORE DATABASE [rosra_restore_test]
FROM DISK = N'/var/opt/mssql/backups/rosra_YYYYMMDD_HHMM.bak'
WITH
  MOVE 'logical_data_file_name' TO '/var/opt/mssql/data/rosra_restore_test.mdf',
  MOVE 'logical_log_file_name' TO '/var/opt/mssql/data/rosra_restore_test_log.ldf',
  CHECKSUM;
```

If you must overwrite an existing database, use extreme care:

```sql
ALTER DATABASE [unhab-rosra-db-prod] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

RESTORE DATABASE [unhab-rosra-db-prod]
FROM DISK = N'/var/opt/mssql/backups/rosra_YYYYMMDD_HHMM.bak'
WITH REPLACE, CHECKSUM;

ALTER DATABASE [unhab-rosra-db-prod] SET MULTI_USER;
```

After restore:

```bash
dotnet ef database update
dotnet run
```

Only run `dotnet ef database update` if the application code is newer than the restored database schema.

### Restore From An Azure SQL `.bacpac`

Using `SqlPackage`:

```bash
SqlPackage /Action:Import \
  /TargetConnectionString:"<target-connection-string>" \
  /SourceFile:"backups/rosra_YYYYMMDD_HHMM.bacpac"
```

Azure Portal approach:

1. Open SQL Server in Azure.
2. Choose Import database.
3. Select the `.bacpac` file from storage.
4. Choose the target database name and compute tier.
5. Start import.
6. Update the app connection string if the restored database has a new name.

## 9. Files Not Fully Covered By SQL Backup

A SQL backup protects database rows. It does not automatically include all application files.

Also back up:

| Item | Why It Matters |
| --- | --- |
| Data Protection keys, usually `$HOME/DataProtection-Keys` | Required to keep auth cookies and encrypted SMTP values readable after deployment/restores. |
| Generated report artifacts | `ReportArtifacts` stores file paths, but the actual PDF/Excel files live outside the database. |
| Production environment variables/secrets | Connection strings, SMTP credentials, Entra ID settings, and seed admin password are not stored safely in source control. |
| Uploaded source files, if preserved outside the database | Upload history is stored in SQL, but original upload files may not be. |

Playwright browser binaries do not need to be backed up. They can be reinstalled.

## 10. Suggested Backup Schedule

For production:

- Full database backup: daily.
- Additional backup before deployments or migrations.
- Keep at least 7 daily backups and 4 weekly backups.
- Test restore at least once per month.
- Store backups outside the application server.
- Encrypt backups if they contain real user or government data.

For local development:

- Back up before running new migrations.
- Back up before importing large reference datasets.
- Use a separate test database for restore practice.

## 11. Restore Verification Checklist

After any restore, verify:

- The application starts.
- Admin login works.
- `/Dashboard` shows expected reports.
- `/Rosra` can open an existing report.
- Report JSON tabs load correctly.
- Review queue and validation status are correct.
- PDF and Excel exports work.
- Admin pages can load users, roles, data uploads, audit logs, and solution cards.
- Latest EF migration is applied.
- Data Protection keys and report artifact files are present if needed.

## 12. Data Retention Note

The application has a background retention service:

- Soft-deleted reports are kept for 90 days.
- After 90 days, expired deleted reports, snapshots, artifacts, and notes can be permanently purged.
- Purge activity is written to `AuditLogs`.

Create a real database backup before running manual retention purges in production.
