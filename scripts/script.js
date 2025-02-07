// Lazy Load Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.onload = () => img.classList.add('loaded');
    });
});

// Back-to-Top Button
const backToTopButton = document.getElementById('back-to-top');
window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
};
backToTopButton.onclick = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

// Disable Right-Click and Dragging
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
});
document.addEventListener('keydown', e => {
    if (e.ctrlKey && [83, 67, 86].includes(e.keyCode)) e.preventDefault();
    if (e.keyCode === 123) e.preventDefault();
});