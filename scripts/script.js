// Theme Management
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Load saved theme or use system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');

// Initialize theme
function setTheme(theme) {
    document.documentElement.style.setProperty('--theme-transition', 'all 0.3s ease');
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    updateThemeIcon(theme);
    
    // Remove transition after theme change
    setTimeout(() => {
        document.documentElement.style.removeProperty('--theme-transition');
    }, 300);
}

// Set initial theme
setTheme(currentTheme);

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('theme-light') 
        ? 'dark' 
        : 'light';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' 
        ? 'fas fa-moon' 
        : 'fas fa-sun';
}

// Performance Optimization Utilities
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Smooth Scroll Implementation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 60;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            requestAnimationFrame(() => {
                entry.target.classList.add('fade-in');
            });
        }
    });
};

const observer = new IntersectionObserver(observerCallback, { 
    threshold: 0.1,
    rootMargin: '20px'
});

document.querySelectorAll('.certification-card').forEach(card => {
    observer.observe(card);
});

// Optimized Scroll Handler
const pageContainer = document.querySelector('.page-container');
if (pageContainer) {
    // Remove the complex scroll handling to allow native smooth scroll
    pageContainer.removeEventListener('wheel', handleScroll);
}

// Content Protection
const preventActions = (e) => e.preventDefault();
const protectedEvents = ['contextmenu', 'selectstart', 'dragstart'];

protectedEvents.forEach(event => {
    document.addEventListener(event, preventActions);
});

// Keyboard Protection
document.addEventListener('keydown', (e) => {
    const protectedKeys = {
        // Prevent common shortcut combinations
        ctrlS: e.ctrlKey && e.key === 's',
        ctrlC: e.ctrlKey && e.key === 'c',
        ctrlV: e.ctrlKey && e.key === 'v',
        f12: e.key === 'F12'
    };

    if (Object.values(protectedKeys).some(Boolean)) {
        e.preventDefault();
    }
});

// Image Protection Enhancement
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', preventActions);
    img.style.webkitUserSelect = 'none';
    img.style.webkitTouchCallout = 'none';
});

// Mouse Effect for Cards
const handleMouseMove = debounce((e) => {
    requestAnimationFrame(() => {
        document.querySelectorAll('.certification-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}, 10);

document.addEventListener('mousemove', handleMouseMove);

// Cleanup
window.addEventListener('unload', () => {
    observer.disconnect();
    protectedEvents.forEach(event => {
        document.removeEventListener(event, preventActions);
    });
    document.removeEventListener('mousemove', handleMouseMove);
});

// Initial Setup
window.addEventListener('load', () => {
    pageContainer?.scrollTo(0, 0);
});

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        updateThemeIcon(newTheme);
    }
});