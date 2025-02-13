// Theme Management
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Load saved theme or use system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');

// Initialize theme
function setTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    updateThemeIcon(theme);
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

// Remove complex scroll handling
const pageContainer = document.querySelector('.page-container');
if (pageContainer) {
    pageContainer.style.scrollBehavior = 'smooth';
}

// Content Protection
const preventActions = (e) => e.preventDefault();
const protectedEvents = ['contextmenu', 'selectstart', 'dragstart'];

protectedEvents.forEach(event => {
    document.addEventListener(event, preventActions);
});

// Enhanced Right Click Protection
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Disable keyboard shortcuts and dev tools
document.addEventListener('keydown', function(e) {
    if (
        // Prevent F12
        e.key === 'F12' ||
        // Prevent Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        // Prevent Ctrl+Shift+J
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        // Prevent Ctrl+Shift+C
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        // Prevent Ctrl+U
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
        return false;
    }
});

// Snap Scrolling Implementation
const sections = document.querySelectorAll('section');
let currentSection = 0;
let isScrolling = false;

function scrollToSection(index) {
    if (index >= 0 && index < sections.length && !isScrolling) {
        isScrolling = true;
        sections[index].scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            isScrolling = false;
        }, 1000); // Prevent scroll for 1 second after transition
    }
}

// Handle mouse wheel events
document.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (!isScrolling) {
        if (e.deltaY > 0) {
            // Scroll down
            currentSection = Math.min(currentSection + 1, sections.length - 1);
        } else {
            // Scroll up
            currentSection = Math.max(currentSection - 1, 0);
        }
        scrollToSection(currentSection);
    }
}, { passive: false });

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isScrolling) {
            if (e.key === 'ArrowDown') {
                currentSection = Math.min(currentSection + 1, sections.length - 1);
            } else {
                currentSection = Math.max(currentSection - 1, 0);
            }
            scrollToSection(currentSection);
        }
    }
});

// Handle navigation links
document.querySelectorAll('.nav-links a').forEach((link, index) => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            currentSection = index;
            scrollToSection(currentSection);
        }
    });
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

// Mouse Bubble Effect
const createBubbleEffect = () => {
    const mainBubble = document.createElement('div');
    mainBubble.className = 'mouse-bubble';
    document.body.appendChild(mainBubble);

    const bubbleTrails = Array.from({ length: 5 }, () => {
        const trail = document.createElement('div');
        trail.className = 'bubble-trail';
        document.body.appendChild(trail);
        return {
            element: trail,
            x: 0,
            y: 0,
            delay: 0
        };
    });

    let mouseX = 0;
    let mouseY = 0;
    let scale = 1;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Scale effect on movement
        scale = 0.8;
        
        // Update main bubble position
        mainBubble.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px) scale(${scale})`;

        // Update trail positions with delay
        bubbleTrails.forEach((trail, index) => {
            setTimeout(() => {
                trail.x = mouseX;
                trail.y = mouseY;
                trail.element.style.opacity = '0.5';
                trail.element.style.transform = `translate(${trail.x - 5}px, ${trail.y - 5}px) scale(${0.5 + index * 0.1})`;
                
                // Fade out trail
                setTimeout(() => {
                    trail.element.style.opacity = '0';
                }, 100);
            }, index * 50);
        });
    });

    // Scale effect on mouse down/up
    document.addEventListener('mousedown', () => scale = 1.5);
    document.addEventListener('mouseup', () => scale = 1);

    // Cleanup function
    return () => {
        document.body.removeChild(mainBubble);
        bubbleTrails.forEach(trail => document.body.removeChild(trail.element));
    };
};

// Initialize bubble effect
const cleanupBubbleEffect = createBubbleEffect();

// Cleanup
window.addEventListener('unload', () => {
    observer.disconnect();
    protectedEvents.forEach(event => {
        document.removeEventListener(event, preventActions);
    });
    document.removeEventListener('mousemove', handleMouseMove);
    cleanupBubbleEffect();
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