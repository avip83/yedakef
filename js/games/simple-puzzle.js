window['simple-puzzle'] = {
  stage: 0,
  totalStages: 20,
  sounds: {},
  currentImage: '',
  currentGrid: 2, // מתחיל ב-2x2
  pieceSize: 80,
  
  // תמונות הפירות
  images: [
    'fruits/apple.jpg',
    'fruits/banana.jpg', 
    'fruits/strawberry.jpg',
    'fruits/orange.jpeg',
    'fruits/lemon.jpg',
    'fruits/pear.jpg',
    'fruits/water melon.jpg'
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
      complete: new Audio('sounds/game-level-complete-143022.mp3')
    };
    for (const k in this.sounds) this.sounds[k].volume = 0.7;
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
      <div class="game-modal-content" style="position:relative; max-height:100vh; overflow-y:auto; box-sizing:border-box; padding-bottom:16px;">
        <div class="game-modal-header">
          <h2>🧩 פאזל תמונות יפות</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <div id="puzzle-stage-bar" style="width:100%;margin-bottom:16px;"></div>
          <div id="puzzle-preview" style="margin-bottom:16px;"></div>
          <p style="margin:0 0 16px 0; font-size:1.2em; color:#ff9800;">🎯 גרור את החלקים למקום הנכון!</p>
          <div id="puzzle-container" style="display: flex; gap: 24px; align-items: flex-start; margin: 16px 0; flex-wrap: wrap; justify-content: center;"></div>
          <div id="puzzle-feedback" style="font-size: 1.3rem; color: #388e3c; min-height: 32px; font-weight: 700; text-align: center;"></div>
          <button id="puzzle-next-stage" style="display:none; margin-top:20px; padding:12px 28px; font-size:1.2rem; border-radius:16px; border:none; background:#43a047; color:#fff; cursor:pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">🎉 לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  getGridSize() {
    // שלבים 0-4: 2x2, 5-9: 2x3, 10+: 3x3
    if (this.stage <= 4) return 2;
    if (this.stage <= 9) return 3; // 2x3
    return 3; // 3x3
  },

  renderGame() {
    // עדכון בר שלבים
    const bar = document.getElementById('puzzle-stage-bar');
    if (bar) {
      const percent = Math.round(((this.stage+1)/this.totalStages)*100);
      bar.innerHTML = `
        <div style="font-size:1.4rem; font-weight:900; color:#ff6f00; margin-bottom:8px; font-family:'Baloo 2','Heebo',sans-serif;">
          🧩 שלב ${this.stage+1} מתוך ${this.totalStages}
        </div>
        <div style="width:100%;height:20px;background:#ffe0b2;border-radius:10px;overflow:hidden;box-shadow:0 3px 12px rgba(255,111,0,0.3);margin-bottom:8px;">
          <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,#ff6f00,#ff8f00);border-radius:10px 0 0 10px;transition:width 0.5s ease;"></div>
        </div>`;
    }

    // בחירת תמונה וגודל רשת
    this.currentImage = this.images[this.stage % this.images.length];
    this.currentGrid = this.getGridSize();
    
    // תצוגה מקדימה של התמונה השלמה
    const preview = document.getElementById('puzzle-preview');
    preview.innerHTML = `
      <div style="text-align: center; margin-bottom: 12px;">
        <div style="font-size: 1.1rem; color: #666; margin-bottom: 8px;">התמונה השלמה:</div>
        <img src="${this.currentImage}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.2);">
        <div style="font-size: 0.9rem; color: #999; margin-top: 6px;">פאזל ${this.currentGrid}×${this.currentGrid}</div>
      </div>
    `;

    this.createPuzzle();
  },

  createPuzzle() {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';
    
    // יצירת לוח הפאזל ואזור החלקים
    const boardArea = document.createElement('div');
    boardArea.style.display = 'flex';
    boardArea.style.flexDirection = 'column';
    boardArea.style.alignItems = 'center';
    boardArea.style.gap = '16px';

    // כותרת לוח הפאזל
    const boardTitle = document.createElement('div');
    boardTitle.innerHTML = '🎯 לוח הפאזל';
    boardTitle.style.fontSize = '1.1rem';
    boardTitle.style.fontWeight = 'bold';
    boardTitle.style.color = '#1976d2';
    boardArea.appendChild(boardTitle);

    // לוח הפאזל (מטרות)
    const puzzleBoard = document.createElement('div');
    puzzleBoard.id = 'puzzle-board';
    puzzleBoard.style.display = 'grid';
    puzzleBoard.style.gridTemplateColumns = `repeat(${this.currentGrid}, ${this.pieceSize}px)`;
    puzzleBoard.style.gridTemplateRows = `repeat(${this.currentGrid}, ${this.pieceSize}px)`;
    puzzleBoard.style.gap = '2px';
    puzzleBoard.style.background = '#e3f2fd';
    puzzleBoard.style.padding = '12px';
    puzzleBoard.style.borderRadius = '16px';
    puzzleBoard.style.boxShadow = '0 6px 20px rgba(25,118,210,0.3)';
    boardArea.appendChild(puzzleBoard);

    // אזור החלקים
    const piecesArea = document.createElement('div');
    piecesArea.style.display = 'flex';
    piecesArea.style.flexDirection = 'column';
    piecesArea.style.alignItems = 'center';
    piecesArea.style.gap = '16px';

    // כותרת אזור החלקים
    const piecesTitle = document.createElement('div');
    piecesTitle.innerHTML = '🧩 חלקי הפאזל';
    piecesTitle.style.fontSize = '1.1rem';
    piecesTitle.style.fontWeight = 'bold';
    piecesTitle.style.color = '#43a047';
    piecesArea.appendChild(piecesTitle);

    // אזור החלקים לגרירה
    const piecesContainer = document.createElement('div');
    piecesContainer.id = 'puzzle-pieces';
    piecesContainer.style.display = 'flex';
    piecesContainer.style.flexWrap = 'wrap';
    piecesContainer.style.gap = '8px';
    piecesContainer.style.justifyContent = 'center';
    piecesContainer.style.background = '#e8f5e8';
    piecesContainer.style.padding = '16px';
    piecesContainer.style.borderRadius = '16px';
    piecesContainer.style.boxShadow = '0 6px 20px rgba(67,160,71,0.3)';
    piecesContainer.style.maxWidth = `${(this.pieceSize + 8) * 4}px`;
    piecesArea.appendChild(piecesContainer);

    container.appendChild(boardArea);
    container.appendChild(piecesArea);

    // יצירת חלקי הפאזל
    this.createPuzzlePieces(puzzleBoard, piecesContainer);
  },

  createPuzzlePieces(board, piecesContainer) {
    const totalPieces = this.currentGrid * this.currentGrid;
    const pieces = [];
    
    // יצירת כל החלקים
    for(let row = 0; row < this.currentGrid; row++) {
      for(let col = 0; col < this.currentGrid; col++) {
        const pieceIndex = row * this.currentGrid + col;
        pieces.push({ row, col, index: pieceIndex });
      }
    }

    // יצירת מטרות בלוח
    pieces.forEach(piece => {
      const target = document.createElement('div');
      target.className = 'puzzle-target';
      target.dataset.row = piece.row;
      target.dataset.col = piece.col;
      target.dataset.index = piece.index;
      target.style.width = this.pieceSize + 'px';
      target.style.height = this.pieceSize + 'px';
      target.style.background = '#fff';
      target.style.border = '2px dashed #90caf9';
      target.style.borderRadius = '8px';
      target.style.display = 'flex';
      target.style.alignItems = 'center';
      target.style.justifyContent = 'center';
      target.style.fontSize = '2rem';
      target.style.color = '#1976d2';
      target.style.transition = 'all 0.3s ease';
      target.innerHTML = '📍';
      
      // אירועי גרירה
      target.ondragover = e => {
        e.preventDefault();
        target.style.background = '#e3f2fd';
        target.style.transform = 'scale(1.05)';
      };
      
      target.ondragleave = () => {
        if (!target.classList.contains('filled')) {
          target.style.background = '#fff';
          target.style.transform = 'scale(1)';
        }
      };
      
      target.ondrop = e => {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData('pieceIndex'));
        const targetIndex = parseInt(target.dataset.index);
        
        target.style.background = '#fff';
        target.style.transform = 'scale(1)';
        
        if (draggedIndex === targetIndex) {
          this.playSound('success');
          this.placePieceInTarget(target, piece);
          
          // בדיקה אם הפאזל הושלם
          if (document.querySelectorAll('.puzzle-target.filled').length === totalPieces) {
            setTimeout(() => this.completePuzzle(), 500);
          }
        } else {
          this.playSound('wrong');
          this.showFeedback('🤔 לא במקום הנכון, נסה שוב!', '#e53935');
        }
      };
      
      board.appendChild(target);
    });

    // ערבוב החלקים ויצירתם באזור החלקים
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);
    
    shuffledPieces.forEach(piece => {
      const dragPiece = document.createElement('div');
      dragPiece.className = 'puzzle-piece';
      dragPiece.draggable = true;
      dragPiece.dataset.index = piece.index;
      dragPiece.style.width = this.pieceSize + 'px';
      dragPiece.style.height = this.pieceSize + 'px';
      dragPiece.style.backgroundImage = `url(${this.currentImage})`;
      dragPiece.style.backgroundSize = `${this.pieceSize * this.currentGrid}px ${this.pieceSize * this.currentGrid}px`;
      dragPiece.style.backgroundPosition = `-${piece.col * this.pieceSize}px -${piece.row * this.pieceSize}px`;
      dragPiece.style.cursor = 'grab';
      dragPiece.style.borderRadius = '8px';
      dragPiece.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      dragPiece.style.transition = 'transform 0.2s, box-shadow 0.2s';
      dragPiece.style.border = '2px solid #fff';
      
      // אירועי גרירה
      dragPiece.ondragstart = e => {
        this.playSound('drag');
        e.dataTransfer.setData('pieceIndex', piece.index);
        dragPiece.style.opacity = '0.7';
      };
      
      dragPiece.ondragend = () => {
        dragPiece.style.opacity = '1';
      };
      
      // אפקטי hover
      dragPiece.onmouseenter = () => {
        dragPiece.style.transform = 'scale(1.05) rotate(2deg)';
        dragPiece.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
      };
      
      dragPiece.onmouseleave = () => {
        dragPiece.style.transform = 'scale(1) rotate(0deg)';
        dragPiece.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      };
      
      piecesContainer.appendChild(dragPiece);
    });

    this.showFeedback('🎯 גרור כל חלק למקום הנכון בלוח הפאזל!', '#ff9800');
  },

  placePieceInTarget(target, piece) {
    target.classList.add('filled');
    target.style.backgroundImage = `url(${this.currentImage})`;
    target.style.backgroundSize = `${this.pieceSize * this.currentGrid}px ${this.pieceSize * this.currentGrid}px`;
    target.style.backgroundPosition = `-${piece.col * this.pieceSize}px -${piece.row * this.pieceSize}px`;
    target.style.border = '2px solid #43a047';
    target.innerHTML = '';
    
    // הסרת החלק מאזור החלקים
    const dragPiece = document.querySelector(`.puzzle-piece[data-index="${piece.index}"]`);
    if (dragPiece) {
      dragPiece.style.transform = 'scale(0.8)';
      dragPiece.style.opacity = '0';
      setTimeout(() => dragPiece.remove(), 300);
    }
    
    this.showFeedback('🎉 מצוין! חלק במקום הנכון!', '#43a047');
  },

  completePuzzle() {
    this.playSound('complete');
    
    // אנימציה של השלמת הפאזל
    const targets = document.querySelectorAll('.puzzle-target.filled');
    targets.forEach((target, index) => {
      setTimeout(() => {
        target.style.transform = 'scale(1.1)';
        target.style.boxShadow = '0 0 20px rgba(255,193,7,0.8)';
        setTimeout(() => {
          target.style.transform = 'scale(1)';
          target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }, 200);
      }, index * 100);
    });
    
    this.showFeedback('🎊 כל הכבוד! השלמת את הפאזל בהצלחה! 🎊', '#43a047');
    this.nextStageButton();
  },

  showFeedback(message, color) {
    const feedback = document.getElementById('puzzle-feedback');
    feedback.textContent = message;
    feedback.style.color = color;
  },

  nextStageButton() {
    const btn = document.getElementById('puzzle-next-stage');
    btn.style.display = 'inline-block';
    btn.onclick = () => {
      this.playSound('click');
      this.stage++;
      if (this.stage < this.totalStages) {
        this.renderGame();
      } else {
        document.querySelector('.game-modal-body').innerHTML = `
          <div style="text-align: center; padding: 40px;">
            <h2 style="font-size: 2.5rem; color: #43a047; margin-bottom: 20px;">🎊 מזל טוב! 🎊</h2>
            <p style="font-size: 1.5rem; color: #666; margin-bottom: 30px;">השלמת את כל ${this.totalStages} שלבי הפאזל!</p>
            <div style="font-size: 4rem; margin: 20px 0;">🏆</div>
            <p style="font-size: 1.2rem; color: #43a047;">אתה מאסטר פאזלים אמיתי!</p>
          </div>
        `;
      }
    };
  }
};