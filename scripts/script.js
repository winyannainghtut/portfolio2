// Content Protection
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
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

// Text Selection Blocked
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
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

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
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

// Add scroll reveal animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.certification-card').forEach((card) => {
    observer.observe(card);
});