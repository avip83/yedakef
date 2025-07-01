// Puzzle Game - 9 pieces, real puzzle shapes, drag & drop, pieces outside the board
class PuzzleGame {
    constructor() {
        this.puzzleImage = 'puzzle/6.png';
        this.gridSize = 3;
        this.pieceSize = 120;
        this.boardSize = this.pieceSize * this.gridSize;
        this.pieces = [];
        this.draggedPiece = null;
        this.gameCompleted = false;
        this.previewMode = false;
        this.pieceShapes = [
            // [top, right, bottom, left] (0=flat, 1=out, -1=in)
            [0, 1, 1, 0],   // 0 TL
            [0, -1, 1, 1],  // 1 TM
            [0, 0, -1, 1],  // 2 TR
            [-1, 1, 1, 0],  // 3 ML
            [-1, -1, -1, 1],// 4 MM
            [-1, 0, 1, -1], // 5 MR
            [1, 1, 0, 0],   // 6 BL
            [1, -1, 0, 1],  // 7 BM
            [1, 0, 0, -1],  // 8 BR
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
            <div style="background:#7fffa0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <div style="margin:32px 0 16px 0;padding:18px;background:#222;border-radius:12px;box-shadow:0 4px 16px #0006;display:inline-block;">
                    <div id="puzzle-headbreaker"></div>
                </div>
                <div style="margin-bottom:16px;">
                    <button onclick="window.puzzleCanvas && window.puzzleCanvas.shuffle(0.7);window.puzzleCanvas && window.puzzleCanvas.draw();" class="pz-btn">ערבב</button>
                    <button onclick="window.puzzleCanvas && window.puzzleCanvas.solve();window.puzzleCanvas && window.puzzleCanvas.draw();" class="pz-btn">פתור</button>
                </div>
            </div>
        `;
    }

    createPuzzlePieces() {
        // Create SVG clipPaths for each piece
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        defs.setAttribute('width', '0');
        defs.setAttribute('height', '0');
        defs.innerHTML = this.pieceShapes.map((shape, i) => this.getClipPathSVG(i, shape)).join('');
        document.body.appendChild(defs);

        // Create board slots
        const board = document.getElementById('pz-board');
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const slot = document.createElement('div');
            slot.className = 'pz-slot';
            slot.style.position = 'absolute';
            slot.style.left = `${(i%3)*this.pieceSize}px`;
            slot.style.top = `${Math.floor(i/3)*this.pieceSize}px`;
            slot.style.width = `${this.pieceSize}px`;
            slot.style.height = `${this.pieceSize}px`;
            slot.dataset.slot = i;
            board.appendChild(slot);
        }

        // Create pieces
        const piecesArea = document.getElementById('pz-pieces');
        piecesArea.innerHTML = '';
        this.pieces = [];
        for (let i = 0; i < 9; i++) {
            const piece = this.createPieceSVG(i);
            piece.classList.add('pz-piece');
            piece.setAttribute('draggable', 'true');
            piece.dataset.piece = i;
            piecesArea.appendChild(piece);
            this.pieces.push(piece);
        }
    }

    getClipPathSVG(idx, shape) {
        // Returns SVG <clipPath> for piece idx
        const id = `pz-clip-${idx}`;
        return `<clipPath id="${id}">${this.getPiecePath(shape, 0, 0, this.pieceSize)}</clipPath>`;
    }

    getPiecePath(shape, x, y, size) {
        // Returns SVG path string for a puzzle piece at (x,y) with size and shape [top,right,bottom,left]
        // This is a simplified puzzle path generator
        const knob = size/4;
        let d = '';
        // Start top-left
        d += `M${x},${y}`;
        // Top
        d += this.edgePath(shape[0], x, y, x+size, y, 'h', knob);
        // Right
        d += this.edgePath(shape[1], x+size, y, x+size, y+size, 'v', knob);
        // Bottom
        d += this.edgePath(shape[2], x+size, y+size, x, y+size, 'h', knob, true);
        // Left
        d += this.edgePath(shape[3], x, y+size, x, y, 'v', knob, true);
        d += 'Z';
        return `<path d="${d}"/>`;
    }

    edgePath(type, x1, y1, x2, y2, dir, knob, reverse=false) {
        // type: 0=flat, 1=out, -1=in
        if (type === 0) return ` L${x2},${y2}`;
        // For h: left->right, for v: top->bottom
        let mid, c1, c2, c3, c4;
        if (dir==='h') {
            mid = (x1+x2)/2;
            const sign = (reverse?-1:1)*type;
            c1 = `${mid-knob/2},${y1}`;
            c2 = `${mid-knob/2},${y1-sign*knob}`;
            c3 = `${mid+knob/2},${y1-sign*knob}`;
            c4 = `${mid+knob/2},${y1}`;
            return ` L${c1} Q${mid},${y1-sign*knob*1.2} ${c2} L${c3} Q${mid},${y1-sign*knob*1.2} ${c4} L${x2},${y2}`;
        } else {
            mid = (y1+y2)/2;
            const sign = (reverse?-1:1)*type;
            c1 = `${x1},${mid-knob/2}`;
            c2 = `${x1+sign*knob},${mid-knob/2}`;
            c3 = `${x1+sign*knob},${mid+knob/2}`;
            c4 = `${x1},${mid+knob/2}`;
            return ` L${c1} Q${x1+sign*knob*1.2},${mid} ${c2} L${c3} Q${x1+sign*knob*1.2},${mid} ${c4} L${x2},${y2}`;
        }
    }

    createPieceSVG(idx) {
        // Create SVG element for a puzzle piece
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const size = this.pieceSize;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        svg.style.cursor = 'grab';
        svg.style.background = 'none';
        svg.style.position = 'relative';
        svg.style.zIndex = 2;
        svg.innerHTML = `
            <image href="${this.puzzleImage}" x="${-col*size}" y="${-row*size}" width="${size*3}" height="${size*3}" clip-path="url(#pz-clip-${idx})"/>
            <use href="#pz-clip-${idx}" fill="none" stroke="#333" stroke-width="2"/>
        `;
        return svg;
    }

    shufflePieces() {
        // Shuffle pieces in the pieces area
        const area = document.getElementById('pz-pieces');
        const arr = [...this.pieces];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        area.innerHTML = '';
        arr.forEach(p => area.appendChild(p));
    }

    setupEventListeners() {
        // Drag and drop (mouse)
        this.pieces.forEach(piece => {
            piece.addEventListener('dragstart', (e) => this.handleDragStart(e));
            piece.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });
        document.querySelectorAll('.pz-slot').forEach(slot => {
            slot.addEventListener('dragover', (e) => e.preventDefault());
            slot.addEventListener('drop', (e) => this.handleDrop(e, slot));
        });
        document.getElementById('pz-pieces').addEventListener('dragover', (e) => e.preventDefault());
        document.getElementById('pz-pieces').addEventListener('drop', (e) => this.handleDrop(e, null));
        document.getElementById('pz-preview-btn').onclick = () => this.togglePreview();
        document.getElementById('pz-restart-btn').onclick = () => this.reset();
        // Touch support
        this.pieces.forEach(piece => {
            piece.addEventListener('touchstart', (e) => this.handleTouchStart(e), {passive:false});
        });
        document.querySelectorAll('.pz-slot').forEach(slot => {
            slot.addEventListener('touchmove', (e) => e.preventDefault(), {passive:false});
            slot.addEventListener('touchend', (e) => this.handleTouchDrop(e, slot), {passive:false});
        });
        document.getElementById('pz-pieces').addEventListener('touchmove', (e) => e.preventDefault(), {passive:false});
        document.getElementById('pz-pieces').addEventListener('touchend', (e) => this.handleTouchDrop(e, null), {passive:false});
    }

    handleDragStart(e) {
        this.draggedPiece = e.target.closest('svg');
        setTimeout(() => {
            this.draggedPiece.style.opacity = '0.6';
            this.draggedPiece.style.zIndex = 10;
        }, 0);
    }
    handleDragEnd(e) {
        if (this.draggedPiece) {
            this.draggedPiece.style.opacity = '1';
            this.draggedPiece.style.zIndex = 2;
        }
        this.draggedPiece = null;
    }
    handleDrop(e, slot) {
        e.preventDefault();
        if (!this.draggedPiece) return;
        if (slot) {
            // Drop on board slot
            if (slot.children.length > 0) {
                document.getElementById('pz-pieces').appendChild(slot.children[0]);
            }
            slot.appendChild(this.draggedPiece);
        } else {
            // Drop back to pieces area
            document.getElementById('pz-pieces').appendChild(this.draggedPiece);
        }
        this.checkCompletion();
    }
    // Touch drag & drop
    handleTouchStart(e) {
        e.preventDefault();
        this.draggedPiece = e.target.closest('svg');
        this.draggedPiece.style.opacity = '0.6';
        this.draggedPiece.style.zIndex = 10;
        document.ontouchmove = (ev) => {
            const touch = ev.touches[0];
            this.draggedPiece.style.position = 'fixed';
            this.draggedPiece.style.left = (touch.clientX - this.pieceSize/2) + 'px';
            this.draggedPiece.style.top = (touch.clientY - this.pieceSize/2) + 'px';
            this.draggedPiece.style.pointerEvents = 'none';
        };
        document.ontouchend = () => {
            this.draggedPiece.style.opacity = '1';
            this.draggedPiece.style.zIndex = 2;
            this.draggedPiece.style.position = 'relative';
            this.draggedPiece.style.left = '';
            this.draggedPiece.style.top = '';
            this.draggedPiece.style.pointerEvents = '';
            document.ontouchmove = null;
            document.ontouchend = null;
        };
    }
    handleTouchDrop(e, slot) {
        if (!this.draggedPiece) return;
        this.draggedPiece.style.opacity = '1';
        this.draggedPiece.style.zIndex = 2;
        this.draggedPiece.style.position = 'relative';
        this.draggedPiece.style.left = '';
        this.draggedPiece.style.top = '';
        this.draggedPiece.style.pointerEvents = '';
        if (slot) {
            if (slot.children.length > 0) {
                document.getElementById('pz-pieces').appendChild(slot.children[0]);
            }
            slot.appendChild(this.draggedPiece);
        } else {
            document.getElementById('pz-pieces').appendChild(this.draggedPiece);
        }
        this.draggedPiece = null;
        this.checkCompletion();
    }

    checkCompletion() {
        let correct = 0;
        document.querySelectorAll('.pz-slot').forEach((slot, i) => {
            if (slot.children.length > 0) {
                const piece = slot.children[0];
                if (parseInt(piece.dataset.piece) === i) correct++;
            }
        });
        if (correct === 9 && !this.gameCompleted) {
            this.gameCompleted = true;
            setTimeout(() => alert('כל הכבוד! השלמת את הפאזל! 🎉'), 300);
        }
    }

    togglePreview() {
        this.previewMode = !this.previewMode;
        let preview = document.getElementById('pz-preview-img');
        if (this.previewMode) {
            if (!preview) {
                preview = document.createElement('img');
                preview.id = 'pz-preview-img';
                preview.src = this.puzzleImage;
                preview.style.position = 'absolute';
                preview.style.left = '0';
                preview.style.top = '0';
                preview.style.width = this.boardSize+'px';
                preview.style.height = this.boardSize+'px';
                preview.style.opacity = '0.7';
                preview.style.pointerEvents = 'none';
                preview.style.zIndex = 1;
                document.getElementById('pz-board').appendChild(preview);
            } else {
                preview.style.display = '';
            }
            document.getElementById('pz-preview-btn').innerText = 'Hide';
        } else {
            if (preview) preview.style.display = 'none';
            document.getElementById('pz-preview-btn').innerText = 'Preview';
        }
    }

    reset() {
        this.gameCompleted = false;
        this.createPuzzlePieces();
        this.shufflePieces();
        this.setupEventListeners();
        let preview = document.getElementById('pz-preview-img');
        if (preview) preview.remove();
        document.getElementById('pz-preview-btn').innerText = 'Preview';
    }
}

// פאזל עם jigsawpuzzle-rhill - 9 חלקים, snap, גרירה חופשית, עיצוב תואם
function startPuzzleGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div style="background:#7fffa0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="margin:32px 0 16px 0;padding:18px;background:#222;border-radius:12px;box-shadow:0 4px 16px #0006;display:inline-block;">
                <canvas id="jigsaw-canvas" width="480" height="480" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px #0003;"></canvas>
            </div>
            <div style="margin-bottom:16px;">
                <button onclick="window.jigsaw && window.jigsaw.shuffle();" class="pz-btn">ערבב</button>
                <button onclick="window.jigsaw && window.jigsaw.solve();" class="pz-btn">פתור</button>
            </div>
        </div>
    `;
    // טען את הספרייה אם לא קיימת
    if (!window.JigsawPuzzle) {
        const script = document.createElement('script');
        script.src = 'js/games/jigsawpuzzle-rhill.js';
        script.onload = () => createPuzzle();
        document.body.appendChild(script);
    } else {
        createPuzzle();
    }
    function createPuzzle() {
        const img = new window.Image();
        img.src = 'puzzle/6.png';
        img.onload = () => {
            window.jigsaw = new window.JigsawPuzzle({
                canvas: document.getElementById('jigsaw-canvas'),
                image: img,
                rows: 3,
                cols: 3,
                pieceBorder: true,
                snapDistance: 30,
                showPreview: false,
                shuffleOnInit: true,
                onComplete: function() { setTimeout(()=>alert('כל הכבוד!'), 300); }
            });
            window.jigsaw.shuffle();
        };
    }
}

window['puzzle-game'] = {
    init: function() {
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = `
            <div class="game-modal-content" style="max-width: 700px; width: 95%; max-height: 90vh; overflow: auto;">
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
        setTimeout(() => {
            startPuzzleGame();
        }, 100);
    }
}; 