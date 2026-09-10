/**
 * Anudip Oil Mill - Reusable Header & Footer Component
 * Supports instant zero-flicker rendering and seamless SPA client-side page swapping.
 */

(function () {
    // 1. Inject Stylesheets & Fonts
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
            headerCSS.href = "../components/header.css";
            document.head.appendChild(headerCSS);
        }

        if (!document.querySelector('link[href*="footer.css"]')) {
            const footerCSS = document.createElement("link");
            footerCSS.rel = "stylesheet";
            footerCSS.href = "../components/footer.css";
            document.head.appendChild(footerCSS);
        }
    }

    // 2. Header Template
    const headerHTML = `
<header class="site-header">
    <div class="header-container">
        <!-- Logo -->
        <a href="index.html" class="header-logo">
            <img src="../public/logo_trasprent.png" alt="Anudip Oil Mill">
        </a>

        <!-- Desktop Navigation -->
        <nav class="header-nav">
            <a href="index.html">Home</a>
            <a href="about.html">About Us</a>
            <a href="products.html">Products</a>
            <a href="process.html">Manufacturing Process</a>
            <a href="lab-reports.html">Lab Reports</a>
            <a href="gallery.html">Gallery</a>
            <a href="contact.html">Contact Us</a>
        </nav>

        <!-- Right Side -->
        <div class="header-actions">
            <!-- Cart -->
            <a href="cart.html" class="cart-button">
                <span class="material-symbols-outlined">shopping_cart</span>
                <span>Cart</span>
                <span id="cartCounter">0</span>
            </a>

            <!-- Account / Contact -->
            <a href="contact.html" class="account-button" title="Contact & Support">
                <span class="material-symbols-outlined">person</span>
            </a>

            <!-- Mobile Menu Toggle -->
            <button id="menuToggle" class="menu-toggle" type="button" aria-label="Toggle navigation menu">
                <span class="material-symbols-outlined">menu</span>
            </button>
        </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div id="mobileDrawer" class="mobile-drawer">
        <a href="index.html">Home</a>
        <a href="about.html">About Us</a>
        <a href="products.html">Products</a>
        <a href="process.html">Manufacturing Process</a>
        <a href="lab-reports.html">Lab Reports</a>
        <a href="gallery.html">Gallery</a>
        <a href="contact.html">Contact Us</a>
    </div>
</header>
`;

    // 3. Footer Template
    const footerHTML = `
<footer class="site-footer">
    <div class="footer-container">
        <!-- COMPANY -->
        <div class="footer-company">
            <div class="footer-brand">
                <img 
                    src="../public/logo_trasprent.png" 
                    alt="Anudip Oil Mill"
                    class="footer-logo"
                >
                <span>Anudip Oil Mill</span>
            </div>

            <p class="footer-description">
                Dedicated to bringing 100% natural,
                traditionally extracted cold-pressed oils
                straight from seed to your kitchen.
            </p>

            <div class="footer-social">
                <a href="#" aria-label="Facebook">f</a>
                <a href="#" aria-label="Instagram">◎</a>
                <a href="#" aria-label="YouTube">▶</a>
                <a href="https://wa.me/919876543210" aria-label="WhatsApp" target="_blank">◌</a>
            </div>
        </div>

        <!-- QUICK LINKS -->
        <div class="footer-column">
            <h3>Quick Links</h3>
            <a href="index.html">Home</a>
            <a href="about.html">About Us</a>
            <a href="products.html">Products</a>
            <a href="process.html">Manufacturing Process</a>
            <a href="lab-reports.html">Lab Reports & Quality</a>
            <a href="gallery.html">Gallery</a>
            <a href="contact.html">Contact Us</a>
        </div>

        <!-- PURE EXTRACTION -->
        <div class="footer-column extraction-column">
            <h3>Pure Extraction</h3>
            <p>
                Our seeds undergo authentic wood-pressed
                (Mara Chekku) extraction below 45°C,
                preserving natural vitamins, vital nutrients,
                and genuine seed aroma without chemical
                refining or heat damage.
            </p>
        </div>

        <!-- CONTACT -->
        <div class="footer-column contact-column">
            <h3>Contact Information</h3>
            <div class="contact-row">
                <span class="contact-icon">⌖</span>
                <p>
                    Anudip Oil Mill,<br>
                    Bengaluru, Karnataka,<br>
                    India
                </p>
            </div>
            <div class="contact-row">
                <span class="contact-icon">⌕</span>
                <p>
                    +91 98765 43210
                </p>
            </div>
            <div class="contact-row">
                <span class="contact-icon">✉</span>
                <p>
                    info@anudipoilmill.com
                </p>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <p>
            © 2025 Anudip Oil Mill. All Rights Reserved.
        </p>

        <div class="footer-legal">
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="terms-services.html">Terms & Services</a>
            <a href="lab-reports.html">Lab Reports</a>
        </div>
    </div>
</footer>
`;

    // 4. Inject DOM Nodes
    function renderComponents() {
        ensureHeadAssets();

        const headerEl = document.getElementById("header");
        if (headerEl && (!headerEl.children.length || !headerEl.querySelector(".site-header"))) {
            headerEl.innerHTML = headerHTML;
        }

        const footerEl = document.getElementById("footer");
        if (footerEl && (!footerEl.children.length || !footerEl.querySelector(".site-footer"))) {
            footerEl.innerHTML = footerHTML;
        }

        setupActiveNav();
        setupMobileMenu();
        setupSeamlessNavigation();
    }

    function setupActiveNav(targetPath) {
        const currentPath = targetPath || window.location.pathname;
        let currentPage = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

        const navLinks = document.querySelectorAll(".header-nav a, .mobile-drawer a");
        navLinks.forEach(link => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === currentPage || (currentPage === "" && href === "index.html")) {
                link.classList.add("active");
            }
        });
    }

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

    // 5. Seamless Client-Side Page Swapping (SPA Router)
    function setupSeamlessNavigation() {
        // Only enable SPA router on HTTP/HTTPS servers (file:// blocks fetch)
        if (window.location.protocol === "file:") return;

        if (window._spaRouterInitialized) return;
        window._spaRouterInitialized = true;

        document.addEventListener("click", function (e) {
            const link = e.target.closest("a");
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http") || link.target === "_blank") {
                return;
            }

            // Internal page link clicked
            e.preventDefault();
            loadPage(href, true);
        });

        window.addEventListener("popstate", function () {
            loadPage(window.location.pathname, false);
        });
    }

    async function loadPage(url, pushHistory = true) {
        try {
            // Close mobile drawer if open
            const mobileDrawer = document.getElementById("mobileDrawer");
            if (mobileDrawer) mobileDrawer.classList.remove("active");

            // Add smooth fade out
            const mainEl = document.querySelector("main") || document.body;
            mainEl.style.transition = "opacity 0.15s ease";
            mainEl.style.opacity = "0.3";

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to load page");
            const htmlText = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");

            // Update Page Title
            if (doc.title) {
                document.title = doc.title;
            }

            // Swap Page CSS links that are specific to the new page
            const newLinks = doc.querySelectorAll('link[rel="stylesheet"]');
            newLinks.forEach(newLink => {
                const href = newLink.getAttribute("href");
                if (href && !document.querySelector(`link[href="${href}"]`)) {
                    document.head.appendChild(newLink.cloneNode(true));
                }
            });

            // Swap Main / Body Content between Header and Footer
            const currentMain = document.querySelector("main");
            const incomingMain = doc.querySelector("main");

            if (currentMain && incomingMain) {
                currentMain.replaceWith(incomingMain);
            } else {
                // Fallback: replace body content while preserving header & footer
                const currentHeader = document.getElementById("header");
                const currentFooter = document.getElementById("footer");
                const incomingBody = doc.body;

                const incomingHeader = incomingBody.querySelector("#header");
                const incomingFooter = incomingBody.querySelector("#footer");
                if (incomingHeader) incomingHeader.remove();
                if (incomingFooter) incomingFooter.remove();

                document.body.innerHTML = "";
                if (currentHeader) document.body.appendChild(currentHeader);
                while (incomingBody.firstChild) {
                    document.body.appendChild(incomingBody.firstChild);
                }
                if (currentFooter) document.body.appendChild(currentFooter);
            }

            // Fade in new content
            const updatedMain = document.querySelector("main") || document.body;
            updatedMain.style.opacity = "1";
            window.scrollTo({ top: 0, behavior: "smooth" });

            // Update URL & Active Nav Link
            if (pushHistory) {
                window.history.pushState({}, "", url);
            }
            setupActiveNav(url);

            // Execute scripts of the new page
            const scripts = doc.querySelectorAll("script");
            scripts.forEach(s => {
                if (s.src && !s.src.includes("components.js")) {
                    const newScript = document.createElement("script");
                    newScript.src = s.src;
                    document.body.appendChild(newScript);
                } else if (!s.src && s.textContent.trim()) {
                    try {
                        new Function(s.textContent)();
                    } catch (err) {
                        console.error("Error executing inline script:", err);
                    }
                }
            });

        } catch (err) {
            console.error("SPA Navigation error, falling back to standard navigation:", err);
            window.location.href = url;
        }
    }

    // Run render immediately if possible, or as soon as DOM loads
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderComponents);
    } else {
        renderComponents();
    }
})();