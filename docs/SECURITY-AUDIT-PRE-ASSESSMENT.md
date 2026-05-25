# ROSRA V2 — Pre-Assessment Security Self-Audit

**Date:** 2026-05-25
**Scope:** ASP.NET Core 8 web app, full source tree, current `main` branch
**Audience:** Internal — fix list before sending to UN-Habitat IT
**Stack:** ASP.NET Core 8, EF Core 8/9, ASP.NET Identity, SQL Server, Azure App Service (Windows S1)

This report uses `file:line` citations so each finding maps to a single edit.
Findings are ranked by what a UN-Habitat IT reviewer will flag first.

---

## CRITICAL — fix before sending

### C-1. Hardcoded default admin password `Admin@123` seeded on every deploy
**Files:** `Data/DbInitializer.cs:90`, `Data/DbInitializer.cs:567`

On first start `DbInitializer.Initialize` unconditionally creates three admin accounts using a hardcoded password:

```
admin@rosra.com            Admin@123
lennart.fleck@un.org       Admin@123
omar.moraleslopez@un.org   Admin@123
```

Plus `acmichuki@gmail.com` is auto-promoted to Admin if the user exists.

Why this is critical:
- The password is in a **public git history** (committed in `2c35210 first commit` and `355b5dc feat: Harden application security`).
- It satisfies the configured complexity policy, so the seed succeeds.
- The moment Azure App Service starts, these accounts are live with a known password.
- Two of the accounts are real UN-Habitat staff inboxes. If those users later self-register through `/Account/Register`, the `EnsureAdminUser` path silently grants them Admin without them ever choosing a password.

**Fix:**
1. Remove the hardcoded `Admin@123` literal. Read from `ADMIN_SEED_PASSWORD` env var, fail-fast if missing.
2. Only seed `admin@rosra.com` once on a truly empty DB; don't re-seed if any Admin user exists.
3. Stop unconditionally adding `acmichuki@gmail.com` to Admin — promote via a manual `/Admin/AssignRole` flow.
4. Rotate the password for any account that was ever created with `Admin@123`.
5. Force password reset on first login for seeded accounts (`MustChangePassword` flag or `IdentityUser.PasswordHash = null` so first login goes through the recovery flow).

---

### C-2. Data Protection keys are not persisted
**File:** `Program.cs` (no `AddDataProtection().PersistKeysTo(...)` call)
**Affects:** `Services/EmailService.cs:47` (encrypts SMTP password with `IDataProtector`)

ASP.NET Core's default key store is the local filesystem (`%LOCALAPPDATA%/ASP.NET/DataProtection-Keys` on Windows). On Azure App Service this directory is recreated on restart, redeploy, or scale-out. Consequences:

- Every restart invalidates **all** active auth cookies — every user logged out.
- The SMTP password stored via `_protector.Protect(...)` becomes undecryptable, breaking email permanently.
- Scaling to two instances breaks login on every other request.

**Fix:** add to `Program.cs` before `builder.Build()`:

```csharp
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(
        Path.Combine(Environment.GetEnvironmentVariable("HOME") ?? "", "DataProtection-Keys")))
    .SetApplicationName("RosraApp");
```

(On App Service `%HOME%` is a persisted, shared file share. Better still: Azure Key Vault — `ProtectKeysWithAzureKeyVault`.)

---

## HIGH

### H-1. Vulnerable transitive dependencies
**File:** `RosraApp.csproj`

`dotnet list package --vulnerable --include-transitive` reports:

| Package | Version | Severity | Advisory |
|---|---|---|---|
| MailKit | 4.10.0 | Moderate | GHSA-9j88-vvj5-vhgr |
| MimeKit | 4.10.0 | Moderate | GHSA-g7hc-96xr-gvvx |
| Microsoft.Build | 17.10.4 | **High** | GHSA-w3q9-fxm7-j8fq |
| System.IO.Packaging | 8.0.0 | **High** ×2 | GHSA-f32c-w444-8ppv, GHSA-qj66-m88j-hmgj |
| NuGet.Packaging | 6.11.0 | Low | GHSA-g4vj-cjjj-v7hg |

**Fix:**
- Bump `MailKit` to 4.16.0 (resolves MailKit + MimeKit advisories).
- Pin `System.IO.Packaging` 9.0.x at the top level to override the transitive 8.0.0 from `ClosedXML`.
- The `Microsoft.Build` advisory comes from `Microsoft.VisualStudio.Web.CodeGeneration.Design` — that's a scaffolding-only package; mark it `<PackageReference … PrivateAssets="all" />` so it doesn't ship in the publish bundle.

### H-2. Production HTTPS depends entirely on host configuration
**File:** `Program.cs:208-212`

```csharp
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
```

HTTPS redirect is **only** active in Development. In production the app trusts the host (App Service / Railway) to enforce TLS. If the App Service "HTTPS Only" toggle is off, the site serves clear-text. HSTS *is* applied (`app.UseHsts()` at line 145), which mitigates after the first visit.

**Fix:**
- Verify Azure App Service "HTTPS Only" + "Minimum TLS Version 1.2" are set in the portal (Configuration → General Settings).
- Add `Forwarded Headers` middleware so the app sees `X-Forwarded-Proto = https`, then enable `app.UseHttpsRedirection()` in production too.
- Add `Cookie.SecurePolicy = CookieSecurePolicy.Always` on the session cookie (`Program.cs:111-116`) and on the application cookie (`ConfigureApplicationCookie` at line 44).

### H-3. CSP defeats itself with `unsafe-inline` and `unsafe-eval`
**File:** `Program.cs:227-233`

```csharp
"script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
```

Auditors will flag this as a non-mitigation. The reason it's there: the Razor views inline a lot of bootstrapping JS and pass server data via `@Html.Raw(JsonSerializer.Serialize(...))`.

**Fix (longer):** move inline scripts to external `.js` files under `wwwroot/js/`, pass data via `data-*` attributes or `<script type="application/json" id="bootstrap-data">`. Once inline scripts are gone, drop `'unsafe-inline'` and `'unsafe-eval'`. If a full refactor isn't feasible before the assessment, add a nonce-based CSP (`script-src 'self' 'nonce-{random}'`) and write a Razor helper that emits the nonce.

---

## MEDIUM

### M-1. Exception details echoed to clients
**Files:** 8 sites — `Controllers/AdminController.cs:692,783,1634,2011`, `Controllers/DashboardController.cs:177,218,262`, `Controllers/RosraController.cs:3168`

```csharp
return Json(new { success = false, message = $"Error importing data: {ex.Message}" });
```

CWE-209 (Information Exposure Through an Error Message). `ex.Message` can leak SQL error text, file paths, etc.

**Fix:** log `ex` with `_logger.LogError(ex, ...)`, return a generic message + a correlation ID:

```csharp
var corrId = Guid.NewGuid().ToString("N")[..8];
_logger.LogError(ex, "Import failed [{CorrId}]", corrId);
return Json(new { success = false, message = $"Import failed (ref {corrId}). Contact support." });
```

### M-2. `CultureController.SetLanguage` has `[HttpPost]` without `[ValidateAntiForgeryToken]`
**File:** `Controllers/CultureController.cs:8-9`

Low real-world impact (the action only sets a culture cookie via `LocalRedirect`), but it will show up in any automated scanner.

**Fix:** add `[ValidateAntiForgeryToken]` and the form already in `_Layout.cshtml` will continue to work.

### M-3. `ImportSolutionCards` reads an arbitrary-size JSON into memory
**File:** `Controllers/AdminController.cs:1952-2013`

No `[RequestSizeLimit]` (the other upload endpoints use 2–5 MB) and the whole file is parsed into a `List<JsonElement>`. An Admin uploading a 500 MB file (or an attacker who compromises an Admin account) can OOM the worker.

**Fix:**
```csharp
[HttpPost]
[ValidateAntiForgeryToken]
[RequestSizeLimit(5_000_000)]
public async Task<IActionResult> ImportSolutionCards(IFormFile file)
```
Also reject if `file.Length > 5_000_000`.

### M-4. Application & session cookies don't pin `SameSite=Strict` / `Secure`
**File:** `Program.cs:44-48` (`ConfigureApplicationCookie`), `Program.cs:111-116` (session cookie)

Defaults are `SameSite=Lax`, `Secure=SameAsRequest`. For an authenticated app, `Strict` + `Always` is the right baseline.

**Fix:**
```csharp
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromHours(2);
    options.SlidingExpiration = true;
});
```

### M-5. Login endpoints have no rate limiting
**File:** `Program.cs:122-132` defines a `"api"` fixed-window limiter but it is **not** applied to `AccountController.Login` / `AjaxLogin`.

Account lockout (5 attempts → 15 min, `Program.cs:35-36`) is the actual mitigation, but per-IP rate limiting is still expected by reviewers (mitigates user-enumeration and lockout-as-DoS).

**Fix:** add `[EnableRateLimiting("login")]` to `Login`, `AjaxLogin`, `Register`, `AjaxRegister`, with a tighter limiter (e.g. 10 / minute / IP).

### M-6. POST endpoint count vs. antiforgery count
`grep` shows 59 `[HttpPost]` attributes vs. 54 `[ValidateAntiForgeryToken]`. One known gap is M-2; verify the other 4. Easier fix: apply `services.AddControllersWithViews(o => o.Filters.Add(new AutoValidateAntiforgeryTokenAttribute()))` globally, then explicitly add `[IgnoreAntiforgeryToken]` to JSON API endpoints that take a `[FromBody]` payload from a session cookie *and* have CORS locked down.

---

## LOW / INFO

### L-1. `appsettings.Production.json` is committed to git
**File:** `.gitignore` ignores `appsettings.Development.json` but not `Production`.

Current file holds only `YOUR_SQL_PASSWORD_HERE` placeholders — no real secret was ever committed (verified by `git log -p`). But the path is wide-open for the next person who edits the file in a hurry.

**Fix:** add `appsettings.Production.json` to `.gitignore` and `git rm --cached` it. Keep a `appsettings.Production.json.example` so the structure is documented.

### L-2. `AllowedHosts: "*"` in `appsettings.json:11`
Tighten to the actual Azure hostname (`rosra-dev.azurewebsites.net` + any custom domain) to make Host header injection impossible.

### L-3. `X-XSS-Protection: 1; mode=block` (`Program.cs:220`)
Modern OWASP guidance is to send `X-XSS-Protection: 0` because the legacy XSS filter has its own bypass issues. CSP is the real defence.

### L-4. PII in logs
`Services/EmailService.cs:175,185,192,215` log recipient emails. Acceptable for an internal app but document in the data-handling note that operational logs contain email addresses.

### L-5. Sample reports are publicly viewable
`Controllers/RosraController.cs:1352` (`View(Guid id)` with `[AllowAnonymous]`). Auth check is correct (only `UserId == null` sample reports are anonymous). Worth documenting explicitly so the reviewer doesn't think it's a bug.

### L-6. `Microsoft.VisualStudio.Web.CodeGeneration.Design` is a runtime dependency
**File:** `RosraApp.csproj:43`. This is a scaffolding tool; ships in the publish bundle today. Add `<PrivateAssets>all</PrivateAssets>` to keep it dev-only.

---

## Confirmed safe (worth mentioning in the cover letter)

- **No SQL injection vectors.** `grep` for `FromSqlRaw|ExecuteSqlRaw|SqlCommand|CommandText` across all `.cs` files returns zero matches — all data access goes through EF Core LINQ.
- **No real secret in git history.** `git log -p` on `appsettings*.json` shows only `YOUR_SQL_PASSWORD_HERE` placeholders and empty SMTP strings. Real connection comes from `CONNECTION_STRING` env var (`Program.cs:13`).
- **CSRF protection is real.** `_RequestVerificationToken` configured in `Program.cs:56-59` with header support for AJAX, used by 54 POST endpoints.
- **Open-redirect on login is mitigated.** `AccountController.cs:103` checks `Url.IsLocalUrl(returnUrl)`. `CultureController.cs:22` uses `LocalRedirect`.
- **Password policy is strong.** `Program.cs:27-37`: 8+ chars, mixed case, digit, symbol, 4 unique, 5-attempt lockout, 15-minute lockout window. `lockoutOnFailure: true` is set on both login paths.
- **Permission model is hardened.** Class-level `[Authorize(Roles="Admin")]` on `AdminController`, granular `[Authorize(Policy = "...")]` and `[Authorize(Roles = ...)]` per action elsewhere. Custom `PermissionAuthorizationHandler` with 5-minute memory cache.
- **Most `Html.Raw` usage is safe.** Inspected 100+ sites — they fall into three categories: (a) localized resource strings from `.resx` (trusted source), (b) JSON output of `JsonSerializer.Serialize` (auto-escaped), (c) URL/route strings. No raw user free-text reaches `Html.Raw`.
- **File uploads have size limits and admin-only auth** on 3 of 4 endpoints (the 4th is M-3 above).
- **Security headers are emitted** (`X-Content-Type-Options`, `X-Frame-Options=SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, CSP, HSTS).
- **Rate limiter middleware is wired up** (`Program.cs:240`), just not yet bound to specific endpoints.

---

## Recommended fix order (one PR each)

1. **C-1** delete hardcoded passwords (1 hr).
2. **C-2** persist DataProtection keys to `%HOME%` (15 min).
3. **H-1** bump MailKit; mark scaffolding pkg as PrivateAssets (15 min).
4. **L-1** gitignore `appsettings.Production.json` (5 min).
5. **M-1** centralize exception → correlation-ID helper, replace 8 sites (1 hr).
6. **M-3, M-2, M-4, M-5, M-6** small hardening pass (2 hr).
7. **H-2, H-3** HTTPS-Only + CSP refactor (4–8 hr, may be after assessment if scope-bound).

After C-1, C-2, H-1, M-1, L-1 are merged you can send the package with confidence.

---

## Artifacts to send to UN-Habitat IT

1. Source tree (or pointer to private repo).
2. This audit file plus a 1-page "remediation summary" showing what was fixed.
3. Output of `dotnet list package --vulnerable --include-transitive` taken **after** fixes.
4. Architecture / data-flow diagram (1 page is enough — Identity → Controllers → EF Core → Azure SQL).
5. List of third-party services (Azure SQL `unhab-rosra-db-prod`, Gmail SMTP if used, World Bank API for country data, Playwright Chromium for PDF rendering).
6. Data-handling note: what PII the app stores (email, name, organisation, phone), where it lives (Azure SQL), retention (`DataRetentionService` background job), how it's deleted on request.
