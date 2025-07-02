class FindDifferencesGame {
    constructor() {
        this.gameContainer = null;
        this.differencesFound = 0;
        this.totalDifferences = 5;
        this.score = 0;
        this.timeLeft = 120; // 2 minutes
        this.gameTimer = null;
        this.gameStarted = false;
        this.soundEnabled = true;
        
        // Sound effects
        this.sounds = {
            success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
            wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
            complete: new Audio('sounds/game-level-complete-143022.mp3'),
            click: new Audio('sounds/click-tap-computer-mouse-352734.mp3')
        };
        
        // Set sound volumes
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.5;
            sound.preload = 'auto';
        });
        
        this.differences = [
            { id: 'diff1', x: 60, y: 154, width: 25, height: 26, hint: 'תולעת אדמה ליד הדשא' },
            { id: 'diff2', x: 13, y: 162, width: 45, height: 37, hint: 'זנב השועל' },
            { id: 'diff3', x: 199, y: 50, width: 62, height: 41, hint: 'ענף עץ מאחורי השועל' },
            { id: 'diff4', x: 190, y: 51, width: 46, height: 32, hint: 'דמעה/זיעה על פני השועל' },
            { id: 'diff5', x: 66, y: 122, width: 37, height: 49, hint: 'צבע האוזן השמאלית של השועל' }
        ];
    }
    
    init() {
        this.createGameHTML();
        this.setupEventListeners();
        this.startGame();
    }
    
    createGameHTML() {
        this.gameContainer = document.createElement('div');
        this.gameContainer.className = 'find-differences-game';
        this.gameContainer.innerHTML = `
            <div class="game-header">
                <h2>🔍 מצא את ההבדלים</h2>
                <div class="game-info">
                    <div class="info-item">
                        <span class="label">נמצאו:</span>
                        <span id="found-count">${this.differencesFound}</span>/<span id="total-count">${this.totalDifferences}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">זמן:</span>
                        <span id="time-left">${this.formatTime(this.timeLeft)}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">ניקוד:</span>
                        <span id="score">${this.score}</span>
                    </div>
                </div>
            </div>
            
            <div class="game-instructions">
                <p>👆 לחץ על האובייקטים בתמונה הראשונה (מצא את ההבדלים) שחסרים בתמונה השנייה</p>
            </div>
            
            <div class="images-container">
                <div class="image-wrapper">
                    <h3>תמונה 1 (מצא בה את ההבדלים)</h3>
                    <div class="image-container" id="image1">
                        <img src="find-differences-images/unreal.jpg" alt="תמונה עם הבדלים">
                        <div class="differences-overlay" id="differences-overlay"></div>
                    </div>
                </div>
                
                <div class="image-wrapper">
                    <h3>תמונה 2 (תמונה השוואה)</h3>
                    <div class="image-container" id="image2">
                        <img src="find-differences-images/Real.jpg" alt="תמונה השוואה">
                    </div>
                </div>
            </div>
            
            <div class="game-controls">
                <button class="btn hint-btn" id="hint-btn">💡 רמז</button>
                <button class="btn restart-btn" id="restart-btn">🔄 התחל מחדש</button>
                <button class="btn sound-btn" id="sound-btn">🔊 צליל</button>
            </div>
            
            <div class="hint-display" id="hint-display"></div>
            
            <div class="game-footer">
                <p>מצא את 5 ההבדלים בין התמונות!</p>
            </div>
        `;
        
        // Add to modal
        let modal = document.getElementById('game-modal');
        if (!modal) {
            showModal(); // Create modal if it doesn't exist
            modal = document.getElementById('game-modal');
        }
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = '';
            modalBody.appendChild(this.gameContainer);
        }
        
        // Create differences clickable areas
        this.createDifferencesAreas();
    }
    
    createDifferencesAreas() {
        const overlay = document.getElementById('differences-overlay');
        
        this.differences.forEach((diff, index) => {
            const area = document.createElement('div');
            area.className = 'difference-area';
            area.id = diff.id;
            area.style.cssText = `
                position: absolute;
                left: ${diff.x}px;
                top: ${diff.y}px;
                width: ${diff.width}px;
                height: ${diff.height}px;
                cursor: pointer;
                z-index: 10;
            `;
            
            area.addEventListener('click', () => this.handleDifferenceClick(diff, area));
            overlay.appendChild(area);
        });
    }
    
    setupEventListeners() {
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('sound-btn').addEventListener('click', () => this.toggleSound());
    }
    
    startGame() {
        this.gameStarted = true;
        this.startTimer();
    }
    
    startTimer() {
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('time-left').textContent = this.formatTime(this.timeLeft);
            
            if (this.timeLeft <= 0) {
                this.endGame(false);
            }
        }, 1000);
    }
    
    handleDifferenceClick(diff, area) {
        if (!this.gameStarted) return;
        
        // Play click sound
        this.playSound('click');
        
        // Mark as found
        area.classList.add('found');
        area.style.cssText += `
            background-color: rgba(0, 255, 0, 0.3);
            border: 2px solid #00ff00;
            border-radius: 50%;
            pointer-events: none;
        `;
        
        // Add found animation
        area.classList.add('found-animation');
        
        this.differencesFound++;
        this.score += 20; // 20 points per difference
        
        // Update display
        document.getElementById('found-count').textContent = this.differencesFound;
        document.getElementById('score').textContent = this.score;
        
        // Play success sound
        this.playSound('success');
        
        // Show success message
        this.showMessage(`מעולה! מצאת: ${diff.hint}`, 'success');
        
        // Check if game completed
        if (this.differencesFound >= this.totalDifferences) {
            setTimeout(() => this.endGame(true), 500);
        }
    }
    
    showHint() {
        const hintDisplay = document.getElementById('hint-display');
        const remainingDiffs = this.differences.filter(diff => 
            !document.getElementById(diff.id).classList.contains('found')
        );
        
        if (remainingDiffs.length > 0) {
            const randomDiff = remainingDiffs[Math.floor(Math.random() * remainingDiffs.length)];
            hintDisplay.innerHTML = `
                <div class="hint-message">
                    💡 רמז: ${randomDiff.hint}
                </div>
            `;
            hintDisplay.style.display = 'block';
            
            // Hide hint after 5 seconds
            setTimeout(() => {
                hintDisplay.style.display = 'none';
            }, 5000);
        }
    }
    
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1000;
            animation: messageSlideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'messageSlideOut 0.3s ease-in';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 2000);
    }
    
    endGame(won) {
        this.gameStarted = false;
        clearInterval(this.gameTimer);
        
        if (won) {
            // Add time bonus
            this.score += this.timeLeft;
            this.playSound('complete');
            
            this.showEndModal(
                '🎉 כל הכבוד!',
                `מצאת את כל ההבדלים!<br>
                 ניקוד סופי: ${this.score}<br>
                 זמן שנותר: ${this.formatTime(this.timeLeft)}`
            );
        } else {
            this.showEndModal(
                '⏰ הזמן נגמר!',
                `מצאת ${this.differencesFound} מתוך ${this.totalDifferences} הבדלים<br>
                 ניקוד: ${this.score}<br>
                 נסה שוב!`
            );
        }
    }
    
    showEndModal(title, message) {
        const endModal = document.createElement('div');
        endModal.className = 'game-end-modal';
        endModal.innerHTML = `
            <div class="end-modal-content">
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="end-modal-buttons">
                    <button class="btn primary" onclick="this.parentElement.parentElement.parentElement.remove(); startFindDifferences();">שחק שוב</button>
                    <button class="btn secondary" onclick="this.parentElement.parentElement.parentElement.remove(); closeModal();">סגור</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(endModal);
    }
    
    restartGame() {
        this.differencesFound = 0;
        this.score = 0;
        this.timeLeft = 120;
        this.gameStarted = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        // Reset UI
        document.getElementById('found-count').textContent = this.differencesFound;
        document.getElementById('score').textContent = this.score;
        document.getElementById('time-left').textContent = this.formatTime(this.timeLeft);
        
        // Reset differences
        this.differences.forEach(diff => {
            const area = document.getElementById(diff.id);
            if (area) {
                area.classList.remove('found', 'found-animation');
                area.style.cssText = `
                    position: absolute;
                    left: ${diff.x}px;
                    top: ${diff.y}px;
                    width: ${diff.width}px;
                    height: ${diff.height}px;
                    cursor: pointer;
                    z-index: 10;
                `;
                area.style.pointerEvents = 'auto';
            }
        });
        
        // Hide hint
        document.getElementById('hint-display').style.display = 'none';
        
        this.startGame();
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('sound-btn');
        soundBtn.textContent = this.soundEnabled ? '🔊 צליל' : '🔇 צליל';
    }
    
    playSound(soundName) {
        if (this.soundEnabled && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Global functions for modal management
function showModal() {
    const modal = document.getElementById('game-modal');
    if (!modal) {
        // Create modal if it doesn't exist
        const newModal = document.createElement('div');
        newModal.id = 'game-modal';
        newModal.className = 'game-modal';
        newModal.innerHTML = `
            <div class="game-modal-content">
                <button class="close-button" onclick="closeModal()">×</button>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(newModal);
    }
    document.getElementById('game-modal').style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('game-modal');
    if (modal) {
        modal.style.display = 'none';
        // Clean up the modal content
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = '';
        }
    }
}

// Global function to start the game
function startFindDifferences() {
    const game = new FindDifferencesGame();
    game.init();
    showModal();
}

// Make sure the functions are available globally
window.startFindDifferences = startFindDifferences;
window.showModal = showModal;
window.closeModal = closeModal;