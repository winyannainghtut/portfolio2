// Theme Management
function setTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
    
    const icon = document.querySelector('.theme-toggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const defaultTheme = prefersDark.matches ? 'dark' : 'light';
setTheme(savedTheme || defaultTheme);

// Theme toggle
document.querySelector('.theme-toggle').addEventListener('click', () => {
    const newTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    setTheme(newTheme);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Content Protection
const protectedEvents = ['contextmenu', 'selectstart', 'dragstart'];
protectedEvents.forEach(event => document.addEventListener(event, e => e.preventDefault()));

document.addEventListener('keydown', (e) => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && ['s', 'c', 'v'].includes(e.key))
    ) {
        e.preventDefault();
    }
});

// Image Protection
document.querySelectorAll('img').forEach(img => {
    img.draggable = false;
    img.style.webkitUserSelect = 'none';
    img.style.webkitTouchCallout = 'none';
});

// System theme changes
prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Scroll to top functionality
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});