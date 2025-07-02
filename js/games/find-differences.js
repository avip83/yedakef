class FindDifferencesGame {
    constructor() {
        this.lives = 3;
        this.score = 0;
        this.gameInProgress = false;
        this.currentLevel = 0;
        this.timer = null;
        this.timeLeft = 45;
        this.gameData = {
            "diff": [
                {
                    "id": "1",
                    "a_src": "./find-differences-images/diafores1.jpg",
                    "b_src": "./find-differences-images/diafores2.jpg",
                    "css": [
                        {
                            "left": "150",
                            "top": "200", 
                            "width": "40",
                            "height": "40"
                        },
                        {
                            "left": "300",
                            "top": "150",
                            "width": "30",
                            "height": "30"
                        },
                        {
                            "left": "450",
                            "top": "250", 
                            "width": "35",
                            "height": "35"
                        },
                        {
                            "left": "200",
                            "top": "350", 
                            "width": "45",
                            "height": "25"
                        }
                    ]
                }
            ]
        };
        this.foundDifferences = [];
        this.gameContainer = null;
    }

    init() {
        this.createGameHTML();
        this.setupEventListeners();
        this.startGame();
    }

    createGameHTML() {
        // יצירת מודאל המשחק
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = `
            <div class="game-modal-content find-differences-modal">
                <button class="close-button" onclick="this.parentElement.parentElement.remove()">×</button>
                <div class="find-differences-game">
                    <div class="game-header">
                        <h2>מצא את ההבדלים</h2>
                        <div class="game-stats">
                            <div class="stat">
                                <span class="stat-label">חיים:</span>
                                <span id="lives-count">${this.lives}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">זמן:</span>
                                <span id="timer">00:${this.timeLeft < 10 ? '0' + this.timeLeft : this.timeLeft}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">ניקוד:</span>
                                <span id="score-count">${this.score}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="game-instructions">
                        <p>מצא 4 הבדלים בין התמונות. לחץ על ההבדלים כדי לסמן אותם!</p>
                    </div>
                    
                    <div class="images-container">
                        <div class="image-wrapper" id="image1">
                            <img src="${this.gameData.diff[0].a_src}" alt="תמונה 1" />
                            <div class="differences-overlay">
                                ${this.createDifferenceSpots()}
                            </div>
                        </div>
                        <div class="image-wrapper" id="image2">
                            <img src="${this.gameData.diff[0].b_src}" alt="תמונה 2" />
                            <div class="differences-overlay">
                                ${this.createDifferenceSpots()}
                            </div>
                        </div>
                    </div>
                    
                    <div class="game-controls">
                        <button id="restart-btn" class="game-btn">התחל מחדש</button>
                        <button id="hint-btn" class="game-btn">רמז</button>
                        <button id="back-btn" class="game-btn">חזור לתפריט</button>
                    </div>
                </div>
                
                <!-- Win Modal -->
                <div id="win-modal" class="modal hidden">
                    <div class="modal-content">
                        <h3>כל הכבוד!</h3>
                        <p>מצאת את כל ההבדלים!</p>
                        <p>הניקוד שלך: <span id="final-score"></span></p>
                        <button id="play-again-btn" class="modal-btn">שחק שוב</button>
                        <button id="menu-btn" class="modal-btn">תפריט ראשי</button>
                    </div>
                </div>
                
                <!-- Game Over Modal -->
                <div id="gameover-modal" class="modal hidden">
                    <div class="modal-content">
                        <h3>המשחק הסתיים</h3>
                        <p>הזמן נגמר או שנגמרו החיים</p>
                        <p>הניקוד שלך: <span id="gameover-score"></span></p>
                        <button id="try-again-btn" class="modal-btn">נסה שוב</button>
                        <button id="gameover-menu-btn" class="modal-btn">תפריט ראשי</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.gameContainer = modal;
    }

    createDifferenceSpots() {
        let spotsHTML = '';
        for (let i = 0; i < 4; i++) {
            const spot = this.gameData.diff[0].css[i];
            spotsHTML += `
                <div class="difference-spot" data-diff="${i}" style="
                    left: ${spot.left}px; 
                    top: ${spot.top}px; 
                    width: ${spot.width}px; 
                    height: ${spot.height}px;
                "></div>
            `;
        }
        return spotsHTML;
    }

    setupEventListeners() {
        // Difference spots click handlers
        document.querySelectorAll('.difference-spot').forEach(spot => {
            spot.addEventListener('click', (e) => this.handleDifferenceClick(e));
        });

        // Wrong area click handlers
        document.querySelectorAll('.image-wrapper img').forEach(img => {
            img.addEventListener('click', (e) => this.handleWrongClick(e));
        });

        // Control buttons
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('back-btn').addEventListener('click', () => this.backToMenu());

        // Modal buttons
        const playAgainBtn = document.getElementById('play-again-btn');
        const menuBtn = document.getElementById('menu-btn');
        const tryAgainBtn = document.getElementById('try-again-btn');
        const gameoverMenuBtn = document.getElementById('gameover-menu-btn');
        
        if (playAgainBtn) playAgainBtn.addEventListener('click', () => this.playAgain());
        if (menuBtn) menuBtn.addEventListener('click', () => this.backToMenu());
        if (tryAgainBtn) tryAgainBtn.addEventListener('click', () => this.playAgain());
        if (gameoverMenuBtn) gameoverMenuBtn.addEventListener('click', () => this.backToMenu());
    }

    handleDifferenceClick(e) {
        e.stopPropagation();
        const diffIndex = parseInt(e.target.dataset.diff);
        
        if (this.foundDifferences.includes(diffIndex)) {
            return; // Already found
        }

        // Mark as found
        this.foundDifferences.push(diffIndex);
        
        // Visual feedback
        document.querySelectorAll(`[data-diff="${diffIndex}"]`).forEach(spot => {
            spot.classList.add('found');
            spot.innerHTML = '<div class="found-marker">✓</div>';
        });

        // Play success sound
        this.playSound('success');
        
        // Update score
        this.score += 25;
        this.updateScore();

        // Check if all differences found
        if (this.foundDifferences.length === 4) {
            this.winGame();
        }
    }

    handleWrongClick(e) {
        if (e.target.classList.contains('difference-spot')) {
            return; // Don't penalize if clicking on difference spot
        }

        // Wrong click penalty
        this.lives--;
        this.score = Math.max(0, this.score - 5);
        
        this.updateLives();
        this.updateScore();
        
        // Visual feedback
        this.showWrongClickEffect(e);
        
        // Play wrong sound
        this.playSound('wrong');

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    showWrongClickEffect(e) {
        const effect = document.createElement('div');
        effect.className = 'wrong-click-effect';
        effect.innerHTML = '✗';
        effect.style.left = e.offsetX + 'px';
        effect.style.top = e.offsetY + 'px';
        
        e.target.parentNode.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }

    startGame() {
        this.gameInProgress = true;
        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }

    updateTimer() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateScore() {
        document.getElementById('score-count').textContent = this.score;
    }

    updateLives() {
        document.getElementById('lives-count').textContent = this.lives;
    }

    showHint() {
        if (this.foundDifferences.length >= 4) return;
        
        // Find first unfound difference
        let hintIndex = -1;
        for (let i = 0; i < 4; i++) {
            if (!this.foundDifferences.includes(i)) {
                hintIndex = i;
                break;
            }
        }
        
        if (hintIndex !== -1) {
            // Highlight the difference briefly
            document.querySelectorAll(`[data-diff="${hintIndex}"]`).forEach(spot => {
                spot.classList.add('hint-glow');
                setTimeout(() => {
                    spot.classList.remove('hint-glow');
                }, 2000);
            });
            
            // Small score penalty for using hint
            this.score = Math.max(0, this.score - 10);
            this.updateScore();
        }
    }

    winGame() {
        clearInterval(this.timer);
        this.gameInProgress = false;
        
        // Bonus points for remaining time
        this.score += this.timeLeft * 2;
        this.updateScore();
        
        // Play success sound
        this.playSound('complete');
        
        // Show win modal
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('win-modal').classList.remove('hidden');
    }

    gameOver() {
        clearInterval(this.timer);
        this.gameInProgress = false;
        
        // Show game over modal
        document.getElementById('gameover-score').textContent = this.score;
        document.getElementById('gameover-modal').classList.remove('hidden');
    }

    restartGame() {
        this.resetGame();
        this.startGame();
    }

    playAgain() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        this.resetGame();
        this.startGame();
    }

    resetGame() {
        clearInterval(this.timer);
        this.lives = 3;
        this.score = 0;
        this.timeLeft = 45;
        this.foundDifferences = [];
        this.gameInProgress = false;
        
        // Reset UI
        this.updateLives();
        this.updateScore();
        this.updateTimer();
        
        // Reset difference spots
        document.querySelectorAll('.difference-spot').forEach(spot => {
            spot.classList.remove('found');
            spot.innerHTML = '';
        });
        
        // Hide modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    backToMenu() {
        clearInterval(this.timer);
        if (this.gameContainer) {
            this.gameContainer.remove();
        }
    }

    playSound(type) {
        let soundFile = '';
        switch(type) {
            case 'success':
                soundFile = 'sounds/success-340660 (mp3cut.net).mp3';
                break;
            case 'wrong':
                soundFile = 'sounds/wrong-47985 (mp3cut.net).mp3';
                break;
            case 'complete':
                soundFile = 'sounds/game-level-complete-143022.mp3';
                break;
            case 'click':
                soundFile = 'sounds/click-tap-computer-mouse-352734.mp3';
                break;
        }
        
        if (soundFile) {
            const audio = new Audio(soundFile);
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Could not play sound:', e));
        }
    }
}

// Global function to start the game
function startFindDifferences() {
    const game = new FindDifferencesGame();
    game.init();
}

// Make it available globally
window.startFindDifferences = startFindDifferences; 