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
  connectedGroups: new Map(),
  dragBounds: { minX: 50, minY: 50, maxX: 750, maxY: 450 },
  
  // מיפוי צורות הפאזל - מגדיר איפה יש בליטות וחורים
  puzzleShapes: {
    // כל משבצת מוגדרת כ: [top, right, bottom, left]
    // 0 = קו ישר (רק בפאות), 1 = בליטה, -1 = חור
    0: [0, 1, 1, 0],     // פינה שמאל עליון: קו עליון ושמאלי, בליטה ימינה ולמטה
    1: [0, -1, 1, -1],   // אמצע עליון: קו עליון, חור משמאל ומימין, בליטה למטה
    2: [0, 0, -1, 1],    // פינה ימין עליון: קו עליון וימני, חור למטה, בליטה שמאלה
    3: [-1, 1, 1, 0],    // אמצע שמאל: קו שמאלי, חור למעלה, בליטות ימינה ולמטה
    4: [-1, -1, -1, -1], // מרכז: חורים מכל הצדדים
    5: [1, 0, 1, 1],     // אמצע ימין: קו ימני, בליטות בשאר הצדדים
    6: [-1, -1, 0, 0],   // פינה שמאל תחתון: קו תחתון ושמאלי, חורים למעלה ולימין
    7: [1, 1, 0, 1],     // אמצע תחתון: קו תחתון, בליטות בשאר הצדדים
    8: [-1, 0, 0, -1]    // פינה ימין תחתון: קו תחתון וימני, חור למעלה ושמאלה
  },
  
  async init() {
    this.loadSounds();
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
      snap: new Audio('sounds/click-tap-computer-mouse-352734.mp3')
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
      <div class="game-modal-content" style="position:relative; max-height:100vh; overflow:hidden; box-sizing:border-box;">
        <div class="game-modal-header">
          <h2>פאזל פירות</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center; height: 80vh;">
          <p style="margin:0 0 10px 0; font-size:1.3em; color:#ff9800;">גרור את החלקים למקום הנכון!</p>
          <div id="puzzle-container" style="width: 800px; height: 500px; background: #f5f5f5; border: 3px solid #333; border-radius: 15px; position: relative; overflow: hidden; box-shadow: inset 0 0 20px rgba(0,0,0,0.1);"></div>
          <div id="puzzle-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; font-weight: 700; margin-top: 10px;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  renderGame() {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';
    
    this.pieces = [];
    this.connectedGroups.clear();
    
    const gridCols = 3;
    const gridRows = 3;
    const totalPieces = gridCols * gridRows;
    
    // מיקומי יעד נכונים
    const targetPositions = [];
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        targetPositions.push({
          x: 240 + col * 160,
          y: 70 + row * 160,
          row,
          col,
          index: row * gridCols + col
        });
      }
    }
    
    // מיקומים אקראיים להתחלה
    const shuffledPositions = [];
    for (let i = 0; i < totalPieces; i++) {
      let x, y, attempts = 0;
      do {
        x = Math.random() * (this.dragBounds.maxX - this.dragBounds.minX - 160) + this.dragBounds.minX;
        y = Math.random() * (this.dragBounds.maxY - this.dragBounds.minY - 160) + this.dragBounds.minY;
        attempts++;
      } while (attempts < 50 && shuffledPositions.some(pos => 
        Math.abs(pos.x - x) < 170 || Math.abs(pos.y - y) < 170
      ));
      shuffledPositions.push({x, y});
    }
    
    // יצירת החלקים
    for (let i = 0; i < totalPieces; i++) {
      const target = targetPositions[i];
      const startPos = shuffledPositions[i];
      
      const piece = document.createElement('div');
      piece.className = 'puzzle-piece';
      piece.dataset.index = i;
      piece.dataset.targetRow = target.row;
      piece.dataset.targetCol = target.col;
      
      // סגנון בסיסי
      Object.assign(piece.style, {
        position: 'absolute',
        width: '160px',
        height: '160px',
        left: startPos.x + 'px',
        top: startPos.y + 'px',
        cursor: 'grab',
        zIndex: '10',
        transition: 'none'
      });
      
      // יצירת SVG עם צורת הפאזל
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '160');
      svg.setAttribute('height', '160');
      svg.style.pointerEvents = 'none';
      
      // דפוס עבור קליפינג של התמונה
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPath.setAttribute('id', `clip-${i}`);
      
      const clipPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      clipPathElement.setAttribute('d', this.createPuzzlePiece(target.row, target.col));
      clipPath.appendChild(clipPathElement);
      defs.appendChild(clipPath);
      svg.appendChild(defs);
      
      // תמונה
      const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttribute('href', 'puzzle/1.png');
      image.setAttribute('x', -target.col * 160);
      image.setAttribute('y', -target.row * 160);
      image.setAttribute('width', 480);
      image.setAttribute('height', 480);
      image.setAttribute('clip-path', `url(#clip-${i})`);
      svg.appendChild(image);
      
      // מסגרת
      const border = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      border.setAttribute('d', this.createPuzzlePiece(target.row, target.col));
      border.setAttribute('fill', 'none');
      border.setAttribute('stroke', '#333');
      border.setAttribute('stroke-width', '2');
      svg.appendChild(border);
      
      piece.appendChild(svg);
      container.appendChild(piece);
      this.pieces.push(piece);
      
      // הוספת האירועים
      this.addPieceEventListeners(piece, target);
    }
  },

  createPuzzlePiece(row, col) {
    const pieceIndex = row * 3 + col;
    const size = 160;
    const knobSize = 25;
    
    // הגדרת הצורות לפי האינדקס (0-8)
    const shapeConfig = {
      0: { top: 'flat', right: 'out', bottom: 'out', left: 'flat' },      // פינה שמאל עליון
      1: { top: 'flat', right: 'in', bottom: 'out', left: 'in' },        // אמצע עליון
      2: { top: 'flat', right: 'flat', bottom: 'in', left: 'out' },      // פינה ימין עליון
      3: { top: 'in', right: 'out', bottom: 'out', left: 'flat' },       // אמצע שמאל
      4: { top: 'in', right: 'in', bottom: 'in', left: 'in' },           // מרכז
      5: { top: 'out', right: 'flat', bottom: 'out', left: 'out' },      // אמצע ימין
      6: { top: 'in', right: 'in', bottom: 'flat', left: 'flat' },       // פינה שמאל תחתון
      7: { top: 'out', right: 'out', bottom: 'flat', left: 'out' },      // אמצע תחתון
      8: { top: 'in', right: 'flat', bottom: 'flat', left: 'in' }        // פינה ימין תחתון
    };
    
    const config = shapeConfig[pieceIndex];
    let path = `M 0 0`;
    
    // קו עליון
    if (config.top === 'flat') {
      path += ` L ${size} 0`;
    } else if (config.top === 'out') {
      path += ` L ${size/2 - knobSize} 0 Q ${size/2 - knobSize} ${-knobSize} ${size/2} ${-knobSize} Q ${size/2 + knobSize} ${-knobSize} ${size/2 + knobSize} 0 L ${size} 0`;
    } else { // in
      path += ` L ${size/2 - knobSize} 0 Q ${size/2 - knobSize} ${knobSize} ${size/2} ${knobSize} Q ${size/2 + knobSize} ${knobSize} ${size/2 + knobSize} 0 L ${size} 0`;
    }
    
    // קו ימני
    if (config.right === 'flat') {
      path += ` L ${size} ${size}`;
    } else if (config.right === 'out') {
      path += ` L ${size} ${size/2 - knobSize} Q ${size + knobSize} ${size/2 - knobSize} ${size + knobSize} ${size/2} Q ${size + knobSize} ${size/2 + knobSize} ${size} ${size/2 + knobSize} L ${size} ${size}`;
    } else { // in
      path += ` L ${size} ${size/2 - knobSize} Q ${size - knobSize} ${size/2 - knobSize} ${size - knobSize} ${size/2} Q ${size - knobSize} ${size/2 + knobSize} ${size} ${size/2 + knobSize} L ${size} ${size}`;
    }
    
    // קו תחתון
    if (config.bottom === 'flat') {
      path += ` L 0 ${size}`;
    } else if (config.bottom === 'out') {
      path += ` L ${size/2 + knobSize} ${size} Q ${size/2 + knobSize} ${size + knobSize} ${size/2} ${size + knobSize} Q ${size/2 - knobSize} ${size + knobSize} ${size/2 - knobSize} ${size} L 0 ${size}`;
    } else { // in
      path += ` L ${size/2 + knobSize} ${size} Q ${size/2 + knobSize} ${size - knobSize} ${size/2} ${size - knobSize} Q ${size/2 - knobSize} ${size - knobSize} ${size/2 - knobSize} ${size} L 0 ${size}`;
    }
    
    // קו שמאלי
    if (config.left === 'flat') {
      path += ` L 0 0`;
    } else if (config.left === 'out') {
      path += ` L 0 ${size/2 + knobSize} Q ${-knobSize} ${size/2 + knobSize} ${-knobSize} ${size/2} Q ${-knobSize} ${size/2 - knobSize} 0 ${size/2 - knobSize} L 0 0`;
    } else { // in
      path += ` L 0 ${size/2 + knobSize} Q ${knobSize} ${size/2 + knobSize} ${knobSize} ${size/2} Q ${knobSize} ${size/2 - knobSize} 0 ${size/2 - knobSize} L 0 0`;
    }
    
    path += ' Z';
    return path;
  },

  addPieceEventListeners(piece, target) {
    let isDragging = false;
    let startX, startY, pieceStartX, pieceStartY;
    
    const startDrag = (clientX, clientY) => {
      if (isDragging) return;
      isDragging = true;
      
      piece.style.cursor = 'grabbing';
      piece.style.zIndex = '1000';
      piece.style.transform = 'scale(1.05)';
      
      const rect = piece.getBoundingClientRect();
      startX = clientX;
      startY = clientY;
      pieceStartX = rect.left - document.getElementById('puzzle-container').getBoundingClientRect().left;
      pieceStartY = rect.top - document.getElementById('puzzle-container').getBoundingClientRect().top;
      
      this.playSound('drag');
    };
    
    const doDrag = (clientX, clientY) => {
      if (!isDragging) return;
      
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      
      let newX = pieceStartX + deltaX;
      let newY = pieceStartY + deltaY;
      
      // הגבלת תנועה בתוך הגבולות
      newX = Math.max(this.dragBounds.minX, Math.min(newX, this.dragBounds.maxX - 160));
      newY = Math.max(this.dragBounds.minY, Math.min(newY, this.dragBounds.maxY - 160));
      
      piece.style.left = newX + 'px';
      piece.style.top = newY + 'px';
    };
    
    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      
      piece.style.cursor = 'grab';
      piece.style.zIndex = '10';
      piece.style.transform = '';
      
      this.checkPlacement(piece, target);
    };
    
    // אירועי עכבר
    piece.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    });
    
    document.addEventListener('mousemove', (e) => {
      doDrag(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', endDrag);
    
    // אירועי מגע
    piece.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      doDrag(touch.clientX, touch.clientY);
    }, { passive: false });
    
    document.addEventListener('touchend', endDrag);
  },

  checkPlacement(piece, target) {
    const rect = piece.getBoundingClientRect();
    const containerRect = document.getElementById('puzzle-container').getBoundingClientRect();
    const pieceX = rect.left - containerRect.left;
    const pieceY = rect.top - containerRect.top;
    
    const targetX = 240 + target.col * 160;
    const targetY = 70 + target.row * 160;
    
    const distance = Math.sqrt(Math.pow(pieceX - targetX, 2) + Math.pow(pieceY - targetY, 2));
    
    if (distance < 30) {
      // צמידה למקום הנכון
      piece.style.left = targetX + 'px';
      piece.style.top = targetY + 'px';
      piece.classList.add('placed');
      
      this.playSound('snap');
      
      // בדיקת חיבור לחלקים סמוכים
      this.connectPiece(piece);
      
      // בדיקה אם הפאזל הושלם
      if (this.pieces.every(p => p.classList.contains('placed'))) {
        setTimeout(() => {
          this.playSound('success');
          document.getElementById('puzzle-feedback').textContent = 'מעולה! השלמת את הפאזל!';
          document.getElementById('puzzle-feedback').style.color = '#43a047';
        }, 500);
      }
    }
  },

  connectPiece(piece) {
    const pieceIndex = parseInt(piece.dataset.index);
    const row = parseInt(piece.dataset.targetRow);
    const col = parseInt(piece.dataset.targetCol);
    
    // חיפוש חלקים סמוכים
    const adjacentPieces = [];
    
    // בדיקת כל החלקים
    this.pieces.forEach(otherPiece => {
      if (otherPiece === piece || !otherPiece.classList.contains('placed')) return;
      
      const otherRow = parseInt(otherPiece.dataset.targetRow);
      const otherCol = parseInt(otherPiece.dataset.targetCol);
      
      // בדיקה אם החלקים צריכים להיות סמוכים
      const isAdjacent = this.shouldBeAdjacent(row, col, otherRow, otherCol);
      
      if (isAdjacent) {
        const otherRect = otherPiece.getBoundingClientRect();
        const pieceRect = piece.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(otherRect.left - pieceRect.left, 2) + 
          Math.pow(otherRect.top - pieceRect.top, 2)
        );
        
        if (distance < 165) { // קרוב מספיק
          adjacentPieces.push(otherPiece);
        }
      }
    });
    
    // יצירת קבוצה מחוברת
    if (adjacentPieces.length > 0) {
      let groupId = this.connectedGroups.get(piece) || `group-${Date.now()}-${Math.random()}`;
      
      // מיזוג קבוצות קיימות
      const allGroupIds = new Set([groupId]);
      adjacentPieces.forEach(adjPiece => {
        const adjGroupId = this.connectedGroups.get(adjPiece);
        if (adjGroupId) allGroupIds.add(adjGroupId);
      });
      
      // עדכון כל החלקים בקבוצה
      [piece, ...adjacentPieces].forEach(p => {
        this.connectedGroups.set(p, groupId);
        p.classList.add('connected');
        p.style.animation = 'connectPulse 0.3s ease-out';
        setTimeout(() => p.style.animation = '', 300);
      });
    }
  },

  shouldBeAdjacent(row1, col1, row2, col2) {
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
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
      if (!piece.classList.contains('placed')) {
        const containerRect = document.getElementById('puzzle-container').getBoundingClientRect();
        const piecesArea = document.getElementById('puzzle-pieces-area');
        const piecesAreaRect = piecesArea.getBoundingClientRect();
        
        const actualPieceSize = this.pieceSize + 40; // מתחשב בגודל הגדול יותר עם הבליטות
        const randomX = (piecesAreaRect.left - containerRect.left) + Math.random() * (280 - actualPieceSize);
        const randomY = (piecesAreaRect.top - containerRect.top) + Math.random() * (360 - actualPieceSize);
        
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

// הוספת סגנונות CSS
const style = document.createElement('style');
style.textContent = `
  .puzzle-piece.connected {
    filter: brightness(1.1);
  }
  
  @keyframes connectPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style); 