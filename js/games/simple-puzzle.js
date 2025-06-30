window['simple-puzzle'] = {
  stage: 0,
  totalStages: 10,
  sounds: {},
  currentImage: 'puzzle/1.png', // תמונה קבועה מהתיקייה החדשה
  gridSize: 4, // 4x4 = 16 חלקים
  pieceSize: 90,
  boardSize: 400,
  pieces: [],
  correctPieces: 0,
  draggedPiece: null,
  
  // מערך של צורות פאזל אמיתיות - בליטות וחורים
  puzzleShapes: [
    // שורה 1
    'M0,0 L80,0 Q85,15 80,30 L80,60 Q65,65 50,60 Q35,65 20,60 L0,60 Z', // פינה שמאל עליון
    'M0,0 L60,0 Q65,15 60,30 L60,60 Q45,55 30,60 Q15,65 0,60 Z', // עליון מרכז
    'M0,0 L60,0 Q65,15 60,30 L60,60 Q45,55 30,60 Q15,65 0,60 Z', // עליון מרכז
    'M0,0 L80,0 L80,60 Q65,65 50,60 Q35,55 20,60 L0,60 Q5,45 0,30 Z', // פינה ימין עליון
    
    // שורה 2-3 (מרכז) - צורות מורכבות יותר
    'M0,0 Q15,5 30,0 L60,0 Q65,15 60,30 L60,60 Q45,65 30,60 L0,60 Q5,45 0,30 Z',
    'M0,0 Q15,5 30,0 L60,0 Q55,15 60,30 L60,60 Q45,55 30,60 L0,60 Q5,45 0,30 Z',
    'M0,0 Q15,5 30,0 L60,0 Q55,15 60,30 L60,60 Q45,55 30,60 L0,60 Q5,45 0,30 Z',
    'M0,0 Q15,5 30,0 L60,0 Q55,15 60,30 L60,60 Q45,55 30,60 L0,60 Q5,45 0,30 Z',
    
    'M0,0 Q15,5 30,0 L60,0 Q65,15 60,30 L60,60 Q45,65 30,60 L0,60 Q5,45 0,30 Z',
    'M0,0 Q15,5 30,0 L60,0 Q55,15 60,30 L60,60 Q45,55 30,60 L0,60 Q5,45 0,30 Z',
    'M0,0 Q15,5 30,0 L60,0 Q55,15 60,30 L60,60 Q45,55 30,60 L0,60 Q5,45 0,30 Z',
    'M0,0 Q15,5 30,0 L60,0 Q55,15 60,30 L60,60 Q45,55 30,60 L0,60 Q5,45 0,30 Z',
    
    // שורה 4 (תחתון)
    'M0,0 Q15,5 30,0 L60,0 Q65,15 60,30 L60,60 L0,60 Q5,45 0,30 Z', // פינה שמאל תחתון  
    'M0,0 Q15,5 30,0 L60,0 Q55,15 60,30 L60,60 L0,60 Q5,45 0,30 Z', // תחתון מרכז
    'M0,0 Q15,5 30,0 L60,0 Q55,15 60,30 L60,60 L0,60 Q5,45 0,30 Z', // תחתון מרכז
    'M0,0 Q15,5 30,0 L60,0 L60,60 L0,60 Q5,45 0,30 Z' // פינה ימין תחתון
  ],

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
      connect: new Audio('sounds/click-tap-computer-mouse-352734.mp3')
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
          <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🧩 פאזל אמיתי - 16 חלקים</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <div id="puzzle-progress" style="width:100%; max-width: 500px; margin-bottom:20px;"></div>
          <div id="puzzle-instructions" style="color: white; font-size: 1.1rem; margin-bottom: 16px; text-align: center; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px;">
            🎯 גרור חלקי הפאזל ושחרר אותם קרוב לחלקים שצריכים להתחבר!
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
      const percent = Math.round((this.correctPieces / 16) * 100);
      progress.innerHTML = `
        <div style="color: white; font-size: 1.2rem; font-weight: bold; margin-bottom: 8px; text-align: center;">
          🧩 פאזל ${this.stage + 1} - ${this.correctPieces}/16 חלקים
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
    
    // יצירת לוח הפאזל
    const boardContainer = document.createElement('div');
    boardContainer.style.display = 'flex';
    boardContainer.style.flexDirection = 'column';
    boardContainer.style.alignItems = 'center';
    boardContainer.style.gap = '16px';

    const boardTitle = document.createElement('div');
    boardTitle.innerHTML = '🎯 לוח הפאזל';
    boardTitle.style.color = 'white';
    boardTitle.style.fontSize = '1.2rem';
    boardTitle.style.fontWeight = 'bold';
    boardTitle.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
    boardContainer.appendChild(boardTitle);

    const puzzleBoard = document.createElement('div');
    puzzleBoard.id = 'puzzle-board';
    puzzleBoard.className = 'puzzle-board';
    puzzleBoard.style.width = this.boardSize + 'px';
    puzzleBoard.style.height = this.boardSize + 'px';
    puzzleBoard.style.position = 'relative';
    boardContainer.appendChild(puzzleBoard);

    // יצירת אזור החלקים
    const piecesContainer = document.createElement('div');
    piecesContainer.style.display = 'flex';
    piecesContainer.style.flexDirection = 'column';
    piecesContainer.style.alignItems = 'center';
    piecesContainer.style.gap = '16px';

    const piecesTitle = document.createElement('div');
    piecesTitle.innerHTML = '🧩 חלקי הפאזל';
    piecesTitle.style.color = 'white';
    piecesTitle.style.fontSize = '1.2rem';
    piecesTitle.style.fontWeight = 'bold';
    piecesTitle.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
    piecesContainer.appendChild(piecesTitle);

    const piecesArea = document.createElement('div');
    piecesArea.id = 'puzzle-pieces-area';
    piecesArea.className = 'puzzle-pieces-area';
    piecesArea.style.width = '400px';
    piecesArea.style.minHeight = '300px';
    piecesArea.style.position = 'relative';
    piecesContainer.appendChild(piecesArea);

    mainArea.appendChild(boardContainer);
    mainArea.appendChild(piecesContainer);

    // יצירת חלקי הפאזל
    this.createPuzzlePieces(puzzleBoard, piecesArea);
    
    // הוספת event listeners לכפתורים
    document.getElementById('puzzle-restart').onclick = () => {
      this.playSound('click');
      this.shufflePieces();
    };
  },

  createPuzzlePieces(board, piecesArea) {
    const piecesPerRow = this.gridSize;
    const pieceWidth = this.boardSize / piecesPerRow;
    const pieceHeight = this.boardSize / piecesPerRow;

    // יצירת 16 חלקי פאזל
    for (let row = 0; row < piecesPerRow; row++) {
      for (let col = 0; col < piecesPerRow; col++) {
        const pieceIndex = row * piecesPerRow + col;
        const piece = this.createPuzzlePiece(pieceIndex, row, col, pieceWidth, pieceHeight);
        
        // מיקום מתאים בלוח (מיקום נכון)
        piece.correctX = col * pieceWidth;
        piece.correctY = row * pieceHeight;
        
        // מיקום ראשוני באזור החלקים (אקראי)
        const randomX = Math.random() * (380 - this.pieceSize);
        const randomY = Math.random() * (280 - this.pieceSize);
        piece.style.left = randomX + 'px';
        piece.style.top = randomY + 'px';
        
        piecesArea.appendChild(piece);
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
    image.setAttribute('height', this.boardSize);
    image.setAttribute('x', -col * (this.boardSize / 4));
    image.setAttribute('y', -row * (this.boardSize / 4));
    
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
    if (col === this.gridSize - 1) {
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
    if (row === this.gridSize - 1) {
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
      
      const newX = initialX + (clientX - startX);
      const newY = initialY + (clientY - startY);
      
      piece.style.left = newX + 'px';
      piece.style.top = newY + 'px';
      
      e.preventDefault();
    };
    
    const endDrag = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      piece.classList.remove('dragging');
      
      // בדיקה אם החלק קרוב למיקום הנכון
      this.checkPieceConnection(piece);
      
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

  checkPieceConnection(piece) {
    const board = document.getElementById('puzzle-board');
    const boardRect = board.getBoundingClientRect();
    const pieceRect = piece.getBoundingClientRect();
    
    // חישוב מיקום יחסית ללוח
    const relativeX = pieceRect.left - boardRect.left;
    const relativeY = pieceRect.top - boardRect.top;
    
    // בדיקה אם החלק קרוב למיקום הנכון (טלרנס של 40 פיקסלים)
    const tolerance = 40;
    const isClose = Math.abs(relativeX - piece.correctX) < tolerance && 
                   Math.abs(relativeY - piece.correctY) < tolerance;
    
    if (isClose) {
      // התחברות החלק למיקום הנכון
      piece.style.left = (boardRect.left + piece.correctX - board.parentElement.getBoundingClientRect().left) + 'px';
      piece.style.top = (boardRect.top + piece.correctY - board.parentElement.getBoundingClientRect().top) + 'px';
      piece.connected = true;
      piece.classList.add('connected');
      
      this.playSound('connect');
      this.correctPieces++;
      
      this.showFeedback(`🎉 מצוין! ${this.correctPieces}/16 חלקים`, '#4caf50');
      this.renderGame(); // עדכון בר התקדמות
      
      // בדיקה אם הפאזל הושלם
      if (this.correctPieces === 16) {
        setTimeout(() => this.completePuzzle(), 500);
      }
    }
  },

  shufflePieces() {
    const piecesArea = document.getElementById('puzzle-pieces-area');
    this.pieces.forEach(piece => {
      if (!piece.connected) {
        const randomX = Math.random() * (380 - this.pieceSize);
        const randomY = Math.random() * (280 - this.pieceSize);
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
        this.pieces.forEach(p => {
          p.connected = false;
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