using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Playwright;

namespace RosraApp.Services
{
    public class HtmlToPdfService
    {
        private readonly IServer _server;

        public HtmlToPdfService(IServer server)
        {
            _server = server;
        }

        /// <summary>
        /// Navigates headless Chromium to a page URL on this server, waits for full load, and converts to PDF.
        /// The session cookie is forwarded so the page can access session data.
        /// </summary>
        public async Task<byte[]> RenderUrlToPdf(string path, HttpContext httpContext)
        {
            // Build the local URL from the running server
            var addresses = _server.Features.Get<Microsoft.AspNetCore.Hosting.Server.Features.IServerAddressesFeature>();
            var baseUrl = addresses?.Addresses.FirstOrDefault() ?? "http://localhost:5090";
            var fullUrl = $"{baseUrl}{path}";

            // Get the session cookie to forward to headless browser
            var cookies = new List<Cookie>();
            if (httpContext.Request.Cookies.TryGetValue(".AspNetCore.Session", out var sessionCookie))
            {
                cookies.Add(new Cookie
                {
                    Name = ".AspNetCore.Session",
                    Value = sessionCookie,
                    Domain = new Uri(baseUrl).Host,
                    Path = "/"
                });
            }
            // Also forward auth cookie if present
            if (httpContext.Request.Cookies.TryGetValue(".AspNetCore.Identity.Application", out var authCookie))
            {
                cookies.Add(new Cookie
                {
                    Name = ".AspNetCore.Identity.Application",
                    Value = authCookie,
                    Domain = new Uri(baseUrl).Host,
                    Path = "/"
                });
            }

            using var playwright = await Playwright.CreateAsync();
            await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
            {
                Headless = true
            });

            var context = await browser.NewContextAsync();

            // Add session and auth cookies so the page can access session data
            if (cookies.Count > 0)
            {
                await context.AddCookiesAsync(cookies);
            }

            var page = await context.NewPageAsync();

            // Navigate to the actual page URL — all CSS, images, fonts, charts load normally
            await page.GotoAsync(fullUrl, new PageGotoOptions
            {
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 30000
            });

            // Wait for JS-rendered charts and images to finish
            await page.WaitForTimeoutAsync(3000);

            var pdfBytes = await page.PdfAsync(new PagePdfOptions
            {
                Format = "A4",
                PrintBackground = true,
                Margin = new Margin
                {
                    Top = "10mm",
                    Bottom = "10mm",
                    Left = "10mm",
                    Right = "10mm"
                }
            });

            await browser.CloseAsync();
            return pdfBytes;
        }

        /// <summary>
        /// Renders a standalone HTML document (as a string) to PDF using headless Chromium.
        /// Used for reports where the client has already built the full HTML and just needs
        /// a reliable server-side rasterizer (e.g. the Recommendations "Generate Report" flow).
        /// </summary>
        public async Task<byte[]> RenderHtmlToPdf(string html)
        {
            using var playwright = await Playwright.CreateAsync();
            await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
            {
                Headless = true
            });

            var context = await browser.NewContextAsync();
            var page = await context.NewPageAsync();

            await page.SetContentAsync(html, new PageSetContentOptions
            {
                WaitUntil = WaitUntilState.NetworkIdle,
                Timeout = 30000
            });

            var pdfBytes = await page.PdfAsync(new PagePdfOptions
            {
                Format = "A4",
                PrintBackground = true,
                Margin = new Margin
                {
                    Top = "10mm",
                    Bottom = "10mm",
                    Left = "10mm",
                    Right = "10mm"
                }
            });

            await browser.CloseAsync();
            return pdfBytes;
        }
    }
}
