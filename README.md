# ROSRA V2

ROSRA V2 is an ASP.NET Core MVC application for subnational revenue opportunity analysis. It helps municipalities and local governments build ROSRA reports, estimate own-source revenue potential, compare gaps across revenue streams, prioritize reforms, and export validated analysis packages.

The application is built for authenticated users, reviewers, and administrators. It includes role and permission management, review and validation workflows, localized UI resources, PDF/Excel exports, data uploads, and seeded reference datasets for country, peer SNG, frontier, and WoFi-based top-down estimates.

## Main Capabilities

- Build ROSRA reports through top-down and bottom-up analysis workflows.
- Estimate revenue potential using local government profile data and embedded WoFi reference tables.
- Analyze gaps for property tax, business licenses, short-term user charges, long-term user charges, mixed user charges, and custom revenue streams.
- Save, auto-save, view, archive, soft-delete, restore, and export reports.
- Submit reports for review, add reviewer notes, validate reports, unlock validated reports, and retain analysis snapshots and artifacts.
- Manage users, roles, permissions, reports, data uploads, email settings, system settings, and the solution-card library from the admin area.
- Export reports to PDF and Excel.
- Run in English, French, and Spanish through ASP.NET Core localization resources.

## Technology Stack

- .NET 8 / ASP.NET Core MVC
- Razor views and partial views
- ASP.NET Core Identity with roles and custom permission policies
- Entity Framework Core with SQL Server
- Bootstrap, jQuery, Chart.js, Select2, Font Awesome, and local static assets
- ClosedXML for Excel export
- QuestPDF and Playwright/Chromium-backed HTML-to-PDF rendering
- MailKit for SMTP email delivery

## Repository Layout

```text
Authorization/          Custom permission authorization attributes, requirements, and handlers
Controllers/            MVC and API controllers
Data/                   EF Core DbContext, database initializer, and embedded seed data
Infrastructure/         MVC infrastructure such as custom model binding
Migrations/             EF Core migrations
Models/                 Domain models, enums, and view models
Resources/              Localization resource files
Services/               Report, export, snapshot, email, validation, and data services
Views/                  Razor pages, layouts, and partial views
wwwroot/                CSS, JavaScript, images, fonts, client libraries, and public docs
docs/                   Project documentation, audits, design notes, and operational guides
tools/                  SQL scripts and data-processing helper scripts
```

## Getting Started

### Prerequisites

- .NET SDK 8.x
- SQL Server or SQL Server-compatible local development instance
- A connection string with rights to create/update the ROSRA database
- Optional: SMTP credentials for email features
- Optional: Microsoft Entra ID app registration for UN account single sign-on

### Configure Local Settings

The application reads the database connection string from `CONNECTION_STRING` first, then from `ConnectionStrings:DefaultConnection` in `appsettings.json`.

For local development, use user secrets or environment variables instead of committing secrets. The connection string is read through normal .NET configuration, while `ADMIN_SEED_PASSWORD` is read directly from the process environment:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=unhab-rosra-db-prod;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
export ADMIN_SEED_PASSWORD="ChangeThisToAStrongLocalPassword!"
```

The default admin account is only created when `ADMIN_SEED_PASSWORD` is set. The seeded email is `admin@rosra.com`.

### Restore, Build, and Run

```bash
dotnet restore
dotnet build
dotnet run
```

The development launch profile is in `Properties/launchSettings.json`. On first startup, the app initializes the database, applies migrations where possible, seeds roles, permissions, reference data, solution cards, email settings, and sample reports.

Playwright Chromium is installed on startup into a persistent `.playwright` location. PDF generation can fail until that browser install completes.

## Configuration

Common configuration keys:

| Key | Purpose |
| --- | --- |
| `CONNECTION_STRING` | Preferred runtime database connection string override. |
| `ConnectionStrings:DefaultConnection` | SQL Server connection string fallback. |
| `ADMIN_SEED_PASSWORD` | Enables initial `admin@rosra.com` seed user creation. |
| `EmailSettings:*` | SMTP host, port, sender, credentials, and TLS settings. |
| `EntraId:TenantId` | Microsoft Entra ID tenant for optional SSO. |
| `EntraId:ClientId` | Entra ID application client ID. |
| `EntraId:ClientSecret` | Entra ID application secret. |
| `EntraId:AdminEmails` | Comma-separated allow-list used by external sign-in handling. |

See [Setup And Deployment](docs/SETUP_AND_DEPLOYMENT.md) for more detail.

## Core Workflows

### Report Authoring

Users create or edit ROSRA reports at `/Rosra`. Report data is stored in `RosraReports`, with several tab payloads persisted as JSON fields. The main workflow is split into top-down and bottom-up analysis areas and includes gap analysis, prioritization, recommendations, and exports.

### Review And Validation

Reports move through these statuses:

```text
Draft -> Submitted -> UnderReview -> NeedsRevision -> Validated
```

The submission workflow creates snapshots and artifacts so reviewers and validators can inspect stable versions of an analysis.

### Administration

The `/Admin` area manages users, roles, permissions, reports, deleted reports, audit logs, reference data uploads, email settings, data backups, retention purges, system settings, analytics, and solution cards.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Setup And Deployment](docs/SETUP_AND_DEPLOYMENT.md)
- [Security Audit Pre-Assessment](docs/SECURITY-AUDIT-PRE-ASSESSMENT.md)
- [Cybersecurity Audit 2026-05-25](docs/CYBERSECURITY-AUDIT-2026-05-25.md)
- [Project Update 2026-05-04](docs/PROJECT-UPDATE-2026-05-04.md)
- [Public User Job Aid](wwwroot/docs/ROSRA_User_Job_Aid.md)

## Development Notes

- Use `dotnet ef migrations add <Name>` for schema changes and review generated migrations before committing.
- Keep seed data changes in `Data/SeedData/` and `Data/Wofi/` aligned with the initializer and embedded resource declarations in `RosraApp.csproj`.
- Do not commit secrets in `appsettings.json`; use user secrets locally and platform environment variables in hosted environments.
- There is no separate test project in the repository at the time of writing. Use `dotnet build` as the minimum verification step after code changes.
