// Performance and Optimization Improvements
(function() {
    // Debounce function for performance-critical events
    function debounce(func, wait = 100) {
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
        
        // Handle keyboard event for accessibility
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeToggle.click();
            }
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
        
        // Listen for system preference changes
        prefersDarkScheme.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Scroll Top Button Optimization
    function initScrollTopButton() {
        const scrollTopBtn = document.getElementById('scroll-top');
        if (!scrollTopBtn) return;

        const showScrollTopButton = debounce(() => {
            scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        });

        window.addEventListener('scroll', showScrollTopButton);
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize all features when DOM is fully loaded
    function init() {
        initThemeToggle();
        initScrollTopButton();

        // Add fade-in animation to elements
        const observerOptions = {
            threshold: 0.1,
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

        document.querySelectorAll('.certification-card, .skill-category, .about-description').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });

        // Disable right-click and context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });

        // Disable keyboard shortcuts that could be used to copy content
        document.addEventListener('keydown', (e) => {
            // Disable Ctrl+C, Ctrl+U, Ctrl+S, F12
            if (
                (e.ctrlKey && (e.key === 'c' || e.key === 'C' || 
                              e.key === 'u' || e.key === 'U' ||
                              e.key === 's' || e.key === 'S')) ||
                e.key === 'F12'
            ) {
                e.preventDefault();
                return false;
            }
        });

        // Disable drag and drop of images
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });

        // Print CV function
        function printCV() {
            window.print();
        }
    }

    // Use DOMContentLoaded for more efficient initialization
    document.addEventListener('DOMContentLoaded', init);
})();