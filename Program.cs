using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
builder.Services.AddControllersWithViews()
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
builder.Services.AddScoped<RosraApp.Services.HtmlToPdfService>();
builder.Services.AddScoped<RosraApp.Services.IEmailService, RosraApp.Services.EmailService>();
builder.Services.AddSingleton<RosraApp.Services.DataRetentionService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<RosraApp.Services.DataRetentionService>());
builder.Services.AddScoped<RosraApp.Services.SubmissionService>();
builder.Services.AddScoped<RosraApp.Services.ValidationService>();

// Add session services
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
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

// Only redirect to HTTPS in development; Railway handles SSL at the proxy level
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
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
