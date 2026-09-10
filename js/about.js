/**
 * Anudip Oil Mill - About Page Animations & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Scroll Reveal Observers
    const revealElements = document.querySelectorAll('.heritage-section, .principles-section, .values-section, .quote-banner, .value-card, .principle-card');

    revealElements.forEach((el) => {
        el.classList.add('reveal');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add staggered delay if grid item
                if (entry.target.classList.contains('value-card') || entry.target.classList.contains('principle-card')) {
                    const siblingCards = Array.from(entry.target.parentNode.children);
                    const cardIndex = siblingCards.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${(cardIndex % 4) * 0.12}s`;
                }

                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Animated Number Counter for Stats Cards
    const statNums = document.querySelectorAll('.stat-num');
    let animated = false;

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animated = true;
                statNums.forEach(stat => {
                    const originalText = stat.innerText.trim();
                    const numericValue = parseInt(originalText.replace(/[^0-9]/g, ''), 10);

                    if (isNaN(numericValue)) return;

                    const prefix = originalText.startsWith('<') ? '<' : '';
                    const suffix = originalText.endsWith('%') ? '%' : originalText.endsWith('+') ? '+' : originalText.includes('°C') ? '°C' : '';

                    const duration = 1600;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Ease out quad
                        const easeProgress = 1 - (1 - progress) * (1 - progress);
                        const currentNum = Math.floor(easeProgress * numericValue);

                        stat.innerText = `${prefix}${currentNum}${suffix}`;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.innerText = originalText;
                        }
                    }

                    requestAnimationFrame(updateCount);
                });
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }
});
