// Idle-session logout. Mirrors the server-side policy in Program.cs (auth cookie
// ExpireTimeSpan = 15 min, sliding): after 15 minutes without user activity the
// page posts the logout form so the session visibly ends even if the tab stays
// open. A warning banner appears one minute before.
//
// Only loaded for authenticated users (see _Layout.cshtml).
(function () {
    'use strict';

    var IDLE_LIMIT_MS = 15 * 60 * 1000;
    var WARNING_BEFORE_MS = 60 * 1000;

    var lastActivity = Date.now();
    var warningShown = false;
    var banner = null;

    function logout() {
        var form = document.getElementById('logoutForm');
        if (form) {
            form.submit();
        } else {
            window.location.href = '/Account/Login';
        }
    }

    function showWarning() {
        if (banner) return;
        banner = document.createElement('div');
        banner.setAttribute('role', 'alert');
        banner.style.cssText =
            'position:fixed;top:0;left:0;right:0;z-index:2000;' +
            'background:#f26a21;color:#fff;padding:0.75rem 1rem;text-align:center;' +
            'font-size:0.95rem;box-shadow:0 2px 8px rgba(0,0,0,0.25);';
        banner.textContent = 'You have been inactive for a while — you will be signed out in 1 minute. Move the mouse or press a key to stay signed in.';
        document.body.appendChild(banner);
        warningShown = true;
    }

    function hideWarning() {
        if (banner) {
            banner.remove();
            banner = null;
        }
        warningShown = false;
    }

    function onActivity() {
        lastActivity = Date.now();
        if (warningShown) hideWarning();
    }

    // Passive, throttled-by-nature activity signals.
    ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'].forEach(function (evt) {
        window.addEventListener(evt, onActivity, { passive: true });
    });

    setInterval(function () {
        var idleFor = Date.now() - lastActivity;
        if (idleFor >= IDLE_LIMIT_MS) {
            logout();
        } else if (idleFor >= IDLE_LIMIT_MS - WARNING_BEFORE_MS) {
            showWarning();
        }
    }, 5000);
})();
