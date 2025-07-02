// פאזל תמונות פשוט עם JigsawExplorer - 9 חלקים מתכוונן
function startSimplePuzzleGame() {
    const gameArea = document.getElementById('gameArea');
    
    // רשימת תמונות לפאזל
    const puzzleImages = [
        'puzzle/1.png',
        'puzzle/2.png', 
        'puzzle/3.png',
        'puzzle/4.png',
        'puzzle/5.png',
        'puzzle/6.png',
        'puzzle/7.png',
        'puzzle/8.png',
        'puzzle/9.png',
        'puzzle/10.png'
    ];
    
    // משתנים גלובליים
    window.currentLevel = 1;
    window.totalLevels = 10;
    window.currentPuzzleImages = puzzleImages;
    
    // בחירת תמונה אקראית
    const randomImage = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
    
        gameArea.innerHTML = `
        <div style="background: #f5f5f5; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
            <!-- בר התקדמות שלבים -->
            <div id="progressBar" style="width: 100%; max-width: 600px; margin-bottom: 20px;">
                <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div id="progressFill" style="background: linear-gradient(90deg, #4CAF50, #8BC34A); height: 100%; width: 10%; transition: width 0.3s ease;"></div>
                </div>
                <div style="text-align: center; margin-top: 5px; color: #666; font-size: 12px;">
                    שלב <span id="currentLevel">1</span> מתוך 10
                </div>
            </div>

            <div style="text-align: center; margin-bottom: 15px;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 1.8em;">🧩 פאזל תמונות</h2>
                <div style="margin-bottom: 20px;">
                    <button onclick="showHint()" style="padding: 8px 16px; background: #FF9800; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">💡 טיפים</button>
                </div>
            </div>
            
            <div id="puzzleContainer" style="text-align: center; background: white; border-radius: 15px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <iframe id="puzzleFrame" 
                        src="https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?pieces=9&url=${encodeURIComponent(window.location.origin + '/' + randomImage)}&bg=f0f0f0&rotate=false&timer=true&allowFullScreen=true" 
                        width="600" 
                        height="450" 
                        style="border: none; border-radius: 10px; max-width: 100%; max-height: 70vh;"
                        frameborder="0"
                        allowfullscreen>
                </iframe>
            </div>

            <!-- הסבר על החלון הפנימי -->
            <div style="margin-top: 15px; max-width: 600px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; text-align: center;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                    💡 <strong>הסבר:</strong> כשהפאזל נטען, יופיע חלון קטן שמאפשר לבחור מספר חלקים ואפשרויות נוספות. 
                    לחץ על "OK" כדי להתחיל עם ההגדרות או שנה אותן לפי הרצון שלך.
                </p>
            </div>
        </div>
    `;
    
    // הוספת פונקציות גלובליות
    window.showHint = showHint;
    window.nextLevel = nextLevel;
    window.updateProgressBar = updateProgressBar;
    
    // עדכון בר ההתקדמות הראשוני
    setTimeout(() => {
        updateProgressBar();
    }, 100);
    
    // האזנה להשלמת פאזל
    window.addEventListener('message', function(event) {
        if (event.origin === 'https://www.jigsawexplorer.com' && event.data === 'puzzle-complete') {
            setTimeout(() => {
                showNextLevelButton();
                playSuccessSound();
            }, 500);
        }
    });
}

function nextLevel() {
    if (window.currentLevel < window.totalLevels) {
        window.currentLevel++;
        
        // בחירת תמונה אקראית חדשה
        const randomImage = window.currentPuzzleImages[Math.floor(Math.random() * window.currentPuzzleImages.length)];
        
        // עדכון הפאזל
        const puzzleFrame = document.getElementById('puzzleFrame');
        puzzleFrame.src = `https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?pieces=9&url=${encodeURIComponent(window.location.origin + '/' + randomImage)}&bg=f0f0f0&rotate=false&timer=true&allowFullScreen=true`;
        
        // עדכון בר ההתקדמות
        updateProgressBar();
        
        // הסרת כפתור השלב הבא אם קיים
        const nextButton = document.getElementById('nextLevelButton');
        if (nextButton) {
            nextButton.remove();
        }
        
        // הודעה לשחקן
        showNotification(`🎯 שלב ${window.currentLevel}!`, '#4CAF50');
    } else {
        // סיום כל השלבים
        showNotification('🏆 מזל טוב! סיימת את כל השלבים!', '#FFD700');
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const currentLevelSpan = document.getElementById('currentLevel');
    
    if (progressFill && currentLevelSpan) {
        const progressPercent = (window.currentLevel / window.totalLevels) * 100;
        progressFill.style.width = progressPercent + '%';
        currentLevelSpan.textContent = window.currentLevel;
    }
}

function showNextLevelButton() {
    // יצירת כפתור שלב הבא
    const nextButton = document.createElement('div');
    nextButton.id = 'nextLevelButton';
    nextButton.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2000; background: rgba(0,0,0,0.8); padding: 30px; border-radius: 15px; text-align: center;">
            <h3 style="color: white; margin-bottom: 20px;">🎉 כל הכבוד!</h3>
            <p style="color: #ddd; margin-bottom: 25px;">הצלחת להשלים את השלב!</p>
            <button onclick="nextLevel()" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
                ${window.currentLevel < window.totalLevels ? '➡️ שלב הבא' : '🏆 סיום'}
            </button>
        </div>
    `;
    document.body.appendChild(nextButton);
}

function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        background: ${color}; color: white; padding: 10px 20px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: bold; animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2500);
}

function showHint() {
    const hintModal = document.createElement('div');
    hintModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 2000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 400px; margin: 20px;">
                <h3 style="color: #333; margin-bottom: 20px;">💡 טיפים לפתרון הפאזל</h3>
                <ul style="text-align: right; color: #666; line-height: 1.8;">
                    <li>התחל מהפינות והקצוות</li>
                    <li>חפש צבעים וצורות דומות</li>
                    <li>קבץ חלקים לפי אזורים</li>
                    <li>השתמש בתכונת המסך המלא</li>
                    <li>קח הפסקות אם אתה תקוע</li>
                </ul>
                <button onclick="this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px;">הבנתי</button>
            </div>
        </div>
    `;
    document.body.appendChild(hintModal);
}

function playSuccessSound() {
    // ניגון צליל הצלחה
    const audio = new Audio('sounds/success-340660 (mp3cut.net).mp3');
    audio.play().catch(() => {
        // התעלם משגיאות אם הצליל לא יכול להתנגן
    });
}

// הוספת סגנונות CSS לאנימציות
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    #piecesSelect:hover {
        border-color: #4CAF50;
    }
    
    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// יצוא המשחק
window['simple-puzzle'] = {
    init: function() {
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = `
            <div class="game-modal-content" style="max-width: 95vw; width: 95%; max-height: 95vh; overflow: auto;">
                <button class="close-button" onclick="this.parentElement.parentElement.remove(); document.documentElement.style.overflow = ''; document.body.style.overflow = '';" style="position: absolute; top: 12px; right: 12px; z-index: 2000; background: #ff4444; color: white; border: none; border-radius: 50%; width: 35px; height: 35px; font-size: 18px; cursor: pointer;">←</button>
                <div id="gameArea"></div>
            </div>
        `;
        document.body.appendChild(modal);
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            startSimplePuzzleGame();
        }, 100);
    }
}; 