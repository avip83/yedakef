// פאזל תמונות פשוט - פתרון מותאם אישית עם HTML5 Canvas
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
    
    gameArea.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: white; border-radius: 20px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin-bottom: 20px; max-width: 95vw;">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h2 style="color: #333; margin: 0 0 10px 0; font-size: 1.5em;">🧩 פאזל תמונות</h2>
                    <div style="margin-bottom: 15px;">
                        <label style="color: #666; font-weight: bold;">מספר חלקים:</label>
                        <select id="piecesSelect" onchange="createNewPuzzle()" style="margin: 0 10px; padding: 8px; border-radius: 5px; border: 1px solid #ddd; font-size: 14px;">
                            <option value="3">9 חלקים (3x3)</option>
                            <option value="4">16 חלקים (4x4)</option>
                            <option value="5">25 חלקים (5x5)</option>
                            <option value="6">36 חלקים (6x6)</option>
                            <option value="7">49 חלקים (7x7)</option>
                        </select>
                        <button onclick="createNewPuzzle()" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">🔄 פאזל חדש</button>
                        <button onclick="showHint()" style="padding: 8px 16px; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-right: 5px;">💡 טיפים</button>
                    </div>
                </div>
                
                <div id="puzzleContainer" style="text-align: center; position: relative;">
                    <div id="puzzleBoard" style="width: 500px; height: 500px; border: 3px solid #333; margin: 0 auto; background: #f0f0f0; position: relative; border-radius: 10px;"></div>
                    <div id="piecesArea" style="width: 500px; height: 150px; border: 2px solid #999; margin: 20px auto; background: #e8e8e8; position: relative; border-radius: 10px; overflow: hidden;"></div>
                </div>
            </div>
        </div>
    `;
    
    // הוספת פונקציות גלובליות
    window.createNewPuzzle = createNewPuzzle;
    window.showHint = showHint;
    window.currentPuzzleImages = puzzleImages;
    window.currentPuzzle = null;
    
    // יצירת הפאזל הראשון
    createNewPuzzle();
}

function createNewPuzzle() {
    const piecesSelect = document.getElementById('piecesSelect');
    const gridSize = parseInt(piecesSelect.value);
    const totalPieces = gridSize * gridSize;
    
    // בחירת תמונה אקראית חדשה
    const randomImage = window.currentPuzzleImages[Math.floor(Math.random() * window.currentPuzzleImages.length)];
    
    // ניקוי הלוח הקודם
    const puzzleBoard = document.getElementById('puzzleBoard');
    const piecesArea = document.getElementById('piecesArea');
    puzzleBoard.innerHTML = '';
    piecesArea.innerHTML = '';
    
    // יצירת תמונה
    const img = new Image();
    img.onload = function() {
        createPuzzlePieces(img, gridSize, puzzleBoard, piecesArea);
    };
    img.src = randomImage;
    
    // הודעה לשחקן
    const notification = document.createElement('div');
    notification.innerHTML = `🎲 פאזל חדש עם ${totalPieces} חלקים!`;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        background: #4CAF50; color: white; padding: 10px 20px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: bold; animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function createPuzzlePieces(img, gridSize, puzzleBoard, piecesArea) {
    const pieceWidth = 500 / gridSize;
    const pieceHeight = 500 / gridSize;
    
    // יצירת חלקי הפאזל
    const pieces = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.style.cssText = `
                width: ${pieceWidth}px;
                height: ${pieceHeight}px;
                background-image: url(${img.src});
                background-size: 500px 500px;
                background-position: -${col * pieceWidth}px -${row * pieceHeight}px;
                border: 2px solid #333;
                position: absolute;
                cursor: grab;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                transition: transform 0.2s ease;
            `;
            
            // מאפיינים של החלק
            piece.dataset.correctRow = row;
            piece.dataset.correctCol = col;
            piece.dataset.currentRow = -1;
            piece.dataset.currentCol = -1;
            
            // מיקום אקראי באזור החלקים
            const randomX = Math.random() * (500 - pieceWidth);
            const randomY = Math.random() * (150 - pieceHeight);
            piece.style.left = randomX + 'px';
            piece.style.top = randomY + 'px';
            
            // הוספת פונקציונליות גרירה
            addDragFunctionality(piece, puzzleBoard, piecesArea, pieceWidth, pieceHeight, gridSize);
            
            pieces.push(piece);
            piecesArea.appendChild(piece);
        }
    }
    
    // ערבוב החלקים
    shufflePieces(pieces, piecesArea, pieceWidth, pieceHeight);
}

function addDragFunctionality(piece, puzzleBoard, piecesArea, pieceWidth, pieceHeight, gridSize) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    piece.addEventListener('mousedown', startDrag);
    piece.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
        isDragging = true;
        piece.style.cursor = 'grabbing';
        piece.style.zIndex = '1000';
        piece.style.transform = 'scale(1.05)';
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        startX = clientX;
        startY = clientY;
        startLeft = parseInt(piece.style.left) || 0;
        startTop = parseInt(piece.style.top) || 0;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', stopDrag);
        
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        piece.style.left = (startLeft + deltaX) + 'px';
        piece.style.top = (startTop + deltaY) + 'px';
        
        e.preventDefault();
    }
    
    function stopDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        
        piece.style.cursor = 'grab';
        piece.style.zIndex = '1';
        piece.style.transform = 'scale(1)';
        
        // בדיקה אם החלק נמצא במקום הנכון
        checkPiecePosition(piece, puzzleBoard, piecesArea, pieceWidth, pieceHeight, gridSize);
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', stopDrag);
    }
}

function checkPiecePosition(piece, puzzleBoard, piecesArea, pieceWidth, pieceHeight, gridSize) {
    const rect = puzzleBoard.getBoundingClientRect();
    const pieceRect = piece.getBoundingClientRect();
    
    // בדיקה אם החלק נמצא מעל הלוח
    if (pieceRect.left >= rect.left && pieceRect.right <= rect.right &&
        pieceRect.top >= rect.top && pieceRect.bottom <= rect.bottom) {
        
        // חישוב המיקום הקרוב ביותר ברשת
        const relativeX = pieceRect.left - rect.left;
        const relativeY = pieceRect.top - rect.top;
        
        const snapCol = Math.round(relativeX / pieceWidth);
        const snapRow = Math.round(relativeY / pieceHeight);
        
        // בדיקה אם זה המקום הנכון
        const correctRow = parseInt(piece.dataset.correctRow);
        const correctCol = parseInt(piece.dataset.correctCol);
        
        if (snapRow === correctRow && snapCol === correctCol) {
            // מיקום נכון - הצמדה
            piece.style.left = (snapCol * pieceWidth) + 'px';
            piece.style.top = (snapRow * pieceHeight) + 'px';
            piece.style.border = '2px solid #4CAF50';
            piece.style.cursor = 'default';
            
            // העברה ללוח
            puzzleBoard.appendChild(piece);
            
            // צליל הצלחה
            playSuccessSound();
            
            // בדיקה אם הפאזל הושלם
            checkPuzzleCompletion(puzzleBoard, gridSize);
        } else {
            // מיקום לא נכון - החזרה לאזור החלקים
            returnToPiecesArea(piece, piecesArea, pieceWidth, pieceHeight);
        }
    } else {
        // מחוץ ללוח - החזרה לאזור החלקים
        returnToPiecesArea(piece, piecesArea, pieceWidth, pieceHeight);
    }
}

function returnToPiecesArea(piece, piecesArea, pieceWidth, pieceHeight) {
    const randomX = Math.random() * (500 - pieceWidth);
    const randomY = Math.random() * (150 - pieceHeight);
    
    piece.style.left = randomX + 'px';
    piece.style.top = randomY + 'px';
    piece.style.border = '2px solid #333';
    
    piecesArea.appendChild(piece);
}

function shufflePieces(pieces, piecesArea, pieceWidth, pieceHeight) {
    pieces.forEach(piece => {
        const randomX = Math.random() * (500 - pieceWidth);
        const randomY = Math.random() * (150 - pieceHeight);
        piece.style.left = randomX + 'px';
        piece.style.top = randomY + 'px';
    });
}

function checkPuzzleCompletion(puzzleBoard, gridSize) {
    const totalPieces = gridSize * gridSize;
    const completedPieces = puzzleBoard.children.length;
    
    if (completedPieces === totalPieces) {
        setTimeout(() => {
            alert('🎉 כל הכבוד! הצלחת להשלים את הפאזל!');
            playSuccessSound();
            
            // אפקט חגיגה
            celebratePuzzleCompletion();
        }, 500);
    }
}

function celebratePuzzleCompletion() {
    // אפקט זיקוקים פשוט
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉🎊🎉🎊🎉';
    celebration.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        font-size: 3em; z-index: 2000; animation: celebrate 2s ease-out;
    `;
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 2000);
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
    
    @keyframes celebrate {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    #piecesSelect:hover {
        border-color: #4CAF50;
    }
    
    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
    
    .puzzle-piece:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 8px rgba(0,0,0,0.4);
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