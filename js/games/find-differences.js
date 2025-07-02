// משחק מצא את ההבדלים - מבוסס על yi-jy/find-different
// מותאם למערכת שלנו עם ממשק בעברית, צלילים ואינטגרציה

class FindDifferencesGame {
    constructor() {
        this.gameData = {
            count: 10,
            imgInfo: [
                {
                    src: "08",
                    pos: [
                        { x: 0, y: 127, w: 50, h: 70 },
                        { x: 80, y: 90, w: 50, h: 40 },
                        { x: 66, y: 145, w: 72, h: 35 },
                        { x: 200, y: 145, w: 80, h: 65 }
                    ]
                },
                {
                    src: "09",
                    pos: [
                        { x: 20, y: 0, w: 50, h: 35 },
                        { x: 20, y: 118, w: 58, h: 35 },
                        { x: 85, y: 45, w: 40, h: 60 },
                        { x: 240, y: 155, w: 55, h: 50 }
                    ]
                },
                {
                    src: "12",
                    pos: [
                        { x: 10, y: 0, w: 62, h: 35 },
                        { x: 85, y: 0, w: 42, h: 45 },
                        { x: 187, y: 72, w: 57, h: 52 },
                        { x: 208, y: 150, w: 50, h: 50 }
                    ]
                },
                {
                    src: "16",
                    pos: [
                        { x: 0, y: 155, w: 45, h: 52 },
                        { x: 60, y: 148, w: 52, h: 42 },
                        { x: 158, y: 88, w: 42, h: 42 },
                        { x: 215, y: 100, w: 60, h: 40 }
                    ]
                },
                {
                    src: "17",
                    pos: [
                        { x: 26, y: 40, w: 40, h: 45 },
                        { x: 62, y: 126, w: 50, h: 50 },
                        { x: 215, y: 37, w: 47, h: 58 },
                        { x: 255, y: 140, w: 42, h: 48 }
                    ]
                },
                {
                    src: "21",
                    pos: [
                        { x: 0, y: 150, w: 95, h: 48 },
                        { x: 90, y: 0, w: 60, h: 48 },
                        { x: 92, y: 55, w: 46, h: 60 },
                        { x: 255, y: 12, w: 42, h: 85 }
                    ]
                },
                {
                    src: "23",
                    pos: [
                        { x: 0, y: 20, w: 100, h: 40 },
                        { x: 60, y: 67, w: 50, h: 60 },
                        { x: 220, y: 30, w: 75, h: 50 },
                        { x: 220, y: 115, w: 75, h: 60 }
                    ]
                },
                {
                    src: "26",
                    pos: [
                        { x: 0, y: 115, w: 43, h: 105 },
                        { x: 90, y: 112, w: 55, h: 32 },
                        { x: 180, y: 110, w: 48, h: 35 },
                        { x: 70, y: 165, w: 57, h: 42 }
                    ]
                },
                {
                    src: "29",
                    pos: [
                        { x: 90, y: 80, w: 46, h: 46 },
                        { x: 112, y: 32, w: 50, h: 45 },
                        { x: 170, y: 0, w: 120, h: 32 },
                        { x: 252, y: 120, w: 45, h: 50 }
                    ]
                },
                {
                    src: "34",
                    pos: [
                        { x: 0, y: 0, w: 46, h: 70 },
                        { x: 50, y: 65, w: 45, h: 42 },
                        { x: 175, y: 85, w: 55, h: 87 },
                        { x: 17, y: 163, w: 40, h: 38 }
                    ]
                }
            ]
        };
        
        this.currentLevel = 0;
        this.foundDifferences = 0;
        this.timeLeft = 60;
        this.timer = null;
        this.gameStarted = false;
        this.gameEnded = false;
        this.imgNumArr = [];
        this.currentImgIndex = 0;
        this.totalScore = 0;
        
        this.sounds = {
            success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
            wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
            click: new Audio('sounds/click-tap-computer-mouse-352734.mp3'),
            complete: new Audio('sounds/game-level-complete-143022.mp3')
        };
    }
    
    init() {
        this.showStartModal();
    }
    
    showStartModal() {
        const modal = document.createElement('div');
        modal.className = 'game-modal find-differences-modal';
        modal.innerHTML = `
            <div class="game-modal-content">
                <div class="game-modal-header">
                    <h2>🔍 מצא את ההבדלים</h2>
                    <button class="close-button" onclick="this.closest('.game-modal').remove(); document.documentElement.style.overflow = ''; document.body.style.overflow = '';">×</button>
                </div>
                <div class="game-modal-body">
                    <div class="game-info">
                        <p><strong>🎯 המטרה:</strong> מצא 4 הבדלים בין שתי התמונות</p>
                        <p><strong>⏰ זמן:</strong> 60 שניות לכל שלב</p>
                        <p><strong>🎮 שלבים:</strong> 10 שלבים מאתגרים</p>
                        <p><strong>⚠️ שים לב:</strong> כל טעות גוזלת 10 שניות!</p>
                    </div>
                    <div class="progress-info">
                        <div class="level-progress">
                            <span>שלב 1 מתוך 10</span>
                        </div>
                    </div>
                    <button class="start-btn" onclick="window.findDifferencesGame.startGame()">🚀 התחל משחק</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        // Store reference for access
        window.findDifferencesGame = this;
    }
    
    startGame() {
        // Close start modal
        const modal = document.querySelector('.find-differences-modal');
        if (modal) modal.remove();
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        
        // Reset game state
        this.currentLevel = 0;
        this.foundDifferences = 0;
        this.timeLeft = 60;
        this.gameStarted = true;
        this.gameEnded = false;
        this.totalScore = 0;
        
        // Initialize image array
        this.imgNumArr = [];
        for (let i = 0; i < this.gameData.count; i++) {
            this.imgNumArr.push(i);
        }
        
        this.createGameUI();
        this.loadLevel();
        this.startTimer();
        
        this.playSound('click');
    }
    
    createGameUI() {
        const gameContainer = document.createElement('div');
        gameContainer.className = 'find-differences-game';
        gameContainer.innerHTML = `
            <div class="game-header">
                <h2>🔍 מצא את ההבדלים</h2>
                <div class="game-stats">
                    <div class="timer-display">⏰ <span id="time-display">${this.timeLeft}</span></div>
                    <div class="differences-display">🎯 <span id="diff-display">${this.foundDifferences}</span>/4</div>
                </div>
            </div>
            
            <div class="stage-info">
                <span>שלב <span id="level-display">${this.currentLevel + 1}</span> מתוך ${this.gameData.count}</span>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${((this.currentLevel) / this.gameData.count) * 100}%"></div>
                </div>
            </div>
            
            <div class="images-container">
                <div class="image-wrapper">
                    <div class="image-title">תמונה ראשונה</div>
                    <div class="picture-container" id="top-picture">
                        <div class="click-layer" onclick="window.findDifferencesGame.wrongClick()"></div>
                    </div>
                </div>
                <div class="image-wrapper">
                    <div class="image-title">תמונה שנייה</div>
                    <div class="picture-container" id="bottom-picture">
                        <div class="click-layer" onclick="window.findDifferencesGame.wrongClick()"></div>
                    </div>
                </div>
            </div>
            
            <div class="game-instructions">
                לחץ על ההבדלים שאתה מוצא בין התמונות. שים לב - כל טעות גוזלת 10 שניות!
            </div>
        `;
        
        // Remove any existing game
        const existingGame = document.querySelector('.find-differences-game');
        if (existingGame) existingGame.remove();
        
        // Add to modal
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.appendChild(gameContainer);
        
        document.body.appendChild(modal);
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }
    
    loadLevel() {
        if (this.imgNumArr.length === 0) {
            this.gameComplete();
            return;
        }
        
        // Reset differences for new level
        this.foundDifferences = 0;
        this.updateUI();
        
        // Get random image
        const randomIndex = Math.floor(Math.random() * this.imgNumArr.length);
        this.currentImgIndex = this.imgNumArr[randomIndex];
        this.imgNumArr.splice(randomIndex, 1);
        
        const imgData = this.gameData.imgInfo[this.currentImgIndex];
        
        // Load images
        const topPicture = document.getElementById('top-picture');
        const bottomPicture = document.getElementById('bottom-picture');
        
        topPicture.innerHTML = `
            <img src="find-differences-images/${imgData.src}_a.jpg" alt="תמונה A">
            <div class="click-layer" onclick="window.findDifferencesGame.wrongClick()"></div>
        `;
        
        bottomPicture.innerHTML = `
            <img src="find-differences-images/${imgData.src}_b.jpg" alt="תמונה B">
            <div class="click-layer" onclick="window.findDifferencesGame.wrongClick()"></div>
        `;
        
        // Add difference areas
        imgData.pos.forEach((pos, index) => {
            const diffArea1 = this.createDifferenceArea(pos, index);
            const diffArea2 = this.createDifferenceArea(pos, index);
            
            topPicture.appendChild(diffArea1);
            bottomPicture.appendChild(diffArea2);
        });
    }
    
    createDifferenceArea(pos, index) {
        const diffArea = document.createElement('div');
        diffArea.className = 'difference-area';
        diffArea.dataset.index = index;
        diffArea.style.left = pos.x + 'px';
        diffArea.style.top = pos.y + 'px';
        diffArea.style.width = pos.w + 'px';
        diffArea.style.height = pos.h + 'px';
        
        diffArea.onclick = (e) => {
            e.stopPropagation();
            this.foundDifference(index);
        };
        
        return diffArea;
    }
    
    foundDifference(index) {
        if (this.gameEnded) return;
        
        // Mark all areas with this index as found
        const areas = document.querySelectorAll(`[data-index="${index}"]`);
        areas.forEach(area => {
            if (!area.classList.contains('found')) {
                area.classList.add('found');
                this.foundDifferences++;
            }
        });
        
        this.updateUI();
        this.playSound('success');
        
        // Check if level complete
        if (this.foundDifferences >= 4) {
            this.levelComplete();
        }
    }
    
    wrongClick() {
        if (this.gameEnded) return;
        
        this.timeLeft -= 10;
        if (this.timeLeft < 0) this.timeLeft = 0;
        
        this.updateUI();
        this.playSound('wrong');
        
        // Show wrong click effect
        this.showWrongEffect();
        
        if (this.timeLeft <= 0) {
            this.gameOver();
        }
    }
    
    showWrongEffect() {
        const effect = document.createElement('div');
        effect.className = 'wrong-click-effect';
        effect.textContent = '-10 שניות!';
        
        const gameContainer = document.querySelector('.find-differences-game');
        if (gameContainer) {
            gameContainer.appendChild(effect);
            
            setTimeout(() => {
                if (effect.parentNode) {
                    effect.parentNode.removeChild(effect);
                }
            }, 2000);
        }
    }
    
    levelComplete() {
        this.currentLevel++;
        this.totalScore += this.timeLeft + 20; // Bonus for completion
        
        if (this.currentLevel >= this.gameData.count) {
            this.gameComplete();
            return;
        }
        
        this.playSound('complete');
        
        // Show level complete modal
        const modal = document.createElement('div');
        modal.className = 'game-modal level-complete';
        modal.innerHTML = `
            <div class="game-modal-content">
                <div class="game-modal-header">
                    <h2>🎉 שלב הושלם!</h2>
                </div>
                <div class="game-modal-body">
                    <div class="success-animation">🎯</div>
                    <p><strong>מצוין!</strong> מצאת את כל ההבדלים!</p>
                    <p>זמן שנותר: ${this.timeLeft} שניות</p>
                    <p>ניקוד השלב: ${this.timeLeft + 20}</p>
                    <p>שלב ${this.currentLevel + 1} מתוך ${this.gameData.count}</p>
                    <button class="next-btn" onclick="window.findDifferencesGame.nextLevel()">➡️ שלב הבא</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    nextLevel() {
        // Close level complete modal
        const modal = document.querySelector('.level-complete');
        if (modal) modal.remove();
        
        // Reset timer for next level
        this.timeLeft = 60;
        this.loadLevel();
        this.startTimer();
    }
    
    gameComplete() {
        this.gameEnded = true;
        this.stopTimer();
        this.playSound('complete');
        
        const modal = document.createElement('div');
        modal.className = 'game-modal game-complete';
        modal.innerHTML = `
            <div class="game-modal-content">
                <div class="game-modal-header">
                    <h2>🏆 משחק הושלם!</h2>
                </div>
                <div class="game-modal-body">
                    <div class="success-animation">🎊</div>
                    <p><strong>כל הכבוד!</strong> השלמת את כל השלבים!</p>
                    <div class="final-score">
                        <p>הניקוד הסופי שלך: <strong>${this.totalScore}</strong></p>
                    </div>
                    <div class="action-buttons">
                        <button class="play-again-btn" onclick="window.findDifferencesGame.playAgain()">🔄 שחק שוב</button>
                        <button class="back-btn" onclick="window.findDifferencesGame.backToMenu()">🏠 חזור לתפריט</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove game UI
        const gameModal = document.querySelector('.game-modal:not(.game-complete)');
        if (gameModal) gameModal.remove();
        
        document.body.appendChild(modal);
    }
    
    gameOver() {
        this.gameEnded = true;
        this.stopTimer();
        this.playSound('wrong');
        
        const modal = document.createElement('div');
        modal.className = 'game-modal game-over';
        modal.innerHTML = `
            <div class="game-modal-content">
                <div class="game-modal-header">
                    <h2>⏰ נגמר הזמן!</h2>
                </div>
                <div class="game-modal-body">
                    <div class="game-over-animation">😔</div>
                    <p>הזמן נגמר! הגעת לשלב ${this.currentLevel + 1}</p>
                    <p>הניקוד שלך: <strong>${this.totalScore}</strong></p>
                    <div class="action-buttons">
                        <button class="try-again-btn" onclick="window.findDifferencesGame.playAgain()">🔄 נסה שוב</button>
                        <button class="back-btn" onclick="window.findDifferencesGame.backToMenu()">🏠 חזור לתפריט</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove game UI
        const gameModal = document.querySelector('.game-modal:not(.game-over)');
        if (gameModal) gameModal.remove();
        
        document.body.appendChild(modal);
    }
    
    playAgain() {
        // Remove all modals
        document.querySelectorAll('.game-modal').forEach(modal => modal.remove());
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        
        // Restart game
        this.init();
    }
    
    backToMenu() {
        // Remove all modals
        document.querySelectorAll('.game-modal').forEach(modal => modal.remove());
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        
        // Return to game selection
        if (typeof showGameSelection === 'function') {
            showGameSelection();
        }
    }
    
    startTimer() {
        this.stopTimer();
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateUI();
            
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    updateUI() {
        const timeDisplay = document.getElementById('time-display');
        const diffDisplay = document.getElementById('diff-display');
        const levelDisplay = document.getElementById('level-display');
        const progressBar = document.querySelector('.progress-bar');
        
        if (timeDisplay) timeDisplay.textContent = this.timeLeft;
        if (diffDisplay) diffDisplay.textContent = this.foundDifferences;
        if (levelDisplay) levelDisplay.textContent = this.currentLevel + 1;
        if (progressBar) {
            progressBar.style.width = ((this.currentLevel) / this.gameData.count) * 100 + '%';
        }
    }
    
    playSound(soundName) {
        if (window.__globalMute) return;
        
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(e => console.log('Could not play sound:', e));
            }
        } catch (e) {
            console.log('Sound error:', e);
        }
    }
}

// Initialize game when called
function startFindDifferences() {
    const game = new FindDifferencesGame();
    game.init();
}
