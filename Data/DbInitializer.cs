using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RosraApp.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

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
                    
                    logger.LogInformation("Database initialization completed successfully");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while initializing the database");
                }
            }
        }
    }
}
