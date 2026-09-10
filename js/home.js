/**
 * Anudip Oil Mill - Home Page Interactivity (home.js)
 * Smooth anchor scrolling and home animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for internal anchor links (#)
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
