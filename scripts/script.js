document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && [83, 67, 86].includes(e.keyCode)) {
        e.preventDefault();
    }
    if (e.keyCode === 123) {
        e.preventDefault();
    }
});