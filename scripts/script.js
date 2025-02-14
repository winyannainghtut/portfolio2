// Performance and Optimization Improvements
(function() {
    // Debounce function for performance-critical events
    function debounce(func, wait = 100) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Theme Toggle Optimization
    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const moonIcon = themeToggle.querySelector('.fa-moon');
        const sunIcon = document.createElement('i');
        sunIcon.className = 'fas fa-sun';

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('theme-dark');
            document.body.classList.toggle('theme-light');
            
            if (document.body.classList.contains('theme-dark')) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
            
            // Optional: Save theme preference in localStorage
            localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
        });

        // Restore theme preference on page load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Scroll Top Button Optimization
    function initScrollTopButton() {
        const scrollTopBtn = document.getElementById('scroll-top');
        if (!scrollTopBtn) return;

        const showScrollTopButton = debounce(() => {
            scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        });

        window.addEventListener('scroll', showScrollTopButton);
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Canvas Initialization with Performance Considerations
    function initializeCanvas() {
        const canvas = document.getElementById('mouse-canvas');
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const resizeCanvas = debounce(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        window.addEventListener('resize', resizeCanvas);

        const ctx = canvas.getContext('2d');
        let particles = [];

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
                ctx.fillStyle = `hsla(${document.body.classList.contains('theme-dark') ? '220' : '210'}, 50%, 50%, ${this.life})`;
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
    }

    // Initialize all features when DOM is fully loaded
    function init() {
        initThemeToggle();
        initScrollTopButton();
        initializeCanvas();

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
    }

    // Use DOMContentLoaded for more efficient initialization
    document.addEventListener('DOMContentLoaded', init);
})();