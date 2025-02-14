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
const defaultTheme = 'dark'; // Changed this line to always default to dark
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
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        
        if (target) {
            const headerOffset = 80; // Adjust this value based on your header height
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
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
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Removed: Page-by-page scroll feature that was overriding natural smooth scrolling

// Mouse connecting dots effect
const canvas = document.getElementById('mouse-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Dots configuration
const dots = [];
const maxDots = 50;
const dotSize = 2;
const maxDistance = 100;
let mouseX = 0;
let mouseY = 0;

// Dot class
class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Attraction to mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
            this.vx += (dx / dist) * 0.1;
            this.vy += (dy / dist) * 0.1;
        }

        // Limit speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 2) {
            this.vx = (this.vx / speed) * 2;
            this.vy = (this.vy / speed) * 2;
        }
    }
}

// Initialize dots
for (let i = 0; i < maxDots; i++) {
    dots.push(new Dot(
        Math.random() * canvas.width,
        Math.random() * canvas.height
    ));
}

// Update mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw dots
    dots.forEach(dot => {
        dot.update();
    });

    // Draw connections
    ctx.beginPath();
    ctx.strokeStyle = document.body.classList.contains('theme-light') 
        ? 'rgba(0,0,0,0.1)' 
        : 'rgba(255,255,255,0.1)';

    dots.forEach((dot, i) => {
        dots.slice(i + 1).forEach(otherDot => {
            const dx = dot.x - otherDot.x;
            const dy = dot.y - otherDot.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
                ctx.lineWidth = (1 - dist / maxDistance) * 1;
                ctx.beginPath();
                ctx.moveTo(dot.x, dot.y);
                ctx.lineTo(otherDot.x, otherDot.y);
                ctx.stroke();
            }
        });

        // Draw dot
        ctx.fillStyle = document.body.classList.contains('theme-light')
            ? 'rgba(0,0,0,0.2)'
            : 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

// Start animation
animate();