// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
let currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');

function setTheme(theme) {
    document.body.className = `theme-${theme}`;
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', theme);
    currentTheme = theme;
}

themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Initialize theme
setTheme(currentTheme);

// Mouse trail effect
const canvas = document.getElementById('mouse-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02;
        
        if (this.size > 0.3) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = `hsla(${currentTheme === 'dark' ? '220' : '210'}, 50%, 50%, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let mouse = {
    x: null,
    y: null,
    lastX: null,
    lastY: null
};

window.addEventListener('mousemove', (e) => {
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (mouse.lastX !== null) {
        const deltaX = mouse.x - mouse.lastX;
        const deltaY = mouse.y - mouse.lastY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const numParticles = Math.floor(distance / 10);

        for (let i = 0; i < numParticles; i++) {
            const x = mouse.lastX + (deltaX * i) / numParticles;
            const y = mouse.lastY + (deltaY * i) / numParticles;
            particles.push(new Particle(x, y));
        }
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

animate();

// Scroll to top button
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add fade-in animation to elements
const observerOptions = {
    threshold: 0.1,
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

document.querySelectorAll('.certification-card, .skill-category, .about-description').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Disable right-click and context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Disable keyboard shortcuts that could be used to copy content
document.addEventListener('keydown', (e) => {
    // Disable Ctrl+C, Ctrl+U, Ctrl+S, F12
    if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C' || 
                      e.key === 'u' || e.key === 'U' ||
                      e.key === 's' || e.key === 'S')) ||
        e.key === 'F12'
    ) {
        e.preventDefault();
        return false;
    }
});

// Disable drag and drop of images
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
});

// Print CV function
function printCV() {
    window.print();
}