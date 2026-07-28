using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;

namespace RosraApp.Controllers
{
    public class CultureController : Controller
    {
        // Audit M-2: antiforgery on the only state-changing endpoint — the culture cookie
        // is functionally harmless but reviewers will flag any [HttpPost] without a token.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult SetLanguage(string culture, string returnUrl)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddYears(1),
                    IsEssential = true,
                    SameSite = SameSiteMode.Lax,
                    // Burp 5.2/6: no JS reads this cookie, so lock it down.
                    Secure = true,
                    HttpOnly = true
                }
            );

            // Burp 7: don't reflect arbitrary attacker-supplied paths — validate and
            // fall back to home instead of throwing (LocalRedirect 500s on bad input).
            if (string.IsNullOrEmpty(returnUrl) || !Url.IsLocalUrl(returnUrl))
            {
                returnUrl = "/";
            }
            return LocalRedirect(returnUrl);
        }
    }
}
