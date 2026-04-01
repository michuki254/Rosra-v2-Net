// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');

    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            if (header) header.classList.add('scrolled');
        } else {
            if (header) header.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links (Learn dropdown)
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Check if it's an anchor link on the current page or homepage
            if (href.includes('#')) {
                const hashIndex = href.indexOf('#');
                const path = href.substring(0, hashIndex);
                const hash = href.substring(hashIndex);

                // If we're on the homepage or the link is for the homepage
                if ((path === '' || path === '/') && window.location.pathname === '/') {
                    e.preventDefault();
                    const targetSection = document.querySelector(hash);

                    if (targetSection) {
                        const headerHeight = header ? header.offsetHeight : 0;
                        const targetPosition = targetSection.offsetTop - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Close mobile menu if open
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                            navbarCollapse.classList.remove('show');
                        }
                    }
                }
            }
        });
    });

    // Handle hash on page load (when navigating from another page)
    if (window.location.hash) {
        setTimeout(function() {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});
