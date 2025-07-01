// משחק פאזל מקצועי עם Konva.js
class KonvaPuzzleGame {
    constructor() {
        this.stage = null;
        this.mainLayer = null;
        this.gridSize = 3;
        this.pieces = [];
        this.puzzleBoard = [];
        this.currentImage = null;
        this.pieceWidth = 120;
        this.pieceHeight = 120;
        this.completedPieces = 0;
        
        // רשימת תמונות
        this.imageList = [
            'fruits/apple.jpg',
            'fruits/banana.jpg', 
            'fruits/orange.jpeg',
            'fruits/strawberry.jpg',
            'puzzle/1.png',
            'puzzle/2.png',
            'puzzle/3.png',
            'puzzle/4.png',
            'puzzle/5.png',
            'puzzle/6.png'
        ];
        
        this.init();
    }

    init() {
        this.createGameHTML();
        this.loadKonvaLibrary();
    }

    loadKonvaLibrary() {
        // טעינת Konva.js
        if (typeof Konva === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/konva@9/konva.min.js';
            script.onload = () => {
                this.initializeKonva();
            };
            document.head.appendChild(script);
        } else {
            this.initializeKonva();
        }
    }

    createGameHTML() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        gameContainer.innerHTML = `
            <div class="konva-puzzle-game">
                <style>
                    .konva-puzzle-game {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        padding: 20px;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .puzzle-header {
                        text-align: center;
                        color: white;
                        margin-bottom: 20px;
                    }
                    
                    .puzzle-title {
                        font-size: 2.5em;
                        margin: 0 0 15px 0;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    
                    .puzzle-controls {
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                        flex-wrap: wrap;
                        margin-bottom: 20px;
                    }
                    
                    .control-btn, .control-select {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 25px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                        color: white;
                    }
                    
                    .control-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                    }
                    
                    .control-btn.preview {
                        background: linear-gradient(45deg, #4ecdc4, #44a08d);
                    }
                    
                    .control-btn.shuffle {
                        background: linear-gradient(45deg, #45b7d1, #2980b9);
                    }
                    
                    .control-select {
                        background: white;
                        color: #333;
                    }
                    
                    .game-area {
                        display: flex;
                        gap: 20px;
                        align-items: flex-start;
                        flex-wrap: wrap;
                        justify-content: center;
                        width: 100%;
                        max-width: 1200px;
                    }
                    
                    .canvas-container {
                        background: rgba(255,255,255,0.95);
                        border-radius: 20px;
                        padding: 20px;
                        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                        backdrop-filter: blur(10px);
                    }
                    
                    .preview-container {
                        background: rgba(255,255,255,0.95);
                        border-radius: 20px;
                        padding: 20px;
                        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                        backdrop-filter: blur(10px);
                        display: none;
                        max-width: 250px;
                    }
                    
                    .preview-title {
                        text-align: center;
                        color: #333;
                        margin: 0 0 15px 0;
                        font-size: 1.1em;
                        font-weight: 600;
                    }
                    
                    .preview-image {
                        width: 100%;
                        height: auto;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    }
                    
                    .success-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.8);
                        display: none;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    
                    .success-content {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 50px;
                        border-radius: 30px;
                        text-align: center;
                        box-shadow: 0 25px 50px rgba(0,0,0,0.3);
                        animation: successPop 0.5s ease-out;
                    }
                    
                    .success-icon {
                        font-size: 80px;
                        margin-bottom: 20px;
                        animation: bounce 2s infinite;
                    }
                    
                    .success-text {
                        font-size: 32px;
                        font-weight: bold;
                        margin-bottom: 15px;
                    }
                    
                    .success-subtext {
                        font-size: 16px;
                        opacity: 0.9;
                        margin-bottom: 30px;
                    }
                    
                    .success-btn {
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: 2px solid white;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    
                    .success-btn:hover {
                        background: white;
                        color: #667eea;
                    }
                    
                    @keyframes successPop {
                        0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
                        50% { transform: scale(1.1) rotate(5deg); }
                        100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    }
                    
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-20px); }
                        60% { transform: translateY(-10px); }
                    }
                    
                    @media (max-width: 768px) {
                        .game-area {
                            flex-direction: column;
                        }
                        .puzzle-title {
                            font-size: 2em;
                        }
                        .control-btn, .control-select {
                            padding: 8px 16px;
                            font-size: 12px;
                        }
                    }
                </style>
                
                <div class="puzzle-header">
                    <h1 class="puzzle-title">🧩 פאזל מקצועי</h1>
                    <div class="puzzle-controls">
                        <select id="pieces-select" class="control-select">
                            <option value="3">9 חלקים (3×3)</option>
                            <option value="4">16 חלקים (4×4)</option>
                            <option value="5">25 חלקים (5×5)</option>
                        </select>
                        <button id="new-image-btn" class="control-btn">🖼️ תמונה חדשה</button>
                        <button id="shuffle-btn" class="control-btn shuffle">🔀 ערבב</button>
                        <button id="preview-btn" class="control-btn preview">👁️ תצוגה מקדימה</button>
                        <button id="hint-btn" class="control-btn">💡 רמז</button>
                    </div>
                </div>
                
                <div class="game-area">
                    <div class="canvas-container">
                        <div id="konva-container"></div>
                    </div>
                    
                    <div id="preview-container" class="preview-container">
                        <h3 class="preview-title">תצוגה מקדימה</h3>
                        <img id="preview-image" class="preview-image">
                    </div>
                </div>
                
                <div id="success-overlay" class="success-overlay">
                    <div class="success-content">
                        <div class="success-icon">🎉</div>
                        <div class="success-text">מזל טוב!</div>
                        <div class="success-subtext">פתרת את הפאזל בהצלחה!</div>
                        <button class="success-btn" onclick="this.parentElement.parentElement.style.display='none'">
                            המשך למשחק הבא
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    initializeKonva() {
        // יצירת stage של Konva
        const containerWidth = Math.min(800, window.innerWidth - 40);
        const containerHeight = Math.min(600, window.innerHeight - 200);
        
        this.stage = new Konva.Stage({
            container: 'konva-container',
            width: containerWidth,
            height: containerHeight
        });

        // יצירת שכבה ראשית
        this.mainLayer = new Konva.Layer();
        this.stage.add(this.mainLayer);

        // טעינת תמונה ראשונה
        this.loadRandomImage();
        this.setupEventListeners();
    }

    loadRandomImage() {
        const randomIndex = Math.floor(Math.random() * this.imageList.length);
        const imagePath = this.imageList[randomIndex];
        
        const imageObj = new Image();
        imageObj.crossOrigin = 'anonymous';
        imageObj.onload = () => {
            this.currentImage = imageObj;
            this.createPuzzle();
            
            // עדכון תצוגה מקדימה
            const previewImg = document.getElementById('preview-image');
            if (previewImg) {
                previewImg.src = imagePath;
            }
        };
        imageObj.src = imagePath;
    }

    createPuzzle() {
        this.completedPieces = 0;
        this.pieces = [];
        this.puzzleBoard = [];
        
        // ניקוי השכבה
        this.mainLayer.destroyChildren();
        
        // יצירת רקע
        this.createBackground();
        
        // יצירת חלקי הפאזל
        this.createPuzzlePieces();
        
        // ערבוב החלקים
        this.shufflePieces();
        
        // עדכון התצוגה
        this.mainLayer.draw();
    }

    createBackground() {
        // יצירת רקע עם מסגרת הפאזל
        const boardX = 50;
        const boardY = 50;
        const boardWidth = this.gridSize * this.pieceWidth;
        const boardHeight = this.gridSize * this.pieceHeight;
        
        // רקע המסגרת
        const boardBg = new Konva.Rect({
            x: boardX - 10,
            y: boardY - 10,
            width: boardWidth + 20,
            height: boardHeight + 20,
            fill: '#f0f0f0',
            stroke: '#ddd',
            strokeWidth: 2,
            cornerRadius: 10,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 5, y: 5 },
            shadowOpacity: 0.2
        });
        
        this.mainLayer.add(boardBg);
        
        // יצירת רשת המיקומים הנכונים
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const slot = new Konva.Rect({
                    x: boardX + col * this.pieceWidth,
                    y: boardY + row * this.pieceHeight,
                    width: this.pieceWidth,
                    height: this.pieceHeight,
                    fill: 'transparent',
                    stroke: '#ccc',
                    strokeWidth: 1,
                    dash: [5, 5]
                });
                
                this.mainLayer.add(slot);
                
                // שמירת המיקום הנכון
                this.puzzleBoard.push({
                    x: boardX + col * this.pieceWidth,
                    y: boardY + row * this.pieceHeight,
                    row: row,
                    col: col,
                    occupied: false
                });
            }
        }
    }

    createPuzzlePieces() {
        const sourceWidth = this.currentImage.width / this.gridSize;
        const sourceHeight = this.currentImage.height / this.gridSize;
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const pieceIndex = row * this.gridSize + col;
                
                // יצירת קנבס זמני לחלק
                const canvas = document.createElement('canvas');
                canvas.width = this.pieceWidth;
                canvas.height = this.pieceHeight;
                const ctx = canvas.getContext('2d');
                
                // ציור החלק
                ctx.drawImage(
                    this.currentImage,
                    col * sourceWidth, row * sourceHeight, sourceWidth, sourceHeight,
                    0, 0, this.pieceWidth, this.pieceHeight
                );
                
                // יצירת אובייקט תמונה של Konva
                const imageObj = new Image();
                imageObj.onload = () => {
                    const piece = new Konva.Image({
                        x: 400 + (pieceIndex % 4) * (this.pieceWidth + 10),
                        y: 100 + Math.floor(pieceIndex / 4) * (this.pieceHeight + 10),
                        image: imageObj,
                        width: this.pieceWidth,
                        height: this.pieceHeight,
                        draggable: true,
                        shadowColor: 'black',
                        shadowBlur: 10,
                        shadowOffset: { x: 3, y: 3 },
                        shadowOpacity: 0.3
                    });
                    
                    // הוספת מאפיינים מותאמים
                    piece.correctRow = row;
                    piece.correctCol = col;
                    piece.isPlaced = false;
                    piece.originalX = piece.x();
                    piece.originalY = piece.y();
                    
                    // אירועי גרירה
                    piece.on('dragstart', () => {
                        piece.moveToTop();
                        piece.shadowBlur(15);
                        piece.scaleX(1.05);
                        piece.scaleY(1.05);
                        this.playSound('click-tap-computer-mouse-352734.mp3');
                    });
                    
                    piece.on('dragend', () => {
                        piece.shadowBlur(10);
                        piece.scaleX(1);
                        piece.scaleY(1);
                        this.checkSnap(piece);
                    });
                    
                    // אפקטי hover
                    piece.on('mouseenter', () => {
                        if (!piece.isPlaced) {
                            piece.scaleX(1.02);
                            piece.scaleY(1.02);
                            document.body.style.cursor = 'pointer';
                        }
                    });
                    
                    piece.on('mouseleave', () => {
                        if (!piece.isPlaced) {
                            piece.scaleX(1);
                            piece.scaleY(1);
                            document.body.style.cursor = 'default';
                        }
                    });
                    
                    this.pieces.push(piece);
                    this.mainLayer.add(piece);
                    this.mainLayer.draw();
                };
                
                imageObj.src = canvas.toDataURL();
            }
        }
    }

    checkSnap(piece) {
        const correctSlot = this.puzzleBoard.find(slot => 
            slot.row === piece.correctRow && slot.col === piece.correctCol
        );
        
        if (!correctSlot) return;
        
        const distance = Math.sqrt(
            Math.pow(piece.x() - correctSlot.x, 2) + 
            Math.pow(piece.y() - correctSlot.y, 2)
        );
        
        if (distance < 50 && !correctSlot.occupied) {
            // צמידה למקום הנכון
            piece.x(correctSlot.x);
            piece.y(correctSlot.y);
            piece.draggable(false);
            piece.isPlaced = true;
            correctSlot.occupied = true;
            
            // אפקט ויזואלי
            piece.stroke('#4CAF50');
            piece.strokeWidth(3);
            
            // אנימציית הצלחה
            const tween = new Konva.Tween({
                node: piece,
                duration: 0.3,
                scaleX: 1.1,
                scaleY: 1.1,
                onFinish: () => {
                    piece.scaleX(1);
                    piece.scaleY(1);
                }
            });
            tween.play();
            
            this.completedPieces++;
            this.playSound('success-340660 (mp3cut.net).mp3');
            
            // יצירת אפקט זיקוקים קטן
            this.createSparkleEffect(piece.x() + this.pieceWidth/2, piece.y() + this.pieceHeight/2);
            
            // בדיקה אם הפאזל הושלם
            if (this.completedPieces === this.gridSize * this.gridSize) {
                setTimeout(() => {
                    this.showSuccess();
                }, 500);
            }
        } else {
            // החזרה למקום המקורי אם לא נכון
            const tween = new Konva.Tween({
                node: piece,
                duration: 0.3,
                x: piece.originalX,
                y: piece.originalY,
                easing: Konva.Easings.BounceEaseOut
            });
            tween.play();
            
            this.playSound('wrong-47985 (mp3cut.net).mp3');
        }
    }

    createSparkleEffect(x, y) {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726'];
        
        for (let i = 0; i < 8; i++) {
            const sparkle = new Konva.Circle({
                x: x,
                y: y,
                radius: 3,
                fill: colors[Math.floor(Math.random() * colors.length)],
                opacity: 1
            });
            
            this.mainLayer.add(sparkle);
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            
            const tween = new Konva.Tween({
                node: sparkle,
                duration: 1,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                opacity: 0,
                scaleX: 0,
                scaleY: 0,
                onFinish: () => {
                    sparkle.destroy();
                }
            });
            tween.play();
        }
    }

    shufflePieces() {
        // ערבוב מיקומי החלקים
        const positions = [];
        this.pieces.forEach(piece => {
            if (!piece.isPlaced) {
                positions.push({ x: piece.originalX, y: piece.originalY });
            }
        });
        
        // ערבוב המערך
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        // הקצאת מיקומים חדשים
        let posIndex = 0;
        this.pieces.forEach(piece => {
            if (!piece.isPlaced && positions[posIndex]) {
                piece.x(positions[posIndex].x);
                piece.y(positions[posIndex].y);
                piece.originalX = positions[posIndex].x;
                piece.originalY = positions[posIndex].y;
                posIndex++;
            }
        });
        
        this.mainLayer.draw();
    }

    showHint() {
        // הצגת רמז - הדגשת החלק הבא שצריך להציב
        const unplacedPieces = this.pieces.filter(piece => !piece.isPlaced);
        if (unplacedPieces.length === 0) return;
        
        const hintPiece = unplacedPieces[0];
        const correctSlot = this.puzzleBoard.find(slot => 
            slot.row === hintPiece.correctRow && slot.col === hintPiece.correctCol
        );
        
        if (correctSlot) {
            // הדגשת המיקום הנכון
            const highlight = new Konva.Rect({
                x: correctSlot.x - 5,
                y: correctSlot.y - 5,
                width: this.pieceWidth + 10,
                height: this.pieceHeight + 10,
                stroke: '#FFD700',
                strokeWidth: 4,
                dash: [10, 5],
                opacity: 0.8
            });
            
            this.mainLayer.add(highlight);
            
            // אנימציית הדגשה
            const tween = new Konva.Tween({
                node: highlight,
                duration: 2,
                opacity: 0,
                onFinish: () => {
                    highlight.destroy();
                }
            });
            tween.play();
            
            // הדגשת החלק
            const pieceTween = new Konva.Tween({
                node: hintPiece,
                duration: 0.5,
                scaleX: 1.1,
                scaleY: 1.1,
                onFinish: () => {
                    const backTween = new Konva.Tween({
                        node: hintPiece,
                        duration: 0.5,
                        scaleX: 1,
                        scaleY: 1
                    });
                    backTween.play();
                }
            });
            pieceTween.play();
        }
    }

    showSuccess() {
        document.getElementById('success-overlay').style.display = 'flex';
        this.playSound('game-level-complete-143022.mp3');
        this.createFireworks();
    }

    createFireworks() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#a8e6cf'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                    animation: fireworkPop 3s ease-out forwards;
                `;
                
                document.body.appendChild(firework);
                setTimeout(() => firework.remove(), 3000);
            }, i * 150);
        }
        
        // הוספת אנימציית זיקוקים
        if (!document.getElementById('firework-style')) {
            const style = document.createElement('style');
            style.id = 'firework-style';
            style.textContent = `
                @keyframes fireworkPop {
                    0% { transform: scale(0) rotate(0deg); opacity: 1; }
                    25% { transform: scale(2) rotate(90deg); opacity: 0.8; }
                    50% { transform: scale(1.5) rotate(180deg); opacity: 0.6; }
                    75% { transform: scale(2.5) rotate(270deg); opacity: 0.4; }
                    100% { transform: scale(0) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupEventListeners() {
        document.getElementById('pieces-select')?.addEventListener('change', (e) => {
            this.gridSize = parseInt(e.target.value);
            this.pieceWidth = Math.max(80, 300 / this.gridSize);
            this.pieceHeight = this.pieceWidth;
            this.createPuzzle();
        });
        
        document.getElementById('new-image-btn')?.addEventListener('click', () => {
            this.loadRandomImage();
        });
        
        document.getElementById('shuffle-btn')?.addEventListener('click', () => {
            this.shufflePieces();
        });
        
        document.getElementById('preview-btn')?.addEventListener('click', () => {
            const previewContainer = document.getElementById('preview-container');
            const isVisible = previewContainer.style.display !== 'none';
            previewContainer.style.display = isVisible ? 'none' : 'block';
            document.getElementById('preview-btn').textContent = 
                isVisible ? '👁️ תצוגה מקדימה' : '❌ סגור תצוגה';
        });
        
        document.getElementById('hint-btn')?.addEventListener('click', () => {
            this.showHint();
        });
    }

    playSound(soundFile) {
        try {
            const audio = new Audio(`sounds/${soundFile}`);
            audio.volume = 0.4;
            audio.play().catch(e => console.log('Could not play sound:', e));
        } catch (e) {
            console.log('Sound not available:', e);
        }
    }
}

// הגדרת המשחק כאובייקט גלובלי
window['simple-puzzle'] = {
    game: null,
    init: function() {
        // יצירת מודאל למשחק
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = `
            <div class="game-modal-content" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                z-index: 1000;
                overflow-y: auto;
            ">
                <button class="close-button" onclick="this.parentElement.parentElement.remove(); document.documentElement.style.overflow = ''; document.body.style.overflow = '';" style="
                    position: fixed;
                    top: 15px;
                    right: 15px;
                    z-index: 2000;
                    font-size: 2rem;
                    width: 50px;
                    height: 50px;
                    background: #fff;
                    border: 2px solid #f44336;
                    border-radius: 50%;
                    color: #f44336;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                ">×</button>
                <div id="game-container" style="width: 100%; height: 100vh;"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        // אתחול המשחק
        setTimeout(() => {
            this.game = new KonvaPuzzleGame();
        }, 100);
    }
};

// אתחול המשחק אם הדף נטען ישירות
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.querySelector('.game-modal')) {
            new KonvaPuzzleGame();
        }
    });
} else {
    if (!document.querySelector('.game-modal')) {
        new KonvaPuzzleGame();
    }
} 