/**
 * Anudip Oil Mill - Dynamic Reusable Header & Footer Loader
 * Automatically fetches and syncs components/header.html and components/footer.html
 * So you only ever need to edit header.html, footer.html, header.css, or footer.css!
 */

(function () {
    // 1. Determine relative path to components based on directory depth
    function getComponentsBasePath() {
        const path = window.location.pathname.replace(/\\/g, "/");
        if (path.includes("/html/") || window.location.href.includes("/html/")) {
            return "../components/";
        }
        return "components/";
    }

    const basePath = getComponentsBasePath();

    // 2. Ensure Stylesheets & Fonts
    function ensureHeadAssets() {
        if (!document.querySelector('link[href*="Material+Symbols+Outlined"]')) {
            const iconFont = document.createElement("link");
            iconFont.rel = "stylesheet";
            iconFont.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
            document.head.appendChild(iconFont);
        }

        if (!document.querySelector('link[href*="Plus+Jakarta+Sans"]')) {
            const textFont = document.createElement("link");
            textFont.rel = "stylesheet";
            textFont.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
            document.head.appendChild(textFont);
        }

        if (!document.querySelector('link[href*="header.css"]')) {
            const headerCSS = document.createElement("link");
            headerCSS.rel = "stylesheet";
            headerCSS.href = basePath + "header.css";
            document.head.appendChild(headerCSS);
        }

        if (!document.querySelector('link[href*="footer.css"]')) {
            const footerCSS = document.createElement("link");
            footerCSS.rel = "stylesheet";
            footerCSS.href = basePath + "footer.css";
            document.head.appendChild(footerCSS);
        }
    }

    // 3. Dynamic Fetch & Injection
    async function loadComponent(elementId, fileName, fallbackHTML) {
        const el = document.getElementById(elementId);
        if (!el) return;

        try {
            const response = await fetch(basePath + fileName, { cache: "no-cache" });
            if (response.ok) {
                const html = await response.text();
                el.innerHTML = html;
                return;
            }
        } catch (err) {
            // Local file:// protocol restriction fallback
            if (fallbackHTML && (!el.children.length || !el.querySelector("header, footer"))) {
                el.innerHTML = fallbackHTML;
            }
        }
    }

    // Fallback template only for offline file:// protocol if fetch is blocked
    const fallbackHeader = `
<header class="site-header" id="siteHeader">
    <div class="header-container">
        <div class="header-brand-group">
            <a href="home.html" class="header-logo"><img src="../public/logo_trasprent.png" alt="Anudip Oil Mill"></a>
        </div>
        <nav class="header-nav">
            <a href="home.html">Home</a>
            <a href="about.html">About Us</a>
            <a href="products.html">Products</a>
            <a href="process.html">Manufacturing Process</a>
            <a href="quality.html">Quality</a>
            <a href="gallery.html">Gallery</a>
            <a href="contact.html">Contact Us</a>
        </nav>
        <div class="header-actions">
            <a href="cart.html" class="cart-button" title="View Cart"><span class="material-symbols-outlined">shopping_cart</span><span class="cart-btn-label">Cart</span><span id="cartCounter">0</span></a>
            <button id="menuToggle" class="menu-toggle" type="button" aria-label="Toggle navigation menu"><span class="material-symbols-outlined">menu</span></button>
        </div>
    </div>
    <div id="mobileDrawer" class="mobile-drawer">
        <a href="home.html">Home</a>
        <a href="about.html">About Us</a>
        <a href="products.html">Products</a>
        <a href="process.html">Manufacturing Process</a>
        <a href="quality.html">Quality</a>
        <a href="gallery.html">Gallery</a>
        <a href="contact.html">Contact Us</a>
    </div>
</header>`;

    const fallbackFooter = `
<footer class="site-footer">
    <div class="footer-container">
        <div class="footer-company">
            <div class="footer-brand"><img src="../public/logo_trasprent.png" alt="Anudip Oil Mill" class="footer-logo"><span>Anudip Oil Mill</span></div>
            <p class="footer-description">Dedicated to bringing 100% natural, traditionally extracted cold-pressed oils straight from seed to your kitchen.</p>
            <div class="footer-social">
                <a href="#" aria-label="Facebook" title="Facebook"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                <a href="#" aria-label="Instagram" title="Instagram"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="#" aria-label="YouTube" title="YouTube"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                <a href="#" aria-label="Share" title="Share"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg></a>
            </div>
        </div>
        <div class="footer-column">
            <h3>Quick Links</h3>
            <a href="home.html">Home</a>
            <a href="about.html">About Us</a>
            <a href="products.html">Products</a>
            <a href="process.html">Manufacturing Process</a>
            <a href="quality.html">Quality</a>
            <a href="gallery.html">Gallery</a>
            <a href="contact.html">Contact Us</a>
        </div>
        <div class="footer-column extraction-column">
            <h3>Pure Extraction</h3>
            <p>Our seeds undergo authentic wood-pressed (Mara Chekku) extraction below 45°C, preserving natural vitamins, vital nutrients, and genuine seed aroma without chemical refining or heat damage.</p>
        </div>
        <div class="footer-column contact-column">
            <h3>Contact Information</h3>
            <div class="contact-row">
                <span class="contact-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></span>
                <p>Anudip Oil Mill,<br>Traditional Cold Press Unit<br>Bengaluru, Karnataka, India 560001</p>
            </div>
            <div class="contact-row">
                <span class="contact-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg></span>
                <p>+91 98765 43210</p>
            </div>
            <div class="contact-row">
                <span class="contact-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></span>
                <p>info@anudipoilmill.com</p>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>© 2025 Anudip Oil Mill. All Rights Reserved.</p>
        <div class="footer-legal">
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="terms-services.html">Terms & Services</a>
            <a href="lab-reports.html">Lab Reports</a>
        </div>
    </div>
</footer>`;

    // 4. Initialize Components
    async function renderComponents() {
        ensureHeadAssets();

        await Promise.all([
            loadComponent("header", "header.html", fallbackHeader),
            loadComponent("footer", "footer.html", fallbackFooter)
        ]);

        setupActiveNav();
        setupMobileMenu();
        setupSeamlessNavigation();
        syncHeaderCartCounter();
        initScrollEffects();
    }

    function syncHeaderCartCounter() {
        try {
            const raw = localStorage.getItem('anudip_cart_items');
            const cart = raw ? JSON.parse(raw) : [];
            const count = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.qty || 0), 0) : 0;
            const badges = document.querySelectorAll('#cartCounter, #cart-count, .cart-count-badge');
            badges.forEach(b => {
                if (b) b.textContent = count;
            });
        } catch (e) {}
    }

    window.addEventListener('anudip_cart_updated', syncHeaderCartCounter);
    window.addEventListener('storage', syncHeaderCartCounter);

    // 5. Active Navigation Highlighting
    function setupActiveNav(targetPath) {
        const currentPath = targetPath || window.location.pathname;
        let currentPage = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "home.html";

        const navLinks = document.querySelectorAll(".header-nav a, .mobile-drawer a");
        navLinks.forEach(link => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === currentPage || ((currentPage === "" || currentPage === "index.html") && href === "home.html")) {
                link.classList.add("active");
            }
        });
    }

    // 6. Mobile Drawer Toggle
    function setupMobileMenu() {
        const menuToggle = document.getElementById("menuToggle");
        const mobileDrawer = document.getElementById("mobileDrawer");

        if (menuToggle && mobileDrawer && !menuToggle.dataset.bound) {
            menuToggle.dataset.bound = "true";
            menuToggle.addEventListener("click", function (e) {
                e.stopPropagation();
                mobileDrawer.classList.toggle("active");
            });

            document.addEventListener("click", function (e) {
                if (!mobileDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
                    mobileDrawer.classList.remove("active");
                }
            });
        }
    }

    // 7. Scroll Effects: Fixed Pill Header Elevation & Floating Back to Top Button
    function initScrollEffects() {
        // Ensure Back to Top button exists in the DOM
        let backToTopBtn = document.getElementById("backToTopBtn");
        if (!backToTopBtn) {
            backToTopBtn = document.createElement("button");
            backToTopBtn.id = "backToTopBtn";
            backToTopBtn.className = "back-to-top-btn";
            backToTopBtn.setAttribute("type", "button");
            backToTopBtn.setAttribute("aria-label", "Back to top of page");
            backToTopBtn.setAttribute("title", "Back to Top");
            backToTopBtn.innerHTML = `<span class="material-symbols-outlined">expand_less</span>`;
            document.body.appendChild(backToTopBtn);

            backToTopBtn.addEventListener("click", function () {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
        }

        const handleScroll = function () {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
            const headers = document.querySelectorAll(".site-header");

            // Header transformation on scroll: edge-to-edge -> floating rounded pill
            headers.forEach(header => {
                if (scrollY > 20) {
                    header.classList.add("is-scrolled");
                } else {
                    header.classList.remove("is-scrolled");
                }
            });

            // Back to Top button visibility
            if (backToTopBtn) {
                if (scrollY > 200) {
                    backToTopBtn.classList.add("is-visible");
                } else {
                    backToTopBtn.classList.remove("is-visible");
                }
            }
        };

        if (!window._anudipScrollBound) {
            window._anudipScrollBound = true;
            window.addEventListener("scroll", handleScroll, { passive: true });
        }
        // Run initial check
        handleScroll();
    }

    // 8. Navigation lifecycle
    function setupSeamlessNavigation() {
        // Native browser navigation
    }

    // Run on DOM Ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderComponents);
    } else {
        renderComponents();
    }
})();