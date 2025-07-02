// משחק מצא את ההבדלים - פשוט ובסיסי
function startFindDifferences() {
    console.log('Starting Find Differences Game');
    
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
                <div class="found">נמצאו: <span id="found">0</span>/3</div>
                <div class="timer">זמן: <span id="timer">60</span></div>
            </div>
            <div class="game-container">
                <div class="images-container">
                    <div class="image-wrapper">
                        <h3>תמונה ראשונה - תפוח</h3>
                        <div class="image-box" id="image1">
                            <img src="fruits/apple.jpg" alt="תפוח">
                        </div>
                    </div>
                    <div class="image-wrapper">
                        <h3>תמונה שנייה - בננה</h3>
                        <div class="image-box" id="image2">
                            <img src="fruits/banana.jpg" alt="בננה">
                            <!-- נקודות ההבדלים - מיקומים פשוטים -->
                            <div class="difference" data-id="1" style="top: 25%; left: 25%; width: 60px; height: 60px;" title="הבדל 1"></div>
                            <div class="difference" data-id="2" style="top: 50%; left: 50%; width: 60px; height: 60px;" title="הבדל 2"></div>
                            <div class="difference" data-id="3" style="top: 70%; left: 30%; width: 60px; height: 60px;" title="הבדל 3"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="game-instructions">
                <p>🎯 לחץ על התמונה השנייה כדי למצוא את ההבדלים!</p>
                <p>💡 רמז: יש 3 הבדלים בין התפוח לבננה</p>
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
    timeLeft: 60,
    gameActive: true,
    differences: [1, 2, 3],
    foundDifferences: []
};

function initGame() {
    console.log('Initializing game...');
    
    // איפוס משתני המשחק
    gameState.score = 0;
    gameState.found = 0;
    gameState.timeLeft = 60;
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
    // מאזין לקליקים על התמונה השנייה
    const image2 = document.getElementById('image2');
    if (image2) {
        image2.addEventListener('click', handleImageClick);
    }
    
    // מאזין לקליקים על ההבדלים
    const differences = document.querySelectorAll('.difference');
    differences.forEach(diff => {
        diff.addEventListener('click', handleDifferenceClick);
    });
}

function handleImageClick(event) {
    if (!gameState.gameActive) return;
    
    console.log('Image clicked at:', event.offsetX, event.offsetY);
    
    // אפקט קליק שגוי
    showWrongClick(event.offsetX, event.offsetY);
    
    // הפחתת נקודות על קליק שגוי
    gameState.score = Math.max(0, gameState.score - 2);
    updateDisplay();
    
    // צליל שגיאה
    playSound('wrong');
}

function handleDifferenceClick(event) {
    event.stopPropagation(); // מניעת הפעלת handleImageClick
    
    if (!gameState.gameActive) return;
    
    const diffId = parseInt(event.target.getAttribute('data-id'));
    
    if (gameState.foundDifferences.includes(diffId)) {
        return; // כבר נמצא
    }
    
    console.log('Difference found:', diffId);
    
    // סימון ההבדל כנמצא
    event.target.classList.add('found');
    gameState.foundDifferences.push(diffId);
    gameState.found++;
    gameState.score += 10;
    
    // אפקט חזותי
    showFoundEffect(event.target);
    
    // עדכון התצוגה
    updateDisplay();
    
    // צליל הצלחה
    playSound('success');
    
    // בדיקת סיום המשחק
    if (gameState.found >= 3) {
        endGame(true);
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

function showFoundEffect(element) {
    element.innerHTML = '✅';
    element.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
    element.style.borderRadius = '50%';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.fontSize = '30px';
    element.style.border = '3px solid green';
    element.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.7)';
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
        message = `כל הכבוד! מצאת את כל ההבדלים!\nהנקודות שלך: ${gameState.score}`;
        emoji = '🎉';
        playSound('complete');
    } else {
        message = `הזמן נגמר!\nמצאת ${gameState.found} מתוך 3 הבדלים\nהנקודות שלך: ${gameState.score}`;
        emoji = '⏰';
        playSound('wrong');
    }
    
    setTimeout(() => {
        alert(emoji + ' ' + message);
    }, 500);
}

function resetGame() {
    // איפוס כל ההבדלים
    const differences = document.querySelectorAll('.difference');
    differences.forEach(diff => {
        diff.classList.remove('found');
        diff.innerHTML = '';
        diff.style.backgroundColor = '';
        diff.style.borderRadius = '';
        diff.style.border = '';
        diff.style.boxShadow = '';
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
    const diffElement = document.querySelector(`[data-id="${randomDiff}"]`);
    
    if (diffElement) {
        // אפקט הבזקה
        diffElement.style.border = '4px solid yellow';
        diffElement.style.boxShadow = '0 0 20px yellow';
        diffElement.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
        
        setTimeout(() => {
            if (!diffElement.classList.contains('found')) {
                diffElement.style.border = '';
                diffElement.style.boxShadow = '';
                diffElement.style.backgroundColor = '';
            }
        }, 3000);
        
        // הפחתת נקודות על רמז
        gameState.score = Math.max(0, gameState.score - 5);
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