// פאזל תמונות פשוט עם JigsawExplorer - 9 חלקים מתכוונן
function startSimplePuzzleGame() {
    // טעינת צלילים
    const sounds = {
        click: new Audio('sounds/click-tap-computer-mouse-352734.mp3'),
        success: new Audio('sounds/success-340660 (mp3cut.net).mp3')
    };
    
    // פונקציה להשמעת צליל
    function playSound(type) {
        if (window.__globalMute) return;
        if (sounds[type]) {
            try {
                sounds[type].currentTime = 0;
                sounds[type].play();
            } catch (e) {
                console.log('לא ניתן לנגן צליל:', e);
            }
        }
    }
    
    // הוספת הפונקציה לחלון הגלובלי
    window.playPuzzleSound = playSound;
    const gameArea = document.getElementById('gameArea');
    
    // רשימת תמונות לפאזל - כל התמונות בספרייה
    const puzzleImages = [
        'puzzle/1.png', 'puzzle/2.png', 'puzzle/3.png', 'puzzle/4.png', 'puzzle/5.png',
        'puzzle/6.png', 'puzzle/7.png', 'puzzle/8.png', 'puzzle/9.png', 'puzzle/10.png',
        'puzzle/11.png', 'puzzle/12.png', 'puzzle/13.png', 'puzzle/14.png', 'puzzle/15.png',
        'puzzle/16.png', 'puzzle/17.png', 'puzzle/18.png', 'puzzle/19.png', 'puzzle/20.png'
    ];
    
    // משתנים גלובליים
    window.currentLevel = 1;
    window.totalLevels = puzzleImages.length; // 20 שלבים לפי מספר התמונות
    window.currentPuzzleImages = puzzleImages;
    window.isMuted = false;
    
    // בחירת תמונה אקראית
    const randomImage = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
    
        gameArea.innerHTML = `
        <div style="background: #f5f5f5; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;">
            <!-- בר התקדמות שלבים -->
            <div id="progressBar" style="width: 100%; max-width: 600px; margin-bottom: 12px;">
                <div style="background: #e0e0e0; height: 6px; border-radius: 3px; overflow: hidden;">
                    <div id="progressFill" style="background: linear-gradient(90deg, #4CAF50, #8BC34A); height: 100%; width: 10%; transition: width 0.3s ease;"></div>
                </div>
                <div style="text-align: center; margin-top: 4px; color: #666; font-size: 11px;">
                    שלב <span id="currentLevel">1</span> מתוך <span id="totalLevels">20</span>
                </div>
            </div>

            <div style="text-align: center; margin-bottom: 10px;">
                <h2 style="color: #333; margin: 0 0 10px 0; font-size: 1.4em;">🧩 פאזל תמונות</h2>
                <div style="margin-bottom: 12px;">
                    <button onclick="window.playPuzzleSound('click'); nextLevel()" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">➡️ שלב הבא</button>
                </div>
            </div>
            
            <div id="puzzleContainer" style="text-align: center; background: white; border-radius: 12px; padding: 12px; box-shadow: 0 3px 12px rgba(0,0,0,0.1);">
                <iframe id="puzzleFrame" 
                        src="https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?pieces=9&url=${encodeURIComponent(window.location.origin + '/' + randomImage)}&bg=f0f0f0&rotate=false&timer=true&allowFullScreen=true" 
                        width="600" 
                        height="420" 
                        style="border: none; border-radius: 8px; max-width: 100%; max-height: 65vh;"
                        frameborder="0"
                        allowfullscreen>
                </iframe>
            </div>

            <!-- הסבר על החלון הפנימי -->
            <div style="margin-top: 10px; max-width: 600px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 10px; text-align: center;">
                <p style="margin: 0; color: #856404; font-size: 12px;">
                    💡 <strong>הסבר:</strong> לחץ על "OK" כדי להתחיל או שנה את ההגדרות לפי הרצון שלך.
                </p>
            </div>
        </div>
    `;
    
    // הוספת פונקציות גלובליות
    window.nextLevel = nextLevel;
    window.updateProgressBar = updateProgressBar;
    
    // עדכון בר ההתקדמות הראשוני
    setTimeout(() => {
        updateProgressBar();
    }, 100);
    
    // האזנה להשלמת פאזל (לא תמיד עובד, לכן יש כפתור ידני)
    window.addEventListener('message', function(event) {
        if (event.origin === 'https://www.jigsawexplorer.com' && event.data === 'puzzle-complete') {
            setTimeout(() => {
                window.playPuzzleSound('success');
                showNotification('🎉 כל הכבוד! השלב הושלם!', '#4CAF50');
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
        
        // הסרת כפתור השלב הבא הזמני אם קיים
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
    const totalLevelsSpan = document.getElementById('totalLevels');
    
    if (progressFill && currentLevelSpan && totalLevelsSpan) {
        const progressPercent = (window.currentLevel / window.totalLevels) * 100;
        progressFill.style.width = progressPercent + '%';
        currentLevelSpan.textContent = window.currentLevel;
        totalLevelsSpan.textContent = window.totalLevels;
    }
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





// הוספת סגנונות CSS לאנימציות ותמיכה מובייל
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
    
    /* תמיכה מובייל טובה יותר */
    @media (max-width: 768px) {
        #puzzleContainer iframe {
            height: 350px !important;
            max-height: 50vh !important;
        }
        
        .game-modal-content {
            padding: 10px !important;
        }
        
        h2 {
            font-size: 1.2em !important;
        }
    }
    
    @media (max-width: 480px) {
        #puzzleContainer iframe {
            height: 300px !important;
            max-height: 45vh !important;
        }
        
        h2 {
            font-size: 1.1em !important;
        }
        
        button {
            font-size: 12px !important;
            padding: 6px 12px !important;
        }
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