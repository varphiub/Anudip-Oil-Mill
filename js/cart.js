/**
 * Anudip Oil Mill - Dynamic Shopping Cart Controller
 * Persists cart state in localStorage and manages cart calculations & UI rendering.
 */

const AnudipCart = (function () {
    const STORAGE_KEY = 'anudip_cart_items';
    const COUPON_KEY = 'anudip_cart_coupon';
    const FREE_DELIVERY_THRESHOLD = 500;
    const STANDARD_DELIVERY_FEE = 50;

    // Load Cart from localStorage
    function getCart() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to read cart from localStorage", e);
            return [];
        }
    }

    // Get quantity of a single item by id or name
    function getItemQty(id) {
        if (!id) return 0;
        const cart = getCart();
        const targetId = String(id).toLowerCase().trim();
        const item = cart.find(i => {
            const itemId = String(i.id || '').toLowerCase().trim();
            const itemName = String(i.name || '').toLowerCase().trim();
            return itemId === targetId || itemName === targetId || itemName.includes(targetId) || targetId.includes(itemId);
        });
        return item ? (Number(item.qty) || 0) : 0;
    }

    // Save Cart to localStorage and emit update event
    function saveCart(cart) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (e) {
            console.error("Failed to save cart to localStorage", e);
        }
        updateGlobalCounters();
        window.dispatchEvent(new CustomEvent('anudip_cart_updated', { detail: { cart } }));
    }

    // Add or increment item in cart
    function addItem(product) {
        if (!product) return getCart();
        const cart = getCart();
        const prodId = String(product.id || product.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const existingIndex = cart.findIndex(item => {
            const itemId = String(item.id || '').toLowerCase();
            const itemName = String(item.name || '').toLowerCase();
            return itemId === prodId || itemName === String(product.name || '').toLowerCase();
        });

        if (existingIndex > -1) {
            cart[existingIndex].qty = (Number(cart[existingIndex].qty) || 0) + (Number(product.qty) || 1);
        } else {
            cart.push({
                id: prodId,
                name: product.name || 'Edible Oil',
                badge: product.badge || 'Cold Pressed',
                meta: product.meta || '1 Litre Bottle',
                price: Number(product.price) || 0,
                image: product.image || '../public/products/groundnut_oil.jpg',
                qty: Number(product.qty) || 1
            });
        }

        saveCart(cart);
        showToast(`Added ${product.name} to cart!`);
        return cart;
    }

    // Change item quantity
    function changeQty(id, delta) {
        if (!id) return;
        const cart = getCart();
        const targetId = String(id).toLowerCase().trim();
        const item = cart.find(i => {
            const itemId = String(i.id || '').toLowerCase().trim();
            const itemName = String(i.name || '').toLowerCase().trim();
            return itemId === targetId || itemName === targetId || itemName.includes(targetId) || targetId.includes(itemId);
        });
        if (!item) return;

        const newQty = (Number(item.qty) || 0) + delta;
        if (newQty <= 0) {
            removeItem(item.id);
        } else {
            item.qty = newQty;
            saveCart(cart);
            if (isCartPage()) {
                renderCartPage();
            }
        }
    }

    // Remove item
    function removeItem(id) {
        if (!id) return;
        let cart = getCart();
        const targetId = String(id).toLowerCase().trim();
        cart = cart.filter(i => {
            const itemId = String(i.id || '').toLowerCase().trim();
            const itemName = String(i.name || '').toLowerCase().trim();
            return itemId !== targetId && itemName !== targetId && !itemName.includes(targetId) && !targetId.includes(itemId);
        });
        saveCart(cart);
        if (isCartPage()) {
            renderCartPage();
        }
    }

    // Clear entire cart
    function clearCart() {
        saveCart([]);
        if (isCartPage()) {
            renderCartPage();
        }
    }

    // Get total items count
    function getTotalCount() {
        const cart = getCart();
        return cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    }

    // Get Subtotal
    function getSubtotal() {
        const cart = getCart();
        return cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.qty) || 0)), 0);
    }

    // Applied coupon
    function getAppliedCoupon() {
        try {
            return JSON.parse(localStorage.getItem(COUPON_KEY)) || null;
        } catch {
            return null;
        }
    }

    function setAppliedCoupon(coupon) {
        if (!coupon) {
            localStorage.removeItem(COUPON_KEY);
        } else {
            localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
        }
    }

    // Coupon discount logic
    function applyCoupon(code) {
        const cleanCode = (code || '').trim().toUpperCase();
        const subtotal = getSubtotal();

        if (cleanCode === 'MILLPURE' || cleanCode === 'PURE50') {
            const coupon = { code: cleanCode, type: 'flat', value: 50, message: '₹50 Mill Discount Applied!' };
            setAppliedCoupon(coupon);
            return { success: true, coupon };
        } else if (cleanCode === 'PURE10') {
            const discountAmount = Math.round(subtotal * 0.10);
            const coupon = { code: cleanCode, type: 'percent', value: discountAmount, message: '10% Harvest Discount Applied!' };
            setAppliedCoupon(coupon);
            return { success: true, coupon };
        } else {
            return { success: false, message: "Invalid code. Try 'MILLPURE' or 'PURE10'." };
        }
    }

    function removeCoupon() {
        setAppliedCoupon(null);
    }

    // Update cart badge in header & mobile drawer
    function updateGlobalCounters() {
        const count = getTotalCount();
        const badges = document.querySelectorAll('#cartCounter, #cart-count, .cart-count-badge');
        badges.forEach(badge => {
            if (badge) badge.textContent = count;
        });
    }

    // Check if current page is cart page
    function isCartPage() {
        return window.location.pathname.includes('cart.html') || !!document.getElementById('cart-items-wrapper');
    }

    // Toast Notification System
    function showToast(message) {
        let toast = document.getElementById('cart-toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cart-toast-notification';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background-color: #012d1d;
                color: #ffffff;
                padding: 14px 22px;
                border-radius: 50px;
                box-shadow: 0 10px 30px rgba(1, 45, 29, 0.35);
                display: flex;
                align-items: center;
                gap: 12px;
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 14px;
                font-weight: 600;
                z-index: 99999;
                transform: translateY(100px);
                opacity: 0;
                transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
            `;
            document.body.appendChild(toast);
        }

        toast.innerHTML = `
            <span style="background:#c1ecd4; color:#012d1d; width:22px; height:22px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold;">✓</span>
            <span>${message}</span>
            <a href="cart.html" style="margin-left:8px; color:#c1ecd4; text-decoration:underline; font-weight:700;">View Cart →</a>
        `;

        // Trigger animation
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
        }, 3200);
    }

    // Dynamic Render for cart.html
    function renderCartPage() {
        const wrapper = document.getElementById('cart-items-wrapper');
        if (!wrapper) return;

        const cart = getCart();
        const totalCount = getTotalCount();
        const subtotal = getSubtotal();
        const coupon = getAppliedCoupon();

        // Update badge
        const badge = document.getElementById('cart-item-count-badge');
        if (badge) {
            badge.textContent = totalCount === 1 ? '1 item in your cart' : `${totalCount} items in your cart`;
        }

        // Update Delivery Progress Card
        const deliveryCard = document.getElementById('free-delivery-card');
        const deliveryMsgEl = document.getElementById('delivery-msg');
        const deliveryPctEl = document.getElementById('delivery-pct');
        const deliveryBarEl = document.getElementById('delivery-bar-fill');

        const qualifiedPct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));
        const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
        const deliveryMsg = remainingForFree > 0
            ? `Add ₹${remainingForFree} more for FREE doorstep delivery!`
            : `🎉 Congratulations! You unlocked FREE doorstep delivery!`;

        if (deliveryCard) {
            if (cart.length === 0) {
                deliveryCard.style.display = 'none';
            } else {
                deliveryCard.style.display = 'flex';
                if (deliveryMsgEl) deliveryMsgEl.textContent = deliveryMsg;
                if (deliveryPctEl) deliveryPctEl.textContent = `${qualifiedPct}% Qualified`;
                if (deliveryBarEl) deliveryBarEl.style.width = `${qualifiedPct}%`;
            }
        }

        // Empty state check
        if (cart.length === 0) {
            wrapper.innerHTML = `
                <div class="bg-surface-container-lowest p-space-2xl rounded-xl text-center flex flex-col items-center gap-space-md shadow-sm" id="empty-cart-state" style="padding: 50px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #ffffff; border-radius: 14px; border: 1px solid #eadfd6;">
                    <div style="width: 64px; height: 64px; border-radius: 50%; background: #ffead8; display: flex; align-items: center; justify-content: center; color: #012d1d; margin-bottom: 12px;">
                        <span class="material-symbols-outlined" style="font-size: 34px;">remove_shopping_cart</span>
                    </div>
                    <h3 style="font-size: 24px; font-weight: 800; color: #012d1d; margin-bottom: 6px;">Your cart is empty</h3>
                    <p style="color: #414844; font-size: 14px; max-width: 360px; margin-bottom: 20px; line-height: 1.6;">
                        You have no unrefined cold-pressed oils in your cart. Explore our freshly churned harvest oils today!
                    </p>
                    <a href="products.html" style="background: #012d1d; color: #ffffff; padding: 12px 28px; border-radius: 999px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s;">
                        <span>Browse Fresh Oils</span>
                        <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
                    </a>
                </div>
            `;
        } else {
            let itemsHTML = '';

            // Render Product Rows
            cart.forEach(item => {
                const itemTotal = (Number(item.price) || 0) * (Number(item.qty) || 1);
                itemsHTML += `
                    <article class="bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-space-md transition-all" id="item-${item.id}" style="background: #ffffff; padding: 20px; border-radius: 14px; border: 1px solid #eadfd6; margin-bottom: 14px; display: flex; gap: 18px; align-items: center;">
                        <!-- Thumbnail -->
                        <div style="width: 95px; height: 95px; border-radius: 12px; overflow: hidden; background: #f6e7db; flex-shrink: 0;">
                            <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>

                        <!-- Details -->
                        <div style="flex: 1; min-width: 0; text-align: left;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <span style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; background: #c1ecd4; color: #012d1d; padding: 2px 8px; border-radius: 20px; letter-spacing: 0.5px;">${item.badge || 'Cold Pressed'}</span>
                            </div>
                            <h2 style="font-size: 17px; font-weight: 700; color: #012d1d; margin-bottom: 3px; line-height: 1.3;">${item.name}</h2>
                            <p style="font-size: 12.5px; color: #717973; margin-bottom: 6px;">${item.meta || '1 Litre Bottle'}</p>
                            <div style="font-size: 14px; color: #012d1d; font-weight: 700;">
                                Unit Price: <span style="color: #2c694e;">₹${item.price}</span>
                            </div>
                        </div>

                        <!-- Quantity & Actions -->
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                            <!-- Quantity Selector -->
                            <div style="display: flex; align-items: center; background: #fff1e6; border-radius: 999px; padding: 3px 6px; border: 1px solid #eadfd6;">
                                <button type="button" onclick="AnudipCart.changeQty('${item.id}', -1)" aria-label="Decrease" style="width: 28px; height: 28px; border-radius: 50%; border: none; background: #ffffff; color: #012d1d; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                    <span class="material-symbols-outlined" style="font-size: 15px;">remove</span>
                                </button>
                                <span style="width: 34px; text-align: center; font-weight: 700; font-size: 14px; color: #012d1d;">${item.qty}</span>
                                <button type="button" onclick="AnudipCart.changeQty('${item.id}', 1)" aria-label="Increase" style="width: 28px; height: 28px; border-radius: 50%; border: none; background: #ffffff; color: #012d1d; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                    <span class="material-symbols-outlined" style="font-size: 15px;">add</span>
                                </button>
                            </div>

                            <!-- Total & Delete -->
                            <div style="text-align: right;">
                                <span style="font-size: 18px; font-weight: 800; color: #012d1d;">₹${itemTotal}</span>
                            </div>

                            <button type="button" onclick="AnudipCart.removeItem('${item.id}')" style="background: none; border: none; color: #ba1a1a; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; opacity: 0.85; transition: opacity 0.2s;">
                                <span class="material-symbols-outlined" style="font-size: 15px;">delete</span>
                                <span>Remove</span>
                            </button>
                        </div>
                    </article>
                `;
            });

            wrapper.innerHTML = itemsHTML;
        }

        // Summary Calculations
        const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
        let discount = 0;
        if (coupon && subtotal > 0) {
            discount = coupon.type === 'percent' ? coupon.value : Math.min(coupon.value, subtotal);
        }
        const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

        // Update Summary Elements
        const subtotalEl = document.getElementById('summary-subtotal');
        if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;

        const itemsCountEl = document.getElementById('summary-items-count');
        if (itemsCountEl) itemsCountEl.textContent = `Subtotal (${totalCount} items)`;

        const deliveryFeeEl = document.getElementById('summary-delivery-fee');
        if (deliveryFeeEl) {
            deliveryFeeEl.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
            deliveryFeeEl.style.color = deliveryFee === 0 ? '#2c694e' : '#012d1d';
            deliveryFeeEl.style.fontWeight = 'bold';
        }

        const discountRow = document.getElementById('summary-discount-row');
        const discountLabel = document.getElementById('summary-discount-label');
        const discountVal = document.getElementById('summary-discount-val');
        if (discountRow && discountLabel && discountVal) {
            if (discount > 0) {
                discountRow.style.display = 'flex';
                discountLabel.textContent = coupon ? coupon.message.split('!')[0] : 'Discount';
                discountVal.textContent = `- ₹${discount}`;
            } else {
                discountRow.style.display = 'none';
            }
        }

        const totalEl = document.getElementById('summary-total');
        if (totalEl) totalEl.textContent = `₹${grandTotal}`;

        // Coupon display
        const couponMsg = document.getElementById('coupon-message');
        if (couponMsg) {
            if (coupon && subtotal > 0) {
                couponMsg.textContent = `${coupon.message} (-₹${discount})`;
                couponMsg.classList.remove('hidden');
                couponMsg.style.display = 'block';
                couponMsg.style.color = '#2c694e';
            } else {
                couponMsg.style.display = 'none';
            }
        }
    }

    // Order Checkout via WhatsApp
    function initiateCheckout() {
        const cart = getCart();
        if (cart.length === 0) {
            alert("Your cart is empty. Please add products before checking out!");
            return;
        }

        const subtotal = getSubtotal();
        const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
        const coupon = getAppliedCoupon();
        let discount = 0;
        if (coupon) {
            discount = coupon.type === 'percent' ? coupon.value : Math.min(coupon.value, subtotal);
        }
        const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

        let orderText = `🌱 *NEW ORDER - ANUDIP OIL MILL*\n\n`;
        cart.forEach((item, index) => {
            orderText += `${index + 1}. *${item.name}* (${item.meta || '1L'})\n   Qty: ${item.qty} × ₹${item.price} = ₹${item.qty * item.price}\n`;
        });

        orderText += `\n------------------------`;
        orderText += `\n📦 *Subtotal:* ₹${subtotal}`;
        if (discount > 0) orderText += `\n🏷️ *Discount (${coupon.code}):* -₹${discount}`;
        orderText += `\n🚚 *Delivery:* ${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}`;
        orderText += `\n💰 *Total Amount:* ₹${grandTotal}`;
        orderText += `\n------------------------\n`;
        orderText += `Please share delivery address and confirmation. Thank you!`;

        const encoded = encodeURIComponent(orderText);
        window.open(`https://wa.me/919876543210?text=${encoded}`, '_blank');
    }

    // Initialize listeners on DOM ready
    function init() {
        updateGlobalCounters();
        if (isCartPage()) {
            renderCartPage();
        }

        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY) {
                updateGlobalCounters();
                if (isCartPage()) renderCartPage();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    const publicAPI = {
        getCart,
        getItemQty,
        saveCart,
        addItem,
        changeQty,
        removeItem,
        clearCart,
        getTotalCount,
        getSubtotal,
        applyCoupon,
        removeCoupon,
        renderCartPage,
        initiateCheckout,
        showToast,
        updateGlobalCounters
    };

    return publicAPI;
})();

// Explicitly attach to window for cross-script access
window.AnudipCart = AnudipCart;

// Global Helper Wrappers for inline HTML onclick attributes
function changeQty(id, delta) {
    AnudipCart.changeQty(id, delta);
}

function removeItem(id) {
    AnudipCart.removeItem(id);
}

function clearEntireCart() {
    AnudipCart.clearCart();
}

function applyCoupon() {
    const input = document.getElementById('promo-input');
    const msg = document.getElementById('coupon-message');
    if (!input) return;

    const result = AnudipCart.applyCoupon(input.value);
    if (msg) {
        msg.textContent = result.message;
        msg.classList.remove('hidden');
        msg.style.display = 'block';
        msg.style.color = result.success ? '#2c694e' : '#ba1a1a';
    }
    if (result.success) {
        AnudipCart.renderCartPage();
    }
}

function initiateCheckout() {
    AnudipCart.initiateCheckout();
}
