// Custom Jigsaw Puzzle Game
class JigsawPuzzle {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.image = null;
        this.pieces = [];
        this.draggedPiece = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.solvedPieces = 0;
        
        // Configuration
        this.rows = options.rows || 3;
        this.cols = options.cols || 3;
        this.pieceWidth = 0;
        this.pieceHeight = 0;
        this.boardStartX = 50;
        this.boardStartY = 50;
        this.piecesAreaY = 0;
        
        this.onComplete = options.onComplete || (() => {});
        
        this.setupCanvas();
        this.setupEventListeners();
    }
    
    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.border = '2px solid #333';
        this.canvas.style.borderRadius = '10px';
        this.canvas.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        
        // Calculate areas
        this.boardHeight = 350;
        this.piecesAreaY = this.boardHeight + 100;
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
    }
    
    loadImage(imageSrc) {
        return new Promise((resolve, reject) => {
            this.image = new Image();
            this.image.onload = () => {
                this.calculatePieceSizes();
                this.createPieces();
                this.shufflePieces();
                this.draw();
                resolve();
            };
            this.image.onerror = reject;
            this.image.src = imageSrc;
        });
    }
    
    calculatePieceSizes() {
        const maxBoardWidth = this.canvas.width - 100;
        const maxBoardHeight = this.boardHeight - 100;
        
        const imageAspect = this.image.width / this.image.height;
        let boardWidth, boardHeight;
        
        if (imageAspect > maxBoardWidth / maxBoardHeight) {
            boardWidth = maxBoardWidth;
            boardHeight = boardWidth / imageAspect;
        } else {
            boardHeight = maxBoardHeight;
            boardWidth = boardHeight * imageAspect;
        }
        
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.boardStartX = (this.canvas.width - boardWidth) / 2;
        this.boardStartY = 50;
        
        this.pieceWidth = boardWidth / this.cols;
        this.pieceHeight = boardHeight / this.rows;
    }
    
    createPieces() {
        this.pieces = [];
        this.solvedPieces = 0;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const piece = {
                    id: row * this.cols + col,
                    correctRow: row,
                    correctCol: col,
                    currentX: 0,
                    currentY: 0,
                    width: this.pieceWidth,
                    height: this.pieceHeight,
                    solved: false,
                    
                    // Puzzle piece shape properties
                    tabs: {
                        top: this.generateTab(),
                        right: this.generateTab(),
                        bottom: this.generateTab(),
                        left: this.generateTab()
                    }
                };
                
                // Adjust tabs for edge pieces
                if (row === 0) piece.tabs.top = 0; // Top edge
                if (row === this.rows - 1) piece.tabs.bottom = 0; // Bottom edge
                if (col === 0) piece.tabs.left = 0; // Left edge
                if (col === this.cols - 1) piece.tabs.right = 0; // Right edge
                
                // Match adjacent pieces' tabs
                if (row > 0) {
                    const topPiece = this.pieces[(row - 1) * this.cols + col];
                    piece.tabs.top = -topPiece.tabs.bottom;
                }
                if (col > 0) {
                    const leftPiece = this.pieces[row * this.cols + (col - 1)];
                    piece.tabs.left = -leftPiece.tabs.right;
                }
                
                this.pieces.push(piece);
            }
        }
    }
    
    generateTab() {
        return Math.random() > 0.5 ? 1 : -1; // 1 = tab out, -1 = tab in
    }
    
    shufflePieces() {
        const piecesAreaHeight = this.canvas.height - this.piecesAreaY - 20;
        const piecesPerRow = Math.floor((this.canvas.width - 40) / (this.pieceWidth + 10));
        
        this.pieces.forEach((piece, index) => {
            const row = Math.floor(index / piecesPerRow);
            const col = index % piecesPerRow;
            
            piece.currentX = 20 + col * (this.pieceWidth + 10);
            piece.currentY = this.piecesAreaY + 20 + row * (this.pieceHeight + 10);
            
            // Add some random offset
            piece.currentX += (Math.random() - 0.5) * 20;
            piece.currentY += (Math.random() - 0.5) * 20;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board area
        this.drawBoard();
        
        // Draw pieces
        this.pieces.forEach(piece => {
            if (!piece.solved) {
                this.drawPiece(piece);
            }
        });
        
        // Draw solved pieces on board
        this.pieces.forEach(piece => {
            if (piece.solved) {
                this.drawSolvedPiece(piece);
            }
        });
        
        // Draw separator line
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.piecesAreaY - 10);
        this.ctx.lineTo(this.canvas.width, this.piecesAreaY - 10);
        this.ctx.stroke();
    }
    
    drawBoard() {
        // Draw board background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.boardStartX - 10, this.boardStartY - 10, 
                         this.boardWidth + 20, this.boardHeight + 20);
        
        // Draw board border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.boardStartX - 10, this.boardStartY - 10, 
                           this.boardWidth + 20, this.boardHeight + 20);
        
        // Draw grid lines for guidance
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        
        for (let i = 1; i < this.cols; i++) {
            const x = this.boardStartX + i * this.pieceWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.boardStartY);
            this.ctx.lineTo(x, this.boardStartY + this.boardHeight);
            this.ctx.stroke();
        }
        
        for (let i = 1; i < this.rows; i++) {
            const y = this.boardStartY + i * this.pieceHeight;
            this.ctx.beginPath();
            this.ctx.moveTo(this.boardStartX, y);
            this.ctx.lineTo(this.boardStartX + this.boardWidth, y);
            this.ctx.stroke();
        }
    }
    
    drawPiece(piece) {
        this.ctx.save();
        
        // Create puzzle piece path
        const path = this.createPiecePath(piece);
        
        // Clip to piece shape
        this.ctx.clip(path);
        
        // Draw piece image
        const sourceX = piece.correctCol * (this.image.width / this.cols);
        const sourceY = piece.correctRow * (this.image.height / this.rows);
        const sourceWidth = this.image.width / this.cols;
        const sourceHeight = this.image.height / this.rows;
        
        this.ctx.drawImage(
            this.image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            piece.currentX, piece.currentY, piece.width, piece.height
        );
        
        this.ctx.restore();
        
        // Draw piece border
        this.ctx.strokeStyle = piece === this.draggedPiece ? '#ff6b6b' : '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke(path);
        
        // Add shadow effect
        if (piece === this.draggedPiece) {
            this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 3;
            this.ctx.shadowOffsetY = 3;
            this.ctx.stroke(path);
            this.ctx.shadowColor = 'transparent';
        }
    }
    
    drawSolvedPiece(piece) {
        const x = this.boardStartX + piece.correctCol * this.pieceWidth;
        const y = this.boardStartY + piece.correctRow * this.pieceHeight;
        
        // Draw piece image
        const sourceX = piece.correctCol * (this.image.width / this.cols);
        const sourceY = piece.correctRow * (this.image.height / this.rows);
        const sourceWidth = this.image.width / this.cols;
        const sourceHeight = this.image.height / this.rows;
        
        this.ctx.drawImage(
            this.image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            x, y, piece.width, piece.height
        );
        
        // Draw green border for solved pieces
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, piece.width, piece.height);
    }
    
    createPiecePath(piece) {
        const path = new Path2D();
        const x = piece.currentX;
        const y = piece.currentY;
        const w = piece.width;
        const h = piece.height;
        const tabSize = Math.min(w, h) * 0.2;
        
        path.moveTo(x, y);
        
        // Top edge
        if (piece.tabs.top !== 0) {
            path.lineTo(x + w * 0.3, y);
            if (piece.tabs.top > 0) {
                path.arc(x + w * 0.5, y - tabSize * 0.5, tabSize, 0, Math.PI, true);
            } else {
                path.arc(x + w * 0.5, y + tabSize * 0.5, tabSize, Math.PI, 0, true);
            }
            path.lineTo(x + w * 0.7, y);
        }
        path.lineTo(x + w, y);
        
        // Right edge
        if (piece.tabs.right !== 0) {
            path.lineTo(x + w, y + h * 0.3);
            if (piece.tabs.right > 0) {
                path.arc(x + w + tabSize * 0.5, y + h * 0.5, tabSize, Math.PI * 1.5, Math.PI * 0.5, true);
            } else {
                path.arc(x + w - tabSize * 0.5, y + h * 0.5, tabSize, Math.PI * 0.5, Math.PI * 1.5, true);
            }
            path.lineTo(x + w, y + h * 0.7);
        }
        path.lineTo(x + w, y + h);
        
        // Bottom edge
        if (piece.tabs.bottom !== 0) {
            path.lineTo(x + w * 0.7, y + h);
            if (piece.tabs.bottom > 0) {
                path.arc(x + w * 0.5, y + h + tabSize * 0.5, tabSize, Math.PI, 0, true);
            } else {
                path.arc(x + w * 0.5, y + h - tabSize * 0.5, tabSize, 0, Math.PI, true);
            }
            path.lineTo(x + w * 0.3, y + h);
        }
        path.lineTo(x, y + h);
        
        // Left edge
        if (piece.tabs.left !== 0) {
            path.lineTo(x, y + h * 0.7);
            if (piece.tabs.left > 0) {
                path.arc(x - tabSize * 0.5, y + h * 0.5, tabSize, Math.PI * 0.5, Math.PI * 1.5, true);
            } else {
                path.arc(x + tabSize * 0.5, y + h * 0.5, tabSize, Math.PI * 1.5, Math.PI * 0.5, true);
            }
            path.lineTo(x, y + h * 0.3);
        }
        path.closePath();
        
        return path;
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    getTouchPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    }
    
    getPieceAt(x, y) {
        for (let i = this.pieces.length - 1; i >= 0; i--) {
            const piece = this.pieces[i];
            if (!piece.solved && 
                x >= piece.currentX && x <= piece.currentX + piece.width &&
                y >= piece.currentY && y <= piece.currentY + piece.height) {
                return piece;
            }
        }
        return null;
    }
    
    onMouseDown(e) {
        const pos = this.getMousePos(e);
        this.startDrag(pos.x, pos.y);
    }
    
    onMouseMove(e) {
        const pos = this.getMousePos(e);
        this.drag(pos.x, pos.y);
    }
    
    onMouseUp(e) {
        const pos = this.getMousePos(e);
        this.endDrag(pos.x, pos.y);
    }
    
    onTouchStart(e) {
        e.preventDefault();
        const pos = this.getTouchPos(e);
        this.startDrag(pos.x, pos.y);
    }
    
    onTouchMove(e) {
        e.preventDefault();
        const pos = this.getTouchPos(e);
        this.drag(pos.x, pos.y);
    }
    
    onTouchEnd(e) {
        e.preventDefault();
        this.endDrag();
    }
    
    startDrag(x, y) {
        this.draggedPiece = this.getPieceAt(x, y);
        if (this.draggedPiece) {
            this.offsetX = x - this.draggedPiece.currentX;
            this.offsetY = y - this.draggedPiece.currentY;
            
            // Move dragged piece to end of array (draw last)
            const index = this.pieces.indexOf(this.draggedPiece);
            this.pieces.splice(index, 1);
            this.pieces.push(this.draggedPiece);
        }
    }
    
    drag(x, y) {
        if (this.draggedPiece) {
            this.draggedPiece.currentX = x - this.offsetX;
            this.draggedPiece.currentY = y - this.offsetY;
            this.draw();
        }
    }
    
    endDrag(x, y) {
        if (this.draggedPiece) {
            this.checkIfSolved(this.draggedPiece);
            this.draggedPiece = null;
            this.draw();
        }
    }
    
    checkIfSolved(piece) {
        const correctX = this.boardStartX + piece.correctCol * this.pieceWidth;
        const correctY = this.boardStartY + piece.correctRow * this.pieceHeight;
        
        const tolerance = 30;
        
        if (Math.abs(piece.currentX - correctX) < tolerance &&
            Math.abs(piece.currentY - correctY) < tolerance) {
            
            piece.solved = true;
            piece.currentX = correctX;
            piece.currentY = correctY;
            this.solvedPieces++;
            
            this.playSound('success');
            
            if (this.solvedPieces === this.pieces.length) {
                setTimeout(() => {
                    this.onPuzzleComplete();
                }, 500);
            }
        }
    }
    
    onPuzzleComplete() {
        this.playSound('complete');
        this.onComplete();
        
        // Add celebration effect
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        setTimeout(() => {
            this.draw();
        }, 1000);
    }
    
    playSound(type) {
        const sounds = {
            success: 'sounds/success-340660 (mp3cut.net).mp3',
            complete: 'sounds/game-level-complete-143022.mp3'
        };
        
        if (sounds[type]) {
            try {
                const audio = new Audio(sounds[type]);
                audio.volume = 0.3;
                audio.play().catch(() => {});
            } catch (e) {}
        }
    }
    
    shuffle() {
        this.shufflePieces();
        this.pieces.forEach(piece => piece.solved = false);
        this.solvedPieces = 0;
        this.draw();
    }
}

// Game initialization
window['simple-puzzle'] = {
    currentPuzzle: null,
    
    init: function() {
        this.setupUI();
        this.newPuzzle();
    },
    
    setupUI: function() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
            <div class="game-header">
                <h2>🧩 פאזל פשוט</h2>
                <div class="puzzle-controls">
                    <select id="puzzle-image">
                        <option value="fruits/apple.jpg">תפוח 🍎</option>
                        <option value="fruits/banana.jpg">בננה 🍌</option>
                        <option value="fruits/orange.jpeg">תפוז 🍊</option>
                        <option value="fruits/strawberry.jpg">תות 🍓</option>
                        <option value="fruits/pear.jpg">אגס 🍐</option>
                        <option value="fruits/lemon.jpg">לימון 🍋</option>
                        <option value="fruits/water melon.jpg">אבטיח 🍉</option>
                    </select>
                    <select id="puzzle-difficulty">
                        <option value="2,2">קל מאוד (4 חלקים)</option>
                        <option value="3,3" selected>קל (9 חלקים)</option>
                        <option value="4,4">בינוני (16 חלקים)</option>
                    </select>
                    <button onclick="window['simple-puzzle'].newPuzzle()">פאזל חדש</button>
                    <button onclick="window['simple-puzzle'].shufflePuzzle()">ערבב</button>
                    <button onclick="window['simple-puzzle'].showPreview()">תצוגה מקדימה</button>
                </div>
            </div>
            <div class="puzzle-container">
                <canvas id="puzzle-canvas"></canvas>
            </div>
            <div id="puzzle-info">
                <p>גרור את החלקים למקום הנכון בלוח!</p>
                <p>החלקים יצטמדו כשהם קרובים למקום הנכון</p>
            </div>
        `;
        
        this.addStyles();
    },
    
    addStyles: function() {
        if (document.getElementById('puzzle-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'puzzle-styles';
        style.textContent = `
            .game-header {
                text-align: center;
                margin-bottom: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            
            .game-header h2 {
                margin: 0 0 15px 0;
                font-size: 28px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .puzzle-controls {
                display: flex;
                justify-content: center;
                gap: 10px;
                flex-wrap: wrap;
                align-items: center;
            }
            
            .puzzle-controls select, .puzzle-controls button {
                padding: 10px 15px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .puzzle-controls select {
                background: white;
                color: #333;
            }
            
            .puzzle-controls button {
                background: linear-gradient(45deg, #4CAF50, #45a049);
                color: white;
                min-width: 100px;
            }
            
            .puzzle-controls button:hover {
                background: linear-gradient(45deg, #45a049, #3d8b40);
                transform: translateY(-2px);
            }
            
            .puzzle-container {
                display: flex;
                justify-content: center;
                margin: 20px 0;
            }
            
            #puzzle-canvas {
                display: block;
                margin: 0 auto;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            
            #puzzle-info {
                text-align: center;
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin-top: 20px;
                border-left: 4px solid #4CAF50;
            }
            
            #puzzle-info p {
                margin: 5px 0;
                color: #666;
                font-size: 14px;
            }
            
            .success-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #4CAF50, #45a049);
                color: white;
                padding: 30px 50px;
                border-radius: 15px;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: celebrationBounce 0.8s ease-in-out;
            }
            
            @keyframes celebrationBounce {
                0%, 20%, 60%, 100% {
                    transform: translate(-50%, -50%) translateY(0);
                }
                40% {
                    transform: translate(-50%, -50%) translateY(-20px);
                }
                80% {
                    transform: translate(-50%, -50%) translateY(-10px);
                }
            }
            
            .preview-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            
            .preview-content {
                max-width: 90%;
                max-height: 90%;
                background: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
            }
            
            .preview-content img {
                max-width: 100%;
                max-height: 70vh;
                border-radius: 10px;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    newPuzzle: function() {
        const imageSelect = document.getElementById('puzzle-image');
        const difficultySelect = document.getElementById('puzzle-difficulty');
        
        const imageSrc = imageSelect.value;
        const [rows, cols] = difficultySelect.value.split(',').map(Number);
        
        this.currentPuzzle = new JigsawPuzzle('puzzle-canvas', {
            rows: rows,
            cols: cols,
            onComplete: () => {
                this.showSuccessMessage();
            }
        });
        
        this.currentPuzzle.loadImage(imageSrc).catch(() => {
            alert('שגיאה בטעינת התמונה');
        });
    },
    
    shufflePuzzle: function() {
        if (this.currentPuzzle) {
            this.currentPuzzle.shuffle();
        }
    },
    
    showPreview: function() {
        const imageSelect = document.getElementById('puzzle-image');
        const imageSrc = imageSelect.value;
        
        const preview = document.createElement('div');
        preview.className = 'preview-overlay';
        preview.onclick = () => preview.remove();
        
        preview.innerHTML = `
            <div class="preview-content">
                <h3>תצוגה מקדימה</h3>
                <img src="${imageSrc}">
                <p style="margin-top: 15px; color: #666;">לחץ כדי לסגור</p>
            </div>
        `;
        
        document.body.appendChild(preview);
    },
    
    showSuccessMessage: function() {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = '🎉 מזל טוב! פתרת את הפאזל! 🎉';
        
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 3000);
    }
};