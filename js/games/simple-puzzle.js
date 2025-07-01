// משחק פאזל מקצועי עם ספרייה מתקדמת
class ProfessionalPuzzleGame {
    constructor() {
        this.gameContainer = null;
        this.puzzleContainer = null;
        this.piecesContainer = null;
        this.currentImage = null;
        this.gridSize = 3;
        this.pieces = [];
        this.completedPieces = 0;
        this.totalPieces = 9;
        
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
        this.createGameInterface();
        this.loadRandomImage();
        this.setupEventListeners();
    }

    createGameInterface() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        gameContainer.innerHTML = `
            <div class="professional-puzzle-game">
                <style>
                    .professional-puzzle-game {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    
                    .puzzle-header {
                        text-align: center;
                        color: white;
                        margin-bottom: 30px;
                    }
                    
                    .puzzle-title {
                        font-size: 3em;
                        margin: 0;
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
                        margin: 20px 0;
                    }
                    
                    .control-btn, .control-select {
                        padding: 12px 20px;
                        border: none;
                        border-radius: 25px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    }
                    
                    .control-btn {
                        background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                        color: white;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
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
                    
                    .puzzle-main {
                        display: flex;
                        gap: 30px;
                        justify-content: center;
                        align-items: flex-start;
                        flex-wrap: wrap;
                    }
                    
                    .puzzle-board {
                        background: rgba(255,255,255,0.95);
                        border-radius: 20px;
                        padding: 20px;
                        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                        backdrop-filter: blur(10px);
                        position: relative;
                    }
                    
                    .puzzle-grid {
                        display: grid;
                        gap: 2px;
                        background: #ddd;
                        border: 3px solid #bbb;
                        border-radius: 10px;
                        padding: 10px;
                        position: relative;
                    }
                    
                    .puzzle-slot {
                        background: #f8f9fa;
                        border: 2px dashed #ccc;
                        border-radius: 8px;
                        position: relative;
                        transition: all 0.3s ease;
                    }
                    
                    .puzzle-slot.highlight {
                        border-color: #4ecdc4;
                        background: rgba(78, 205, 196, 0.1);
                        transform: scale(1.02);
                    }
                    
                    .puzzle-slot.completed {
                        border-color: #27ae60;
                        background: rgba(39, 174, 96, 0.1);
                    }
                    
                    .pieces-area {
                        background: rgba(255,255,255,0.95);
                        border-radius: 20px;
                        padding: 20px;
                        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                        backdrop-filter: blur(10px);
                        max-width: 400px;
                    }
                    
                    .pieces-title {
                        text-align: center;
                        color: #333;
                        margin: 0 0 15px 0;
                        font-size: 1.2em;
                        font-weight: 600;
                    }
                    
                    .pieces-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        justify-content: center;
                        min-height: 200px;
                        padding: 15px;
                        border: 2px dashed #ddd;
                        border-radius: 10px;
                        background: #fafafa;
                    }
                    
                    .puzzle-piece {
                        border-radius: 8px;
                        cursor: grab;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        border: 2px solid #fff;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .puzzle-piece:hover {
                        transform: scale(1.05);
                        box-shadow: 0 6px 15px rgba(0,0,0,0.2);
                        z-index: 10;
                    }
                    
                    .puzzle-piece:active {
                        cursor: grabbing;
                    }
                    
                    .puzzle-piece.dragging {
                        transform: scale(1.1) rotate(5deg);
                        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                        z-index: 100;
                        border-color: #4ecdc4;
                    }
                    
                    .puzzle-piece img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        pointer-events: none;
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
                    
                    @keyframes sparkle {
                        0%, 100% { opacity: 0; transform: scale(0); }
                        50% { opacity: 1; transform: scale(1); }
                    }
                    
                    .sparkle {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        background: #ffd700;
                        border-radius: 50%;
                        animation: sparkle 1.5s infinite;
                        pointer-events: none;
                    }
                </style>
                
                <div class="puzzle-header">
                    <h1 class="puzzle-title">🧩 פאזל מקצועי</h1>
                    <div class="puzzle-controls">
                        <select id="pieces-select" class="control-select">
                            <option value="3">9 חלקים (3×3)</option>
                            <option value="4">16 חלקים (4×4)</option>
                            <option value="5">25 חלקים (5×5)</option>
                            <option value="6">36 חלקים (6×6)</option>
                        </select>
                        <button id="new-image-btn" class="control-btn">🖼️ תמונה חדשה</button>
                        <button id="shuffle-btn" class="control-btn shuffle">🔀 ערבב</button>
                        <button id="preview-btn" class="control-btn preview">👁️ תצוגה מקדימה</button>
                    </div>
                </div>
                
                <div class="puzzle-main">
                    <div class="puzzle-board">
                        <div id="puzzle-grid" class="puzzle-grid"></div>
                    </div>
                    
                    <div class="pieces-area">
                        <h3 class="pieces-title">חלקי הפאזל</h3>
                        <div id="pieces-container" class="pieces-container"></div>
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
        
        this.puzzleContainer = document.getElementById('puzzle-grid');
        this.piecesContainer = document.getElementById('pieces-container');
    }

    loadRandomImage() {
        const randomIndex = Math.floor(Math.random() * this.imageList.length);
        const imagePath = this.imageList[randomIndex];
        
        this.currentImage = new Image();
        this.currentImage.crossOrigin = 'anonymous';
        this.currentImage.onload = () => {
            this.createPuzzle();
            document.getElementById('preview-image').src = imagePath;
        };
        this.currentImage.src = imagePath;
    }

    createPuzzle() {
        this.totalPieces = this.gridSize * this.gridSize;
        this.completedPieces = 0;
        this.pieces = [];
        
        // יצירת רשת הפאזל
        this.createPuzzleGrid();
        
        // יצירת חלקי הפאזל
        this.createPuzzlePieces();
        
        // ערבוב החלקים
        this.shufflePieces();
    }

    createPuzzleGrid() {
        this.puzzleContainer.innerHTML = '';
        this.puzzleContainer.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        this.puzzleContainer.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;
        
        const slotSize = Math.min(400 / this.gridSize, 100);
        
        for (let i = 0; i < this.totalPieces; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.style.width = slotSize + 'px';
            slot.style.height = slotSize + 'px';
            slot.dataset.index = i;
            
            // אירועי גרירה
            slot.addEventListener('dragover', this.handleDragOver.bind(this));
            slot.addEventListener('drop', this.handleDrop.bind(this));
            
            this.puzzleContainer.appendChild(slot);
        }
    }

    createPuzzlePieces() {
        this.piecesContainer.innerHTML = '';
        
        const pieceSize = Math.min(300 / this.gridSize, 80);
        const canvasSize = 400;
        
        for (let i = 0; i < this.totalPieces; i++) {
            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;
            
            // יצירת קנבס לחלק
            const canvas = document.createElement('canvas');
            canvas.width = pieceSize;
            canvas.height = pieceSize;
            canvas.className = 'puzzle-piece';
            canvas.draggable = true;
            canvas.dataset.index = i;
            canvas.dataset.correctIndex = i;
            
            const ctx = canvas.getContext('2d');
            
            // חישוב מיקום בתמונה המקורית
            const sourceX = (col * this.currentImage.width) / this.gridSize;
            const sourceY = (row * this.currentImage.height) / this.gridSize;
            const sourceWidth = this.currentImage.width / this.gridSize;
            const sourceHeight = this.currentImage.height / this.gridSize;
            
            // ציור החלק
            ctx.drawImage(
                this.currentImage,
                sourceX, sourceY, sourceWidth, sourceHeight,
                0, 0, pieceSize, pieceSize
            );
            
            // הוספת מסגרת
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, pieceSize, pieceSize);
            
            // אירועי גרירה
            canvas.addEventListener('dragstart', this.handleDragStart.bind(this));
            canvas.addEventListener('dragend', this.handleDragEnd.bind(this));
            
            this.piecesContainer.appendChild(canvas);
            this.pieces.push(canvas);
        }
    }

    shufflePieces() {
        // ערבוב מערך החלקים
        for (let i = this.pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.pieces[i], this.pieces[j]] = [this.pieces[j], this.pieces[i]];
        }
        
        // עדכון הצגת החלקים
        this.piecesContainer.innerHTML = '';
        this.pieces.forEach(piece => {
            this.piecesContainer.appendChild(piece);
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
        e.target.classList.add('dragging');
        this.playSound('click-tap-computer-mouse-352734.mp3');
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.target.classList.add('highlight');
    }

    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('highlight');
        
        const pieceIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const slotIndex = parseInt(e.target.dataset.index);
        const piece = this.pieces.find(p => parseInt(p.dataset.index) === pieceIndex);
        
        if (piece && parseInt(piece.dataset.correctIndex) === slotIndex) {
            // חלק נכון!
            e.target.appendChild(piece);
            e.target.classList.add('completed');
            piece.draggable = false;
            piece.style.cursor = 'default';
            
            this.completedPieces++;
            this.playSound('success-340660 (mp3cut.net).mp3');
            
            // אפקט נצנוצים
            this.createSparkles(e.target);
            
            // בדיקה אם הפאזל הושלם
            if (this.completedPieces === this.totalPieces) {
                setTimeout(() => {
                    this.showSuccess();
                }, 500);
            }
        } else {
            // חלק לא נכון
            this.playSound('wrong-47985 (mp3cut.net).mp3');
            this.shakeElement(e.target);
        }
    }

    createSparkles(element) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = Math.random() * element.offsetWidth + 'px';
                sparkle.style.top = Math.random() * element.offsetHeight + 'px';
                element.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1500);
            }, i * 100);
        }
    }

    shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
        
        // הוספת אנימציית רעידה
        if (!document.getElementById('shake-style')) {
            const style = document.createElement('style');
            style.id = 'shake-style';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
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
            this.game = new ProfessionalPuzzleGame();
        }, 100);
    }
};

// אתחול המשחק אם הדף נטען ישירות
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.querySelector('.game-modal')) {
            new ProfessionalPuzzleGame();
        }
    });
} else {
    if (!document.querySelector('.game-modal')) {
        new ProfessionalPuzzleGame();
    }
} 