window['simple-puzzle'] = {
  stage: 0,
  totalStages: 10,
  sounds: {},
  currentImage: 'puzzle/1.png',
  gridSize: 3, // 3x3 = 9 חלקים פשוטים
  pieceSize: 100,
  boardSize: 300, // 3*100
  pieces: [],
  correctPieces: 0,
  draggedPiece: null,
  showPreview: true, // הצגת תמונה מלאה כהדרכה
  
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
      snap: new Audio('sounds/mouse-click-290204.mp3')
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
          <h2 style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🧩 פאזל מדהים - 9 חלקים</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <div id="puzzle-progress" style="width:100%; max-width: 600px; margin-bottom:20px;"></div>
          <div id="puzzle-instructions" style="color: white; font-size: 1.1rem; margin-bottom: 16px; text-align: center; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px;">
            🎯 גרור כל חלק למקום הנכון בלוח הכחול!<br>
            ✨ שים לב לתמונה הקטנה למעלה - היא מראה איך הפאזל צריך להיראות!<br>
            🌟 כשחלק יהיה קרוב למקום הנכון הוא יקפוץ אליו!
          </div>
          <div id="puzzle-main-area" style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; width: 100%;"></div>
          <div id="puzzle-feedback" style="font-size: 1.4rem; color: #ffeb3b; min-height: 40px; font-weight: 700; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.7); margin-top: 16px;"></div>
          <div id="puzzle-controls" style="display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; justify-content: center;">
            <button id="puzzle-preview-toggle" style="padding:10px 20px; font-size:1rem; border-radius:12px; border:none; background:#2196f3; color:#fff; cursor:pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">👁️ הצג/הסתר תמונה</button>
            <button id="puzzle-restart" style="padding:10px 20px; font-size:1rem; border-radius:12px; border:none; background:#f44336; color:#fff; cursor:pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">🔄 פזר מחדש</button>
          </div>
          <button id="puzzle-next-stage" style="display:none; margin-top:20px; padding:12px 28px; font-size:1.2rem; border-radius:16px; border:none; background:#4caf50; color:#fff; cursor:pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">🎉 הבא!</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    this.addPuzzleStyles();
  },

  addPuzzleStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .puzzle-piece {
        position: absolute;
        cursor: grab;
        transition: all 0.2s ease;
        filter: drop-shadow(3px 3px 8px rgba(0,0,0,0.4));
        z-index: 1;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .puzzle-piece:hover {
        transform: scale(1.05);
        filter: drop-shadow(4px 4px 12px rgba(0,0,0,0.6));
        z-index: 10;
      }
      
      .puzzle-piece.dragging {
        transform: scale(1.1);
        z-index: 100;
        filter: drop-shadow(6px 6px 16px rgba(0,0,0,0.8));
        cursor: grabbing;
      }
      
      .puzzle-piece.connected {
        cursor: default;
        filter: drop-shadow(2px 2px 6px rgba(0,0,0,0.3));
      }
      
      .puzzle-piece.snapping {
        animation: snapEffect 0.4s ease-out;
      }
      
      @keyframes snapEffect {
        0% { transform: scale(1); }
        30% { transform: scale(1.2); filter: drop-shadow(0 0 20px rgba(76,175,80,0.9)); }
        70% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }
      
      .puzzle-container {
        position: relative;
        background: rgba(255,255,255,0.05);
        border: 3px solid rgba(255,255,255,0.2);
        border-radius: 20px;
        padding: 30px;
        backdrop-filter: blur(5px);
        box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
        width: 800px;
        height: 600px;
      }
      
      .puzzle-board {
        position: relative;
        background: rgba(33,150,243,0.1);
        border: 3px solid rgba(33,150,243,0.4);
        border-radius: 15px;
        backdrop-filter: blur(10px);
        box-shadow: inset 0 0 15px rgba(33,150,243,0.2);
      }
      
      .puzzle-pieces-area {
        background: rgba(255,255,255,0.05);
        border-radius: 15px;
        padding: 20px;
        backdrop-filter: blur(5px);
        border: 2px solid rgba(255,255,255,0.1);
        position: relative;
      }
      
      .puzzle-slot {
        position: absolute;
        border: 2px dashed rgba(33,150,243,0.3);
        border-radius: 8px;
        background: rgba(33,150,243,0.03);
        transition: all 0.3s ease;
      }
      
      .puzzle-slot.highlight {
        border-color: rgba(76,175,80,0.8);
        background: rgba(76,175,80,0.1);
        box-shadow: 0 0 20px rgba(76,175,80,0.4);
        transform: scale(1.02);
      }
      
      .puzzle-preview {
        position: absolute;
        top: 20px;
        right: 20px;
        border: 3px solid rgba(255,255,255,0.4);
        border-radius: 12px;
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        padding: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
      
      .puzzle-preview.hidden {
        opacity: 0;
        transform: scale(0.8);
      }
      
      .puzzle-preview img {
        width: 120px;
        height: 120px;
        border-radius: 8px;
        object-fit: cover;
      }
      
      .puzzle-preview-title {
        color: white;
        font-size: 0.9rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 8px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
      }
      
      .progress-bar {
        width: 100%;
        height: 30px;
        background: rgba(255,255,255,0.2);
        border-radius: 15px;
        overflow: hidden;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
        margin-bottom: 10px;
        position: relative;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4caf50, #8bc34a, #cddc39);
        border-radius: 15px;
        transition: width 0.8s ease;
        position: relative;
      }
      
      .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
        animation: shimmer 2s infinite;
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      .completion-celebration {
        animation: celebrate 1s ease-out;
      }
      
      @keyframes celebrate {
        0% { transform: scale(1); }
        25% { transform: scale(1.1) rotate(2deg); }
        50% { transform: scale(1.05) rotate(-1deg); }
        75% { transform: scale(1.08) rotate(1deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  },

  renderGame() {
    // עדכון בר התקדמות
    const progress = document.getElementById('puzzle-progress');
    if (progress) {
      const percent = Math.round((this.correctPieces / 9) * 100);
      progress.innerHTML = `
        <div style="color: white; font-size: 1.3rem; font-weight: bold; margin-bottom: 12px; text-align: center;">
          🧩 פאזל ${this.stage + 1} - ${this.correctPieces}/9 חלקים מושלמים
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percent}%;"></div>
        </div>
        <div style="color: rgba(255,255,255,0.8); font-size: 1rem; text-align: center; margin-top: 8px;">
          ${percent}% הושלם
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
    
    // יצירת מכל הפאזל
    const puzzleContainer = document.createElement('div');
    puzzleContainer.className = 'puzzle-container';
    puzzleContainer.id = 'puzzle-container';
    
    // הוספת תמונת preview
    const previewDiv = document.createElement('div');
    previewDiv.className = 'puzzle-preview';
    previewDiv.id = 'puzzle-preview';
    if (!this.showPreview) previewDiv.classList.add('hidden');
    
    previewDiv.innerHTML = `
      <div class="puzzle-preview-title">🎯 המטרה</div>
      <img src="${this.currentImage}" alt="תמונה מלאה">
    `;
    puzzleContainer.appendChild(previewDiv);
    
    // יצירת לוח הפאזל (שמאל)
    const boardContainer = document.createElement('div');
    boardContainer.style.position = 'absolute';
    boardContainer.style.top = '60px';
    boardContainer.style.left = '40px';

    const boardTitle = document.createElement('div');
    boardTitle.innerHTML = '🎯 בנה כאן את הפאזל';
    boardTitle.style.color = 'white';
    boardTitle.style.fontSize = '1.2rem';
    boardTitle.style.fontWeight = 'bold';
    boardTitle.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
    boardTitle.style.marginBottom = '12px';
    boardTitle.style.textAlign = 'center';
    boardContainer.appendChild(boardTitle);

    const puzzleBoard = document.createElement('div');
    puzzleBoard.id = 'puzzle-board';
    puzzleBoard.className = 'puzzle-board';
    puzzleBoard.style.width = this.boardSize + 'px';
    puzzleBoard.style.height = this.boardSize + 'px';
    puzzleBoard.style.position = 'relative';
    boardContainer.appendChild(puzzleBoard);

    // יצירת אזור החלקים (ימין)
    const piecesContainer = document.createElement('div');
    piecesContainer.style.position = 'absolute';
    piecesContainer.style.top = '60px';
    piecesContainer.style.right = '40px';

    const piecesTitle = document.createElement('div');
    piecesTitle.innerHTML = '🧩 חלקי הפאזל';
    piecesTitle.style.color = 'white';
    piecesTitle.style.fontSize = '1.2rem';
    piecesTitle.style.fontWeight = 'bold';
    piecesTitle.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
    piecesTitle.style.marginBottom = '12px';
    piecesTitle.style.textAlign = 'center';
    piecesContainer.appendChild(piecesTitle);

    const piecesArea = document.createElement('div');
    piecesArea.id = 'puzzle-pieces-area';
    piecesArea.className = 'puzzle-pieces-area';
    piecesArea.style.width = '300px';
    piecesArea.style.height = '380px';
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
      maxY: 600 - this.pieceSize - 10
    };

    // יצירת המשבצות בלוח
    this.createPuzzleSlots(puzzleBoard);
    
    // יצירת חלקי הפאזל
    this.createPuzzlePieces(piecesArea);
    
    // הוספת event listeners לכפתורים
    document.getElementById('puzzle-preview-toggle').onclick = () => {
      this.playSound('click');
      this.togglePreview();
    };
    
    document.getElementById('puzzle-restart').onclick = () => {
      this.playSound('click');
      this.shufflePieces();
    };
  },

  createPuzzleSlots(board) {
    const pieceSize = this.boardSize / this.gridSize;
    
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.style.left = (col * pieceSize) + 'px';
        slot.style.top = (row * pieceSize) + 'px';
        slot.style.width = pieceSize + 'px';
        slot.style.height = pieceSize + 'px';
        slot.dataset.row = row;
        slot.dataset.col = col;
        board.appendChild(slot);
      }
    }
  },

  createPuzzlePieces(piecesArea) {
    const pieceSize = this.boardSize / this.gridSize;

    // יצירת 9 חלקי פאזל (3x3)
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const pieceIndex = row * this.gridSize + col;
        const piece = this.createPuzzlePiece(pieceIndex, row, col, pieceSize);
        
        // מיקום נכון יחסית ללוח
        piece.correctRow = row;
        piece.correctCol = col;
        piece.connected = false;
        
        // מיקום ראשוני באזור החלקים (אקראי)
        const randomX = Math.random() * (280 - this.pieceSize);
        const randomY = Math.random() * (360 - this.pieceSize);
        
        piece.style.left = randomX + 'px';
        piece.style.top = randomY + 'px';
        
        // הוספה למכל הראשי
        document.getElementById('puzzle-container').appendChild(piece);
        this.pieces.push(piece);
        
        // הוספת event listeners
        this.addPieceEvents(piece);
      }
    }
    
    this.showFeedback('🎯 גרור כל חלק למקום הנכון בלוח הכחול!', '#ffeb3b');
  },

  createPuzzlePiece(index, row, col, size) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.dataset.index = index;
    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.style.width = this.pieceSize + 'px';
    piece.style.height = this.pieceSize + 'px';
    piece.style.position = 'absolute';
    piece.style.backgroundImage = `url(${this.currentImage})`;
    piece.style.backgroundSize = `${this.boardSize}px ${this.boardSize}px`;
    piece.style.backgroundPosition = `-${col * size}px -${row * size}px`;
    piece.style.border = '3px solid white';
    piece.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.3)';
    
    return piece;
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
      
      // הדגשת המשבצת הנכונה
      this.highlightCorrectSlot(piece);
      
      e.preventDefault();
    };
    
    const endDrag = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      piece.classList.remove('dragging');
      
      // הסרת כל ההדגשות
      document.querySelectorAll('.puzzle-slot').forEach(slot => {
        slot.classList.remove('highlight');
      });
      
      // בדיקה אם החלק קרוב למקום הנכון
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

  highlightCorrectSlot(piece) {
    // הסרת הדגשות קודמות
    document.querySelectorAll('.puzzle-slot').forEach(slot => {
      slot.classList.remove('highlight');
    });
    
    // הדגשת המשבצת הנכונה אם החלק קרוב
    const board = document.getElementById('puzzle-board');
    const boardRect = board.getBoundingClientRect();
    const containerRect = document.getElementById('puzzle-container').getBoundingClientRect();
    const pieceX = parseInt(piece.style.left);
    const pieceY = parseInt(piece.style.top);
    
    const boardX = boardRect.left - containerRect.left;
    const boardY = boardRect.top - containerRect.top;
    const pieceSize = this.boardSize / this.gridSize;
    
    const correctX = boardX + (piece.correctCol * pieceSize);
    const correctY = boardY + (piece.correctRow * pieceSize);
    
    const tolerance = 80;
    if (Math.abs(pieceX - correctX) < tolerance && Math.abs(pieceY - correctY) < tolerance) {
      const correctSlot = document.querySelector(`.puzzle-slot[data-row="${piece.correctRow}"][data-col="${piece.correctCol}"]`);
      if (correctSlot) {
        correctSlot.classList.add('highlight');
      }
    }
  },

  checkPieceConnection(piece) {
    const board = document.getElementById('puzzle-board');
    const boardRect = board.getBoundingClientRect();
    const containerRect = document.getElementById('puzzle-container').getBoundingClientRect();
    const pieceX = parseInt(piece.style.left);
    const pieceY = parseInt(piece.style.top);
    
    const boardX = boardRect.left - containerRect.left;
    const boardY = boardRect.top - containerRect.top;
    const pieceSize = this.boardSize / this.gridSize;
    
    const correctX = boardX + (piece.correctCol * pieceSize);
    const correctY = boardY + (piece.correctRow * pieceSize);
    
    // בדיקה אם החלק קרוב למקום הנכון
    const tolerance = 60;
    const isClose = Math.abs(pieceX - correctX) < tolerance && 
                   Math.abs(pieceY - correctY) < tolerance;
    
    if (isClose) {
      this.connectPiece(piece, correctX, correctY);
    }
  },

  connectPiece(piece, correctX, correctY) {
    this.playSound('snap');
    
    // אנימציה של חיבור
    piece.classList.add('snapping');
    setTimeout(() => piece.classList.remove('snapping'), 400);
    
    // מיקום החלק במקום הנכון
    piece.style.left = correctX + 'px';
    piece.style.top = correctY + 'px';
    piece.connected = true;
    piece.classList.add('connected');
    
    this.correctPieces++;
    this.showFeedback(`🎉 מצוין! ${this.correctPieces}/9 חלקים מושלמים`, '#4caf50');
    this.renderGame(); // עדכון בר התקדמות
    
    // בדיקה אם הפאזל הושלם
    if (this.correctPieces === 9) {
      setTimeout(() => this.completePuzzle(), 500);
    }
  },

  togglePreview() {
    this.showPreview = !this.showPreview;
    const preview = document.getElementById('puzzle-preview');
    if (this.showPreview) {
      preview.classList.remove('hidden');
    } else {
      preview.classList.add('hidden');
    }
  },

  shufflePieces() {
    this.pieces.forEach(piece => {
      if (!piece.connected) {
        const containerRect = document.getElementById('puzzle-container').getBoundingClientRect();
        const piecesArea = document.getElementById('puzzle-pieces-area');
        const piecesAreaRect = piecesArea.getBoundingClientRect();
        
        const randomX = (piecesAreaRect.left - containerRect.left) + Math.random() * (280 - this.pieceSize);
        const randomY = (piecesAreaRect.top - containerRect.top) + Math.random() * (360 - this.pieceSize);
        
        piece.style.left = randomX + 'px';
        piece.style.top = randomY + 'px';
      }
    });
    this.showFeedback('🔄 החלקים פוזרו מחדש!', '#ff9800');
  },

  completePuzzle() {
    this.playSound('complete');
    
    // אנימציה של השלמה
    const puzzleBoard = document.getElementById('puzzle-board');
    puzzleBoard.classList.add('completion-celebration');
    
    this.pieces.forEach((piece, index) => {
      setTimeout(() => {
        piece.style.transform = 'scale(1.1)';
        piece.style.filter = 'drop-shadow(0 0 25px rgba(255,235,59,0.9))';
        setTimeout(() => {
          piece.style.transform = 'scale(1)';
          piece.style.filter = 'drop-shadow(3px 3px 8px rgba(0,0,0,0.4))';
        }, 300);
      }, index * 80);
    });
    
    // הסתרת תמונת הרפרנס
    const preview = document.getElementById('puzzle-preview');
    preview.style.opacity = '0.3';
    
    this.showFeedback('🎊🎉 WOW! השלמת את הפאזל בהצלחה! 🎉🎊', '#ffeb3b');
    
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
        // הצגת תמונת הרפרנס מחדש
        const preview = document.getElementById('puzzle-preview');
        preview.style.opacity = '1';
      } else {
        document.querySelector('.game-modal-body').innerHTML = `
          <div style="text-align: center; padding: 40px; color: white;">
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">🏆 מזל טוב ענק! 🏆</h2>
            <p style="font-size: 1.5rem; margin-bottom: 30px;">השלמת את כל ${this.totalStages} הפאזלים!</p>
            <div style="font-size: 4rem; margin: 20px 0;">🧩✨🎊</div>
            <p style="font-size: 1.2rem;">אתה מאסטר פאזלים אמיתי כמו ב-RoomRecess!</p>
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