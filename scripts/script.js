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

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});