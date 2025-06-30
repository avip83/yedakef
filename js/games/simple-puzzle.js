window['simple-puzzle'] = {
  stage: 0,
  totalStages: 10,
  sounds: {},
  currentImage: 'puzzle/1.png', // תמונה קבועה מהתיקייה החדשה
  gridSize: 3, // 3x4 = 12 חלקים
  gridCols: 4,
  gridRows: 3,
  pieceSize: 90,
  boardSize: 360, // 4*90
  boardHeight: 270, // 3*90
  pieces: [],
  correctPieces: 0,
  connectedGroups: [], // קבוצות של חלקים מחוברים
  draggedPiece: null,
  
  // גבולות אזור הגרירה
  dragBounds: {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0
  },

  async init() {
    this.loadSounds();
    this.stage = 0;
    this.showModal();
    this.renderGame();
  },

  loadSounds() {
    this.sounds = {
      success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
      wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
      drag: new Audio('sounds/plop-sound-made-with-my-mouth-100690 (mp3cut.net).mp3'),
      click: new Audio('sounds/click-tap-computer-mouse-352734.mp3'),
      complete: new Audio('sounds/game-level-complete-143022.mp3'),
      connect: new Audio('sounds/click-tap-computer-mouse-352734.mp3'),
      snap: new Audio('sounds/mouse-click-290204.mp3') // סאונד של חיבור
    };
    for (const k in this.sounds) this.sounds[k].volume = 0.6;
  },

  playSound(type) {
    if (window.__globalMute) return;
    if (this.sounds[type]) {
      try {
        this.sounds[type].currentTime = 0;
        this.sounds[type].play();
      } catch (e) {}
    }
  },

  showModal() {
    window.scrollTo({top: 0, behavior: "auto"});
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="game-modal-content" style="position:relative; max-height:100vh; overflow-y:auto; box-sizing:border-box; padding:16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div class="game-modal-header">
          <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🧩 פאזל אמיתי - 12 חלקים</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <div id="puzzle-progress" style="width:100%; max-width: 500px; margin-bottom:20px;"></div>
          <div id="puzzle-instructions" style="color: white; font-size: 1.1rem; margin-bottom: 16px; text-align: center; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px;">
            🎯 גרור חלקי הפאזל ושחרר אותם קרוב לחלקים שצריכים להתחבר!<br>
            ✨ חלקים סמוכים יתחברו אוטומטית!
          </div>
          <div id="puzzle-main-area" style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; width: 100%;"></div>
          <div id="puzzle-feedback" style="font-size: 1.4rem; color: #ffeb3b; min-height: 40px; font-weight: 700; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.7); margin-top: 16px;"></div>
          <button id="puzzle-restart" style="margin-top:20px; padding:12px 28px; font-size:1.1rem; border-radius:16px; border:none; background:#f44336; color:#fff; cursor:pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">🔄 פזר מחדש</button>
          <button id="puzzle-next-stage" style="display:none; margin-top:20px; padding:12px 28px; font-size:1.2rem; border-radius:16px; border:none; background:#4caf50; color:#fff; cursor:pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">🎉 הבא!</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // הוספת עיצוב CSS עבור הפאזל
    this.addPuzzleStyles();
  },

  addPuzzleStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .puzzle-piece {
        position: absolute;
        cursor: grab;
        transition: all 0.3s ease;
        filter: drop-shadow(3px 3px 8px rgba(0,0,0,0.4));
        z-index: 1;
      }
      
      .puzzle-piece:hover {
        transform: scale(1.05);
        filter: drop-shadow(4px 4px 12px rgba(0,0,0,0.6));
        z-index: 10;
      }
      
      .puzzle-piece.dragging {
        transform: scale(1.1) rotate(5deg);
        z-index: 100;
        filter: drop-shadow(6px 6px 16px rgba(0,0,0,0.8));
      }
      
      .puzzle-piece.connected {
        cursor: default;
        filter: drop-shadow(2px 2px 6px rgba(0,0,0,0.3));
      }
      
      .puzzle-piece.connecting {
        animation: connectPulse 0.4s ease-out;
      }
      
      @keyframes connectPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); filter: drop-shadow(0 0 15px rgba(76,175,80,0.8)); }
        100% { transform: scale(1); }
      }
      
      .puzzle-container {
        position: relative;
        background: rgba(255,255,255,0.05);
        border: 3px solid rgba(255,255,255,0.2);
        border-radius: 20px;
        padding: 20px;
        backdrop-filter: blur(5px);
        box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
      }
      
      .puzzle-board {
        position: relative;
        background: rgba(255,255,255,0.1);
        border: 3px dashed rgba(255,255,255,0.3);
        border-radius: 20px;
        backdrop-filter: blur(10px);
      }
      
      .puzzle-pieces-area {
        background: rgba(255,255,255,0.05);
        border-radius: 20px;
        padding: 20px;
        backdrop-filter: blur(5px);
        border: 2px solid rgba(255,255,255,0.1);
        position: relative;
        overflow: hidden;
      }
      
      .progress-bar {
        width: 100%;
        height: 25px;
        background: rgba(255,255,255,0.2);
        border-radius: 15px;
        overflow: hidden;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
        margin-bottom: 10px;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        border-radius: 15px;
        transition: width 0.5s ease;
        position: relative;
      }
      
      .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: shimmer 2s infinite;
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      .puzzle-piece svg {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  },

  renderGame() {
    // עדכון בר התקדמות
    const progress = document.getElementById('puzzle-progress');
    if (progress) {
      const percent = Math.round((this.correctPieces / 12) * 100);
      progress.innerHTML = `
        <div style="color: white; font-size: 1.2rem; font-weight: bold; margin-bottom: 8px; text-align: center;">
          🧩 פאזל ${this.stage + 1} - ${this.correctPieces}/12 חלקים
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percent}%;"></div>
        </div>
      `;
    }

    this.createPuzzle();
  },

  createPuzzle() {
    const mainArea = document.getElementById('puzzle-main-area');
    mainArea.innerHTML = '';
    
    // איפוס משתנים
    this.pieces = [];
    this.correctPieces = 0;
    this.connectedGroups = [];
    
    // יצירת מכל הפאזל עם גבולות
    const puzzleContainer = document.createElement('div');
    puzzleContainer.className = 'puzzle-container';
    puzzleContainer.style.width = '800px';
    puzzleContainer.style.height = '500px';
    puzzleContainer.style.position = 'relative';
    puzzleContainer.id = 'puzzle-container';
    
    // יצירת לוח הפאזל
    const boardContainer = document.createElement('div');
    boardContainer.style.position = 'absolute';
    boardContainer.style.top = '50px';
    boardContainer.style.left = '50px';

    const boardTitle = document.createElement('div');
    boardTitle.innerHTML = '🎯 לוח הפאזל';
    boardTitle.style.color = 'white';
    boardTitle.style.fontSize = '1.1rem';
    boardTitle.style.fontWeight = 'bold';
    boardTitle.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
    boardTitle.style.marginBottom = '10px';
    boardTitle.style.textAlign = 'center';
    boardContainer.appendChild(boardTitle);

    const puzzleBoard = document.createElement('div');
    puzzleBoard.id = 'puzzle-board';
    puzzleBoard.className = 'puzzle-board';
    puzzleBoard.style.width = this.boardSize + 'px';
    puzzleBoard.style.height = this.boardHeight + 'px';
    puzzleBoard.style.position = 'relative';
    boardContainer.appendChild(puzzleBoard);

    // יצירת אזור החלקים
    const piecesContainer = document.createElement('div');
    piecesContainer.style.position = 'absolute';
    piecesContainer.style.top = '50px';
    piecesContainer.style.right = '50px';

    const piecesTitle = document.createElement('div');
    piecesTitle.innerHTML = '🧩 חלקי הפאזל';
    piecesTitle.style.color = 'white';
    piecesTitle.style.fontSize = '1.1rem';
    piecesTitle.style.fontWeight = 'bold';
    piecesTitle.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
    piecesTitle.style.marginBottom = '10px';
    piecesTitle.style.textAlign = 'center';
    piecesContainer.appendChild(piecesTitle);

    const piecesArea = document.createElement('div');
    piecesArea.id = 'puzzle-pieces-area';
    piecesArea.className = 'puzzle-pieces-area';
    piecesArea.style.width = '300px';
    piecesArea.style.height = '350px';
    piecesArea.style.position = 'relative';
    piecesContainer.appendChild(piecesArea);

    puzzleContainer.appendChild(boardContainer);
    puzzleContainer.appendChild(piecesContainer);
    mainArea.appendChild(puzzleContainer);

    // הגדרת גבולות הגרירה
    this.dragBounds = {
      minX: 10,
      minY: 10,
      maxX: 800 - this.pieceSize - 10,
      maxY: 500 - this.pieceSize - 10
    };

    // יצירת חלקי הפאזל
    this.createPuzzlePieces(puzzleBoard, piecesArea);
    
    // הוספת event listeners לכפתורים
    document.getElementById('puzzle-restart').onclick = () => {
      this.playSound('click');
      this.shufflePieces();
    };
  },

  createPuzzlePieces(board, piecesArea) {
    const pieceWidth = this.boardSize / this.gridCols;
    const pieceHeight = this.boardHeight / this.gridRows;

    // יצירת 12 חלקי פאזל (3x4)
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const pieceIndex = row * this.gridCols + col;
        const piece = this.createPuzzlePiece(pieceIndex, row, col, pieceWidth, pieceHeight);
        
        // מיקום מתאים בלוח (מיקום נכון יחסית ללוח)
        piece.correctX = col * pieceWidth;
        piece.correctY = row * pieceHeight;
        piece.boardRow = row;
        piece.boardCol = col;
        
        // מיקום ראשוני באזור החלקים (אקראי)
        const containerRect = document.getElementById('puzzle-container').getBoundingClientRect();
        const piecesAreaRect = piecesArea.getBoundingClientRect();
        
        const randomX = (piecesAreaRect.left - containerRect.left) + Math.random() * (280 - this.pieceSize);
        const randomY = (piecesAreaRect.top - containerRect.top) + Math.random() * (330 - this.pieceSize);
        
        piece.style.left = randomX + 'px';
        piece.style.top = randomY + 'px';
        
        // הוספה למכל הראשי
        document.getElementById('puzzle-container').appendChild(piece);
        this.pieces.push(piece);
        
        // הוספת event listeners
        this.addPieceEvents(piece);
      }
    }
    
    this.showFeedback('🎯 התחל לבנות את הפאזל! גרור חלקים קרוב זה לזה', '#ffeb3b');
  },

  createPuzzlePiece(index, row, col, width, height) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.dataset.index = index;
    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.style.width = this.pieceSize + 'px';
    piece.style.height = this.pieceSize + 'px';
    piece.style.position = 'absolute';
    piece.connected = false;
    piece.connectedGroup = null;
    
    // יצירת SVG עם צורת פאזל ותמונה
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.pieceSize);
    svg.setAttribute('height', this.pieceSize);
    svg.setAttribute('viewBox', `0 0 ${this.pieceSize} ${this.pieceSize}`);
    
    // יצירת defs עבור התמונה
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', `img-${index}`);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', this.pieceSize);
    pattern.setAttribute('height', this.pieceSize);
    
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', this.currentImage);
    image.setAttribute('width', this.boardSize);
    image.setAttribute('height', this.boardHeight);
    image.setAttribute('x', -col * (this.boardSize / this.gridCols));
    image.setAttribute('y', -row * (this.boardHeight / this.gridRows));
    
    pattern.appendChild(image);
    defs.appendChild(pattern);
    svg.appendChild(defs);
    
    // יצירת צורת הפאזל
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', this.generatePuzzleShape(row, col));
    path.setAttribute('fill', `url(#img-${index})`);
    path.setAttribute('stroke', '#ffffff');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))');
    
    svg.appendChild(path);
    piece.appendChild(svg);
    
    return piece;
  },

  generatePuzzleShape(row, col) {
    // יצירת צורת פאזל בסיסית עם בליטות וחורים
    const size = this.pieceSize;
    const knobSize = 15;
    const knobDepth = 8;
    
    let path = `M 10,10`;
    
    // צד עליון
    if (row === 0) {
      path += ` L ${size-10},10`; // קו ישר
    } else {
      const knobOut = Math.random() > 0.5;
      const knobPos = size * 0.5;
      path += ` L ${knobPos - knobSize},10`;
      if (knobOut) {
        path += ` Q ${knobPos - knobSize},${10 - knobDepth} ${knobPos},${10 - knobDepth}`;
        path += ` Q ${knobPos + knobSize},${10 - knobDepth} ${knobPos + knobSize},10`;
      } else {
        path += ` Q ${knobPos - knobSize},${10 + knobDepth} ${knobPos},${10 + knobDepth}`;
        path += ` Q ${knobPos + knobSize},${10 + knobDepth} ${knobPos + knobSize},10`;
      }
      path += ` L ${size-10},10`;
    }
    
    // צד ימין
    if (col === this.gridCols - 1) {
      path += ` L ${size-10},${size-10}`; // קו ישר
    } else {
      const knobOut = Math.random() > 0.5;
      const knobPos = size * 0.5;
      path += ` L ${size-10},${knobPos - knobSize}`;
      if (knobOut) {
        path += ` Q ${size-10+knobDepth},${knobPos - knobSize} ${size-10+knobDepth},${knobPos}`;
        path += ` Q ${size-10+knobDepth},${knobPos + knobSize} ${size-10},${knobPos + knobSize}`;
      } else {
        path += ` Q ${size-10-knobDepth},${knobPos - knobSize} ${size-10-knobDepth},${knobPos}`;
        path += ` Q ${size-10-knobDepth},${knobPos + knobSize} ${size-10},${knobPos + knobSize}`;
      }
      path += ` L ${size-10},${size-10}`;
    }
    
    // צד תחתון
    if (row === this.gridRows - 1) {
      path += ` L 10,${size-10}`; // קו ישר
    } else {
      const knobOut = Math.random() > 0.5;
      const knobPos = size * 0.5;
      path += ` L ${knobPos + knobSize},${size-10}`;
      if (knobOut) {
        path += ` Q ${knobPos + knobSize},${size-10+knobDepth} ${knobPos},${size-10+knobDepth}`;
        path += ` Q ${knobPos - knobSize},${size-10+knobDepth} ${knobPos - knobSize},${size-10}`;
      } else {
        path += ` Q ${knobPos + knobSize},${size-10-knobDepth} ${knobPos},${size-10-knobDepth}`;
        path += ` Q ${knobPos - knobSize},${size-10-knobDepth} ${knobPos - knobSize},${size-10}`;
      }
      path += ` L 10,${size-10}`;
    }
    
    // צד שמאל
    if (col === 0) {
      path += ` L 10,10`; // קו ישר
    } else {
      const knobOut = Math.random() > 0.5;
      const knobPos = size * 0.5;
      path += ` L 10,${knobPos + knobSize}`;
      if (knobOut) {
        path += ` Q ${10-knobDepth},${knobPos + knobSize} ${10-knobDepth},${knobPos}`;
        path += ` Q ${10-knobDepth},${knobPos - knobSize} 10,${knobPos - knobSize}`;
      } else {
        path += ` Q ${10+knobDepth},${knobPos + knobSize} ${10+knobDepth},${knobPos}`;
        path += ` Q ${10+knobDepth},${knobPos - knobSize} 10,${knobPos - knobSize}`;
      }
      path += ` L 10,10`;
    }
    
    path += ` Z`;
    return path;
  },

  addPieceEvents(piece) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    const startDrag = (e) => {
      if (piece.connected) return;
      
      isDragging = true;
      piece.classList.add('dragging');
      this.playSound('drag');
      
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      
      startX = clientX;
      startY = clientY;
      initialX = parseInt(piece.style.left);
      initialY = parseInt(piece.style.top);
      
      e.preventDefault();
    };
    
    const drag = (e) => {
      if (!isDragging) return;
      
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      
      let newX = initialX + (clientX - startX);
      let newY = initialY + (clientY - startY);
      
      // הגבלת התנועה לגבולות המכל
      newX = Math.max(this.dragBounds.minX, Math.min(newX, this.dragBounds.maxX));
      newY = Math.max(this.dragBounds.minY, Math.min(newY, this.dragBounds.maxY));
      
      piece.style.left = newX + 'px';
      piece.style.top = newY + 'px';
      
      e.preventDefault();
    };
    
    const endDrag = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      piece.classList.remove('dragging');
      
      // בדיקה אם החלק קרוב למיקום הנכון או לחלקים אחרים
      this.checkPieceConnections(piece);
      
      e.preventDefault();
    };
    
    // Mouse events
    piece.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Touch events
    piece.addEventListener('touchstart', startDrag, {passive: false});
    document.addEventListener('touchmove', drag, {passive: false});
    document.addEventListener('touchend', endDrag, {passive: false});
  },

  checkPieceConnections(piece) {
    const board = document.getElementById('puzzle-board');
    const boardRect = board.getBoundingClientRect();
    const containerRect = document.getElementById('puzzle-container').getBoundingClientRect();
    const pieceRect = piece.getBoundingClientRect();
    
    // חישוב מיקום יחסית ללוח
    const boardX = (boardRect.left - containerRect.left);
    const boardY = (boardRect.top - containerRect.top);
    const pieceX = parseInt(piece.style.left);
    const pieceY = parseInt(piece.style.top);
    
    const correctX = boardX + piece.correctX;
    const correctY = boardY + piece.correctY;
    
    // בדיקה אם החלק קרוב למיקום הנכון
    const tolerance = 50;
    const isCloseToCorrect = Math.abs(pieceX - correctX) < tolerance && 
                           Math.abs(pieceY - correctY) < tolerance;
    
    // בדיקה אם יש חלקים מחוברים בקרבת מקום
    let nearbyConnectedPieces = [];
    this.pieces.forEach(otherPiece => {
      if (otherPiece !== piece && otherPiece.connected) {
        const otherX = parseInt(otherPiece.style.left);
        const otherY = parseInt(otherPiece.style.top);
        const distance = Math.sqrt(Math.pow(pieceX - otherX, 2) + Math.pow(pieceY - otherY, 2));
        
        if (distance < this.pieceSize * 1.2) {
          // בדיקה אם החלקים אמורים להיות סמוכים
          if (this.shouldBeAdjacent(piece, otherPiece)) {
            nearbyConnectedPieces.push(otherPiece);
          }
        }
      }
    });
    
    if (isCloseToCorrect || nearbyConnectedPieces.length > 0) {
      this.connectPiece(piece, nearbyConnectedPieces);
    }
  },

  shouldBeAdjacent(piece1, piece2) {
    const row1 = piece1.boardRow, col1 = piece1.boardCol;
    const row2 = piece2.boardRow, col2 = piece2.boardCol;
    
    // בדיקה אם החלקים סמוכים בגריד
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  },

  connectPiece(piece, nearbyPieces) {
    this.playSound('snap');
    
    // אנימציה של חיבור
    piece.classList.add('connecting');
    setTimeout(() => piece.classList.remove('connecting'), 400);
    
    piece.connected = true;
    piece.classList.add('connected');
    
    const board = document.getElementById('puzzle-board');
    const boardRect = board.getBoundingClientRect();
    const containerRect = document.getElementById('puzzle-container').getBoundingClientRect();
    
    const boardX = (boardRect.left - containerRect.left);
    const boardY = (boardRect.top - containerRect.top);
    
    if (nearbyPieces.length > 0) {
      // התחברות לקבוצה קיימת
      const referenceGroup = nearbyPieces[0].connectedGroup;
      piece.connectedGroup = referenceGroup;
      
      // מציאת החלק הראשון בקבוצה למיקום יחסי
      let referencePiece = nearbyPieces[0];
      const offsetX = piece.correctX - referencePiece.correctX;
      const offsetY = piece.correctY - referencePiece.correctY;
      
      const refX = parseInt(referencePiece.style.left);
      const refY = parseInt(referencePiece.style.top);
      
      piece.style.left = (refX + offsetX) + 'px';
      piece.style.top = (refY + offsetY) + 'px';
      
      // הוספה לקבוצה
      if (referenceGroup) {
        referenceGroup.push(piece);
      }
    } else {
      // חיבור למיקום הנכון בלוח
      piece.style.left = (boardX + piece.correctX) + 'px';
      piece.style.top = (boardY + piece.correctY) + 'px';
      
      // יצירת קבוצה חדשה
      const newGroup = [piece];
      piece.connectedGroup = newGroup;
      this.connectedGroups.push(newGroup);
    }
    
    this.correctPieces++;
    this.showFeedback(`🎉 מצוין! ${this.correctPieces}/12 חלקים`, '#4caf50');
    this.renderGame(); // עדכון בר התקדמות
    
    // בדיקה אם הפאזל הושלם
    if (this.correctPieces === 12) {
      setTimeout(() => this.completePuzzle(), 500);
    }
  },

  shufflePieces() {
    this.pieces.forEach(piece => {
      if (!piece.connected) {
        const containerRect = document.getElementById('puzzle-container').getBoundingClientRect();
        const piecesArea = document.getElementById('puzzle-pieces-area');
        const piecesAreaRect = piecesArea.getBoundingClientRect();
        
        const randomX = (piecesAreaRect.left - containerRect.left) + Math.random() * (280 - this.pieceSize);
        const randomY = (piecesAreaRect.top - containerRect.top) + Math.random() * (330 - this.pieceSize);
        
        piece.style.left = randomX + 'px';
        piece.style.top = randomY + 'px';
      }
    });
    this.showFeedback('🔄 החלקים פוזרו מחדש!', '#ff9800');
  },

  completePuzzle() {
    this.playSound('complete');
    
    // אנימציה של השלמה
    this.pieces.forEach((piece, index) => {
      setTimeout(() => {
        piece.style.transform = 'scale(1.1)';
        piece.style.filter = 'drop-shadow(0 0 20px rgba(255,235,59,0.8))';
        setTimeout(() => {
          piece.style.transform = 'scale(1)';
          piece.style.filter = 'drop-shadow(3px 3px 8px rgba(0,0,0,0.4))';
        }, 200);
      }, index * 50);
    });
    
    this.showFeedback('🎊🎉 כל הכבוד! השלמת את הפאזל! 🎉🎊', '#ffeb3b');
    
    // הצגת כפתור המשך
    const nextBtn = document.getElementById('puzzle-next-stage');
    nextBtn.style.display = 'inline-block';
    nextBtn.onclick = () => {
      this.playSound('click');
      this.stage++;
      if (this.stage < this.totalStages) {
        this.correctPieces = 0;
        this.connectedGroups = [];
        this.pieces.forEach(p => {
          p.connected = false;
          p.connectedGroup = null;
          p.classList.remove('connected');
        });
        this.shufflePieces();
        this.renderGame();
        nextBtn.style.display = 'none';
      } else {
        document.querySelector('.game-modal-body').innerHTML = `
          <div style="text-align: center; padding: 40px; color: white;">
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">🏆 מזל טוב! 🏆</h2>
            <p style="font-size: 1.5rem; margin-bottom: 30px;">השלמת את כל ${this.totalStages} הפאזלים!</p>
            <div style="font-size: 4rem; margin: 20px 0;">🧩✨</div>
            <p style="font-size: 1.2rem;">אתה מאסטר פאזלים אמיתי!</p>
          </div>
        `;
      }
    };
  },

  showFeedback(message, color) {
    const feedback = document.getElementById('puzzle-feedback');
    feedback.textContent = message;
    feedback.style.color = color;
  }
};