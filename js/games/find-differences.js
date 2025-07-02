// משחק מצא את ההבדלים
class FindDifferencesGame {
    constructor() {
        this.gameStarted = false;
        this.completed = false;
        this.score = 0;
        this.foundDifferences = 0;
        this.totalDifferences = 5;
        this.startTime = null;
        this.gameTime = 0;
        
        // צלילים
        this.sounds = {
            success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
            wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
            click: new Audio('sounds/click-tap-computer-mouse-352734.mp3'),
            complete: new Audio('sounds/game-level-complete-143022.mp3')
        };
        
        // רשימת ההבדלים
        this.differences = [
            { id: 'leaf', name: 'עלה', shape: 'circle', coords: '133,280,11', found: false },
            { id: 'light', name: 'אור', shape: 'rect', coords: '253,2,292,24', found: false },
            { id: 'nolight', name: 'אין אור', shape: 'rect', coords: '273,151,293,182', found: false },
            { id: 'sauce', name: 'רוטב', shape: 'circle', coords: '368,385,7', found: false },
            { id: 'petal', name: 'עלה כותרת', shape: 'rect', coords: '261,375,281,403', found: false }
        ];
    }

    start() {
        this.gameStarted = false;
        this.completed = false;
        this.score = 0;
        this.foundDifferences = 0;
        this.startTime = null;
        this.gameTime = 0;
        
        // איפוס רשימת ההבדלים
        this.differences.forEach(diff => diff.found = false);
        
        this.showStartScreen();
    }

    showStartScreen() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <div class="find-diff-start-screen">
                <div class="find-diff-start-content">
                    <h1>🔍 מצא את ההבדלים</h1>
                    <p>מצא את 5 ההבדלים בין שתי התמונות</p>
                    <p>לחץ על ההבדלים בתמונה הימנית</p>
                    <button id="find-diff-start-btn" class="find-diff-start-button">
                        התחל לשחק
                    </button>
                </div>
            </div>
        `;

        document.getElementById('find-diff-start-btn').addEventListener('click', () => {
            this.sounds.click.play();
            this.startGame();
        });
    }

    startGame() {
        this.gameStarted = true;
        this.startTime = new Date().getTime();
        this.showGameBoard();
    }

    showGameBoard() {
        const gameArea = document.getElementById('game-area');
        
        gameArea.innerHTML = `
            <div class="find-diff-game">
                <div class="find-diff-header">
                    <div class="find-diff-info">
                        <span>נמצאו: ${this.foundDifferences}/${this.totalDifferences}</span>
                    </div>
                    <div class="find-diff-score">
                        <span>ניקוד: ${this.score}</span>
                    </div>
                    <div class="find-diff-timer">
                        <span id="game-timer">00:00</span>
                    </div>
                </div>
                
                <div class="find-diff-title">
                    <h2>מצא את 5 ההבדלים</h2>
                    <p>לחץ על ההבדלים בתמונה הימנית</p>
                </div>

                <div class="find-diff-game-container">
                    <div class="find-diff-images">
                        <div class="find-diff-image-wrapper">
                            <h3>תמונה מקורית</h3>
                            <div class="find-diff-original">
                                <img src="find-differences-images/HD_PhotoHunt_Before_0001_sm.jpg" alt="תמונה מקורית">
                            </div>
                        </div>
                        
                        <div class="find-diff-image-wrapper">
                            <h3>מצא את ההבדלים</h3>
                            <div class="find-diff-different">
                                <img src="find-differences-images/HD_PhotoHunt_After_0001_sm.jpg" alt="תמונה עם הבדלים">
                                
                                <div id="leaf-diff" class="find-diff-overlay" style="display: none;">
                                    <img src="find-differences-images/leaf.png" alt="עלה">
                                </div>
                                <div id="light-diff" class="find-diff-overlay" style="display: none;">
                                    <img src="find-differences-images/light.png" alt="אור">
                                </div>
                                <div id="nolight-diff" class="find-diff-overlay" style="display: none;">
                                    <img src="find-differences-images/nolight.png" alt="אין אור">
                                </div>
                                <div id="sauce-diff" class="find-diff-overlay" style="display: none;">
                                    <img src="find-differences-images/sauce.png" alt="רוטב">
                                </div>
                                <div id="petal-diff" class="find-diff-overlay" style="display: none;">
                                    <img src="find-differences-images/petal.png" alt="עלה כותרת">
                                </div>
                                
                                <img class="find-diff-transparent-map" src="find-differences-images/transparentmap.png" usemap="#photohunt" alt="מפת הבדלים">
                                <map name="photohunt">
                                    <area id="leaf" shape="circle" coords="133,280,11" alt="עלה" title="עלה">
                                    <area id="light" shape="rect" coords="253,2,292,24" alt="אור" title="אור">
                                    <area id="nolight" shape="rect" coords="273,151,293,182" alt="אין אור" title="אין אור">
                                    <area id="sauce" shape="circle" coords="368,385,7" alt="רוטב" title="רוטב">
                                    <area id="petal" shape="rect" coords="261,375,281,403" alt="עלה כותרת" title="עלה כותרת">
                                </map>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="find-diff-progress">
                    <div class="find-diff-progress-bar">
                        <div class="find-diff-progress-fill" style="width: 0%"></div>
                    </div>
                    <p>התקדמות: 0 מתוך 5 הבדלים</p>
                </div>

                <div class="find-diff-controls">
                    <button id="find-diff-hint-btn" class="find-diff-button hint-btn">💡 רמז</button>
                    <button id="find-diff-restart-btn" class="find-diff-button restart-btn">🔄 התחל מחדש</button>
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.startTimer();
    }

    attachEventListeners() {
        // מאזינים לאזורי ההבדלים
        this.differences.forEach(diff => {
            const area = document.getElementById(diff.id);
            if (area) {
                area.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleDifferenceClick(diff.id);
                });
            }
        });

        // כפתור רמז
        const hintBtn = document.getElementById('find-diff-hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                this.showHint();
            });
        }

        // כפתור התחל מחדש
        const restartBtn = document.getElementById('find-diff-restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.sounds.click.play();
                this.start();
            });
        }

        // לחיצה שגויה על התמונה
        const differentImage = document.querySelector('.find-diff-different');
        if (differentImage) {
            differentImage.addEventListener('click', (e) => {
                if (e.target.tagName !== 'AREA') {
                    this.handleWrongClick(e);
                }
            });
        }
    }

    handleDifferenceClick(differenceId) {
        const difference = this.differences.find(d => d.id === differenceId);
        
        if (!difference || difference.found) {
            return;
        }

        // סמן כנמצא
        difference.found = true;
        this.foundDifferences++;
        this.score += 100;

        // הצג את ההבדל
        const overlay = document.getElementById(differenceId + '-diff');
        if (overlay) {
            overlay.style.display = 'block';
            overlay.classList.add('found-animation');
        }

        // נגן צליל הצלחה
        this.sounds.success.play();

        // עדכן את הממשק
        this.updateUI();

        // בדוק אם סיימנו
        if (this.foundDifferences >= this.totalDifferences) {
            setTimeout(() => {
                this.completeGame();
            }, 1000);
        }
    }

    handleWrongClick(event) {
        this.sounds.wrong.play();
        
        // יצירת אפקט X אדום במקום הלחיצה
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const wrongMark = document.createElement('div');
        wrongMark.className = 'find-diff-wrong-mark';
        wrongMark.style.left = x + 'px';
        wrongMark.style.top = y + 'px';
        wrongMark.innerHTML = '❌';
        
        event.currentTarget.appendChild(wrongMark);
        
        setTimeout(() => {
            if (wrongMark.parentNode) {
                wrongMark.parentNode.removeChild(wrongMark);
            }
        }, 1000);

        // הפחת ניקוד
        this.score = Math.max(0, this.score - 10);
        this.updateUI();
    }

    showHint() {
        this.sounds.click.play();
        
        // מצא הבדל שעוד לא נמצא
        const unFoundDifference = this.differences.find(d => !d.found);
        
        if (unFoundDifference) {
            const area = document.getElementById(unFoundDifference.id);
            if (area) {
                // הוסף אפקט הבהוב
                area.classList.add('find-diff-hint-flash');
                
                setTimeout(() => {
                    area.classList.remove('find-diff-hint-flash');
                }, 2000);
                
                // הפחת ניקוד עבור השימוש ברמז
                this.score = Math.max(0, this.score - 25);
                this.updateUI();
            }
        }
    }

    updateUI() {
        // עדכן ניקוד
        const scoreElement = document.querySelector('.find-diff-score span');
        if (scoreElement) {
            scoreElement.textContent = 'ניקוד: ' + this.score;
        }

        // עדכן התקדמות
        const infoElement = document.querySelector('.find-diff-info span');
        if (infoElement) {
            infoElement.textContent = 'נמצאו: ' + this.foundDifferences + '/' + this.totalDifferences;
        }

        // עדכן פס התקדמות
        const progressFill = document.querySelector('.find-diff-progress-fill');
        if (progressFill) {
            progressFill.style.width = ((this.foundDifferences / this.totalDifferences) * 100) + '%';
        }

        const progressText = document.querySelector('.find-diff-progress p');
        if (progressText) {
            progressText.textContent = 'התקדמות: ' + this.foundDifferences + ' מתוך ' + this.totalDifferences + ' הבדלים';
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.gameStarted && !this.completed) {
                this.gameTime = new Date().getTime() - this.startTime;
                const minutes = Math.floor(this.gameTime / 60000);
                const seconds = Math.floor((this.gameTime % 60000) / 1000);
                
                const timerElement = document.getElementById('game-timer');
                if (timerElement) {
                    timerElement.textContent = 
                        (minutes < 10 ? '0' : '') + minutes + ':' + 
                        (seconds < 10 ? '0' : '') + seconds;
                }
            }
        }, 1000);
    }

    completeGame() {
        this.completed = true;
        this.gameStarted = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // בונוס זמן
        const timeBonus = Math.max(0, 300 - Math.floor(this.gameTime / 1000)) * 2;
        this.score += timeBonus;

        this.sounds.complete.play();
        
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <div class="find-diff-complete">
                <div class="find-diff-complete-content">
                    <h1>🎉 כל הכבוד!</h1>
                    <h2>מצאת את כל ההבדלים!</h2>
                    
                    <div class="find-diff-stats">
                        <div class="stat-item">
                            <span class="stat-label">זמן:</span>
                            <span class="stat-value">${Math.floor(this.gameTime / 60000)}:${(Math.floor((this.gameTime % 60000) / 1000) < 10 ? '0' : '')}${Math.floor((this.gameTime % 60000) / 1000)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">הבדלים:</span>
                            <span class="stat-value">${this.foundDifferences}/${this.totalDifferences}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">בונוס זמן:</span>
                            <span class="stat-value">+${timeBonus}</span>
                        </div>
                    </div>
                    
                    <div class="find-diff-final-score">
                        <p>הניקוד הסופי שלך:</p>
                        <div class="find-diff-score-display">${this.score}</div>
                    </div>
                    
                    <div class="find-diff-complete-buttons">
                        <button id="find-diff-play-again-btn" class="find-diff-button">
                            שחק שוב
                        </button>
                        <button id="find-diff-home-btn" class="find-diff-button">
                            חזור לתפריט
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('find-diff-play-again-btn').addEventListener('click', () => {
            this.sounds.click.play();
            this.start();
        });

        document.getElementById('find-diff-home-btn').addEventListener('click', () => {
            this.sounds.click.play();
            if (window.app) {
                window.app.showCategories(window.app.currentAge);
            } else {
                window.location.reload();
            }
        });
    }

    stop() {
        this.gameStarted = false;
        this.completed = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}

// משתנה גלובלי למשחק
window.findDifferencesGame = null;

// פונקציה להתחלת המשחק
window.startFindDifferences = function() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) {
        console.error('game-area element not found');
        return;
    }
    
    // הסתר את כל החלקים האחרים
    const ageSelector = document.getElementById('ageSelector');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const gamesContainer = document.getElementById('gamesContainer');
    
    if (ageSelector) ageSelector.style.display = 'none';
    if (categoriesContainer) categoriesContainer.style.display = 'none';
    if (gamesContainer) gamesContainer.style.display = 'none';
    
    // הצג את אזור המשחק
    gameArea.style.display = 'block';
    gameArea.className = 'game-active find-differences-active';
    
    window.findDifferencesGame = new FindDifferencesGame();
    window.findDifferencesGame.start();
}; 