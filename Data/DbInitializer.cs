using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RosraApp.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace RosraApp.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

                try
                {
                    // First ensure the database exists
                    logger.LogInformation("Ensuring database exists");
                    context.Database.EnsureCreated();

                    // Then apply any pending migrations (may fail if tables already exist from EnsureCreated)
                    try
                    {
                        logger.LogInformation("Applying pending migrations");
                        context.Database.Migrate();
                    }
                    catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 2714)
                    {
                        // Error 2714: "There is already an object named '...' in the database"
                        // This happens when EnsureCreated() already created tables without migration history.
                        // Safe to ignore — tables exist, seeders can proceed.
                        logger.LogWarning("Migration skipped: tables already exist (created by EnsureCreated). Seeders will still run.");
                    }

                    // Seed default permissions
                    logger.LogInformation("Seeding default permissions");
                    await SeedPermissions(context, logger);

                    // Seed PeersSNG data
                    logger.LogInformation("Seeding PeersSNG data");
                    await SeedPeersSNG(context, logger);

                    // Seed CountryData (DB_Countries) from embedded JSON
                    logger.LogInformation("Seeding CountryData (DB_Countries)");
                    await SeedCountryDataFromJson(context, logger);

                    // Seed review workflow permissions (idempotent — only adds missing ones)
                    logger.LogInformation("Seeding review workflow permissions");
                    await SeedReviewPermissions(context, logger);

                    // Create roles if they don't exist
                    logger.LogInformation("Ensuring roles exist");
                    string[] roleNames = { "Admin", "User", "Reviewer" };
                    foreach (var roleName in roleNames)
                    {
                        if (!await roleManager.RoleExistsAsync(roleName))
                        {
                            await roleManager.CreateAsync(new IdentityRole(roleName));
                            logger.LogInformation($"Created role: {roleName}");
                        }
                    }

                    // Create default admin user
                    var adminUser = await userManager.FindByEmailAsync("admin@rosra.com");
                    if (adminUser == null)
                    {
                        logger.LogInformation("Creating default admin user");
                        adminUser = new ApplicationUser
                        {
                            UserName = "admin@rosra.com",
                            Email = "admin@rosra.com",
                            EmailConfirmed = true,
                            FirstName = "Admin",
                            LastName = "User",
                            CreatedAt = DateTime.UtcNow
                        };

                        var result = await userManager.CreateAsync(adminUser, "Admin@123");
                        if (result.Succeeded)
                        {
                            logger.LogInformation("Adding admin user to Admin role");
                            await userManager.AddToRoleAsync(adminUser, "Admin");
                        }
                        else
                        {
                            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                            logger.LogError($"Error creating admin user: {errors}");
                        }
                    }

                    // Make acmichuki@gmail.com an admin
                    var specificAdminUser = await userManager.FindByEmailAsync("acmichuki@gmail.com");
                    if (specificAdminUser != null)
                    {
                        if (!await userManager.IsInRoleAsync(specificAdminUser, "Admin"))
                        {
                            logger.LogInformation("Adding acmichuki@gmail.com to Admin role");
                            await userManager.AddToRoleAsync(specificAdminUser, "Admin");
                            logger.LogInformation("Successfully added acmichuki@gmail.com to Admin role");
                        }
                        else
                        {
                            logger.LogInformation("acmichuki@gmail.com is already an admin");
                        }
                    }
                    else
                    {
                        logger.LogInformation("User acmichuki@gmail.com not found. Please register this account first.");
                    }

                    // Create UN admin users
                    await EnsureAdminUser(userManager, logger, "lennart.fleck@un.org", "Lennart", "Fleck");
                    await EnsureAdminUser(userManager, logger, "omar.moraleslopez@un.org", "Omar", "Morales Lopez");

                    // Seed currency data into DB_Countries (if missing)
                    logger.LogInformation("Seeding currency data for DB_Countries");
                    await SeedCurrencyData(context, logger);

                    // Seed default email settings
                    logger.LogInformation("Seeding email settings");
                    await SeedEmailSettings(context, logger);

                    // Seed Country table with states/regions (idempotent)
                    logger.LogInformation("Seeding country administrative divisions");
                    await SeedCountryStates(context, logger);

                    // Seed Solution Cards from JS data files into database
                    logger.LogInformation("Seeding solution cards");
                    var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
                    await Services.SolutionCardSeeder.SeedFromJsFiles(context, logger, env.WebRootPath);

                    // Seed 5 sample reports with pre-populated data
                    logger.LogInformation("Seeding sample reports");
                    await Services.SampleReportSeeder.SeedSampleReports(context, logger);

                    logger.LogInformation("Database initialization completed successfully");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while initializing the database");
                }
            }
        }

        private static async Task SeedPermissions(ApplicationDbContext context, ILogger logger)
        {
            if (await context.Permissions.AnyAsync())
            {
                logger.LogInformation("Permissions already exist, skipping seed");
                return;
            }

            var permissions = new List<Permission>
            {
                // Report Management Permissions
                new Permission { Name = "ViewReports", Description = "Can view all reports", Category = "Reports" },
                new Permission { Name = "CreateReports", Description = "Can create new reports", Category = "Reports" },
                new Permission { Name = "EditReports", Description = "Can edit own reports", Category = "Reports" },
                new Permission { Name = "EditAllReports", Description = "Can edit any user's reports", Category = "Reports" },
                new Permission { Name = "DeleteReports", Description = "Can delete own reports", Category = "Reports" },
                new Permission { Name = "DeleteAllReports", Description = "Can delete any user's reports", Category = "Reports" },
                new Permission { Name = "ExportReports", Description = "Can export reports to PDF/Excel", Category = "Reports" },

                // User Management Permissions
                new Permission { Name = "ViewUsers", Description = "Can view user list", Category = "User Management" },
                new Permission { Name = "CreateUsers", Description = "Can create new users", Category = "User Management" },
                new Permission { Name = "EditUsers", Description = "Can edit user details", Category = "User Management" },
                new Permission { Name = "DeleteUsers", Description = "Can delete users", Category = "User Management" },
                new Permission { Name = "ManageUserRoles", Description = "Can assign/remove user roles", Category = "User Management" },
                new Permission { Name = "ActivateDeactivateUsers", Description = "Can activate/deactivate user accounts", Category = "User Management" },

                // Data Management Permissions
                new Permission { Name = "UploadPeerSNGData", Description = "Can upload PeerSNG data", Category = "Data Management" },
                new Permission { Name = "UploadCountryData", Description = "Can upload Country data", Category = "Data Management" },
                new Permission { Name = "ViewDataLibrary", Description = "Can view data library", Category = "Data Management" },
                new Permission { Name = "DeleteUploadedData", Description = "Can delete uploaded data", Category = "Data Management" },

                // Role & Permission Management
                new Permission { Name = "ViewRoles", Description = "Can view roles", Category = "Role Management" },
                new Permission { Name = "CreateRoles", Description = "Can create new roles", Category = "Role Management" },
                new Permission { Name = "EditRoles", Description = "Can edit roles", Category = "Role Management" },
                new Permission { Name = "DeleteRoles", Description = "Can delete roles", Category = "Role Management" },
                new Permission { Name = "ManagePermissions", Description = "Can assign permissions to roles", Category = "Role Management" },

                // Dashboard & Analytics
                new Permission { Name = "ViewDashboard", Description = "Can view user dashboard", Category = "Dashboard" },
                new Permission { Name = "ViewAdminDashboard", Description = "Can view admin dashboard", Category = "Dashboard" },
                new Permission { Name = "ViewAnalytics", Description = "Can view analytics and statistics", Category = "Dashboard" }
            };

            await context.Permissions.AddRangeAsync(permissions);
            await context.SaveChangesAsync();

            logger.LogInformation($"Seeded {permissions.Count} default permissions");

            // Assign all permissions to Admin role
            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
            if (adminRole != null)
            {
                var allPermissions = await context.Permissions.ToListAsync();
                var rolePermissions = new List<RolePermission>();

                foreach (var permission in allPermissions)
                {
                    rolePermissions.Add(new RolePermission
                    {
                        RoleId = adminRole.Id,
                        PermissionId = permission.Id
                    });
                }

                await context.RolePermissions.AddRangeAsync(rolePermissions);
                await context.SaveChangesAsync();

                logger.LogInformation($"Assigned all {allPermissions.Count} permissions to Admin role");
            }

            // Assign basic permissions to User role
            var userRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
            if (userRole != null)
            {
                var basicPermissionNames = new[]
                {
                    "ViewReports", "CreateReports", "EditReports", "DeleteReports",
                    "ExportReports", "ViewDashboard"
                };

                var basicPermissions = await context.Permissions
                    .Where(p => basicPermissionNames.Contains(p.Name))
                    .ToListAsync();

                var userRolePermissions = new List<RolePermission>();

                foreach (var permission in basicPermissions)
                {
                    userRolePermissions.Add(new RolePermission
                    {
                        RoleId = userRole.Id,
                        PermissionId = permission.Id
                    });
                }

                await context.RolePermissions.AddRangeAsync(userRolePermissions);
                await context.SaveChangesAsync();

                logger.LogInformation($"Assigned {basicPermissions.Count} basic permissions to User role");
            }
        }

        private static async Task SeedReviewPermissions(ApplicationDbContext context, ILogger logger)
        {
            // New permissions for assessment review workflow — only add missing ones
            var newPermissions = new List<(string Name, string Description, string Category)>
            {
                ("SubmitReports", "Can submit reports for review", "Assessment Review"),
                ("ReviewReports", "Can review submitted reports", "Assessment Review"),
                ("ValidateReports", "Can validate/approve reports", "Assessment Review"),
                ("UnlockValidatedReports", "Can unlock validated reports for revision", "Assessment Review"),
                ("AssignReviewers", "Can assign reviewers to reports", "Assessment Review"),
                ("ViewReviewNotes", "Can view review notes", "Assessment Review"),
                ("AddReviewNotes", "Can add review notes to reports", "Assessment Review"),
                ("ViewAnalysisSnapshots", "Can view analysis snapshots", "Assessment Review"),
                ("AccessReportArtifacts", "Can access generated PDF/Excel artifacts", "Assessment Review"),
                ("BulkValidate", "Can bulk validate multiple reports", "Assessment Review"),
                ("ReRunCalculations", "Can re-run calculations on reports", "Assessment Review"),
                // Solution Card Management permissions
                ("ManageSolutionCards", "Can create, edit, and delete solution cards", "Solution Management"),
                ("ViewSolutionLibrary", "Can view the solution card library", "Solution Management"),
                ("ImportExportCards", "Can import and export solution card data", "Solution Management"),
                ("ViewAnalyticsDashboard", "Can view admin analytics dashboards", "Analytics")
            };

            var existingNames = await context.Permissions.Select(p => p.Name).ToListAsync();
            var toAdd = newPermissions
                .Where(p => !existingNames.Contains(p.Name))
                .Select(p => new Permission { Name = p.Name, Description = p.Description, Category = p.Category })
                .ToList();

            if (toAdd.Any())
            {
                await context.Permissions.AddRangeAsync(toAdd);
                await context.SaveChangesAsync();
                logger.LogInformation($"Seeded {toAdd.Count} new review permissions");
            }

            // Assign all new permissions to Admin role
            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
            if (adminRole != null)
            {
                var allReviewPerms = await context.Permissions
                    .Where(p => p.Category == "Assessment Review")
                    .ToListAsync();

                var existingAdminPermIds = await context.RolePermissions
                    .Where(rp => rp.RoleId == adminRole.Id)
                    .Select(rp => rp.PermissionId)
                    .ToListAsync();

                var newAdminPerms = allReviewPerms
                    .Where(p => !existingAdminPermIds.Contains(p.Id))
                    .Select(p => new RolePermission { RoleId = adminRole.Id, PermissionId = p.Id })
                    .ToList();

                if (newAdminPerms.Any())
                {
                    await context.RolePermissions.AddRangeAsync(newAdminPerms);
                    await context.SaveChangesAsync();
                    logger.LogInformation($"Assigned {newAdminPerms.Count} review permissions to Admin role");
                }
            }

            // Assign review permissions to Reviewer role
            var reviewerRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Reviewer");
            if (reviewerRole != null)
            {
                var reviewerPermNames = new[]
                {
                    "ViewReports", "CreateReports", "EditReports", "DeleteReports", "ExportReports",
                    "ViewDashboard", "SubmitReports", "ReviewReports", "ValidateReports",
                    "ViewReviewNotes", "AddReviewNotes", "ViewAnalysisSnapshots",
                    "AccessReportArtifacts", "BulkValidate", "ReRunCalculations"
                };

                var reviewerPerms = await context.Permissions
                    .Where(p => reviewerPermNames.Contains(p.Name))
                    .ToListAsync();

                var existingReviewerPermIds = await context.RolePermissions
                    .Where(rp => rp.RoleId == reviewerRole.Id)
                    .Select(rp => rp.PermissionId)
                    .ToListAsync();

                var newReviewerPerms = reviewerPerms
                    .Where(p => !existingReviewerPermIds.Contains(p.Id))
                    .Select(p => new RolePermission { RoleId = reviewerRole.Id, PermissionId = p.Id })
                    .ToList();

                if (newReviewerPerms.Any())
                {
                    await context.RolePermissions.AddRangeAsync(newReviewerPerms);
                    await context.SaveChangesAsync();
                    logger.LogInformation($"Assigned {newReviewerPerms.Count} permissions to Reviewer role");
                }
            }

            // Add SubmitReports to User role
            var userRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
            if (userRole != null)
            {
                var submitPerm = await context.Permissions.FirstOrDefaultAsync(p => p.Name == "SubmitReports");
                if (submitPerm != null)
                {
                    var exists = await context.RolePermissions
                        .AnyAsync(rp => rp.RoleId == userRole.Id && rp.PermissionId == submitPerm.Id);
                    if (!exists)
                    {
                        context.RolePermissions.Add(new RolePermission { RoleId = userRole.Id, PermissionId = submitPerm.Id });
                        await context.SaveChangesAsync();
                        logger.LogInformation("Assigned SubmitReports permission to User role");
                    }
                }
            }
        }

        private static async Task SeedPeersSNG(ApplicationDbContext context, ILogger logger)
        {
            if (await context.Peers_SNG.AnyAsync())
            {
                logger.LogInformation("PeersSNG data already exists, skipping seed");
                return;
            }

            // OSR and GCP stored as full KES values (not millions)
            // Population: KNBS 2025 projections (direct where available, estimated* from 2023 base × 3.5% national growth)
            var peersSNG = new List<PeerSNG>
            {
                new PeerSNG { SNG = "Baringo", OSR = 313351637m, GCP = 75459000000m, Population = 759000, Include = true },
                new PeerSNG { SNG = "Bomet", OSR = 242395023m, GCP = 151153000000m, Population = 973000, Include = true },
                new PeerSNG { SNG = "Bungoma", OSR = 379716358m, GCP = 205542000000m, Population = 2073000, Include = true },
                new PeerSNG { SNG = "Busia", OSR = 201772364m, GCP = 88731000000m, Population = 1003000, Include = true },
                new PeerSNG { SNG = "Elgeyo/Marakwet", OSR = 217350490m, GCP = 117229000000m, Population = 509000, Include = true },
                new PeerSNG { SNG = "Embu", OSR = 383178337m, GCP = 149912000000m, Population = 671000, Include = true },
                new PeerSNG { SNG = "Garissa", OSR = 81361298m, GCP = 58634000000m, Population = 960000, Include = true },
                new PeerSNG { SNG = "Homa Bay", OSR = 491496550m, GCP = 120751000000m, Population = 1275000, Include = true },
                new PeerSNG { SNG = "Isiolo", OSR = 151805623m, GCP = 26555000000m, Population = 330000, Include = true },
                new PeerSNG { SNG = "Kajiado", OSR = 875281130m, GCP = 150709000000m, Population = 1313000, Include = true },
                new PeerSNG { SNG = "Kakamega", OSR = 1309679900m, GCP = 214365000000m, Population = 2073000, Include = true },
                new PeerSNG { SNG = "Kericho", OSR = 501354545m, GCP = 163543000000m, Population = 988000, Include = true },
                new PeerSNG { SNG = "Kiambu", OSR = 2424634382m, GCP = 554515000000m, Population = 2754000, Include = true },
                new PeerSNG { SNG = "Kilifi", OSR = 661686660m, GCP = 199953000000m, Population = 1737000, Include = true },
                new PeerSNG { SNG = "Kirinyaga", OSR = 399321046m, GCP = 123709000000m, Population = 676000, Include = true },
                new PeerSNG { SNG = "Kisii", OSR = 413988597m, GCP = 198192000000m, Population = 1370000, Include = true },
                new PeerSNG { SNG = "Kisumu", OSR = 731449033m, GCP = 247324000000m, Population = 1292000, Include = true },
                new PeerSNG { SNG = "Kitui", OSR = 464354467m, GCP = 154345000000m, Population = 1273000, Include = true },
                new PeerSNG { SNG = "Kwale", OSR = 392952872m, GCP = 119001000000m, Population = 978000, Include = true },
                new PeerSNG { SNG = "Laikipia", OSR = 504274788m, GCP = 94639000000m, Population = 583000, Include = true },
                new PeerSNG { SNG = "Lamu", OSR = 156907612m, GCP = 32747000000m, Population = 176000, Include = true },
                new PeerSNG { SNG = "Machakos", OSR = 1429791260m, GCP = 309164000000m, Population = 1518000, Include = true },
                new PeerSNG { SNG = "Makueni", OSR = 418752940m, GCP = 110207000000m, Population = 1079000, Include = true },
                new PeerSNG { SNG = "Mandera", OSR = 122528934m, GCP = 56964000000m, Population = 993000, Include = true },
                new PeerSNG { SNG = "Marsabit", OSR = 58565723m, GCP = 60486000000m, Population = 539000, Include = true },
                new PeerSNG { SNG = "Meru", OSR = 418801954m, GCP = 329977000000m, Population = 1666000, Include = true },
                new PeerSNG { SNG = "Migori", OSR = 406364909m, GCP = 120639000000m, Population = 1277000, Include = true },
                new PeerSNG { SNG = "Mombasa", OSR = 3998628848m, GCP = 468749000000m, Population = 1368000, Include = true },
                new PeerSNG { SNG = "Murang'a", OSR = 534416925m, GCP = 200539000000m, Population = 1151000, Include = true },
                new PeerSNG { SNG = "Nairobi", OSR = 10237263780m, GCP = 2682701000000m, Population = 4906000, Include = false },
                new PeerSNG { SNG = "Nakuru", OSR = 1611062682m, GCP = 483938000000m, Population = 2445000, Include = true },
                new PeerSNG { SNG = "Nandi", OSR = 200737628m, GCP = 149117000000m, Population = 985000, Include = true },
                new PeerSNG { SNG = "Narok", OSR = 3061007640m, GCP = 165462000000m, Population = 1355000, Include = true },
                new PeerSNG { SNG = "Nyamira", OSR = 113484901m, GCP = 116992000000m, Population = 681000, Include = true },
                new PeerSNG { SNG = "Nyandarua", OSR = 505913306m, GCP = 149707000000m, Population = 720000, Include = true },
                new PeerSNG { SNG = "Nyeri", OSR = 610656883m, GCP = 209626000000m, Population = 865000, Include = true },
                new PeerSNG { SNG = "Samburu", OSR = 226516961m, GCP = 29090000000m, Population = 367000, Include = true },
                new PeerSNG { SNG = "Siaya", OSR = 402229607m, GCP = 103899000000m, Population = 1097000, Include = true },
                new PeerSNG { SNG = "Taita/Taveta", OSR = 265254255m, GCP = 63592000000m, Population = 373000, Include = true },
                new PeerSNG { SNG = "Tana River", OSR = 59173171m, GCP = 29460000000m, Population = 370000, Include = true },
                new PeerSNG { SNG = "Tharaka-Nithi", OSR = 164200787m, GCP = 61461000000m, Population = 425000, Include = true },
                new PeerSNG { SNG = "Trans Nzoia", OSR = 267760051m, GCP = 165700000000m, Population = 1106000, Include = true },
                new PeerSNG { SNG = "Turkana", OSR = 177717811m, GCP = 107450000000m, Population = 1059000, Include = true },
                new PeerSNG { SNG = "Uasin Gishu", OSR = 936606563m, GCP = 227871000000m, Population = 1301000, Include = true },
                new PeerSNG { SNG = "Vihiga", OSR = 108347382m, GCP = 83773000000m, Population = 636000, Include = true },
                new PeerSNG { SNG = "Wajir", OSR = 46746101m, GCP = 49159000000m, Population = 901000, Include = true },
                new PeerSNG { SNG = "West Pokot", OSR = 128195210m, GCP = 79417000000m, Population = 706000, Include = true }
            };

            await context.Peers_SNG.AddRangeAsync(peersSNG);
            await context.SaveChangesAsync();

            logger.LogInformation($"Seeded {peersSNG.Count} Kenya counties into PeersSNG table");
        }

        private static async Task SeedCountryDataFromJson(ApplicationDbContext context, ILogger logger)
        {
            if (await context.DB_Countries.AnyAsync())
            {
                logger.LogInformation("CountryData (DB_Countries) already exists, skipping seed");
                return;
            }

            var assembly = System.Reflection.Assembly.GetExecutingAssembly();
            var resourceName = assembly.GetManifestResourceNames()
                .FirstOrDefault(n => n.EndsWith("countrydata.json"));

            if (resourceName == null)
            {
                logger.LogWarning("countrydata.json embedded resource not found — skipping CountryData seed");
                return;
            }

            using var stream = assembly.GetManifestResourceStream(resourceName)!;
            using var reader = new System.IO.StreamReader(stream);
            var json = await reader.ReadToEndAsync();
            var items = System.Text.Json.JsonSerializer.Deserialize<List<CountryDataSeedItem>>(json);

            if (items == null || items.Count == 0)
            {
                logger.LogWarning("countrydata.json is empty — skipping");
                return;
            }

            var records = items.Select(i => new CountryData
            {
                Country = i.Country ?? "",
                Government_Type = i.Government_Type,
                Income_Level = i.Income_Level,
                Income_Group = i.Income_Group,
                CurrencyCode = i.CurrencyCode,
                CurrencySymbol = i.CurrencySymbol,
                GDP_nominal_usd = i.GDP_nominal_usd,
                Population_total = i.Population_total,
                OSR_pct_gdp = i.OSR_pct_gdp,
                SNG_total_revenue_pct_gdp = i.SNG_total_revenue_pct_gdp,
                SNG_grants_subsidies_pct_gdp = i.SNG_grants_subsidies_pct_gdp,
                OSR_pc_proxy_usd = i.OSR_pc_proxy_usd,
                OSR_Data_Complete = i.OSR_Data_Complete,
                SNG_total_rev_pc_usd = i.SNG_total_rev_pc_usd,
                Revenue_Autonomy = i.Revenue_Autonomy,
                OSR_pc_derived_usd = i.OSR_pc_derived_usd
            }).ToList();

            await context.DB_Countries.AddRangeAsync(records);
            await context.SaveChangesAsync();
            logger.LogInformation($"Seeded {records.Count} countries into DB_Countries from embedded JSON");
        }

        // DTO for deserializing countrydata.json
        private class CountryDataSeedItem
        {
            public string? Country { get; set; }
            public string? Government_Type { get; set; }
            public string? Income_Level { get; set; }
            public string? Income_Group { get; set; }
            public string? CurrencyCode { get; set; }
            public string? CurrencySymbol { get; set; }
            public decimal? GDP_nominal_usd { get; set; }
            public long? Population_total { get; set; }
            public decimal? OSR_pct_gdp { get; set; }
            public decimal? SNG_total_revenue_pct_gdp { get; set; }
            public decimal? SNG_grants_subsidies_pct_gdp { get; set; }
            public decimal? OSR_pc_proxy_usd { get; set; }
            public string? OSR_Data_Complete { get; set; }
            public decimal? SNG_total_rev_pc_usd { get; set; }
            public decimal? Revenue_Autonomy { get; set; }
            public decimal? OSR_pc_derived_usd { get; set; }
        }

        private static async Task EnsureAdminUser(UserManager<ApplicationUser> userManager, ILogger logger, string email, string firstName, string lastName)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    FirstName = firstName,
                    LastName = lastName,
                    CreatedAt = DateTime.UtcNow
                };
                var result = await userManager.CreateAsync(user, "Admin@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Admin");
                    logger.LogInformation($"Created admin user: {email}");
                }
                else
                {
                    logger.LogError($"Failed to create {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
            else if (!await userManager.IsInRoleAsync(user, "Admin"))
            {
                await userManager.AddToRoleAsync(user, "Admin");
                logger.LogInformation($"Added {email} to Admin role");
            }
        }

        private static async Task SeedEmailSettings(ApplicationDbContext context, ILogger logger)
        {
            if (await context.EmailSettings.AnyAsync())
            {
                logger.LogInformation("Email settings already exist — skipping");
                return;
            }

            context.EmailSettings.Add(new EmailSettings
            {
                SmtpServer = "smtp.gmail.com",
                SmtpPort = 587,
                UseSsl = true,
                SenderEmail = "noreply@rosra.org",
                SenderDisplayName = "ROSRA UN-Habitat",
                IsEnabled = false, // Admin must configure and enable
                EnableReportSubmitted = true,
                EnableReportClaimed = false,
                EnableReportValidated = true,
                EnableReportRejected = true,
                EnableReportUnlocked = true,
                EnableWelcomeEmail = true,
                MaxRetries = 3,
                RetryDelaySeconds = 30
            });
            await context.SaveChangesAsync();
            logger.LogInformation("Seeded default email settings (disabled — admin must configure)");
        }

        private static async Task SeedCurrencyData(ApplicationDbContext context, ILogger logger)
        {
            // Check if currency data is already populated
            var missingCount = await context.DB_Countries
                .Where(c => c.CurrencyCode == null || c.CurrencyCode == "")
                .CountAsync();

            if (missingCount == 0)
            {
                logger.LogInformation("Currency data already populated — skipping");
                return;
            }

            logger.LogInformation($"Populating currency data for {missingCount} countries");

            var currencyMap = new Dictionary<string, (string Code, string Symbol)>(StringComparer.OrdinalIgnoreCase)
            {
                ["Albania"] = ("ALL", "Lek"), ["Angola"] = ("AOA", "Kz"), ["Argentina"] = ("ARS", "$"),
                ["Armenia"] = ("AMD", "֏"), ["Australia"] = ("AUD", "$"), ["Austria"] = ("EUR", "€"),
                ["Azerbaijan"] = ("AZN", "₼"), ["Bangladesh"] = ("BDT", "৳"), ["Belgium"] = ("EUR", "€"),
                ["Benin"] = ("XOF", "₣"), ["Bolivia"] = ("BOB", "Bs"), ["Bosnia and Herzegovina"] = ("BAM", "KM"),
                ["Botswana"] = ("BWP", "P"), ["Brazil"] = ("BRL", "R$"), ["Bulgaria"] = ("BGN", "лв"),
                ["Burkina Faso"] = ("XOF", "₣"), ["Burundi"] = ("BIF", "Br"), ["Cabo Verde"] = ("CVE", "$"),
                ["Cambodia"] = ("KHR", "៛"), ["Cameroon"] = ("XAF", "₣"), ["Canada"] = ("CAD", "$"),
                ["Chad"] = ("XAF", "₣"), ["Chile"] = ("CLP", "$"), ["China"] = ("CNY", "¥"),
                ["Colombia"] = ("COP", "$"), ["Costa Rica"] = ("CRC", "₡"), ["Croatia"] = ("EUR", "€"),
                ["Cyprus"] = ("EUR", "€"), ["Czechia"] = ("CZK", "Kč"), ["Côte d'Ivoire"] = ("XOF", "₣"),
                ["Denmark"] = ("DKK", "kr"), ["Djibouti"] = ("DJF", "Fdj"), ["Dominican Republic"] = ("DOP", "RD$"),
                ["Ecuador"] = ("USD", "$"), ["Egypt"] = ("EGP", "E£"), ["El Salvador"] = ("USD", "$"),
                ["Estonia"] = ("EUR", "€"), ["Eswatini"] = ("SZL", "E"), ["Ethiopia"] = ("ETB", "Br"),
                ["Finland"] = ("EUR", "€"), ["France"] = ("EUR", "€"), ["Gambia"] = ("GMD", "D"),
                ["Georgia"] = ("GEL", "₾"), ["Germany"] = ("EUR", "€"), ["Ghana"] = ("GHS", "₵"),
                ["Greece"] = ("EUR", "€"), ["Guatemala"] = ("GTQ", "Q"), ["Guinea"] = ("GNF", "FG"),
                ["Haiti"] = ("HTG", "G"), ["Honduras"] = ("HNL", "L"), ["Hungary"] = ("HUF", "Ft"),
                ["Iceland"] = ("ISK", "kr"), ["India"] = ("INR", "₹"), ["Indonesia"] = ("IDR", "Rp"),
                ["Ireland"] = ("EUR", "€"), ["Israel"] = ("ILS", "₪"), ["Italy"] = ("EUR", "€"),
                ["Jamaica"] = ("JMD", "J$"), ["Japan"] = ("JPY", "¥"), ["Jordan"] = ("JOD", "JD"),
                ["Kazakhstan"] = ("KZT", "₸"), ["Kenya"] = ("KES", "KSh"), ["Korea"] = ("KRW", "₩"),
                ["Kosovo"] = ("EUR", "€"), ["Kyrgyzstan"] = ("KGS", "с"), ["Latvia"] = ("EUR", "€"),
                ["Liberia"] = ("LRD", "L$"), ["Lithuania"] = ("EUR", "€"), ["Luxembourg"] = ("EUR", "€"),
                ["Madagascar"] = ("MGA", "Ar"), ["Malawi"] = ("MWK", "MK"), ["Malaysia"] = ("MYR", "RM"),
                ["Mali"] = ("XOF", "₣"), ["Malta"] = ("EUR", "€"), ["Mauritania"] = ("MRU", "UM"),
                ["Mauritius"] = ("MUR", "₨"), ["Mexico"] = ("MXN", "$"), ["Moldova"] = ("MDL", "L"),
                ["Mongolia"] = ("MNT", "₮"), ["Montenegro"] = ("EUR", "€"), ["Morocco"] = ("MAD", "د.م"),
                ["Mozambique"] = ("MZN", "MT"), ["Myanmar"] = ("MMK", "K"), ["Namibia"] = ("NAD", "$"),
                ["Nepal"] = ("NPR", "₨"), ["Netherlands"] = ("EUR", "€"), ["New Zealand"] = ("NZD", "$"),
                ["Nicaragua"] = ("NIO", "C$"), ["Niger"] = ("XOF", "₣"), ["Nigeria"] = ("NGN", "₦"),
                ["North Macedonia"] = ("MKD", "ден"), ["Norway"] = ("NOK", "kr"), ["Pakistan"] = ("PKR", "₨"),
                ["Panama"] = ("USD", "$"), ["Paraguay"] = ("PYG", "₲"), ["Peru"] = ("PEN", "S/"),
                ["Philippines"] = ("PHP", "₱"), ["Poland"] = ("PLN", "zł"), ["Portugal"] = ("EUR", "€"),
                ["Romania"] = ("RON", "lei"), ["Rwanda"] = ("RWF", "RF"), ["Saudi Arabia"] = ("SAR", "﷼"),
                ["Senegal"] = ("XOF", "₣"), ["Serbia"] = ("RSD", "дин"), ["Seychelles"] = ("SCR", "₨"),
                ["Sierra Leone"] = ("SLL", "Le"), ["Slovak Republic"] = ("EUR", "€"), ["Slovenia"] = ("EUR", "€"),
                ["Somalia"] = ("SOS", "Sh"), ["South Africa"] = ("ZAR", "R"), ["Spain"] = ("EUR", "€"),
                ["Sri Lanka"] = ("LKR", "₨"), ["Sweden"] = ("SEK", "kr"), ["Switzerland"] = ("CHF", "CHF"),
                ["Tajikistan"] = ("TJS", "ЅМ"), ["Tanzania"] = ("TZS", "Sh"), ["Thailand"] = ("THB", "฿"),
                ["Togo"] = ("XOF", "₣"), ["Tunisia"] = ("TND", "د.ت"), ["Turkey"] = ("TRY", "₺"),
                ["Türkiye"] = ("TRY", "₺"), ["Uganda"] = ("UGX", "Sh"), ["Ukraine"] = ("UAH", "₴"),
                ["United Arab Emirates"] = ("AED", "د.إ"), ["United Kingdom"] = ("GBP", "£"),
                ["United States"] = ("USD", "$"), ["Uruguay"] = ("UYU", "$U"), ["Uzbekistan"] = ("UZS", "сўм"),
                ["Venezuela"] = ("VES", "Bs"), ["Viet Nam"] = ("VND", "₫"),
                ["West Bank and Gaza Strip"] = ("ILS", "₪"), ["Zambia"] = ("ZMW", "ZK"),
                ["Zimbabwe"] = ("ZWL", "Z$"),
            };

            var allCountries = await context.DB_Countries.ToListAsync();
            int updated = 0;
            foreach (var c in allCountries)
            {
                if (!string.IsNullOrEmpty(c.CurrencyCode) && !string.IsNullOrEmpty(c.CurrencySymbol))
                    continue;

                if (currencyMap.TryGetValue(c.Country, out var cur))
                {
                    c.CurrencyCode = cur.Code;
                    c.CurrencySymbol = cur.Symbol;
                    updated++;
                }
            }

            if (updated > 0)
            {
                await context.SaveChangesAsync();
                logger.LogInformation($"Updated currency data for {updated} countries");
            }
        }

        private static async Task SeedCountryStates(ApplicationDbContext context, ILogger logger)
        {
            var existingCount = await context.Countries.CountAsync();
            var expectedCount = CountryStatesData.GetAll().Count;
            logger.LogInformation($"Country table has {existingCount} records, expected ~{expectedCount}");

            // Skip if already fully seeded (within 10% tolerance)
            if (existingCount >= expectedCount * 0.9)
            {
                logger.LogInformation("Country states already seeded — skipping");
                return;
            }

            // Clear and reseed
            if (existingCount > 0)
            {
                context.Countries.RemoveRange(context.Countries);
                await context.SaveChangesAsync();
                logger.LogInformation($"Cleared {existingCount} existing Country records for re-seeding");
            }

            var allData = CountryStatesData.GetAll();
            var countries = allData.Select(d => new Country
            {
                Name = d.Country,
                Region = d.Region,
                Subregion = d.Subregion,
                Capital = d.Capital,
                Currency = d.Currency,
                StateName = d.StateName,
                StateCode = d.StateCode,
            }).ToList();

            await context.Countries.AddRangeAsync(countries);
            await context.SaveChangesAsync();

            var countryCount = allData.Select(d => d.Country).Distinct().Count();
            logger.LogInformation($"Seeded {countries.Count} state/region records for {countryCount} countries");
        }
    }
}
