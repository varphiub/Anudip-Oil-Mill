/**
 * Anudip Oil Mill - Dynamic Product Catalog Controller
 * Handles interactive category filtering, local storage sync, and dynamic +/- quantity counters.
 */

(function () {
    function initProductCatalog() {
        // 1. Interactive Category Filter Setup
        const filterContainer = document.querySelector(".filter-container");
        if (filterContainer && !filterContainer.dataset.bound) {
            filterContainer.dataset.bound = "true";
            filterContainer.addEventListener("click", function (e) {
                const button = e.target.closest(".filter-btn");
                if (!button) return;

                const selectedCategory = button.dataset.category;
                const filterButtons = document.querySelectorAll(".filter-btn");
                const productCards = document.querySelectorAll(".product-card");

                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                // Filter products with smooth fade transition
                productCards.forEach(card => {
                    const productCategory = card.dataset.category;
                    if (selectedCategory === "all" || selectedCategory === productCategory) {
                        card.style.display = "";
                        card.style.animation = "fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        }

        // Helper: Extract full product data from a card
        function extractProductData(card) {
            if (!card) return null;
            const h2El = card.querySelector("h2");
            const priceEl = card.querySelector(".product-price strong");
            const badgeEl = card.querySelector(".product-badge");
            const metaEl = card.querySelector(".product-meta span:last-child");
            const imgEl = card.querySelector(".product-image img");
            const addBtn = card.querySelector(".add-cart-btn");

            const name = h2El ? h2El.textContent.trim() : "Edible Oil";
            const id = card.dataset.category || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            
            // Accurately parse price without including the "/ 1 L" or "/ 500 mL" unit text
            let price = 250;
            if (addBtn && addBtn.dataset.price) {
                price = Number(addBtn.dataset.price);
            } else if (priceEl) {
                const textBeforeSlash = priceEl.textContent.split('/')[0];
                price = parseInt(textBeforeSlash.replace(/[^0-9]/g, ""), 10) || 250;
            }

            const badge = badgeEl ? badgeEl.textContent.trim() : "Cold Pressed";
            const meta = metaEl ? metaEl.textContent.trim() : "1 Litre Bottle";
            const image = imgEl ? imgEl.getAttribute("src") : "../public/products/groundnut_oil.jpg";

            return { id, name, price, badge, meta, image };
        }

        // 2. Synchronize Product Cards with Cart State (Add to Cart vs +/- Stepper)
        function syncProductCardsUI() {
            if (!window.AnudipCart) return;

            const productCards = document.querySelectorAll(".product-card");
            if (productCards.length === 0) return;

            productCards.forEach(card => {
                const data = extractProductData(card);
                if (!data) return;

                const actionContainer = card.querySelector(".product-action");
                if (!actionContainer) return;

                const currentQty = window.AnudipCart.getItemQty(data.id);

                // Find existing button or stepper
                const existingBtn = actionContainer.querySelector(".add-cart-btn");
                const existingStepper = actionContainer.querySelector(".product-qty-stepper");

                if (currentQty > 0) {
                    // Show Quantity Stepper with +/-
                    if (existingBtn) {
                        existingBtn.remove();
                    }

                    if (existingStepper) {
                        const countEl = existingStepper.querySelector(".qty-count");
                        if (countEl) countEl.textContent = currentQty;
                    } else {
                        const stepper = document.createElement("div");
                        stepper.className = "product-qty-stepper";
                        stepper.dataset.id = data.id;
                        stepper.innerHTML = `
                            <button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity" data-id="${data.id}">
                                <span class="material-symbols-outlined">remove</span>
                            </button>
                            <span class="qty-count">${currentQty}</span>
                            <button type="button" class="qty-btn qty-plus" aria-label="Increase quantity" data-id="${data.id}">
                                <span class="material-symbols-outlined">add</span>
                            </button>
                        `;
                        actionContainer.appendChild(stepper);
                    }
                } else {
                    // Show standard Add to Cart button
                    if (existingStepper) {
                        existingStepper.remove();
                    }

                    if (!existingBtn) {
                        const addBtn = document.createElement("button");
                        addBtn.className = "add-cart-btn";
                        addBtn.dataset.id = data.id;
                        addBtn.dataset.name = data.name;
                        addBtn.dataset.price = data.price;
                        addBtn.textContent = "Add to Cart";
                        actionContainer.appendChild(addBtn);
                    }
                }
            });
        }

        // Global Event Delegation on Document for Add to Cart & Stepper actions
        if (!document._productActionsBound) {
            document._productActionsBound = true;
            document.addEventListener("click", function (e) {
                const addBtn = e.target.closest(".add-cart-btn");
                const minusBtn = e.target.closest(".qty-minus");
                const plusBtn = e.target.closest(".qty-plus");

                if (!window.AnudipCart) return;

                if (addBtn) {
                    e.preventDefault();
                    const card = addBtn.closest(".product-card");
                    const data = extractProductData(card);
                    if (data) {
                        window.AnudipCart.addItem({
                            id: data.id,
                            name: data.name,
                            badge: data.badge,
                            meta: data.meta,
                            price: data.price,
                            image: data.image,
                            qty: 1
                        });
                        syncProductCardsUI();
                    }
                } else if (plusBtn) {
                    e.preventDefault();
                    const card = plusBtn.closest(".product-card");
                    const data = extractProductData(card);
                    const id = plusBtn.dataset.id || (data ? data.id : null);
                    if (id) {
                        window.AnudipCart.changeQty(id, 1);
                        syncProductCardsUI();
                    }
                } else if (minusBtn) {
                    e.preventDefault();
                    const card = minusBtn.closest(".product-card");
                    const data = extractProductData(card);
                    const id = minusBtn.dataset.id || (data ? data.id : null);
                    if (id) {
                        window.AnudipCart.changeQty(id, -1);
                        syncProductCardsUI();
                    }
                }
            });
        }

        // Listen for external cart changes (from cart.html, headers, etc.)
        window.addEventListener("anudip_cart_updated", syncProductCardsUI);
        window.addEventListener("storage", syncProductCardsUI);

        // Initial sync
        syncProductCardsUI();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initProductCatalog);
    } else {
        initProductCatalog();
    }
})();
