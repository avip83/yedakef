// משחק מצא את ההבדלים - גרסה אמיתית עם תמונות ההבדלים
function startFindDifferences() {
    console.log('Starting Find Differences Game - Real Version');
    
    // יצירת מודל המשחק
    createGameModal();
}

function createGameModal() {
    // הסרת מודל קיים אם יש
    const existingModal = document.querySelector('.find-differences-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // יצירת מודל חדש
    const modal = document.createElement('div');
    modal.className = 'find-differences-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🔍 מצא את ההבדלים</h2>
                <button class="close-btn" onclick="closeFindDifferences()">×</button>
            </div>
            <div class="game-info">
                <div class="score">נקודות: <span id="score">0</span></div>
                <div class="found">נמצאו: <span id="found">0</span>/5</div>
                <div class="timer">זמן: <span id="timer">120</span></div>
            </div>
            <div class="game-container">
                <div class="images-container">
                    <div class="image-wrapper">
                        <h3>תמונה ראשונה</h3>
                        <div class="image-box" id="image1">
                            <img src="find-differences-images/image1.jpg" alt="תמונה ראשונה">
                        </div>
                    </div>
                    <div class="image-wrapper">
                        <h3>תמונה שנייה - מצא את ההבדלים!</h3>
                        <div class="image-box" id="image2">
                            <img src="find-differences-images/image2.jpg" alt="תמונה שנייה" usemap="#photohunt">
                            
                            <!-- Image map עם קואורדינטות ההבדלים המדויקות -->
                            <map name="photohunt">
                                <area id="leaf" shape="circle" coords="133, 280, 11" title="הבדל 1 - עלה" />
                                <area id="light" shape="rect" coords="253, 2, 292, 24" title="הבדל 2 - אור" />
                                <area id="nolight" shape="rect" coords="273, 151, 293, 182" title="הבדל 3 - אור נעדר" />
                                <area id="sauce" shape="circle" coords="368, 385, 7" title="הבדל 4 - רוטב" />
                                <area id="petal" shape="rect" coords="261, 375, 281, 403" title="הבדל 5 - עלה כותרת" />
                            </map>
                            
                            <!-- תמונות ההבדלים שיופיעו כשנמצאו -->
                            <div id="leaf-diff" class="difference-found" style="display: none; position: absolute; top: 269px; left: 122px;">
                                <img src="find-differences-images/leaf.png" alt="עלה">
                            </div>
                            <div id="light-diff" class="difference-found" style="display: none; position: absolute; top: 2px; left: 253px;">
                                <img src="find-differences-images/light.png" alt="אור">
                            </div>
                            <div id="nolight-diff" class="difference-found" style="display: none; position: absolute; top: 151px; left: 273px;">
                                <img src="find-differences-images/nolight.png" alt="אור נעדר">
                            </div>
                            <div id="sauce-diff" class="difference-found" style="display: none; position: absolute; top: 378px; left: 361px;">
                                <img src="find-differences-images/sauce.png" alt="רוטב">
                            </div>
                            <div id="petal-diff" class="difference-found" style="display: none; position: absolute; top: 375px; left: 261px;">
                                <img src="find-differences-images/petal.png" alt="עלה כותרת">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="game-instructions">
                <p>🎯 לחץ על התמונה השנייה כדי למצוא את ההבדלים!</p>
                <p>💡 רמז: יש 5 הבדלים בין שתי התמונות</p>
            </div>
            <div class="game-controls">
                <button onclick="resetGame()" class="control-btn">🔄 התחל מחדש</button>
                <button onclick="showHint()" class="control-btn">💡 רמז</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // התחלת המשחק
    initGame();
}

// משתני המשחק
let gameState = {
    score: 0,
    found: 0,
    timeLeft: 120,
    gameActive: true,
    differences: ['leaf', 'light', 'nolight', 'sauce', 'petal'],
    foundDifferences: []
};

function initGame() {
    console.log('Initializing real differences game...');
    
    // איפוס משתני המשחק
    gameState.score = 0;
    gameState.found = 0;
    gameState.timeLeft = 120;
    gameState.gameActive = true;
    gameState.foundDifferences = [];
    
    // עדכון התצוגה
    updateDisplay();
    
    // הוספת מאזיני אירועים
    setupEventListeners();
    
    // התחלת הטיימר
    startTimer();
}

function setupEventListeners() {
    // מאזין לקליקים על התמונה השנייה (רק לטעויות)
    const image2 = document.getElementById('image2');
    if (image2) {
        image2.addEventListener('click', handleImageClick);
    }
    
    // מאזין לקליקים על אזורי ההבדלים
    const areas = document.querySelectorAll('map[name="photohunt"] area');
    areas.forEach(area => {
        area.addEventListener('click', handleDifferenceClick);
    });
}

function handleImageClick(event) {
    if (!gameState.gameActive) return;
    
    // בדוק אם הקליק היה על area (הבדל) - אם כן, אל תעשה כלום
    if (event.target.tagName.toLowerCase() === 'area') {
        return;
    }
    
    console.log('Wrong click on image at:', event.offsetX, event.offsetY);
    
    // אפקט קליק שגוי
    showWrongClick(event.offsetX, event.offsetY);
    
    // הפחתת נקודות על קליק שגוי
    gameState.score = Math.max(0, gameState.score - 3);
    updateDisplay();
    
    // צליל שגיאה
    playSound('wrong');
}

function handleDifferenceClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!gameState.gameActive) return;
    
    const diffId = event.target.id;
    
    if (gameState.foundDifferences.includes(diffId)) {
        return; // כבר נמצא
    }
    
    console.log('Difference found:', diffId);
    
    // הצגת ההבדל
    const diffElement = document.getElementById(diffId + '-diff');
    if (diffElement) {
        diffElement.style.display = 'block';
        
        // אפקט הופעה
        diffElement.style.opacity = '0';
        diffElement.style.transform = 'scale(0.5)';
        diffElement.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            diffElement.style.opacity = '1';
            diffElement.style.transform = 'scale(1)';
        }, 50);
    }
    
    // עדכון מצב המשחק
    gameState.foundDifferences.push(diffId);
    gameState.found++;
    gameState.score += 20;
    
    // עדכון התצוגה
    updateDisplay();
    
    // צליל הצלחה
    playSound('success');
    
    // בדיקת סיום המשחק
    if (gameState.found >= 5) {
        setTimeout(() => {
            endGame(true);
        }, 1000);
    }
}

function showWrongClick(x, y) {
    const wrongEffect = document.createElement('div');
    wrongEffect.className = 'wrong-click-effect';
    wrongEffect.style.position = 'absolute';
    wrongEffect.style.left = x + 'px';
    wrongEffect.style.top = y + 'px';
    wrongEffect.style.color = 'red';
    wrongEffect.style.fontSize = '24px';
    wrongEffect.style.fontWeight = 'bold';
    wrongEffect.style.pointerEvents = 'none';
    wrongEffect.style.zIndex = '1000';
    wrongEffect.textContent = '❌';
    
    const image2 = document.getElementById('image2');
    image2.appendChild(wrongEffect);
    
    setTimeout(() => {
        if (wrongEffect.parentNode) {
            wrongEffect.remove();
        }
    }, 1000);
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (!gameState.gameActive) {
            clearInterval(timerInterval);
            return;
        }
        
        gameState.timeLeft--;
        updateDisplay();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false);
        }
    }, 1000);
}

function updateDisplay() {
    const scoreElement = document.getElementById('score');
    const foundElement = document.getElementById('found');
    const timerElement = document.getElementById('timer');
    
    if (scoreElement) scoreElement.textContent = gameState.score;
    if (foundElement) foundElement.textContent = gameState.found;
    if (timerElement) timerElement.textContent = gameState.timeLeft;
}

function endGame(won) {
    gameState.gameActive = false;
    
    let message, emoji;
    if (won) {
        message = `כל הכבוד! מצאת את כל ההבדלים!\nהנקודות שלך: ${gameState.score}\nזמן שנותר: ${gameState.timeLeft} שניות`;
        emoji = '🎉';
        playSound('complete');
    } else {
        message = `הזמן נגמר!\nמצאת ${gameState.found} מתוך 5 הבדלים\nהנקודות שלך: ${gameState.score}`;
        emoji = '⏰';
        playSound('wrong');
    }
    
    setTimeout(() => {
        alert(emoji + ' ' + message);
    }, 500);
}

function resetGame() {
    // הסתרת כל ההבדלים
    const foundDiffs = document.querySelectorAll('.difference-found');
    foundDiffs.forEach(diff => {
        diff.style.display = 'none';
    });
    
    // הסרת אפקטים
    const wrongEffects = document.querySelectorAll('.wrong-click-effect');
    wrongEffects.forEach(effect => effect.remove());
    
    // התחלה מחדש
    initGame();
}

function showHint() {
    if (!gameState.gameActive) return;
    
    // מציאת הבדל שלא נמצא
    const unfoundDifferences = gameState.differences.filter(id => 
        !gameState.foundDifferences.includes(id)
    );
    
    if (unfoundDifferences.length === 0) return;
    
    const randomDiff = unfoundDifferences[Math.floor(Math.random() * unfoundDifferences.length)];
    const areaElement = document.getElementById(randomDiff);
    
    if (areaElement) {
        // יצירת אפקט הבזקה על האזור
        const hintEffect = document.createElement('div');
        hintEffect.style.position = 'absolute';
        hintEffect.style.border = '4px solid yellow';
        hintEffect.style.borderRadius = '10px';
        hintEffect.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
        hintEffect.style.pointerEvents = 'none';
        hintEffect.style.zIndex = '999';
        hintEffect.style.boxShadow = '0 0 20px yellow';
        
        // קביעת מיקום וגודל לפי סוג הצורה
        const coords = areaElement.getAttribute('coords').split(',').map(Number);
        const shape = areaElement.getAttribute('shape');
        
        if (shape === 'circle') {
            const [x, y, r] = coords;
            hintEffect.style.left = (x - r - 5) + 'px';
            hintEffect.style.top = (y - r - 5) + 'px';
            hintEffect.style.width = (r * 2 + 10) + 'px';
            hintEffect.style.height = (r * 2 + 10) + 'px';
            hintEffect.style.borderRadius = '50%';
        } else if (shape === 'rect') {
            const [x1, y1, x2, y2] = coords;
            hintEffect.style.left = (x1 - 5) + 'px';
            hintEffect.style.top = (y1 - 5) + 'px';
            hintEffect.style.width = (x2 - x1 + 10) + 'px';
            hintEffect.style.height = (y2 - y1 + 10) + 'px';
        }
        
        const image2 = document.getElementById('image2');
        image2.appendChild(hintEffect);
        
        setTimeout(() => {
            if (hintEffect.parentNode) {
                hintEffect.remove();
            }
        }, 3000);
        
        // הפחתת נקודות על רמז
        gameState.score = Math.max(0, gameState.score - 10);
        updateDisplay();
    }
}

function closeFindDifferences() {
    const modal = document.querySelector('.find-differences-modal');
    if (modal) {
        modal.remove();
    }
}

function playSound(soundName) {
    try {
        let soundFile;
        switch(soundName) {
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
            default:
                return;
        }
        
        const audio = new Audio(soundFile);
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Cannot play sound:', e));
    } catch (e) {
        console.log('Sound error:', e);
    }
}

// הפונקציה הגלובלית להפעלת המשחק
window.startFindDifferences = startFindDifferences; 