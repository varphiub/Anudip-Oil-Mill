/* ==========================================================================
   ANUDIP OIL MILL - HOME PAGE JAVASCRIPT (home.js)
   Interactivity, Mobile Drawer, and Cart State Sync
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = mobileDrawer.classList.contains('hidden');
      if (isHidden) {
        mobileDrawer.classList.remove('hidden');
        mobileDrawer.classList.add('flex');
      } else {
        mobileDrawer.classList.add('hidden');
        mobileDrawer.classList.remove('flex');
      }
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
        if (!mobileDrawer.classList.contains('hidden')) {
          mobileDrawer.classList.add('hidden');
          mobileDrawer.classList.remove('flex');
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileDrawer.classList.contains('hidden')) {
        mobileDrawer.classList.add('hidden');
        mobileDrawer.classList.remove('flex');
      }
    });
  }

  // 2. Sync Cart Counter
  const cartCounter = document.getElementById('cartCounter');
  if (cartCounter) {
    try {
      const storedCart = localStorage.getItem('anudip_cart');
      if (storedCart) {
        const cartData = JSON.parse(storedCart);
        const totalItems = Object.values(cartData).reduce((sum, item) => sum + (item.qty || 0), 0);
        cartCounter.textContent = `Cart (${totalItems})`;
      }
    } catch (err) {
      console.warn('Cart count storage read failed:', err);
    }
  }

  // 3. Smooth scrolling for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
