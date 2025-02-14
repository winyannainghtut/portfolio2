class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.speed = 200; // Slower initial speed
        this.isPaused = false;
        
        // Set canvas size
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // Get computed styles
        const computedStyle = getComputedStyle(document.documentElement);
        this.colors = {
            snake: computedStyle.getPropertyValue('--accent-color') || '#4CAF50',
            food: computedStyle.getPropertyValue('--primary-color') || '#FF5722',
            background: computedStyle.getPropertyValue('--bg-color') || '#1a1a1a',
            grid: computedStyle.getPropertyValue('--border-color') || '#333333',
            text: computedStyle.getPropertyValue('--text-color') || '#ffffff'
        };
        
        // Bind event listeners
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.setupTouchControls();
    }

    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        }, false);

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, false);

        this.canvas.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0 && this.direction !== 'left') {
                    this.direction = 'right';
                } else if (deltaX < 0 && this.direction !== 'right') {
                    this.direction = 'left';
                }
            } else {
                // Vertical swipe
                if (deltaY > 0 && this.direction !== 'up') {
                    this.direction = 'down';
                } else if (deltaY < 0 && this.direction !== 'down') {
                    this.direction = 'up';
                }
            }
            e.preventDefault();
        }, false);
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        return {x, y};
    }

    handleKeyPress(event) {
        // Prevent page scrolling with arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
            event.preventDefault();
        }

        const key = event.key;
        
        if (key === 'p' || key === 'P') {
            this.togglePause();
            return;
        }

        if (this.isPaused) return;

        switch(key) {
            case 'ArrowUp':
                if (this.direction !== 'down') this.direction = 'up';
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') this.direction = 'down';
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') this.direction = 'left';
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') this.direction = 'right';
                break;
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            this.gameLoop = setInterval(() => this.update(), this.speed);
        } else {
            clearInterval(this.gameLoop);
            this.drawPauseScreen();
        }
    }

    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Press P to resume', this.canvas.width / 2, this.canvas.height / 2 + 30);
    }

    update() {
        if (this.isPaused) return;

        const head = {...this.snake[0]};
        
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check for collisions
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check if snake ate food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            // Increase speed every 50 points
            if (this.score % 50 === 0) {
                clearInterval(this.gameLoop);
                this.speed = Math.max(100, this.speed - 5); // Slower speed increase
                this.gameLoop = setInterval(() => this.update(), this.speed);
            }
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        // Wall collision
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }

        // Self collision
        return this.snake.some((segment, index) => {
            // Skip checking the current head position
            return index > 0 && segment.x === head.x && segment.y === head.y;
        });
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i < this.canvas.height; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }

        // Draw snake
        this.snake.forEach((segment, index) => {
            // Head color slightly different from body
            this.ctx.fillStyle = index === 0 ? 
                this.colors.snake : 
                this.colors.snake + '99'; // Add transparency to body
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = this.colors.food;
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );

        // Draw score
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.fillText('Press Space to restart', this.canvas.width / 2, this.canvas.height / 2 + 60);

        // Add space key listener for restart
        const restartHandler = (e) => {
            if (e.code === 'Space') {
                document.removeEventListener('keydown', restartHandler);
                this.restart();
            }
        };
        document.addEventListener('keydown', restartHandler);
    }

    restart() {
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.score = 0;
        this.food = this.generateFood();
        this.speed = 200; // Reset to slower initial speed
        this.isPaused = false;
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }

    start() {
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }
}

// Export the class
window.SnakeGame = SnakeGame;
