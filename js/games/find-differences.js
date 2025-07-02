// משחק מצא את ההבדלים - מבוסס על Prabhatyadav60
class FindDifferencesGame {
    constructor() {
        this.gameContainer = null;
        this.foundDifferences = 0;
        this.totalDifferences = 5;
        this.gameActive = true;
        this.startTime = null;
        this.score = 0;
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
            <div class="find-differences-container">
                <div class="game-header">
                    <h2>🔍 מצא את ההבדלים</h2>
                    <div class="game-info">
                        <span>נמצאו: <span id="found-count">0</span>/${this.totalDifferences}</span>
                        <span>זמן: <span id="timer">00:00</span></span>
                        <span>ניקוד: <span id="score">0</span></span>
                    </div>
                </div>
                
                <div class="game-instructions">
                    <p>👆 לחץ על האובייקטים בתמונה הראשונה שחסרים בתמונה השנייה</p>
                </div>

                <div class="images-container">
                    <div class="image-wrapper">
                        <h3>תמונה 1 (מצא בה את ההבדלים)</h3>
                        <div id="parent-real" class="image-container">
                            <div id="diff1" class="difference-spot" data-diff="1"></div>
                            <div id="diff2" class="difference-spot" data-diff="2"></div>
                            <div id="diff3" class="difference-spot" data-diff="3"></div>
                            <div id="diff4" class="difference-spot" data-diff="4"></div>
                            <div id="diff5" class="difference-spot" data-diff="5"></div>
                        </div>
                    </div>
                    
                    <div class="image-wrapper">
                        <h3>תמונה 2 (תמונת השוואה)</h3>
                        <div id="parent-unreal" class="image-container comparison"></div>
                    </div>
                </div>

                <div class="game-controls">
                    <button id="hint-btn" class="hint-button">💡 רמז</button>
                    <button id="restart-btn" class="restart-button">🔄 התחל מחדש</button>
                    <button id="back-btn" class="back-button">🏠 חזור לתפריט</button>
                </div>

                <div id="hint-area" class="hint-area" style="display: none;">
                    <h4>רמזים:</h4>
                    <p id="hint-text">טוען רמזים...</p>
                </div>
            </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.gameContainer = modal;
    }

    setupEventListeners() {
        // הוספת מאזינים לנקודות ההבדל
        for (let i = 1; i <= this.totalDifferences; i++) {
            const diffSpot = document.getElementById(`diff${i}`);
            if (diffSpot) {
                diffSpot.addEventListener('click', (e) => this.handleDifferenceClick(e, i));
            }
        }

        // כפתור רמז
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        
        // כפתור התחלה מחדש
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        
        // כפתור חזרה
        document.getElementById('back-btn').addEventListener('click', () => this.backToMenu());
    }

    handleDifferenceClick(event, diffNumber) {
        if (!this.gameActive) return;

        const clickedSpot = event.target;
        
        // בדיקה אם כבר נמצא
        if (clickedSpot.classList.contains('found')) {
            this.playSound('click');
            return;
        }

        // סימון כנמצא
        clickedSpot.classList.add('found');
        this.foundDifferences++;
        this.score += 20;

        // עדכון תצוגה
        this.updateGameInfo();
        
        // אפקט ויזואלי
        this.showFoundEffect(clickedSpot, diffNumber);
        
        // צליל הצלחה
        this.playSound('success');

        // בדיקת סיום המשחק
        if (this.foundDifferences >= this.totalDifferences) {
            this.completeGame();
        }
    }

    showFoundEffect(element, diffNumber) {
        // יצירת אפקט ויזואלי
        element.innerHTML = `<div class="found-marker">✓</div>`;
        element.style.animation = 'foundAnimation 0.6s ease-in-out';
        
        // הודעת עידוד
        const messages = [
            'מעולה! מצאת הבדל!',
            'כל הכבוד! ממשיך טוב!',
            'נהדר! עין חדה!',
            'וואו! אתה מקצוע!',
            'פנטסטי! סיימת!'
        ];
        
        this.showMessage(messages[diffNumber - 1] || 'נמצא!', 'success');
    }

    showHint() {
        const hintArea = document.getElementById('hint-area');
        const hintText = document.getElementById('hint-text');
        
        hintArea.style.display = 'block';
        hintText.innerHTML = 'טוען רמזים...';
        
        setTimeout(() => {
            hintText.innerHTML = `
                <div class="hints-list">
                    <div>1️⃣ תולעת אדמה 🪱 ליד הדשא</div>
                    <div>2️⃣ זנב של השועל 🦊</div>
                    <div>3️⃣ ענף של עץ 🌴 מאחורי השועל</div>
                    <div>4️⃣ דמעה/זיעה על פני השועל</div>
                    <div>5️⃣ צבע האוזן השמאלית של השועל</div>
                </div>
            `;
        }, 1000);
        
        this.playSound('click');
    }

    startGame() {
        this.startTime = Date.now();
        this.gameActive = true;
        this.foundDifferences = 0;
        this.score = 0;
        
        // התחלת טיימר
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);

        this.updateGameInfo();
        this.playSound('click');
    }

    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateGameInfo() {
        document.getElementById('found-count').textContent = this.foundDifferences;
        document.getElementById('score').textContent = this.score;
    }

    completeGame() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const timeBonus = Math.max(0, 300 - elapsed); // בונוס זמן
        this.score += timeBonus;
        
        this.updateGameInfo();
        this.playSound('complete');
        
        setTimeout(() => {
            this.showCompletionModal(elapsed);
        }, 1000);
    }

    showCompletionModal(timeElapsed) {
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const modal = document.createElement('div');
        modal.className = 'completion-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 כל הכבוד!</h2>
                <p>מצאת את כל ההבדלים!</p>
                <div class="completion-stats">
                    <div>⏱️ זמן: ${timeStr}</div>
                    <div>🏆 ניקוד: ${this.score}</div>
                    <div>✅ הבדלים: ${this.foundDifferences}/${this.totalDifferences}</div>
                </div>
                <div class="modal-buttons">
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); findDifferencesGame.restartGame();" class="btn-primary">
                        🔄 שחק שוב
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); findDifferencesGame.backToMenu();" class="btn-secondary">
                        🏠 תפריט ראשי
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    restartGame() {
        // איפוס המשחק
        clearInterval(this.timerInterval);
        this.foundDifferences = 0;
        this.score = 0;
        this.gameActive = true;
        
        // איפוס נקודות ההבדל
        for (let i = 1; i <= this.totalDifferences; i++) {
            const diffSpot = document.getElementById(`diff${i}`);
            if (diffSpot) {
                diffSpot.classList.remove('found');
                diffSpot.innerHTML = '';
                diffSpot.style.animation = '';
            }
        }
        
        // הסתרת רמזים
        document.getElementById('hint-area').style.display = 'none';
        
        // התחלה מחדש
        this.startGame();
        
        this.showMessage('המשחק התחיל מחדש!', 'info');
    }

    backToMenu() {
        clearInterval(this.timerInterval);
        this.gameActive = false;
        
        // הסרת מודלים
        const modals = document.querySelectorAll('.completion-modal');
        modals.forEach(modal => modal.remove());
        
        // הסרת המשחק
        if (this.gameContainer) {
            this.gameContainer.remove();
        }
        
        this.playSound('click');
    }

    showMessage(text, type = 'info') {
        // הצגת הודעה זמנית
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = text;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.classList.add('fade-out');
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 2000);
    }

    playSound(type) {
        const sounds = {
            'click': 'sounds/click-tap-computer-mouse-352734.mp3',
            'success': 'sounds/success-340660 (mp3cut.net).mp3',
            'complete': 'sounds/game-level-complete-143022.mp3',
            'wrong': 'sounds/wrong-47985 (mp3cut.net).mp3'
        };

        if (sounds[type]) {
            const audio = new Audio(sounds[type]);
            audio.volume = 0.5;
            audio.play().catch(e => console.log('שגיאה בהשמעת צליל:', e));
        }
    }
}

// משתנה גלובלי למשחק
let findDifferencesGame;

// פונקציה להפעלת המשחק
function startFindDifferences() {
    findDifferencesGame = new FindDifferencesGame();
    findDifferencesGame.init();
} 