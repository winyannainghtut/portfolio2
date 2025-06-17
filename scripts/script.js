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



    // Dragon Animation Variables (based on original interactive dragon)
    const xmlns = "http://www.w3.org/2000/svg";
    const xlinkns = "http://www.w3.org/1999/xlink";
    let width, height;
    let elems = [];
    let pointer = { x: 0, y: 0 };
    let frm = Math.random();
    let rad = 0;
    const N = 40;

    // Initialize Dragon Animation
    function initDragonAnimation() {
        const screen = document.getElementById('dragon-screen');
        if (!screen) return;
        
        // Initialize dimensions
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
        };
        
        resize();
        window.addEventListener('resize', resize, false);
        
        // Initialize elements array
        for (let i = 0; i < N; i++) {
            elems[i] = { use: null, x: width / 2, y: 0 };
        }
        
        // Initialize pointer
        pointer.x = width / 2;
        pointer.y = height / 2;
        
        // Create dragon elements
        const prepend = (use, i) => {
            const elem = document.createElementNS(xmlns, "use");
            elems[i].use = elem;
            elem.setAttributeNS(xlinkns, "xlink:href", "#" + use);
            screen.prepend(elem);
        };
        
        for (let i = 1; i < N; i++) {
            if (i === 1) prepend("Cabeza", i);
            else if (i === 8 || i === 14) prepend("Aletas", i);
            else prepend("Espina", i);
        }
        
        // Event listeners
        window.addEventListener('pointermove', (e) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            rad = 0;
        }, false);
        
        // Start animation
        run();
    }

    function run() {
        requestAnimationFrame(run);
        let e = elems[0];
        const ax = (Math.cos(3 * frm) * rad * width) / height;
        const ay = (Math.sin(4 * frm) * rad * height) / width;
        e.x += (ax + pointer.x - e.x) / 10;
        e.y += (ay + pointer.y - e.y) / 10;
        
        for (let i = 1; i < N; i++) {
            let e = elems[i];
            let ep = elems[i - 1];
            const a = Math.atan2(e.y - ep.y, e.x - ep.x);
            e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 5) / 4;
            e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 5) / 4;
            const s = (162 + 4 * (1 - i)) / 80;
            e.use.setAttributeNS(
                null,
                "transform",
                `translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${
                    (180 / Math.PI) * a
                }) translate(${0},${0}) scale(${s},${s})`
            );
        }
        
        const radm = Math.min(width, height) / 2 - 20;
        if (rad < radm) rad++;
        frm += 0.003;
        
        if (rad > 60) {
            pointer.x += (width / 2 - pointer.x) * 0.05;
            pointer.y += (height / 2 - pointer.y) * 0.05;
        }
    }

    // Scroll to Top Button Functionality
    function initScrollToTop() {
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        if (!scrollToTopBtn) return;
        
        // Show/hide button based on scroll position
        const toggleScrollButton = () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        };
        
        // Smooth scroll to top
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        
        // Event listeners
        window.addEventListener('scroll', debounce(toggleScrollButton, 100));
        scrollToTopBtn.addEventListener('click', scrollToTop);
        
        // Initial check
        toggleScrollButton();
    }

    // Disable right-click context menu
    function disableRightClick() {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Initialize all features when DOM is fully loaded
    function init() {
        initThemeToggle();
        initDragonAnimation();
        initScrollToTop();
        disableRightClick();

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