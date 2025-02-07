// scripts/script.js

document.addEventListener('DOMContentLoaded', function() {
    // Prevent text selection and right-click context menu on the entire body
    document.body.addEventListener('selectstart', function(e) {
        e.preventDefault(); // Prevent text selection from starting
    });

    document.body.addEventListener('contextmenu', function(e) {
        e.preventDefault(); // Prevent right-click context menu
        alert('Right-click and text selection are disabled on this website to protect content.'); // Optional: Inform the user (can be annoying)
    });

    // Prevent right-click on images specifically to discourage direct download
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Prevent right-click context menu on images
            alert('Right-click to save images is disabled.'); // Optional: Inform user specifically for images
        });

        // Optional: Disable dragging of images (less common download method, but possible)
        img.setAttribute('draggable', false); // Standard HTML attribute to disable dragging
        // Or using JavaScript event listener for more control:
        // img.addEventListener('dragstart', function(e) {
        //     e.preventDefault();
        // });
    });


    // Optional: CSS approach to disable text selection - can also be added to style.css for broader effect
    // (This is less robust than preventDefault on selectstart but adds another layer)
    // document.body.style.userSelect = 'none'; // Or '-webkit-user-select: none;', '-moz-user-select: none;', etc. for browser compatibility if needed directly in JS


});