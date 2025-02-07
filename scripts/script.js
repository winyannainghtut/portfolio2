// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Content Protection
const preventDefaultActions = (e) => e.preventDefault();
['contextmenu', 'selectstart'].forEach(event => {
    document.addEventListener(event, preventDefaultActions);
});

document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

document.addEventListener('keydown', function(e) {
    // Block Ctrl+S/C/V
    if (e.ctrlKey && (e.keyCode === 83 || e.keyCode === 67 || e.keyCode === 86)) {
        e.preventDefault();
    }
    // Block F12
    if (e.keyCode === 123) {
        e.preventDefault();
    }
});

// Image Overlay Protection
document.querySelectorAll('img').forEach(img => {
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    overlay.style.pointerEvents = 'none';
    img.style.position = 'relative';
    img.parentElement.insertBefore(overlay, img);
});

// Smooth Scroll with Error Handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        try {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Scroll error:', error);
        }
    });
});

// Add mouse movement effect
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.certification-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Optimized Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            requestAnimationFrame(() => {
                entry.target.classList.add('fade-in');
            });
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '20px'
});

document.querySelectorAll('.certification-card').forEach(card => {
    observer.observe(card);
});

// Optimized Page Scroll
const pageContainer = document.querySelector('.page-container');
if (pageContainer) {
    const handleScroll = debounce((e) => {
        e.preventDefault();
        const { currentTarget, deltaY } = e;
        const currentScroll = currentTarget.scrollTop;
        const pageHeight = window.innerHeight;

        requestAnimationFrame(() => {
            currentTarget.scrollTo({
                top: Math[deltaY > 0 ? 'ceil' : 'floor'](currentScroll / pageHeight) * pageHeight,
                behavior: 'smooth'
            });
        });
    }, 50);

    pageContainer.addEventListener('wheel', handleScroll, { passive: false });
}

// Ensure proper scroll position on page load
window.addEventListener('load', () => {
    const container = document.querySelector('.page-container');
    container.scrollTo(0, 0);
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    observer.disconnect();
});