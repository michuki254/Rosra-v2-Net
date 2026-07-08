# Future Developer Guide

This guide is for developers taking over ROSRA V2. It explains where the important pieces live, how the app starts, and what to check before changing production-facing behavior.

For user-facing help, see `wwwroot/docs/ROSRA_User_Job_Aid.md`. For deployment details, see `docs/SETUP_AND_DEPLOYMENT.md`. For a system overview, see `docs/ARCHITECTURE.md`.

## Quick Start

Prerequisites:

- .NET SDK 8.x
- SQL Server or an Azure SQL-compatible database
- A connection string with permission to create/update the ROSRA database
- Optional SMTP settings for email workflows
- Optional Microsoft Entra ID app registration for UN account SSO

Recommended local setup:

```bash
dotnet restore
dotnet build
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<local-sql-server-connection-string>"
export ADMIN_SEED_PASSWORD="Use-A-Strong-Local-Password-Here!"
dotnet run
```

Important local URLs:

- `/` - public home page
- `/Rosra` - report builder
- `/Dashboard` - user report dashboard
- `/Admin` - administration area
- `/Home/DevGuide` - in-app developer/admin guide, visible to Admin users only

## Runtime Shape

ROSRA V2 is a server-rendered ASP.NET Core MVC application.

Core technologies:

- .NET 8 / ASP.NET Core MVC
- Razor views and partial views
- ASP.NET Core Identity with roles and permission policies
- Entity Framework Core with SQL Server
- Bootstrap, jQuery, Chart.js, Select2, Font Awesome
- ClosedXML for Excel export
- QuestPDF and Playwright/Chromium-backed HTML-to-PDF rendering
- MailKit for SMTP delivery

Startup is owned by `Program.cs`. At startup the app:

1. Resolves the database connection string from environment/configuration.
2. Registers EF Core, Identity, Data Protection, localization, MVC, antiforgery, authorization, session, memory cache, rate limiting, and app services.
3. Optionally registers Microsoft Entra ID sign-in when Entra settings exist.
4. Starts a background Playwright Chromium install for PDF generation.
5. Runs `DbInitializer.Initialize` to apply migrations and seed data.
6. Configures security headers, static files, routing, localization, auth, session, and MVC routes.

## Repository Map

| Path | Purpose |
| --- | --- |
| `Controllers/` | MVC and API endpoints. |
| `Views/` | Razor views and shared partials. |
| `Models/` | Domain models, enums, and view models. |
| `Data/` | EF Core DbContext, initializer, seed data, and WoFi reference data. |
| `Services/` | Report workflow, validation, exports, email, seeding, retention, and calculations. |
| `Authorization/` | Custom permission authorization policy support. |
| `Infrastructure/` | MVC infrastructure such as custom model binders. |
| `Resources/` | English, French, and Spanish localization resources. |
| `Migrations/` | EF Core migrations and model snapshot. |
| `wwwroot/` | CSS, JavaScript, images, client libraries, and public docs. |
| `docs/` | Technical, deployment, database, security, and handoff documentation. |
| `tools/` | SQL and data-processing helper scripts. |

## Main Controllers

| Controller | Responsibility |
| --- | --- |
| `HomeController` | Public pages, job aid, sample reports, admin/dev guide pages. |
| `AccountController` | Registration, login, logout, profile, password changes, external sign-in callback. |
| `RosraController` | Main report editor, tab persistence, estimator endpoints, exports, print views. |
| `DashboardController` | User report dashboard, archive/delete/restore/bulk actions. |
| `SubmissionController` | Submission queue, review, validation, rejection, notes, snapshots, artifacts. |
| `AdminController` | Users, roles, permissions, reports, audit logs, data uploads, backups, email settings, solution cards, analytics. |
| `CultureController` | UI language switching. |
| `Controllers/Api/GapsApiController.cs` | Gap calculation API. |
| `Controllers/Api/SolutionsApiController.cs` | Solution-card API. |

## Key Services

| Service | Responsibility |
| --- | --- |
| `SubmissionService` | Moves reports through submission and review states. |
| `ValidationService` | Validates report completeness and workflow rules. |
| `SnapshotService` | Captures stable report states for review/validation. |
| `ArtifactService` | Creates and tracks generated report artifacts. |
| `HtmlToPdfService` | Uses Playwright Chromium to render PDFs. Registered as a singleton. |
| `ReportExportService` | Builds localized PDF/report export content. |
| `ExcelExportService` | Builds Excel exports. |
| `EmailService` | Sends SMTP email and logs delivery attempts. |
| `DataRetentionService` | Background purge for soft-deleted report data after retention period. |
| `WofiPotentialEstimator` | Loads embedded WoFi reference data and estimates top-down OSR potential. |
| `GapCalculationService` / `GapCalculator` | Gap calculation support. |
| `SolutionCardSeeder` | Seeds solution-card library data. |
| `SampleReportSeeder` | Seeds sample report data. |

## Core Domain Model

`RosraReport` is the central model. It stores:

- Owner, title, country, region, city, currency, financial year, population, GDP per capita, and OSR values.
- Top-down project details and WoFi estimator inputs.
- Bottom-up tab payloads as JSON strings.
- Generic streams, peer SNG analysis, prioritization, selected solutions, action items, and implementation progress as JSON strings.
- Review workflow state, reviewer assignment, validation details, and submission version.
- Soft-delete, archive, last-viewed, timestamps, and row-version concurrency token.
- Navigation collections for review notes, snapshots, and artifacts.

Report workflow statuses live in `Models/Enums/ReportEnums.cs`:

```text
Draft -> Submitted -> UnderReview -> NeedsRevision -> Validated
```

## Database And Migrations

The app uses SQL Server at runtime. `ApplicationDbContext` inherits from `IdentityDbContext<ApplicationUser>` and contains the ROSRA tables.

Important DbContext behavior:

- `RosraReport.PublicId` is unique and is used for public URL lookups.
- `RosraReport` has a global query filter that excludes soft-deleted reports.
- `SolutionCard` has a global query filter that excludes soft-deleted cards.
- `ApplicationDbContext.SaveChangesAsync` updates report timestamps and writes audit logs for report changes and status transitions.
- Snapshot and artifact relationships use restricted delete behavior to avoid SQL Server cascade cycles.

Migration rules:

- Add new migrations with `dotnet ef migrations add <Name>`.
- Run `dotnet ef database update` against a disposable/local database before handing off.
- Do not rewrite old migrations after they have been applied to shared or production databases.
- Review generated migration files and `ApplicationDbContextModelSnapshot.cs` before committing.
- Keep initializer compatibility safeguards unless existing deployed databases have been tested.

## Seed And Reference Data

Startup calls `DbInitializer.Initialize`, which creates or updates the database, applies migrations where possible, and seeds the app.

Important seed/reference locations:

- `Data/SeedData/countrydata.json`
- `Data/SeedData/peersng.json`
- `Data/Wofi/*.json`
- `Data/CountryStatesData.cs`
- `wwwroot/js/solutionsData-*.js`
- `wwwroot/js/solutionsFullDatabase.js`

The WoFi and core seed JSON files are embedded resources in `RosraApp.csproj`, so changes may require both data updates and project-file checks. If adding a new embedded seed file, add it to the project file explicitly.

## Authentication And Permissions

The app supports local Identity login and optional Microsoft Entra ID login. Entra is only registered when `EntraId:TenantId` and `EntraId:ClientId` are configured.

Roles:

- `Admin`
- `User`
- `Reviewer`

Authorization is permission-based. Permission names are registered as policies in `Program.cs`, seeded in `DbInitializer`, and assigned to roles through the admin UI. Use `RequirePermissionAttribute` or standard authorization policies when protecting actions.

When adding a new permission:

1. Add the permission policy name in `Program.cs`.
2. Seed the permission in `DbInitializer`.
3. Assign it to the appropriate default role if needed.
4. Protect the controller action or page.
5. Verify the admin role-permission UI still shows it.

The default admin user `admin@rosra.com` is only created when `ADMIN_SEED_PASSWORD` is set. Do not hard-code or commit admin passwords.

## Report Authoring Flow

The report editor is a mix of Razor partials and JavaScript state management.

Important files:

- `Views/Rosra/Index.cshtml`
- `Views/Shared/_PotentialEstimates.cshtml`
- `Views/Shared/_OverviewSelection.cshtml`
- `Views/Shared/_GapAnalysis*.cshtml`
- `Views/Shared/_Prioritization.cshtml`
- `Views/Shared/_Recommendations.cshtml`
- `wwwroot/js/rosraStateManager.js`
- `wwwroot/js/rosraTabFlushers.js`
- `wwwroot/js/recommendationsModule.js`
- `wwwroot/js/streamClassification.js`
- `wwwroot/js/rosraNumberFormat.js`

Most tab-level data is serialized into JSON fields on `RosraReport`. When changing a tab:

1. Update the Razor partial and JavaScript flusher together.
2. Confirm save, auto-save, edit, view, print, PDF export, and Excel export still read the same shape.
3. Confirm JSON changes are backward-compatible with existing reports where possible.
4. Update localization resources for any visible labels.

The app includes `Infrastructure/CommaTolerantNumberBinder.cs` because form pages render numeric fields with thousands separators. Be careful when changing numeric parsing or formatting.

## Exports And PDF Generation

Excel export uses `ExcelExportService` and ClosedXML.

PDF/report export uses report services plus `HtmlToPdfService`, which depends on Playwright Chromium. Startup installs Chromium in the background:

- Hosted environments with `HOME`: `$HOME/.playwright`
- Local fallback: `<content-root>/.playwright`

PDF generation can fail on a fresh environment if the first browser install has not completed. Retry after the install finishes or preinstall Chromium in the deployment process.

When changing report output, verify:

- Browser print views
- PDF export
- Excel export
- English, French, and Spanish labels
- Charts and generated images included in exports

## Localization

Supported cultures:

- `en`
- `fr`
- `es`

Resource files live in `Resources/`. Shared and view-specific resources are both used. Any user-visible text added to shared/report views should be reflected in the relevant `.resx`, `.fr.resx`, and `.es.resx` files.

Culture switching is handled by `CultureController.SetLanguage` and request localization middleware in `Program.cs`.

## Security Expectations

Before changing authentication, authorization, admin tools, upload logic, or report access, review the security docs in `docs/`.

Current security controls include:

- Secure, HTTP-only, SameSite Strict auth and session cookies.
- Persistent Data Protection keys.
- Rate limiting for API and login endpoints.
- Antiforgery header support for AJAX requests.
- HTTP method allow-list for `GET`, `HEAD`, `POST`, and `OPTIONS`.
- Security headers and CSP.
- No-store cache headers for account and admin pages.
- Soft-delete plus retention purge for report records.

When adding endpoints:

- Use explicit HTTP verb attributes.
- Add `[ValidateAntiForgeryToken]` on unsafe form POST actions.
- Require a permission or role for non-public actions.
- Do not return raw exception messages to users.
- Avoid logging secrets, passwords, tokens, or unnecessary PII.
- Keep upload limits and file validation explicit.

## Configuration

Common settings:

| Setting | Purpose |
| --- | --- |
| `CONNECTION_STRING` | Preferred database connection string override. |
| `ConnectionStrings:DefaultConnection` | Standard .NET connection string fallback. |
| `AZURE_SQL_CONNECTIONSTRING` | Azure Service Connector/App Service connection string fallback. |
| `ADMIN_SEED_PASSWORD` | Enables initial admin seed user creation. |
| `EmailSettings:*` | SMTP configuration. |
| `EntraId:TenantId` | Microsoft Entra tenant ID. |
| `EntraId:ClientId` | Microsoft Entra app client ID. |
| `EntraId:ClientSecret` | Microsoft Entra app secret. |
| `EntraId:AdminEmails` | Allow-list used by external sign-in handling. |

Do not commit production secrets. Use user secrets locally and hosting-platform environment variables in deployed environments.

## Verification Checklist

Use `dotnet build` as the minimum verification step after code changes:

```bash
dotnet build
```

For workflow changes, manually verify:

1. Register or sign in.
2. Create a new report at `/Rosra`.
3. Save and reload the report from `/Dashboard`.
4. Exercise the changed tab or workflow.
5. Submit the report for review.
6. Review, reject, revise, and validate as applicable.
7. Export PDF and Excel.
8. Confirm admin-only pages require admin permissions.
9. Confirm localization still works for English, French, and Spanish.

There is no separate test project in the repository at the time this guide was written. Add focused automated tests if you introduce shared calculation logic, permission-sensitive behavior, or serialization changes with backward-compatibility risk.

## Common Change Recipes

### Add A Field To Report Metadata

1. Add the property to `RosraReport`.
2. Add/update the view model if the field is bound through a view model.
3. Generate an EF migration.
4. Update the Razor form.
5. Update save/load mapping in `RosraController`.
6. Update dashboard/view/export/print surfaces if the field should appear there.
7. Add localization entries.
8. Verify old reports still load.

### Add A New Report Tab

1. Add a Razor partial under `Views/Shared/`.
2. Add client-side state collection in `rosraTabFlushers.js`.
3. Hydrate state through `rosraStateManager.js`.
4. Add storage to `RosraReport`, usually as a JSON field if it is tab payload data.
5. Update save/edit/view/export/print logic.
6. Add validation rules if the tab affects completion level or submission.
7. Add localization resources.

### Add Or Change Seed Data

1. Update the source data file.
2. Confirm whether it is embedded in `RosraApp.csproj`.
3. Update the seeder or initializer if the shape changed.
4. Run the app against a local database and confirm idempotent startup.
5. Export or inspect the resulting database rows.

### Add Admin Functionality

1. Add the permission policy and seed data if this is a protected capability.
2. Add controller action(s) in `AdminController` or a focused controller if the scope is large.
3. Add Razor view or partial under `Views/Admin/`.
4. Add audit logging for sensitive changes.
5. Confirm non-admin users cannot access the route.
6. Confirm cache headers and antiforgery protection are appropriate.

## Handoff Notes

- Keep docs current when changing setup, deployment, schema, permissions, or report workflows.
- Prefer small migrations and avoid broad refactors in the same change as schema updates.
- Be careful with `RosraReport` JSON fields; existing saved reports may contain older shapes.
- Verify PDF generation after deployment because it depends on Playwright browser availability.
- Treat security audit files as internal handoff material, not casual external documentation.
