# Setup And Deployment

This guide covers local setup, configuration, database initialization, and hosted deployment notes for ROSRA V2.

## Prerequisites

- .NET SDK 8.x
- SQL Server
- Access to create or update the target database
- SMTP credentials if email delivery is required
- Optional Microsoft Entra ID application registration for SSO

## Local Development

From the repository root:

```bash
dotnet restore
dotnet build
```

Configure the connection string with user secrets or environment variables. Configure `ADMIN_SEED_PASSWORD` as an environment variable because the initializer reads it directly from the process environment:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=unhab-rosra-db-prod;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
export ADMIN_SEED_PASSWORD="Use-A-Strong-Local-Password-Here!"
```

Run the app:

```bash
dotnet run
```

The default MVC route opens the home page. The report builder is available at `/Rosra`, the user dashboard at `/Dashboard`, and administration at `/Admin` for users with the required role and permissions.

## Database Initialization

Startup calls `DbInitializer.Initialize`, which:

- Ensures the database exists.
- Applies pending EF Core migrations where possible.
- Seeds permissions, roles, reference data, frontier data, solution cards, sample reports, country/state data, currency data, and email settings.
- Creates `admin@rosra.com` only when `ADMIN_SEED_PASSWORD` is configured.

For explicit migration management during development:

```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

Review generated migrations before committing them. The project contains legacy compatibility logic for databases originally created with `EnsureCreated`, so avoid removing initializer safeguards without testing existing environments.

## Required Configuration

### Database

Preferred production setting:

```text
CONNECTION_STRING=<sql-server-connection-string>
```

Fallback settings:

```text
ConnectionStrings:DefaultConnection=<sql-server-connection-string>
AZURE_SQL_CONNECTIONSTRING=<sql-server-connection-string>
```

On Azure App Service, a connection string entry named `DefaultConnection` or `AZURE_SQL_CONNECTIONSTRING` with type `SQLAzure`/`SQLServer` is also accepted. If using app settings instead of the Connection strings tab, use `CONNECTION_STRING` or `ConnectionStrings__DefaultConnection`.

The application uses SQL Server with retry-on-failure enabled.

### Admin Seed Password

```text
ADMIN_SEED_PASSWORD=<strong-initial-admin-password>
```

When set and no admin user exists, the app creates:

```text
Email: admin@rosra.com
Role: Admin
```

Rotate this password immediately after first login. If the setting is absent, the admin seed is skipped.

### Email

Email settings can be configured in app settings and managed through the admin UI:

```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.example.org",
    "SmtpPort": 587,
    "SmtpUsername": "user",
    "SmtpPassword": "password",
    "UseSsl": true,
    "SenderEmail": "noreply@example.org",
    "SenderDisplayName": "ROSRA UN-Habitat"
  }
}
```

SMTP passwords should be stored in environment variables, user secrets, or platform secrets, not committed appsettings files.

### Microsoft Entra ID SSO

External sign-in is optional. It is enabled only when the required tenant and client ID are present:

```json
{
  "EntraId": {
    "TenantId": "<tenant-id>",
    "ClientId": "<client-id>",
    "ClientSecret": "<client-secret>",
    "AdminEmails": "admin@example.org"
  }
}
```

The app uses:

```text
CallbackPath: /signin-oidc
SignedOutCallbackPath: /signout-callback-oidc
```

Configure those redirect URIs in the Entra app registration for each environment.

## Playwright And PDF Generation

`HtmlToPdfService` uses Playwright Chromium. On startup, the application runs a background Chromium install.

Browser install path:

- Hosted environments with `HOME`: `$HOME/.playwright`
- Local fallback: `<content-root>/.playwright`

PDF generation can fail if a user requests a PDF before the first browser install completes. Retry after the install finishes or preinstall Chromium in the deployment image/startup process.

## Data Protection Keys

Data Protection keys are persisted so auth cookies and encrypted SMTP values survive restarts.

Key path:

- Hosted environments with `HOME`: `$HOME/DataProtection-Keys`
- Local fallback: `<content-root>/.dp-keys`

Ensure the hosting platform preserves this location across restarts and scale-out instances.

## Azure App Service Notes

The code contains App Service-specific assumptions:

- HTTPS redirection is only applied in development because App Service terminates TLS in front of the app.
- `HOME` is used as the persistent root for Data Protection keys and Playwright browsers.
- Production connection strings and secrets should be configured as App Service environment variables or connection strings, not committed JSON files.

Set at minimum:

```text
CONNECTION_STRING or an App Service connection string named DefaultConnection/AZURE_SQL_CONNECTIONSTRING
ADMIN_SEED_PASSWORD
ASPNETCORE_ENVIRONMENT=Production
```

Add SMTP and Entra settings as needed.

## Production Checklist

- Set a production SQL Server connection string through environment configuration.
- Set `ADMIN_SEED_PASSWORD` only long enough to create the first admin, then rotate the account password.
- Configure SMTP settings or disable workflows that require email.
- Configure Entra ID redirect URIs if SSO is used.
- Confirm Data Protection key storage persists across restarts.
- Confirm Playwright Chromium installation succeeds before relying on PDF exports.
- Run `dotnet build` before deployment.
- Review [PRE-DEPLOYMENT-CHECKLIST-2026-05-28.docx](PRE-DEPLOYMENT-CHECKLIST-2026-05-28.docx) if using the existing project checklist.

## Verification

After deployment:

1. Open `/` and confirm the public home page loads.
2. Register or sign in as an admin user.
3. Open `/Admin` and confirm role/permission access works.
4. Open `/Rosra`, create or load a sample report, save it, and confirm it appears in `/Dashboard`.
5. Submit a report and confirm it appears in the review queue for a reviewer/admin.
6. Generate PDF and Excel exports.
7. Send a test email from the admin email settings page if SMTP is configured.
