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
