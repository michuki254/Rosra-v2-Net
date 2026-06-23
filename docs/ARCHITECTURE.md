# Architecture

ROSRA V2 is a server-rendered ASP.NET Core MVC application. The server owns authentication, authorization, data persistence, report workflows, exports, and administrative operations. Razor views and client-side JavaScript provide the multi-tab reporting experience.

## Runtime Composition

`Program.cs` wires the application in this order:

1. Load the SQL Server connection string from `CONNECTION_STRING` or `ConnectionStrings:DefaultConnection`.
2. Register EF Core, ASP.NET Core Identity, role support, and persistent Data Protection keys.
3. Optionally register Microsoft Entra ID OpenID Connect sign-in when Entra configuration is present.
4. Register localization, MVC, antiforgery, permission policies, app services, session, memory cache, and rate limiters.
5. Install Playwright Chromium in the background for PDF generation.
6. Initialize the database through `DbInitializer.Initialize`.
7. Configure security headers, localization, authentication, authorization, session, and MVC routes.

The default route is:

```text
/{controller=Home}/{action=Index}/{id?}
```

## Application Layers

### Controllers

- `HomeController` renders public informational pages and guides.
- `AccountController` handles registration, local login, external Entra login callback, logout, AJAX auth, profile edits, and password changes.
- `RosraController` owns the main report authoring experience, tab persistence, WoFi estimator endpoints, report save/edit/view operations, peer SNG analysis, exports, and print views.
- `DashboardController` shows a user's reports and supports report view, archive, delete, restore, and bulk actions.
- `SubmissionController` manages submission, review queues, reviewer assignment, notes, validation, rejection, unlock, snapshots, artifacts, and validated report lists.
- `AdminController` manages admin dashboards, users, roles, permissions, reports, deleted reports, audit logs, data uploads, email settings, backups, retention purge, solution cards, system settings, and analytics.
- `CultureController` switches UI language.
- `Controllers/Api/GapsApiController.cs` exposes gap calculations for generic streams.
- `Controllers/Api/SolutionsApiController.cs` exposes active solution cards and grouped solution-card data.

### Data Access

`ApplicationDbContext` inherits from `IdentityDbContext<ApplicationUser>` and contains the application tables:

- Reports: `RosraReports`
- Reference data: `Peers_SNG`, `UserPeerSngs`, `DB_Countries`, `Countries`, `DB_Frontiers`
- Authorization: `Permissions`, `RolePermissions`
- Review workflow: `ReviewNotes`, `AnalysisSnapshots`, `ReportArtifacts`
- Operations: `AuditLogs`, `EmailSettings`, `EmailLogs`, `DataUploadHistory`
- Solution library and settings: `SolutionCards`, `SolutionCardHistory`, `SystemSettings`, `CardSets`

Important model behavior:

- `RosraReport.PublicId` is unique and used for URL lookups.
- `RosraReport` has a global query filter that excludes soft-deleted reports.
- `SolutionCard` has a global query filter that excludes soft-deleted cards.
- `ApplicationDbContext.SaveChangesAsync` updates report timestamps and writes audit log entries for report changes and status transitions.

### Domain Model

`RosraReport` is the central aggregate. It stores:

- Ownership and metadata: title, user, country, region, city, government unit, currency, financial year.
- Financial profile: actual OSR, budgeted OSR, population, GDP per capita, economic profile.
- Top-down and bottom-up tab payloads as JSON strings.
- Root causes, recommendations, top OSR configuration, selected solutions, implementation progress, generic streams, and peer SNG analysis as JSON strings.
- Review state: status, completion level, submission version, submitted/validated dates, reviewer, validation user, revision reason.
- Lifecycle state: soft-delete, archive, last viewed timestamp, row-version concurrency token.
- Navigation collections for notes, snapshots, and artifacts.

Report statuses are defined in `Models/Enums/ReportEnums.cs`:

```text
Draft = 0
Submitted = 1
UnderReview = 2
NeedsRevision = 3
Validated = 4
```

### Services

- `SubmissionService` moves reports through submission/review state and coordinates snapshots and artifacts.
- `ValidationService` validates report completion and workflow rules.
- `SnapshotService` captures report states for review and validation.
- `ArtifactService` creates and tracks report artifacts.
- `HtmlToPdfService` renders HTML to PDF using a long-lived Playwright browser.
- `ReportExportService` and `ExcelExportService` build localized export files.
- `EmailService` sends SMTP notifications and logs delivery attempts.
- `IdentityEmailSender` adapts app email delivery to ASP.NET Core Identity.
- `DataRetentionService` purges soft-deleted reports and child records after 90 days.
- `WofiPotentialEstimator` loads embedded WoFi reference data and calculates top-down potential estimates.
- `GapCalculationService` and `GapCalculator` support gap calculations.
- `SolutionCardSeeder` and `SampleReportSeeder` seed database content.

## Authentication And Authorization

The app supports local Identity accounts and optional Microsoft Entra ID sign-in. Entra sign-in is only registered when `EntraId:TenantId` and `EntraId:ClientId` are configured.

Authorization uses roles plus permission policies. Each permission name is registered as an ASP.NET Core policy in `Program.cs`, enforced with custom authorization requirements and attributes. Permissions are seeded through `DbInitializer` and assigned to roles through the admin UI.

Default roles:

- `Admin`
- `User`
- `Reviewer`

The default admin account `admin@rosra.com` is seeded only when `ADMIN_SEED_PASSWORD` is present.

## Localization

Localization resources live in `Resources/`. Supported cultures are:

- English: `en`
- French: `fr`
- Spanish: `es`

Razor view localization is configured with suffix-based view resource lookup. `CultureController.SetLanguage` changes the current culture.

## Static Assets And Client Code

Static assets live in `wwwroot/`. Important client-side modules include:

- `rosraStateManager.js` for report state hydration and persistence.
- `rosraTabFlushers.js` for tab-specific serialization.
- `recommendationsModule.js` for recommendation and solution workflows.
- `streamClassification.js` and `rosraNumberFormat.js` for client-side stream and number handling.
- `exportTopDown.js`, `exportBottomUp.js`, and `chartExportHelper.js` for export preparation.
- `solutionsData-*.js` and `solutionsFullDatabase.js` as source data for seeded solution cards.

## Data Seeding

Database initialization is handled by `Data/DbInitializer.cs`. Startup seeding includes:

- Database creation and migration application.
- Idempotent compatibility patches for selected schema updates.
- Permissions and role setup.
- Peer SNG data from embedded JSON.
- Country data from embedded JSON.
- Frontier benchmarks.
- Review workflow permissions.
- Currency data.
- Email settings.
- Country administrative divisions.
- Solution cards from JavaScript source files.
- Sample reports.

Embedded seed resources are declared in `RosraApp.csproj`.

## Security Controls

Important runtime controls include:

- Secure, HTTP-only, SameSite Strict auth and session cookies.
- Data Protection keys persisted to a stable directory.
- Rate limiting for API and login endpoints.
- Antiforgery header support for AJAX requests.
- HTTP method allow-list for `GET`, `HEAD`, `POST`, and `OPTIONS`.
- Security headers for content type, framing, referrer policy, permissions policy, and CSP.
- No-store cache headers for account and admin pages.
- Soft-delete and retention purge for report records.

