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

                    // Then apply any pending migrations
                    logger.LogInformation("Applying pending migrations");
                    context.Database.Migrate();

                    // Seed default permissions
                    logger.LogInformation("Seeding default permissions");
                    await SeedPermissions(context, logger);

                    // Seed PeersSNG data
                    logger.LogInformation("Seeding PeersSNG data");
                    await SeedPeersSNG(context, logger);
                    
                    // Create roles if they don't exist
                    logger.LogInformation("Ensuring roles exist");
                    string[] roleNames = { "Admin", "User" };
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

        private static async Task SeedPeersSNG(ApplicationDbContext context, ILogger logger)
        {
            if (await context.Peers_SNG.AnyAsync())
            {
                logger.LogInformation("PeersSNG data already exists, skipping seed");
                return;
            }

            var peersSNG = new List<PeerSNG>
            {
                new PeerSNG { SNG = "Baringo", OSR = 321.4m, GCP = 75459m, Include = true },
                new PeerSNG { SNG = "Bomet", OSR = 196.8m, GCP = 151153m, Include = true },
                new PeerSNG { SNG = "Bungoma", OSR = 670.5m, GCP = 205542m, Include = true },
                new PeerSNG { SNG = "Busia", OSR = 205.9m, GCP = 88731m, Include = true },
                new PeerSNG { SNG = "Elgeyo/Marakwet", OSR = 105.9m, GCP = 117229m, Include = true },
                new PeerSNG { SNG = "Embu", OSR = 236.7m, GCP = 149912m, Include = true },
                new PeerSNG { SNG = "Garissa", OSR = 75.4m, GCP = 58634m, Include = true },
                new PeerSNG { SNG = "Homa Bay", OSR = 166m, GCP = 120751m, Include = true },
                new PeerSNG { SNG = "Isiolo", OSR = 125.1m, GCP = 26555m, Include = true },
                new PeerSNG { SNG = "Kajiado", OSR = 544.5m, GCP = 150709m, Include = true },
                new PeerSNG { SNG = "Kakamega", OSR = 639.8m, GCP = 214365m, Include = true },
                new PeerSNG { SNG = "Kericho", OSR = 405.5m, GCP = 163543m, Include = true },
                new PeerSNG { SNG = "Kiambu", OSR = 2192.1m, GCP = 554515m, Include = true },
                new PeerSNG { SNG = "Kilifi", OSR = 685.5m, GCP = 199953m, Include = true },
                new PeerSNG { SNG = "Kirinyaga", OSR = 312.9m, GCP = 123709m, Include = true },
                new PeerSNG { SNG = "Kisii", OSR = 472.9m, GCP = 198192m, Include = true },
                new PeerSNG { SNG = "Kisumu", OSR = 728.3m, GCP = 247324m, Include = true },
                new PeerSNG { SNG = "Kitui", OSR = 244.4m, GCP = 154345m, Include = true },
                new PeerSNG { SNG = "Kwale", OSR = 349.5m, GCP = 119001m, Include = true },
                new PeerSNG { SNG = "Laikipia", OSR = 549.7m, GCP = 94639m, Include = true },
                new PeerSNG { SNG = "Lamu", OSR = 89.6m, GCP = 32747m, Include = true },
                new PeerSNG { SNG = "Machakos", OSR = 1075.9m, GCP = 309164m, Include = true },
                new PeerSNG { SNG = "Makueni", OSR = 259.5m, GCP = 110207m, Include = true },
                new PeerSNG { SNG = "Mandera", OSR = 78m, GCP = 56964m, Include = true },
                new PeerSNG { SNG = "Marsabit", OSR = 81.8m, GCP = 60486m, Include = true },
                new PeerSNG { SNG = "Meru", OSR = 551.3m, GCP = 329977m, Include = true },
                new PeerSNG { SNG = "Migori", OSR = 292.8m, GCP = 120639m, Include = true },
                new PeerSNG { SNG = "Mombasa", OSR = 3271.2m, GCP = 468749m, Include = true },
                new PeerSNG { SNG = "Murang'a", OSR = 567.8m, GCP = 200539m, Include = true },
                new PeerSNG { SNG = "Nairobi", OSR = 6733.3m, GCP = 2682701m, Include = false },
                new PeerSNG { SNG = "Nakuru", OSR = 1511.6m, GCP = 483938m, Include = true },
                new PeerSNG { SNG = "Nandi", OSR = 217m, GCP = 149117m, Include = true },
                new PeerSNG { SNG = "Narok", OSR = 2310.9m, GCP = 165462m, Include = true },
                new PeerSNG { SNG = "Nyamira", OSR = 133.1m, GCP = 116992m, Include = true },
                new PeerSNG { SNG = "Nyandarua", OSR = 307.5m, GCP = 149707m, Include = true },
                new PeerSNG { SNG = "Nyeri", OSR = 659.2m, GCP = 209626m, Include = true },
                new PeerSNG { SNG = "Samburu", OSR = 192.6m, GCP = 29090m, Include = true },
                new PeerSNG { SNG = "Siaya", OSR = 213.1m, GCP = 103899m, Include = true },
                new PeerSNG { SNG = "Taita/Taveta", OSR = 216m, GCP = 63592m, Include = true },
                new PeerSNG { SNG = "Tana River", OSR = 55.5m, GCP = 29460m, Include = true },
                new PeerSNG { SNG = "Tharaka-Nithi", OSR = 190.4m, GCP = 61461m, Include = true },
                new PeerSNG { SNG = "Trans Nzoia", OSR = 320.7m, GCP = 165700m, Include = true },
                new PeerSNG { SNG = "Turkana", OSR = 157.2m, GCP = 107450m, Include = true },
                new PeerSNG { SNG = "Uasin Gishu", OSR = 791.8m, GCP = 227871m, Include = true },
                new PeerSNG { SNG = "Vihiga", OSR = 132.8m, GCP = 83773m, Include = true },
                new PeerSNG { SNG = "Wajir", OSR = 58m, GCP = 49159m, Include = true },
                new PeerSNG { SNG = "West Pokot", OSR = 90.7m, GCP = 79417m, Include = true }
            };

            await context.Peers_SNG.AddRangeAsync(peersSNG);
            await context.SaveChangesAsync();

            logger.LogInformation($"Seeded {peersSNG.Count} Kenya counties into PeersSNG table");
        }
    }
}
