// פאזל תמונות פשוט מותאם אישית - 9+ חלקים מתכוונן
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
                    <canvas id="puzzleCanvas" width="600" height="450" style="border: 2px solid #ddd; border-radius: 10px; max-width: 100%; background: #f0f0f0; cursor: grab;"></canvas>
                    <div id="puzzlePieces" style="margin-top: 20px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; min-height: 100px; background: #f9f9f9; border-radius: 10px; padding: 15px;"></div>
                </div>
            </div>
        </div>
    `;
    
    // הוספת פונקציות גלובליות
    window.createNewPuzzle = createNewPuzzle;
    window.showHint = showHint;
    window.currentPuzzleImages = puzzleImages;
    window.currentImage = randomImage;
    
    // יצירת הפאזל הראשון
    createPuzzle(3, randomImage);
    
    // הגדרת מאזין קליקים על הלוח
    setTimeout(() => setupCanvasClick(), 100);
}

// משתנים גלובליים לפאזל
let puzzlePieces = [];
let puzzleGrid = [];
let selectedPiece = null;
let puzzleSize = 3;
let isCompleted = false;

function createNewPuzzle() {
    const piecesSelect = document.getElementById('piecesSelect');
    const gridSize = parseInt(piecesSelect.value);
    
    // בחירת תמונה אקראית חדשה
    const randomImage = window.currentPuzzleImages[Math.floor(Math.random() * window.currentPuzzleImages.length)];
    window.currentImage = randomImage;
    
    // יצירת פאזל חדש
    createPuzzle(gridSize, randomImage);
    
    // הודעה לשחקן
    const pieces = gridSize * gridSize;
    const notification = document.createElement('div');
    notification.innerHTML = `🎲 פאזל חדש עם ${pieces} חלקים!`;
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

function createPuzzle(gridSize, imageSrc) {
    puzzleSize = gridSize;
    isCompleted = false;
    const canvas = document.getElementById('puzzleCanvas');
    const ctx = canvas.getContext('2d');
    const piecesContainer = document.getElementById('puzzlePieces');
    
    // ניקוי
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    piecesContainer.innerHTML = '';
    puzzlePieces = [];
    puzzleGrid = [];
    
    // יצירת רשת
    for (let i = 0; i < gridSize * gridSize; i++) {
        puzzleGrid.push(null);
    }
    
    // טעינת התמונה
    const img = new Image();
    img.onload = function() {
        const pieceWidth = canvas.width / gridSize;
        const pieceHeight = canvas.height / gridSize;
        
        // יצירת חלקי הפאזל
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const piece = {
                    id: row * gridSize + col,
                    row: row,
                    col: col,
                    correctRow: row,
                    correctCol: col,
                    x: col * pieceWidth,
                    y: row * pieceHeight,
                    width: pieceWidth,
                    height: pieceHeight,
                    placed: false
                };
                
                // יצירת canvas קטן לכל חלק
                const pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = pieceWidth;
                pieceCanvas.height = pieceHeight;
                const pieceCtx = pieceCanvas.getContext('2d');
                
                // ציור החלק
                pieceCtx.drawImage(
                    img,
                    col * (img.width / gridSize), row * (img.height / gridSize),
                    img.width / gridSize, img.height / gridSize,
                    0, 0, pieceWidth, pieceHeight
                );
                
                piece.canvas = pieceCanvas;
                puzzlePieces.push(piece);
            }
        }
        
        // ערבוב החלקים
        shufflePieces();
        renderPuzzle();
    };
    img.src = imageSrc;
}

function shufflePieces() {
    // ערבוב החלקים
    for (let i = puzzlePieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [puzzlePieces[i], puzzlePieces[j]] = [puzzlePieces[j], puzzlePieces[i]];
    }
}

function renderPuzzle() {
    const canvas = document.getElementById('puzzleCanvas');
    const ctx = canvas.getContext('2d');
    const piecesContainer = document.getElementById('puzzlePieces');
    
    // ניקוי הלוח
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // ציור רשת
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    const pieceWidth = canvas.width / puzzleSize;
    const pieceHeight = canvas.height / puzzleSize;
    
    for (let i = 0; i <= puzzleSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * pieceWidth, 0);
        ctx.lineTo(i * pieceWidth, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * pieceHeight);
        ctx.lineTo(canvas.width, i * pieceHeight);
        ctx.stroke();
    }
    
    // ציור חלקים מוצבים
    for (let i = 0; i < puzzleGrid.length; i++) {
        if (puzzleGrid[i]) {
            const piece = puzzleGrid[i];
            const row = Math.floor(i / puzzleSize);
            const col = i % puzzleSize;
            ctx.drawImage(piece.canvas, col * pieceWidth, row * pieceHeight);
        }
    }
    
    // ציור חלקים לא מוצבים
    piecesContainer.innerHTML = '';
    puzzlePieces.forEach((piece, index) => {
        if (!piece.placed) {
            const pieceDiv = document.createElement('div');
            pieceDiv.style.cssText = `
                display: inline-block; margin: 5px; cursor: pointer;
                border: 2px solid #ddd; border-radius: 8px; overflow: hidden;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                background: white;
            `;
            pieceDiv.appendChild(piece.canvas);
            
            pieceDiv.onmouseover = () => {
                pieceDiv.style.transform = 'scale(1.05)';
                pieceDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            };
            pieceDiv.onmouseout = () => {
                pieceDiv.style.transform = 'scale(1)';
                pieceDiv.style.boxShadow = 'none';
            };
            
            pieceDiv.onclick = () => selectPiece(piece);
            piecesContainer.appendChild(pieceDiv);
        }
    });
}

function selectPiece(piece) {
    selectedPiece = piece;
    
    // הדגשת החלק הנבחר
    const piecesContainer = document.getElementById('puzzlePieces');
    Array.from(piecesContainer.children).forEach(child => {
        child.style.border = '2px solid #ddd';
    });
    
    const pieceIndex = puzzlePieces.findIndex(p => p.id === piece.id);
    if (pieceIndex !== -1) {
        const pieceDiv = piecesContainer.children[pieceIndex - puzzlePieces.filter((p, i) => i < pieceIndex && p.placed).length];
        if (pieceDiv) {
            pieceDiv.style.border = '3px solid #4CAF50';
        }
    }
}

// הוספת מאזין קליקים על הלוח
function setupCanvasClick() {
    const canvas = document.getElementById('puzzleCanvas');
    canvas.onclick = function(e) {
        if (!selectedPiece) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const pieceWidth = canvas.width / puzzleSize;
        const pieceHeight = canvas.height / puzzleSize;
        
        const col = Math.floor(x / pieceWidth);
        const row = Math.floor(y / pieceHeight);
        const gridIndex = row * puzzleSize + col;
        
        // בדיקה אם המקום פנוי
        if (puzzleGrid[gridIndex] === null) {
            // הצבת החלק
            puzzleGrid[gridIndex] = selectedPiece;
            selectedPiece.placed = true;
            selectedPiece = null;
            
            renderPuzzle();
            checkCompletion();
        }
    };
}

function checkCompletion() {
    let correctPieces = 0;
    
    for (let i = 0; i < puzzleGrid.length; i++) {
        const piece = puzzleGrid[i];
        if (piece) {
            const expectedRow = Math.floor(i / puzzleSize);
            const expectedCol = i % puzzleSize;
            
            if (piece.correctRow === expectedRow && piece.correctCol === expectedCol) {
                correctPieces++;
            }
        }
    }
    
    if (correctPieces === puzzleSize * puzzleSize && !isCompleted) {
        isCompleted = true;
        setTimeout(() => {
            alert('🎉 כל הכבוד! הצלחת להשלים את הפאזל!');
            playSuccessSound();
        }, 500);
    }
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