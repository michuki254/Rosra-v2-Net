# ROSRA V2 Cybersecurity Audit

Date: 2026-05-25
Scope: Static security review of the ASP.NET Core application, configuration, controllers, authorization model, uploads, client-side scripts, and package dependencies.

## Executive Summary

The project has already remediated several high-risk issues from earlier audit passes: hardcoded admin password seeding was removed, Data Protection keys are persisted, exception details are mostly no longer echoed to clients, cookies are pinned to `Secure` and `SameSite=Strict`, uploads are generally size-limited, jQuery is now 3.7.1, and `dotnet list package --vulnerable --include-transitive` reports no vulnerable NuGet packages.

Remaining risk is concentrated in five areas:

1. Authenticated JSON POST endpoints missing antiforgery validation.
2. A broken permission policy name on an admin data-write endpoint.
3. CSP still allows inline script and eval.
4. Login/register endpoints rely on account lockout but do not have endpoint rate limiting.
5. Identity recovery and stronger account assurance flows are incomplete or not wired to the custom email service.

## Findings

### High: Authenticated JSON POST endpoints lack antiforgery protection

Files:
- `Controllers/RosraController.cs:2736`
- `Controllers/RosraController.cs:2844`
- `Controllers/RosraController.cs:3188`

The following authenticated POST actions accept JSON payloads but do not have `[ValidateAntiForgeryToken]`:

- `SavePeerSNGs`
- `GetPeerSNGAnalysisWithCustomPeers`
- `AdminSavePeerSNGs`

Because the app uses cookie authentication, these endpoints are reachable with the user's auth cookie from a cross-site form/fetch scenario unless browser and request constraints block it. `SameSite=Strict` reduces the practical risk, but antiforgery should still be enforced on state-changing and authenticated POST routes.

Recommended fix:

Add `[ValidateAntiForgeryToken]` to these endpoints and ensure the JavaScript sends the configured `RequestVerificationToken` header.

### High: Admin permission policy name does not exist

Files:
- `Program.cs:88-105`
- `Controllers/RosraController.cs:3189`
- `Data/DbInitializer.cs:184-186`

`Program.cs` registers the permission policy as `UploadPeerSNGData`, and the seeded permission uses the same name. `AdminSavePeerSNGs` requires `CanUploadPeerSNGData`, which is not registered.

Impact:

The intended admin reference-data write path is misconfigured. Depending on runtime behavior, this will fail authorization with an unknown policy rather than enforcing the actual `UploadPeerSNGData` permission.

Recommended fix:

Change:

```csharp
[Authorize(Policy = "CanUploadPeerSNGData")]
```

to:

```csharp
[Authorize(Policy = "UploadPeerSNGData")]
[ValidateAntiForgeryToken]
```

### Medium: CSP still permits unsafe script execution

File:
- `Program.cs:256-259`

Current CSP:

```text
script-src 'self' 'unsafe-inline' 'unsafe-eval'
style-src 'self' 'unsafe-inline'
```

This weakens CSP's value as an XSS mitigation. The app currently has many inline Razor scripts, so removing this immediately may break pages.

Recommended fix:

Move inline scripts to external files or introduce nonce-based CSP, then remove `'unsafe-inline'` and `'unsafe-eval'`.

### Medium: Login/register endpoints lack endpoint rate limiting

Files:
- `Program.cs:151-156`
- `Controllers/AccountController.cs:88-187`

The app has Identity lockout enabled and `lockoutOnFailure: true`, but the configured `"api"` limiter is not applied to login or registration actions.

Impact:

Account lockout protects individual accounts, but endpoint-level throttling also reduces credential stuffing, username probing, registration abuse, and lockout-as-denial-of-service.

Recommended fix:

Add a dedicated `"login"` limiter, partitioned by IP address, and apply it to `Login`, `AjaxLogin`, `Register`, and `AjaxRegister`.

### Medium: Password reset/email confirmation flow is not integrated with the custom email service

Files:
- `Program.cs:39`
- `Views/Account/Login.cshtml:483`
- `Services/EmailService.cs:14`

The custom account controller implements login/register/profile/password change. The login page links to `/Identity/Account/ForgotPassword`, but no `IEmailSender` integration was found. `RequireConfirmedAccount` is currently false.

Impact:

Users may not have a reliable self-service recovery path. Email ownership is not enforced before account use. 2FA is also not implemented in the custom flow.

Recommended fix:

Add Identity email sender integration using the existing `IEmailService`, then enable and test forgot/reset password. Consider enabling confirmed email for normal users and adding 2FA for admin/reviewer roles.

### Medium: Permission cache is not invalidated after role permission changes

Files:
- `Authorization/PermissionAuthorizationHandler.cs:40-59`
- `Controllers/AdminController.cs:823-852`

User permissions are cached for 5 minutes, but `UpdateRolePermissions` does not clear affected users' permission cache entries.

Impact:

Permission removals may remain effective for up to 5 minutes. This is a small but real authorization revocation delay.

Recommended fix:

When role permissions change, invalidate permission cache entries for users in that role, or use a role-version cache key that changes whenever role permissions are updated.

### Low: Production HTTPS depends on hosting/proxy configuration

File:
- `Program.cs:235-237`

`UseHttpsRedirection()` runs only in development. HSTS is enabled in production, and cookies are `Secure=Always`, but first-contact HTTP still depends on Azure/App Service or the front proxy enforcing HTTPS.

Recommended fix:

Verify hosting has HTTPS-only and minimum TLS 1.2+ enabled. Consider adding forwarded headers middleware and enabling HTTPS redirection in production when deployed behind a known proxy.

### Low: `AllowedHosts` is wildcard in base config

File:
- `appsettings.json:11`

The production example is restricted to `rosra-dev.azurewebsites.net`, but base `appsettings.json` uses `AllowedHosts: "*"`.

Recommended fix:

Keep wildcard only for local development. Set production hostnames through environment-specific config or deployment settings.

## Confirmed Safe / Improved Areas

- No vulnerable NuGet packages were reported by `dotnet list package --vulnerable --include-transitive`.
- Default admin seed now reads `ADMIN_SEED_PASSWORD`; previous hardcoded admin password is only referenced in comments documenting the fix.
- Data Protection keys are persisted via `PersistKeysToFileSystem`.
- Auth and session cookies are `HttpOnly`, `SameSite=Strict`, and `Secure=Always`.
- Most exception responses now return reference IDs instead of raw `ex.Message`.
- Upload endpoints reviewed have size limits; `ImportSolutionCards` has a 5 MB cap.
- jQuery is upgraded to 3.7.1.
- `appsettings.Production.json` is ignored; only the example file remains intended for source control.

## Verification Commands Run

```powershell
dotnet list package --vulnerable --include-transitive
rg -n "HttpPost|ValidateAntiForgeryToken|IgnoreAntiforgeryToken|Authorize\(|Authorize\]|AllowAnonymous|RequestSizeLimit|RequestFormLimits" Controllers
rg -n "CanUploadPeerSNGData|UploadPeerSNGData|options\.AddPolicy|new\[\]" Program.cs Controllers\RosraController.cs Authorization
rg -n "IEmailSender|SendEmailAsync|ForgotPassword|ResetPassword|GeneratePasswordResetToken|ConfirmEmail|GenerateEmailConfirmationToken" -g "*.cs" -g "*.cshtml"
rg -n "UseHttpsRedirection|UseHsts|ForwardedHeaders|SecurePolicy|SameSite|Content-Security-Policy|unsafe-inline|unsafe-eval" Program.cs -C 2
```

## Recommended Fix Order

1. Fix `CanUploadPeerSNGData` policy mismatch and add antiforgery to the three JSON POST endpoints.
2. Add login/register endpoint rate limiting.
3. Integrate Identity password reset with `IEmailService`; decide whether to require confirmed email.
4. Invalidate permission cache after role permission changes.
5. Plan CSP nonce/external-script refactor.
6. Verify production HTTPS-only/TLS settings and tighten production `AllowedHosts`.
