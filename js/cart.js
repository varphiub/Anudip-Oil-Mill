// Simple state object representing the cart data
    const cartState = {
      groundnut: { price: 250, qty: 2 },
      coconut: { price: 280, qty: 1 },
      discount: 0
    };

    function recalculateCart() {
      const totalGroundnut = cartState.groundnut.qty * cartState.groundnut.price;
      const totalCoconut = cartState.coconut.qty * cartState.coconut.price;
      const subtotal = totalGroundnut + totalCoconut;
      const totalItems = cartState.groundnut.qty + cartState.coconut.qty;
      const grandTotal = Math.max(0, subtotal - cartState.discount);
      const emptyState = document.getElementById('empty-cart-state');

      // Update unit subtotals
      const gnSubEl = document.getElementById('subtotal-groundnut');
      if (gnSubEl) gnSubEl.textContent = '₹' + totalGroundnut;

      const ccSubEl = document.getElementById('subtotal-coconut');
      if (ccSubEl) ccSubEl.textContent = '₹' + totalCoconut;

      // Update Order Summary
      const summaryItemsCount = document.getElementById('summary-items-count');
      if (summaryItemsCount) summaryItemsCount.textContent = 'Subtotal (' + totalItems + ' items)';

      const summarySubtotal = document.getElementById('summary-subtotal');
      if (summarySubtotal) summarySubtotal.textContent = '₹' + subtotal;

      const summaryTotal = document.getElementById('summary-total');
      if (summaryTotal) summaryTotal.textContent = '₹' + grandTotal;

      // Update badge
      const badge = document.getElementById('cart-item-count-badge');
      if (badge) badge.textContent = totalItems + ' items in your cart';

      // Empty state
      if (emptyState) {
        if (totalItems === 0) {
          emptyState.classList.remove('hidden');
          emptyState.classList.add('flex');
        } else {
          emptyState.classList.add('hidden');
          emptyState.classList.remove('flex');
        }
      }
    }

    function changeQty(item, delta) {
      if (!cartState[item]) return;
      const nextQty = cartState[item].qty + delta;
      if (nextQty > 0) {
        cartState[item].qty = nextQty;
        const qtyEl = document.getElementById('qty-' + item);
        if (qtyEl) qtyEl.textContent = nextQty;
        recalculateCart();
      } else {
        removeItem(item);
      }
    }

    function removeItem(item) {
      if (cartState[item]) {
        cartState[item].qty = 0;
        const itemCard = document.getElementById('item-' + item);
        if (itemCard) itemCard.remove();
        recalculateCart();
      }
    }

    function clearEntireCart() {
      cartState.groundnut.qty = 0;
      cartState.coconut.qty = 0;
      const gnCard = document.getElementById('item-groundnut');
      const ccCard = document.getElementById('item-coconut');
      if (gnCard) gnCard.remove();
      if (ccCard) ccCard.remove();
      recalculateCart();
    }

    function applyCoupon() {
      const input = document.getElementById('promo-input');
      const msg = document.getElementById('coupon-message');
      if (input && input.value.trim().toUpperCase() === 'MILLPURE') {
        cartState.discount = 50;
        if (msg) {
          msg.textContent = 'Coupon applied: ₹50 discount added!';
          msg.classList.remove('hidden');
          msg.classList.remove('text-error');
          msg.classList.add('text-secondary');
        }
        recalculateCart();
      } else {
        if (msg) {
          msg.textContent = 'Invalid code. Try using: MILLPURE';
          msg.classList.remove('hidden');
          msg.classList.remove('text-secondary');
          msg.classList.add('text-error');
        }
      }
    }

    function initiateCheckout() {
      const total = document.getElementById('summary-total') ? document.getElementById('summary-total').textContent : '₹780';
      const text = encodeURIComponent("Hello Anudip Oil Mill team! I want to confirm my order for Cold Pressed Oils amounting to " + total + ". Please provide your delivery details.");
      window.open("https://wa.me/919876543210?text=" + text, '_blank');
    }

    document.addEventListener('DOMContentLoaded', recalculateCart);
