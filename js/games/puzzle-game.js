// Puzzle Game - 9 pieces puzzle
class PuzzleGame {
    constructor() {
        this.puzzleImage = 'puzzle/6.png';
        this.gridSize = 3;
        this.pieces = [];
        this.correctPositions = [];
        this.currentPositions = [];
        this.draggedPiece = null;
        this.gameCompleted = false;
        
        // הגדרת צורות החלקים (flat, in, out)
        this.pieceShapes = [
            { id: 0, edges: ['flat', 'out', 'out', 'flat'] }, // פינה שמאל עליון
            { id: 1, edges: ['flat', 'in', 'out', 'in'] },   // אמצע עליון
            { id: 2, edges: ['flat', 'flat', 'in', 'out'] }, // פינה ימין עליון
            { id: 3, edges: ['in', 'out', 'out', 'flat'] },  // אמצע שמאל
            { id: 4, edges: ['in', 'in', 'in', 'in'] },      // מרכז
            { id: 5, edges: ['in', 'flat', 'out', 'out'] },  // אמצע ימין
            { id: 6, edges: ['out', 'out', 'flat', 'flat'] },// פינה שמאל תחתון
            { id: 7, edges: ['out', 'in', 'flat', 'out'] },  // אמצע תחתון
            { id: 8, edges: ['out', 'flat', 'flat', 'in'] }  // פינה ימין תחתון
        ];
        
        this.init();
    }
    
    init() {
        this.createGameContainer();
        this.createPuzzlePieces();
        this.shufflePieces();
        this.setupEventListeners();
    }
    
    createGameContainer() {
        const gameArea = document.getElementById('gameArea');
        gameArea.innerHTML = `
            <div class="puzzle-game-container">
                <div class="puzzle-board" id="puzzleBoard">
                    ${Array(9).fill().map((_, i) => `<div class="puzzle-slot" data-slot="${i}"></div>`).join('')}
                </div>
                <div class="puzzle-pieces-area" id="puzzlePiecesArea">
                    <h3>גרור את החלקים למקום הנכון:</h3>
                    <div class="pieces-container" id="piecesContainer"></div>
                </div>
                <div class="puzzle-controls">
                    <button class="btn btn-hint" onclick="puzzleGame.showHint()">רמז</button>
                    <button class="btn btn-reset" onclick="puzzleGame.reset()">התחל מחדש</button>
                </div>
            </div>
        `;
    }
    
    createPuzzlePieces() {
        const piecesContainer = document.getElementById('piecesContainer');
        
        this.pieceShapes.forEach((shape, index) => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.pieceId = shape.id;
            piece.dataset.originalPosition = index;
            
            // חישוב מיקום התמונה ברקע
            const row = Math.floor(index / 3);
            const col = index % 3;
            const bgPosX = -(col * 100);
            const bgPosY = -(row * 100);
            
            piece.style.backgroundImage = `url(${this.puzzleImage})`;
            piece.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
            piece.style.backgroundSize = '300px 300px';
            
            // הוספת צורת החלק
            this.addPieceShape(piece, shape.edges);
            
            piecesContainer.appendChild(piece);
            this.pieces.push(piece);
        });
        
        this.correctPositions = [...Array(9).keys()];
    }
    
    addPieceShape(piece, edges) {
        // יצירת SVG עבור צורת החלק
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'piece-shape');
        svg.setAttribute('viewBox', '0 0 100 100');
        
        let path = 'M ';
        const size = 100;
        const knobSize = 15;
        
        // התחלה מפינה שמאל עליון
        path += '0,0 ';
        
        // קו עליון
        if (edges[0] === 'flat') {
            path += `${size},0 `;
        } else if (edges[0] === 'out') {
            path += `${size/2-knobSize},0 `;
            path += `${size/2-knobSize},${-knobSize} `;
            path += `${size/2+knobSize},${-knobSize} `;
            path += `${size/2+knobSize},0 `;
            path += `${size},0 `;
        } else { // in
            path += `${size/2-knobSize},0 `;
            path += `${size/2-knobSize},${knobSize} `;
            path += `${size/2+knobSize},${knobSize} `;
            path += `${size/2+knobSize},0 `;
            path += `${size},0 `;
        }
        
        // קו ימני
        if (edges[1] === 'flat') {
            path += `${size},${size} `;
        } else if (edges[1] === 'out') {
            path += `${size},${size/2-knobSize} `;
            path += `${size+knobSize},${size/2-knobSize} `;
            path += `${size+knobSize},${size/2+knobSize} `;
            path += `${size},${size/2+knobSize} `;
            path += `${size},${size} `;
        } else { // in
            path += `${size},${size/2-knobSize} `;
            path += `${size-knobSize},${size/2-knobSize} `;
            path += `${size-knobSize},${size/2+knobSize} `;
            path += `${size},${size/2+knobSize} `;
            path += `${size},${size} `;
        }
        
        // קו תחתון
        if (edges[2] === 'flat') {
            path += `0,${size} `;
        } else if (edges[2] === 'out') {
            path += `${size/2+knobSize},${size} `;
            path += `${size/2+knobSize},${size+knobSize} `;
            path += `${size/2-knobSize},${size+knobSize} `;
            path += `${size/2-knobSize},${size} `;
            path += `0,${size} `;
        } else { // in
            path += `${size/2+knobSize},${size} `;
            path += `${size/2+knobSize},${size-knobSize} `;
            path += `${size/2-knobSize},${size-knobSize} `;
            path += `${size/2-knobSize},${size} `;
            path += `0,${size} `;
        }
        
        // קו שמאלי
        if (edges[3] === 'flat') {
            path += '0,0 Z';
        } else if (edges[3] === 'out') {
            path += `0,${size/2+knobSize} `;
            path += `${-knobSize},${size/2+knobSize} `;
            path += `${-knobSize},${size/2-knobSize} `;
            path += `0,${size/2-knobSize} `;
            path += '0,0 Z';
        } else { // in
            path += `0,${size/2+knobSize} `;
            path += `${knobSize},${size/2+knobSize} `;
            path += `${knobSize},${size/2-knobSize} `;
            path += `0,${size/2-knobSize} `;
            path += '0,0 Z';
        }
        
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        pathElement.setAttribute('fill', 'white');
        pathElement.setAttribute('stroke', '#333');
        pathElement.setAttribute('stroke-width', '2');
        
        svg.appendChild(pathElement);
        piece.appendChild(svg);
    }
    
    shufflePieces() {
        const container = document.getElementById('piecesContainer');
        const pieces = Array.from(container.children);
        
        // ערבב את החלקים
        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            container.appendChild(pieces[j]);
        }
    }
    
    setupEventListeners() {
        // Drag and drop events
        this.pieces.forEach(piece => {
            piece.addEventListener('dragstart', (e) => this.handleDragStart(e));
            piece.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });
        
        // Drop zones
        const slots = document.querySelectorAll('.puzzle-slot');
        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => this.handleDragOver(e));
            slot.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }
    
    handleDragStart(e) {
        this.draggedPiece = e.target;
        e.target.style.opacity = '0.5';
    }
    
    handleDragEnd(e) {
        e.target.style.opacity = '1';
        this.draggedPiece = null;
    }
    
    handleDragOver(e) {
        e.preventDefault();
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        if (!this.draggedPiece) return;
        
        const slot = e.target.closest('.puzzle-slot');
        if (!slot) return;
        
        const slotIndex = parseInt(slot.dataset.slot);
        const pieceId = parseInt(this.draggedPiece.dataset.pieceId);
        
        // בדיקה אם המקום תפוס
        if (slot.children.length > 0) {
            // החזר את החלק הקיים לאזור החלקים
            const existingPiece = slot.children[0];
            document.getElementById('piecesContainer').appendChild(existingPiece);
        }
        
        // הוסף את החלק החדש למקום
        slot.appendChild(this.draggedPiece);
        
        // בדיקה אם המשחק הושלם
        this.checkCompletion();
    }
    
    checkCompletion() {
        const slots = document.querySelectorAll('.puzzle-slot');
        let correctPieces = 0;
        
        slots.forEach((slot, index) => {
            if (slot.children.length > 0) {
                const piece = slot.children[0];
                const pieceId = parseInt(piece.dataset.pieceId);
                if (pieceId === index) {
                    correctPieces++;
                    piece.classList.add('correct');
                } else {
                    piece.classList.remove('correct');
                }
            }
        });
        
        if (correctPieces === 9) {
            this.gameCompleted = true;
            this.showVictory();
        }
    }
    
    showVictory() {
        // השמעת צליל ניצחון
        if (!window.__globalMute) {
            const audio = new Audio('sounds/success-340660 (mp3cut.net).mp3');
            audio.play().catch(() => {});
        }
        
        // הצגת הודעת ניצחון
        setTimeout(() => {
            alert('כל הכבוד! השלמת את הפאזל בהצלחה! 🎉');
        }, 500);
    }
    
    showHint() {
        const slots = document.querySelectorAll('.puzzle-slot');
        slots.forEach((slot, index) => {
            slot.style.border = '3px dashed #4CAF50';
            slot.innerHTML = `<div class="hint-number">${index + 1}</div>`;
        });
        
        setTimeout(() => {
            slots.forEach(slot => {
                slot.style.border = '';
                const hint = slot.querySelector('.hint-number');
                if (hint) hint.remove();
            });
        }, 3000);
    }
    
    reset() {
        // החזר את כל החלקים לאזור החלקים
        const piecesContainer = document.getElementById('piecesContainer');
        this.pieces.forEach(piece => {
            piece.classList.remove('correct');
            piecesContainer.appendChild(piece);
        });
        
        // ערבב מחדש
        this.shufflePieces();
        this.gameCompleted = false;
    }
}

// פונקציה להפעלת המשחק
function startPuzzleGame() {
    window.puzzleGame = new PuzzleGame();
}

// Export for global use
window.startPuzzleGame = startPuzzleGame;

// המשחק הוא אובייקט גלובלי שהאפליקציה מחפשת
window['puzzle-game'] = {
    init: function() {
        // יצירת חלון מודאלי למשחק
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = `
            <div class="game-modal-content" style="max-width: 900px; width: 95%; max-height: 90vh; overflow: auto;">
                <button class="close-button" onclick="this.parentElement.parentElement.remove(); document.documentElement.style.overflow = ''; document.body.style.overflow = '';" style="position:absolute;top:12px;right:12px;z-index:2000;">×</button>
                <div class="game-modal-header">
                    <h2>פאזל 9 חלקים</h2>
                </div>
                <div class="game-modal-body">
                    <div id="gameArea"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        // התחל את המשחק
        setTimeout(() => {
            startPuzzleGame();
        }, 100);
    }
}; 