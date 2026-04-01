using Microsoft.AspNetCore.Authorization;

namespace RosraApp.Authorization
{
    public class RequirePermissionAttribute : AuthorizeAttribute
    {
        public RequirePermissionAttribute(string permissionName)
        {
            Policy = permissionName;
        }
    }
}
