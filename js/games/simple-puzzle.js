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
    
    // בחירת תמונה אקראית
    const randomImage = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
    
        gameArea.innerHTML = `
        <div style="background: #f5f5f5; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
            <div style="text-align: center; margin-bottom: 15px;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 1.8em;">🧩 פאזל תמונות</h2>
                <div style="margin-bottom: 20px;">
                    <label style="color: #666; font-weight: bold; margin-left: 10px;">מספר חלקים:</label>
                    <select id="piecesSelect" style="margin: 0 10px; padding: 8px; border-radius: 8px; border: 2px solid #ddd; font-size: 14px;">
                        <option value="9">9 חלקים (3x3)</option>
                        <option value="16">16 חלקים (4x4)</option>
                        <option value="25">25 חלקים (5x5)</option>
                        <option value="36">36 חלקים (6x6)</option>
                        <option value="49">49 חלקים (7x7)</option>
                    </select>
                    <button onclick="createNewPuzzle()" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; margin: 0 5px;">🔄 פאזל חדש</button>
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
        </div>
    `;
    
    // הוספת פונקציות גלובליות
    window.createNewPuzzle = createNewPuzzle;
    window.showHint = showHint;
    window.updatePuzzlePieces = updatePuzzlePieces;
    window.currentPuzzleImages = puzzleImages;
    
    // האזנה לשינויים בבחירת מספר החלקים
    setTimeout(() => {
        const piecesSelect = document.getElementById('piecesSelect');
        if (piecesSelect) {
            piecesSelect.addEventListener('change', function() {
                updatePuzzlePieces();
            });
        }
    }, 100);
    
    // האזנה להשלמת פאזל
    window.addEventListener('message', function(event) {
        if (event.origin === 'https://www.jigsawexplorer.com' && event.data === 'puzzle-complete') {
            setTimeout(() => {
                alert('🎉 כל הכבוד! הצלחת להשלים את הפאזל!');
                playSuccessSound();
            }, 500);
        }
    });
}

function createNewPuzzle() {
    const piecesSelect = document.getElementById('piecesSelect');
    const puzzleFrame = document.getElementById('puzzleFrame');
    const pieces = piecesSelect.value;
    
    // בחירת תמונה אקראית חדשה
    const randomImage = window.currentPuzzleImages[Math.floor(Math.random() * window.currentPuzzleImages.length)];
    
    // עדכון הפאזל עם פרמטרים מתקדמים
    puzzleFrame.src = `https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?pieces=${pieces}&url=${encodeURIComponent(window.location.origin + '/' + randomImage)}&bg=f0f0f0&rotate=false&timer=true&allowFullScreen=true`;
    
    // הודעה לשחקן
    showNotification(`🎲 פאזל חדש עם ${pieces} חלקים!`, '#4CAF50');
}

function updatePuzzlePieces() {
    const piecesSelect = document.getElementById('piecesSelect');
    const puzzleFrame = document.getElementById('puzzleFrame');
    const pieces = piecesSelect.value;
    
    // שמירת התמונה הנוכחית
    const currentSrc = puzzleFrame.src;
    const urlMatch = currentSrc.match(/url=([^&]+)/);
    const currentImageUrl = urlMatch ? decodeURIComponent(urlMatch[1]) : null;
    
    if (currentImageUrl) {
        // עדכון רק מספר החלקים, שמירת אותה תמונה עם פרמטרים מתקדמים
        puzzleFrame.src = `https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?pieces=${pieces}&url=${encodeURIComponent(currentImageUrl)}&bg=f0f0f0&rotate=false&timer=true&allowFullScreen=true`;
        
        // הודעה לשחקן
        showNotification(`🔄 עודכן ל-${pieces} חלקים!`, '#2196F3');
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
                <button class="close-button" onclick="this.parentElement.parentElement.remove(); document.documentElement.style.overflow = ''; document.body.style.overflow = '';" style="position: absolute; top: 12px; right: 12px; z-index: 2000; background: #ff4444; color: white; border: none; border-radius: 50%; width: 35px; height: 35px; font-size: 18px; cursor: pointer;">×</button>
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