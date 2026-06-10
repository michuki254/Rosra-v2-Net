using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using RosraApp.Authorization;
using RosraApp.Data;
using RosraApp.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null)));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Audit C-2: persist Data Protection keys to a stable location. The default key store is
// %LOCALAPPDATA% which is wiped on every App Service restart/redeploy/scale-out, which would
// (a) log every user out on each restart and (b) make the SMTP password encrypted by
// EmailService unrecoverable. On Azure App Service %HOME% is a persisted, shared file share;
// elsewhere we fall back to ContentRootPath so dev still works.
var dpKeysDir = Environment.GetEnvironmentVariable("HOME") is { Length: > 0 } home
    ? Path.Combine(home, "DataProtection-Keys")
    : Path.Combine(builder.Environment.ContentRootPath, ".dp-keys");
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(dpKeysDir))
    .SetApplicationName("RosraApp");

builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
        // Password complexity policy
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequiredUniqueChars = 4;
        // Lockout policy
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Point [Authorize] redirects at the custom AccountController instead of the
// default scaffolded /Identity/Account/Login page.
//
// Audit M-4: pin the auth cookie to SameSite=Strict and Secure=Always. Strict eliminates
// CSRF-via-auth-cookie on cross-site navigations; Always forces HTTPS even if the host
// terminates TLS in front of us. Also cap absolute lifetime with sliding renewal so
// stolen cookies don't live forever.
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromHours(2);
    options.SlidingExpiration = true;
});

// Microsoft Entra ID (Azure AD) single sign-on, added ALONGSIDE local Identity login
// (hybrid): UN staff sign in with their UN account; external subnational-government
// users keep email + password. The OIDC scheme is only wired up when EntraId config is
// present, so the app runs with local-only login (unchanged) until the Entra app
// registration is configured in App Service settings — safe to deploy beforehand.
var entraTenantId = builder.Configuration["EntraId:TenantId"];
var entraClientId = builder.Configuration["EntraId:ClientId"];
if (!string.IsNullOrWhiteSpace(entraTenantId) && !string.IsNullOrWhiteSpace(entraClientId))
{
    builder.Services.AddAuthentication()
        .AddOpenIdConnect("EntraId", "UN Account", options =>
        {
            options.Authority = $"https://login.microsoftonline.com/{entraTenantId}/v2.0";
            options.ClientId = entraClientId;
            options.ClientSecret = builder.Configuration["EntraId:ClientSecret"];
            options.ResponseType = "code";
            options.UsePkce = true;
            options.CallbackPath = "/signin-oidc";
            options.SignedOutCallbackPath = "/signout-callback-oidc";
            // Land the external identity in Identity's external sign-in scheme so
            // AccountController.ExternalLoginCallback can find-or-create the local
            // ApplicationUser and issue the normal Identity cookie (roles/permissions
            // then work unchanged for SSO users).
            options.SignInScheme = IdentityConstants.ExternalScheme;
            options.Scope.Add("email");
            options.Scope.Add("profile");
            options.GetClaimsFromUserInfoEndpoint = true;
            options.SaveTokens = true;
            options.TokenValidationParameters.NameClaimType = "preferred_username";
        });
}

builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
builder.Services.AddControllersWithViews(options =>
    {
        // Register the comma-tolerant numeric model binder at the front of the
        // provider list. ROSRA form pages render numeric fields with JS
        // thousand separators ("12,500"); without this binder every save path
        // would silently drop those values. See Infrastructure/CommaTolerantNumberBinder.cs.
        options.ModelBinderProviders.Insert(0, new RosraApp.Infrastructure.CommaTolerantNumberBinderProvider());
    })
    .AddViewLocalization(Microsoft.AspNetCore.Mvc.Razor.LanguageViewLocationExpanderFormat.Suffix)
    .AddDataAnnotationsLocalization();

// Configure anti-forgery to support header-based tokens for AJAX requests
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "RequestVerificationToken";
});

// Add Authorization with Permission-based policies
builder.Services.AddAuthorization(options =>
{
    // Define all permission names
    var permissions = new[]
    {
        "ViewReports", "CreateReports", "EditReports", "EditAllReports", "DeleteReports", "DeleteAllReports", "ExportReports",
        "ViewUsers", "CreateUsers", "EditUsers", "DeleteUsers", "ManageUserRoles", "ActivateDeactivateUsers",
        "UploadPeerSNGData", "UploadCountryData", "ViewDataLibrary", "DeleteUploadedData",
        "ViewRoles", "CreateRoles", "EditRoles", "DeleteRoles", "ManagePermissions",
        "ViewDashboard", "ViewAdminDashboard", "ViewAnalytics",
        // Assessment Review permissions
        "SubmitReports", "ReviewReports", "ValidateReports", "UnlockValidatedReports",
        "AssignReviewers", "ViewReviewNotes", "AddReviewNotes",
        "ViewAnalysisSnapshots", "AccessReportArtifacts", "BulkValidate", "ReRunCalculations"
    };

    // Create a policy for each permission
    foreach (var permission in permissions)
    {
        options.AddPolicy(permission, policy =>
            policy.Requirements.Add(new PermissionRequirement(permission)));
    }
});

// Register the permission authorization handler
builder.Services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

// Register export services for DI (so they can receive IStringLocalizer)
builder.Services.AddScoped<RosraApp.Services.ReportExportService>();
builder.Services.AddScoped<RosraApp.Services.ExcelExportService>();

// Register assessment review services
builder.Services.AddScoped<RosraApp.Services.SnapshotService>();
builder.Services.AddScoped<RosraApp.Services.ArtifactService>();
// HtmlToPdfService is registered as a singleton on purpose — it owns a
// long-lived Playwright IBrowser to avoid relaunching Chromium per request
// (saves ~30+ seconds per call on Azure App Service). See the class docstring.
builder.Services.AddSingleton<RosraApp.Services.HtmlToPdfService>();
builder.Services.AddScoped<RosraApp.Services.IEmailService, RosraApp.Services.EmailService>();
builder.Services.AddTransient<IEmailSender, RosraApp.Services.IdentityEmailSender>();
builder.Services.AddSingleton<RosraApp.Services.DataRetentionService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<RosraApp.Services.DataRetentionService>());
builder.Services.AddScoped<RosraApp.Services.SubmissionService>();
builder.Services.AddScoped<RosraApp.Services.ValidationService>();
// WoFi top-down OSR potential estimator. Singleton because the four seed JSONs
// under Data/Wofi/ are static reference data loaded once at startup.
builder.Services.AddSingleton<RosraApp.Services.WofiPotentialEstimator>();

// Add session services
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    // Audit M-4: Strict + Always for the session cookie too.
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// Add memory cache for reference data
builder.Services.AddMemoryCache();

// Add rate limiting for API endpoints
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("api", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 10;
    });
    options.AddPolicy("login", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// ---------------------------------------------------------------------------
// Ensure Playwright Chromium is installed for HtmlToPdfService.
//
// The Microsoft.Playwright NuGet package only ships the .NET driver; the
// actual Chromium binary (~150 MB) must be fetched separately. On a fresh
// Azure App Service the binary doesn't exist, so RenderReportPdf throws
// "Executable doesn't exist" and we surface a generic 500 to the client.
//
// We pin the install location to a path we control (App Service's persistent
// %HOME% on Azure, otherwise ContentRootPath) so the binary survives between
// requests. The install runs on a background task so cold-start isn't
// blocked; if a user clicks Generate Report before the first install
// finishes they'll get a 500 once, then it works on retry.
// ---------------------------------------------------------------------------
var browsersDir = Environment.GetEnvironmentVariable("HOME") is { Length: > 0 } homeDir
    ? Path.Combine(homeDir, ".playwright")
    : Path.Combine(app.Environment.ContentRootPath, ".playwright");
Environment.SetEnvironmentVariable("PLAYWRIGHT_BROWSERS_PATH", browsersDir);

_ = Task.Run(() =>
{
    var startupLogger = app.Services.GetRequiredService<ILogger<Program>>();
    try
    {
        startupLogger.LogInformation("Installing Playwright Chromium to {Dir}", browsersDir);
        var exitCode = Microsoft.Playwright.Program.Main(new[] { "install", "chromium" });
        if (exitCode == 0)
        {
            startupLogger.LogInformation("Playwright Chromium install complete.");
        }
        else
        {
            startupLogger.LogWarning("Playwright Chromium install exited with code {Code}", exitCode);
        }
    }
    catch (Exception ex)
    {
        startupLogger.LogError(ex, "Failed to install Playwright Chromium — PDF report generation will fail until this is resolved.");
    }
});

// Initialize the database with roles and admin user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        // Initialize the database with roles and admin user
        await DbInitializer.Initialize(services);
        
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Database initialization completed successfully");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing the database.");
    }
}

// Only redirect to HTTPS in development; Azure App Service terminates SSL at its front end in production
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Audit 11.6: accept only a defined set of HTTP request methods. ASP.NET Core MVC
// actions without an explicit verb attribute otherwise respond to ANY method
// (PUT/DELETE/TRACE included). Reject anything outside the allow-list with 405
// before routing — this also removes TRACE (Cross-Site Tracing surface).
var allowedHttpMethods = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
{
    "GET", "HEAD", "POST", "OPTIONS"
};
app.Use(async (context, next) =>
{
    if (!allowedHttpMethods.Contains(context.Request.Method))
    {
        context.Response.StatusCode = StatusCodes.Status405MethodNotAllowed;
        context.Response.Headers["Allow"] = "GET, HEAD, POST, OPTIONS";
        return;
    }
    await next();
});

// Security headers
var isDevelopment = app.Environment.IsDevelopment();
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
    // Audit L-3: per current OWASP guidance the legacy XSS auditor should be disabled,
    // not enabled. Modern browsers ignore the header; old Edge/Chrome implementations
    // had their own XSS bypasses. CSP is the real defence here.
    context.Response.Headers.Append("X-XSS-Protection", "0");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    // In Development, allow ws: so dotnet-watch browser-refresh can connect over localhost.
    var connectSrc = isDevelopment
        ? "connect-src 'self' https://api.worldbank.org ws: wss:;"
        : "connect-src 'self' https://api.worldbank.org wss:;";
    context.Response.Headers.Append("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "font-src 'self'; " +
        "img-src 'self' data: https:; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        connectSrc);

    // Audit 9.3: forms containing sensitive information must not be cached
    // client-side. Account (login/register/profile/password) and Admin pages
    // carry credentials or personal data, so disable client + proxy caching.
    var reqPath = context.Request.Path;
    if (reqPath.StartsWithSegments("/Account") || reqPath.StartsWithSegments("/Admin"))
    {
        context.Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0";
        context.Response.Headers["Pragma"] = "no-cache";
        context.Response.Headers["Expires"] = "0";
    }

    await next();
});

app.UseStaticFiles();

app.UseRouting();
app.UseRateLimiter();

// Localization middleware — must be before auth so culture is set for auth UI
var supportedCultures = new[] { "en", "fr", "es" };
app.UseRequestLocalization(new RequestLocalizationOptions()
    .SetDefaultCulture("en")
    .AddSupportedCultures(supportedCultures)
    .AddSupportedUICultures(supportedCultures));

app.UseAuthentication();
app.UseAuthorization();

// Enable session middleware
app.UseSession();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();
