// Performance and Optimization Improvements
(function() {
    // Debounce function for performance-critical events
    function debounce(func, wait = 200) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Theme Toggle Optimization
    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Function to update theme toggle button appearance
        function updateThemeToggle(isDark) {
            if (isDark) {
                themeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i><span class="sr-only">Switch to light mode</span>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i><span class="sr-only">Switch to dark mode</span>';
            }
        }
        
        // Function to set theme
        function setTheme(theme) {
            const isDark = theme === 'dark';
            document.body.classList.toggle('theme-dark', isDark);
            document.body.classList.toggle('theme-light', !isDark);
            updateThemeToggle(isDark);
            localStorage.setItem('theme', theme);
        }
        
        // Handle click event
        themeToggle.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
            setTheme(newTheme);
        });
        
        // Set initial theme based on preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            // Use saved preference if available
            setTheme(savedTheme);
        } else {
            // Otherwise use system preference
            setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
        }
    }



    // Initialize all features when DOM is fully loaded
    function init() {
        initThemeToggle();

        // Add fade-in animation to elements with reduced frequency
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Only observe important elements
        document.querySelectorAll('.cert-card, .skill-category').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    // Use DOMContentLoaded for more efficient initialization
    document.addEventListener('DOMContentLoaded', init);
})();