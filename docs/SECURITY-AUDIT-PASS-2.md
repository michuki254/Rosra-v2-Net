# ROSRA V2 — Security Audit, Pass 2

**Date:** 2026-05-25
**Scope:** Areas we didn't dig into in pass 1 — Identity scaffold, service layer, frontend JS,
outbound HTTP, IDOR sweep, file-write paths — plus verification of pass-1 fixes.
**Baseline:** Commit `58feccd` (pass-1 fixes already merged to `main`).

---

## What pass 2 verified (no new findings, worth saying in the cover letter)

- **Pass-1 fixes are present in HEAD.** Spot-checked `ADMIN_SEED_PASSWORD`,
  `PersistKeysToFileSystem`, `NewErrorRef`, `RequestSizeLimit(5_000_000)`,
  `SameSiteMode.Strict`, `X-XSS-Protection: 0`. All committed in `58feccd`.
- **`dotnet list package --vulnerable --include-transitive` reports zero packages.**
- **No `HttpClient`, `WebRequest`, `HttpRequestMessage`, or `HttpWebRequest` in any `.cs` file.**
  There is no server-side outbound HTTP, therefore no SSRF surface from the C# side. The only
  external call (`api.worldbank.org`) is made by the browser from
  `Views/Shared/_PotentialEstimates.cshtml:3351` with a hardcoded URL template.
- **`HtmlToPdfService.RenderHtmlToPdf` blocks all outbound network requests** (`Services/HtmlToPdfService.cs:187-196`):
  `context.RouteAsync("**/*", route => abort)` with only `data:` / `about:` allowed. A
  malicious payload like `<img src="http://169.254.169.254/...">` cannot exfiltrate via the
  PDF renderer. The accompanying controller (`RosraController.cs:3325-3353`) caps the body
  at 5 MB, requires antiforgery, and is rate-limited via the `"api"` limiter. Solid.
- **IDOR sweep on report endpoints.** Every endpoint that loads a `RosraReport` by `id`
  checks ownership before mutation:
  - `Dashboard.DeleteReport` — `DashboardController.cs:163`
  - `Dashboard.RestoreReport` — already audited pass 1
  - `Dashboard.ArchiveReport` — `DashboardController.cs:238`
  - `Rosra.View(Guid)` — `RosraController.cs:1352` (allows anonymous only for sample reports;
    sample reports are those with `UserId == null`)
  - Admin-only endpoints rely on the class-level `[Authorize(Roles="Admin")]` and intentionally
    skip per-row checks — that's a deliberate Admin model, not an IDOR.
  - Snapshot / Artifact viewers gate on `[Authorize(Roles="Admin,Reviewer")]` — also intentional;
    any reviewer can see any snapshot.
- **File-write / path-traversal sweep.** `Path.Combine(...)` does not interpolate any
  user-controlled string into a real filesystem path. The two `Path.GetFileName(filename)`
  call sites (`RosraController.cs:3275, 3350`) correctly strip directory components from
  client-supplied download filenames. `IFormFile.FileName` is stored in
  `DataUploadHistory.FileName` as a display-only string in audit logs (`AdminController.cs:695, 787`),
  not used to build a filesystem path. Good.
- **Mass assignment.** Pass 1 noted zero `[Bind(...)]` usage and that endpoints take dedicated
  ViewModels. Re-checked — still no entity types accepted directly by POST actions.

---

## New findings from pass 2

### M-1b. Five more `ex.Message` leakage sites missed in pass 1
**Files:** `Controllers/RosraController.cs:512, 920, 2717, 2782, 3232`

The pass-1 sweep caught the `Json(new { ... ex.Message ... })` pattern but missed:
- Two `TempData["ErrorMessage"] = "..." + ex.Message;` sites (lines 512 and 920)
- Three Json-response sites using `+` concatenation instead of `$"..."` interpolation
  (lines 2717, 2782, 3232)

Same root cause (CWE-209), same fix.

**Fix:** apply the same `NewErrorRef` helper pattern. RosraController already has `_logger`
so this is a 5-line drop-in.

---

### M-7. Logout endpoint missing `[ValidateAntiForgeryToken]`
**File:** `Controllers/AccountController.cs:128-133`

```csharp
[HttpPost]
public async Task<IActionResult> Logout()
{
    await _signInManager.SignOutAsync();
    return RedirectToAction(nameof(HomeController.Index), "Home");
}
```

Real-world impact is low (worst case: an attacker forces a user to log out, the user
re-authenticates). But automated scanners (OWASP ZAP, Burp, the standard MS Defender for
Cloud baseline) flag any `[HttpPost]` without antiforgery, and the global
`AutoValidateAntiforgeryTokenAttribute` mentioned in M-6 isn't wired up yet.

**Fix:** add `[ValidateAntiForgeryToken]`. The logout button in `_Layout.cshtml` already
posts the form with the standard antiforgery token, so no view changes needed.

---

### M-8. No password-reset / email-confirmation / 2FA flow
**File:** `Areas/Identity/Pages/` contains only `_ViewStart.cshtml`. The custom `AccountController`
implements Login, Register, ChangePassword, Profile — but no ForgotPassword, ResetPassword,
ConfirmEmail, or 2FA.

Practical consequences a reviewer will raise:
1. **No self-service password recovery.** A user who forgets their password must email an
   admin, who resets it through the `/Admin` UI. That generates out-of-band password handoffs
   (chat, SMS, email plaintext) — exactly the workflow this app should be eliminating.
2. **No 2FA.** Identity supports it out of the box; just not wired in.
3. **`Program.cs:26` sets `options.SignIn.RequireConfirmedAccount = false`.** Users can
   register and immediately act with an unverified email. Phishing-resistant identity proofs
   start with confirmed email.

This isn't a vulnerability so much as a missing-feature flag — UN-Habitat IT will ask
"where is the password reset?" and the answer needs to be a roadmap item or an "out of scope
for v1, admin-mediated reset documented" cover-letter line.

**Fix options (pick one):**
- (Cheapest) Scaffold the Identity Razor Pages for `ForgotPassword` + `ResetPassword` only,
  using the existing `IEmailService`. ~1 hour. No DB migration.
- Flip `RequireConfirmedAccount = true` + scaffold `ConfirmEmail`. ~2 hours.
- Add 2FA via the standard Identity 2FA scaffold + QR code library. ~4 hours.

If schedule is tight, document "admin-mediated password reset; 2FA on the v1.1 roadmap" in
the package cover letter so the reviewer can categorise it as a known gap rather than a
discovered defect.

---

### L-7. jQuery 3.6.0 is two minor versions behind
**File:** `wwwroot/lib/jquery/dist/jquery.min.js` (`/*! jQuery v3.6.0 ... */`)

No outstanding CVE applies to 3.6.0 (the last security fix was the 3.5.0 HTML-manipulation
prototype-pollution patch). Latest stable is **3.7.1** (Aug 2023). Automated dependency
scanners (Retire.js, OWASP Dependency-Check) frequently flag 3.6.0 as "outdated" even
though there is no exploit. Bumping to 3.7.1 takes one library replacement.

**Fix:** `libman` or `npm install jquery@3.7.1` (depends on how the wwwroot/lib was provisioned —
check `libman.json` if present, otherwise drop in the new minified file and verify `wwwroot/lib`
hasn't been hand-edited).

---

### L-8. DOM `innerHTML` usage in `recommendationsModule.js` interpolates DB-backed solution data
**File:** `wwwroot/js/recommendationsModule.js` (16 sites — `:748, 1152, 1337, 1807, 1835, ...`)

Pattern:
```javascript
const fullSolution = getCompleteSolution(solution.solutionId);
// ...
container.innerHTML = html;   // html is built from fullSolution.title, .gap, .description, etc.
```

`fullSolution` comes from `solutionsFullDatabase.js` (developer-controlled, ships in the bundle).
Today that's safe — no end-user can edit those fields. **However**, the same model is editable
by Admins via `/Admin/SolutionCardEditor` and importable via `ImportSolutionCards`. If a
compromised or malicious Admin uploads JSON containing `<img src=x onerror=...>` in a card
title, every other admin opening the editor renders that as live HTML. **Stored XSS, admin → admin.**

Not exploitable by end users today. Worth tightening before assessment because the auditor
will check `git grep innerHTML` and ask whether all sources are trusted.

**Fix (cheapest):** wrap text fields with an `escapeHtml(str)` helper before interpolating,
or rebuild the cards using `textContent` / DOM API instead of string templates for the
user-editable fields (title, gap, description, what-this-solves, etc.). Leave the static
labels alone.

```javascript
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// then: `<h3>${escapeHtml(solution.title)}</h3>`
```

---

## Remediation priority for pass-2 findings

1. **M-1b** — 5-line patch, same helper as pass 1 (15 min).
2. **M-7** — single attribute add (1 min).
3. **L-8** — `escapeHtml` helper + targeted call sites (~30 min).
4. **L-7** — drop in jquery 3.7.1 (~10 min).
5. **M-8** — schedule decision: scaffold or document. Choose based on whether the
   assessment is a go/no-go gate or an iterative one.

After M-1b and M-7 land, the pass-1 + pass-2 set covers everything a typical
ASP.NET Core baseline scanner will flag. L-8 closes the only stored-XSS path I found.
M-8 is policy more than vulnerability.

---

## What pass 2 explicitly looked for and did not find

For the cover letter, in addition to pass-1's confirmations:

- No raw SQL anywhere (re-confirmed)
- No `HttpClient` server-side → no SSRF
- `HtmlToPdfService` aborts all network → no SSRF via PDF render
- All report endpoints verify ownership before mutation
- All file uploads are size-limited, content-type-checked where applicable, and
  do not write client-controlled paths to the filesystem
- No `[Bind(...)]` mass-assignment exposure
- No `eval`, `new Function`, or unsanitised `document.write` of user input in any
  non-print JS file
- Print/export `document.write(html)` sites are open-window prints with the same data
  the user just rendered — not a server-side attack surface
