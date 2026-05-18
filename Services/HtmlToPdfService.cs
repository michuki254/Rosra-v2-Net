using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.Logging;
using Microsoft.Playwright;

namespace RosraApp.Services
{
    /// <summary>
    /// Renders HTML / Razor pages to PDF using headless Chromium (Playwright).
    ///
    /// This service holds a **singleton** IPlaywright + IBrowser instance for
    /// the lifetime of the process. Each PDF render spins up a fresh
    /// BrowserContext (cheap, ~200 ms) instead of relaunching Chromium
    /// (expensive, ~30+ s on Azure App Service S1). The singleton is registered
    /// in Program.cs.
    ///
    /// Thread-safety: the browser launch is guarded by a SemaphoreSlim; multiple
    /// concurrent first requests will all wait for the same launch to finish.
    /// IBrowser itself is documented as safe for concurrent use across contexts.
    /// </summary>
    public class HtmlToPdfService : IAsyncDisposable
    {
        private readonly IServer _server;
        private readonly ILogger<HtmlToPdfService> _logger;
        private readonly SemaphoreSlim _initLock = new(1, 1);
        private IPlaywright? _playwright;
        private IBrowser? _browser;

        public HtmlToPdfService(IServer server, ILogger<HtmlToPdfService> logger)
        {
            _server = server;
            _logger = logger;
        }

        /// <summary>
        /// Returns the shared IBrowser, lazily launching Chromium on first use
        /// and re-launching if the previous browser has crashed/disconnected.
        /// </summary>
        private async Task<IBrowser> GetBrowserAsync()
        {
            if (_browser is { IsConnected: true })
                return _browser;

            await _initLock.WaitAsync();
            try
            {
                if (_browser is { IsConnected: true })
                    return _browser;

                // Previous browser died — clean it up before relaunching.
                if (_browser != null)
                {
                    try { await _browser.CloseAsync(); }
                    catch (Exception ex) { _logger.LogWarning(ex, "Error closing dead browser"); }
                    _browser = null;
                }

                _playwright ??= await Playwright.CreateAsync();

                _logger.LogInformation("Launching Playwright Chromium (singleton)");
                _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
                {
                    Headless = true,
                    // Standard headless-Chrome flags for low-memory App Service
                    // containers — disables /dev/shm usage and several
                    // GPU/sandbox features that aren't available there.
                    Args = new[]
                    {
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                        "--no-sandbox"
                    }
                });
                _logger.LogInformation("Playwright Chromium launched and ready.");
                return _browser;
            }
            finally
            {
                _initLock.Release();
            }
        }

        /// <summary>
        /// Navigates headless Chromium to a page URL on this server, waits for full load, and converts to PDF.
        /// The session cookie is forwarded so the page can access session data.
        /// </summary>
        public async Task<byte[]> RenderUrlToPdf(string path, HttpContext httpContext)
        {
            // Build the local URL from the running server. Kestrel bound to
            // "http://+:8080" (e.g. on Railway) reports the address as
            // "http://[::]:8080"; "[::]" and "+" are wildcard bind addresses
            // that Playwright's Chromium cannot connect to, and they are also
            // invalid cookie domains — forcing 127.0.0.1 fixes both.
            var addresses = _server.Features.Get<Microsoft.AspNetCore.Hosting.Server.Features.IServerAddressesFeature>();
            var rawUrl = addresses?.Addresses.FirstOrDefault() ?? "http://localhost:5090";
            var baseUrl = NormalizeLoopback(rawUrl);
            var fullUrl = $"{baseUrl}{path}";
            var cookieHost = new Uri(baseUrl).Host;

            // Get the session cookie to forward to headless browser
            var cookies = new List<Cookie>();
            if (httpContext.Request.Cookies.TryGetValue(".AspNetCore.Session", out var sessionCookie))
            {
                cookies.Add(new Cookie
                {
                    Name = ".AspNetCore.Session",
                    Value = sessionCookie,
                    Domain = cookieHost,
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
                    Domain = cookieHost,
                    Path = "/"
                });
            }

            var browser = await GetBrowserAsync();
            var context = await browser.NewContextAsync();
            try
            {
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

                // Wait for JS-rendered charts and images to finish. Bumped from 3s
                // to 5s because the Quick OSR Estimate (WoFi) flow fires an AJAX
                // after page load, then Chart.js renders the bar chart — that whole
                // chain needs a comfortable buffer or the chart canvas is captured blank.
                await page.WaitForTimeoutAsync(5000);

                return await page.PdfAsync(new PagePdfOptions
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
            }
            finally
            {
                await context.CloseAsync();
            }
        }

        /// <summary>
        /// Renders a standalone HTML document (as a string) to PDF using headless Chromium.
        /// Used for reports where the client has already built the full HTML and just needs
        /// a reliable server-side rasterizer (e.g. the Recommendations "Generate Report" flow).
        ///
        /// Security: every outbound network request is aborted, except inline
        /// data: URIs. This prevents SSRF via payloads that embed
        /// <c>&lt;img src="http://internal..."&gt;</c> / external CSS / fonts / etc.
        /// (Audit F-9.) The HTML must therefore be fully self-contained — any
        /// images/fonts/CSS must be inlined as data: URIs by the caller.
        /// </summary>
        public async Task<byte[]> RenderHtmlToPdf(string html)
        {
            var browser = await GetBrowserAsync();
            var context = await browser.NewContextAsync();
            try
            {
                // Block all outbound network requests. Inline data: URIs go through
                // the renderer without triggering Route, so they still work.
                await context.RouteAsync("**/*", route =>
                {
                    var url = route.Request.Url ?? "";
                    if (url.StartsWith("data:", StringComparison.OrdinalIgnoreCase) ||
                        url.StartsWith("about:", StringComparison.OrdinalIgnoreCase))
                    {
                        return route.ContinueAsync();
                    }
                    return route.AbortAsync();
                });

                var page = await context.NewPageAsync();

                // With network blocked we won't reach NetworkIdle — switch to DOMContentLoaded.
                await page.SetContentAsync(html, new PageSetContentOptions
                {
                    WaitUntil = WaitUntilState.DOMContentLoaded,
                    Timeout = 30000
                });

                return await page.PdfAsync(new PagePdfOptions
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
            }
            finally
            {
                await context.CloseAsync();
            }
        }

        public async ValueTask DisposeAsync()
        {
            if (_browser != null)
            {
                try { await _browser.CloseAsync(); }
                catch (Exception ex) { _logger.LogWarning(ex, "Error closing browser on dispose"); }
                _browser = null;
            }
            _playwright?.Dispose();
            _playwright = null;
            _initLock.Dispose();
        }

        private static string NormalizeLoopback(string url)
        {
            // Kestrel reports wildcard binds as "http://[::]:PORT", "http://+:PORT",
            // "http://0.0.0.0:PORT", or "http://*:PORT". None of those are valid
            // connection targets or cookie domains — rewrite to 127.0.0.1 for
            // the in-container loopback call.
            if (string.IsNullOrEmpty(url)) return "http://127.0.0.1:5090";

            var normalized = url.Replace("://+", "://127.0.0.1")
                                .Replace("://*", "://127.0.0.1")
                                .Replace("://[::]", "://127.0.0.1")
                                .Replace("://0.0.0.0", "://127.0.0.1");
            return normalized.TrimEnd('/');
        }
    }
}
