window['puzzle-game'] = {
  stage: 0,
  totalStages: 5,
  sounds: {},
  muted: false,
  currentPuzzle: null,
  puzzleComplete: false,

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
      complete: new Audio('sounds/game-level-complete-143022.mp3')
    };
    for (const k in this.sounds) this.sounds[k].volume = 1;
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
          <h2>פאזל תמונות</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <div id="puzzle-stage-bar" style="width:100%;margin-bottom:8px;"></div>
          <p style="margin:0 0 10px 0; font-size:1.3em; color:#ff9800;">גרור כל חלק למקום הנכון במסגרת!</p>
          <div id="puzzle-game-container" style="display: flex; flex-direction: column; gap: 24px; margin: 24px 0; align-items: center;">
            <div id="puzzle-frame" style="display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 2px; border: 4px solid #8B4513; border-radius: 8px; background: #8B4513; width: 300px; height: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>
            <div id="puzzle-pieces" style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; max-width: 400px; padding: 16px; background: #f5f5f5; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
          </div>
          <div id="puzzle-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; font-weight: 700;"></div>
          <button id="puzzle-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  async renderGame() {
    // עדכון בר שלבים
    const bar = document.getElementById('puzzle-stage-bar');
    if (bar) {
      const percent = Math.round(((this.stage+1)/this.totalStages)*100);
      bar.innerHTML = `<div style="font-size:1.3rem; font-weight:900; color:#43a047; margin-bottom:6px; font-family:'Baloo 2','Heebo',sans-serif;">שלב ${this.stage+1} מתוך ${this.totalStages}</div>
        <div style="width:100%;height:18px;background:#e0e0e0;border-radius:9px;overflow:hidden;box-shadow:0 2px 8px #0001;margin-bottom:4px;">
          <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,#43a047,#00e676);border-radius:9px 0 0 9px;transition:width 0.3s;"></div>
        </div>`;
    }

    this.puzzleComplete = false;
    this.currentPuzzle = this.stage + 1;
    
    // צור את המסגרת והחלקים
    this.createPuzzleFrame();
    this.createPuzzlePieces();
  },

  createPuzzleFrame() {
    const frame = document.getElementById('puzzle-frame');
    frame.innerHTML = '';
    
    // צור 9 תאים במסגרת
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'puzzle-cell';
      cell.dataset.position = i.toString();
      cell.style.cssText = `
        background: #f0f0f0;
        border: 1px dashed #999;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        min-height: 96px;
      `;
      
      // הוסף מספר עזר קטן
      const helper = document.createElement('div');
      helper.style.cssText = `
        position: absolute;
        top: 2px;
        left: 2px;
        font-size: 10px;
        color: #999;
        font-weight: bold;
      `;
      helper.textContent = i + 1;
      cell.appendChild(helper);
      
      // הוסף אירועי drag and drop
      cell.ondragover = (e) => e.preventDefault();
      cell.ondrop = (e) => this.handleDrop(e, i);
      
      frame.appendChild(cell);
    }
  },

  createPuzzlePieces() {
    const piecesContainer = document.getElementById('puzzle-pieces');
    piecesContainer.innerHTML = '';
    
    // צור 9 חלקים מערבבים
    const pieces = this.generatePuzzlePieces();
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);
    
    shuffledPieces.forEach((piece, index) => {
      const pieceEl = document.createElement('div');
      pieceEl.className = 'puzzle-piece';
      pieceEl.dataset.correctPosition = piece.position.toString();
      pieceEl.draggable = true;
      pieceEl.style.cssText = `
        width: 80px;
        height: 80px;
        background: ${piece.color};
        border: 2px solid #333;
        border-radius: 8px;
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
        color: #333;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: transform 0.2s;
        position: relative;
      `;
      
      // צור את הצורה המותאמת לפי המיקום
      const shape = this.createPuzzleShape(piece.position);
      pieceEl.appendChild(shape);
      
      // הוסף טקסט עזר
      const text = document.createElement('div');
      text.style.cssText = `
        position: absolute;
        bottom: 2px;
        right: 2px;
        font-size: 10px;
        color: #666;
        font-weight: bold;
      `;
      text.textContent = piece.position + 1;
      pieceEl.appendChild(text);
      
      // אירועי drag
      pieceEl.ondragstart = (e) => this.handleDragStart(e, piece.position);
      pieceEl.onmousedown = () => {
        pieceEl.style.transform = 'scale(1.1)';
        pieceEl.style.cursor = 'grabbing';
      };
      pieceEl.onmouseup = pieceEl.onmouseleave = () => {
        pieceEl.style.transform = 'scale(1)';
        pieceEl.style.cursor = 'grab';
      };
      
      piecesContainer.appendChild(pieceEl);
    });
  },

  generatePuzzlePieces() {
    const colors = [
      '#FFE6E6', '#E6F3FF', '#E6FFE6', '#FFF3E6', '#F3E6FF',
      '#E6FFFF', '#FFFFE6', '#FFE6F3', '#F0F0F0'
    ];
    
    return Array.from({length: 9}, (_, i) => ({
      position: i,
      color: colors[i],
      shape: this.getPieceType(i)
    }));
  },

  getPieceType(position) {
    // לפי התיאור שלך:
    // 0: פינה שמאל עליון - קו עליון ושמאלי, בליטה ימינה ולמטה
    // 1: אמצע עליון - קו עליון, חור משמאל ומימין, בליטה למטה
    // 2: פינה ימין עליון - קו עליון וימני, חור למטה, בליטה שמאלה
    // 3: אמצע שמאל - קו שמאלי, חור למעלה, בליטות ימינה ולמטה
    // 4: מרכז - חורים מכל הצדדים
    // 5: אמצע ימין - קו ימני, בליטות בשאר הצדדים
    // 6: פינה שמאל תחתון - קו תחתון ושמאלי, חורים למעלה ולימין
    // 7: אמצע תחתון - קו תחתון, בליטות בשאר הצדדים
    // 8: פינה ימין תחתון - קו תחתון וימני, חור למעלה ושמאלה
    
    const types = [
      'corner-top-left', 'edge-top', 'corner-top-right',
      'edge-left', 'center', 'edge-right',
      'corner-bottom-left', 'edge-bottom', 'corner-bottom-right'
    ];
    return types[position];
  },

  createPuzzleShape(position) {
    const shape = document.createElement('div');
    shape.style.cssText = `
      width: 60px;
      height: 60px;
      position: relative;
      background: #4CAF50;
      border-radius: 4px;
    `;
    
    // צור את הצורה המתאימה לפי המיקום
    const shapeType = this.getPieceType(position);
    
    // הוסף בליטות וחורים
    switch (shapeType) {
      case 'corner-top-left':
        this.addProjection(shape, 'right');
        this.addProjection(shape, 'bottom');
        break;
      case 'edge-top':
        this.addHole(shape, 'left');
        this.addHole(shape, 'right');
        this.addProjection(shape, 'bottom');
        break;
      case 'corner-top-right':
        this.addHole(shape, 'bottom');
        this.addProjection(shape, 'left');
        break;
      case 'edge-left':
        this.addHole(shape, 'top');
        this.addProjection(shape, 'right');
        this.addProjection(shape, 'bottom');
        break;
      case 'center':
        this.addHole(shape, 'top');
        this.addHole(shape, 'right');
        this.addHole(shape, 'bottom');
        this.addHole(shape, 'left');
        break;
      case 'edge-right':
        this.addProjection(shape, 'top');
        this.addProjection(shape, 'bottom');
        this.addProjection(shape, 'left');
        break;
      case 'corner-bottom-left':
        this.addHole(shape, 'top');
        this.addHole(shape, 'right');
        break;
      case 'edge-bottom':
        this.addProjection(shape, 'top');
        this.addProjection(shape, 'left');
        this.addProjection(shape, 'right');
        break;
      case 'corner-bottom-right':
        this.addHole(shape, 'top');
        this.addHole(shape, 'left');
        break;
    }
    
    return shape;
  },

  addProjection(element, side) {
    const projection = document.createElement('div');
    projection.style.cssText = `
      position: absolute;
      background: #4CAF50;
      border-radius: 50%;
    `;
    
    switch (side) {
      case 'top':
        projection.style.cssText += `
          width: 20px;
          height: 10px;
          top: -8px;
          left: 20px;
        `;
        break;
      case 'right':
        projection.style.cssText += `
          width: 10px;
          height: 20px;
          right: -8px;
          top: 20px;
        `;
        break;
      case 'bottom':
        projection.style.cssText += `
          width: 20px;
          height: 10px;
          bottom: -8px;
          left: 20px;
        `;
        break;
      case 'left':
        projection.style.cssText += `
          width: 10px;
          height: 20px;
          left: -8px;
          top: 20px;
        `;
        break;
    }
    
    element.appendChild(projection);
  },

  addHole(element, side) {
    const hole = document.createElement('div');
    hole.style.cssText = `
      position: absolute;
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 50%;
    `;
    
    switch (side) {
      case 'top':
        hole.style.cssText += `
          width: 20px;
          height: 10px;
          top: -2px;
          left: 20px;
        `;
        break;
      case 'right':
        hole.style.cssText += `
          width: 10px;
          height: 20px;
          right: -2px;
          top: 20px;
        `;
        break;
      case 'bottom':
        hole.style.cssText += `
          width: 20px;
          height: 10px;
          bottom: -2px;
          left: 20px;
        `;
        break;
      case 'left':
        hole.style.cssText += `
          width: 10px;
          height: 20px;
          left: -2px;
          top: 20px;
        `;
        break;
    }
    
    element.appendChild(hole);
  },

  handleDragStart(e, position) {
    this.playSound('drag');
    e.dataTransfer.setData('text/plain', position.toString());
  },

  handleDrop(e, cellPosition) {
    e.preventDefault();
    const piecePosition = parseInt(e.dataTransfer.getData('text/plain'));
    const cell = e.target.closest('.puzzle-cell');
    
    if (piecePosition === cellPosition) {
      // מיקום נכון!
      this.playSound('success');
      const piece = document.querySelector(`[data-correct-position="${piecePosition}"]`);
      if (piece && !cell.classList.contains('filled')) {
        // העבר את החלק למסגרת
        const clonedPiece = piece.cloneNode(true);
        clonedPiece.draggable = false;
        clonedPiece.style.width = '96px';
        clonedPiece.style.height = '96px';
        clonedPiece.style.cursor = 'default';
        
        cell.appendChild(clonedPiece);
        cell.classList.add('filled');
        
        // הסתר את החלק המקורי
        piece.style.display = 'none';
        
        document.getElementById('puzzle-feedback').textContent = 'כל הכבוד!';
        document.getElementById('puzzle-feedback').style.color = '#43a047';
        
        // בדוק אם הפאזל הושלם
        if (document.querySelectorAll('.puzzle-cell.filled').length === 9) {
          this.completePuzzle();
        }
      }
    } else {
      // מיקום שגוי
      this.playSound('wrong');
      document.getElementById('puzzle-feedback').textContent = 'נסה שוב! זה לא המקום הנכון.';
      document.getElementById('puzzle-feedback').style.color = '#e53935';
    }
  },

  completePuzzle() {
    this.puzzleComplete = true;
    this.playSound('complete');
    document.getElementById('puzzle-feedback').textContent = 'מעולה! סיימת את הפאזל!';
    document.getElementById('puzzle-feedback').style.color = '#43a047';
    
    // הסתר את כל החלקים הנותרים
    document.querySelectorAll('.puzzle-piece').forEach(piece => {
      piece.style.display = 'none';
    });
    
    // הצג כפתור לשלב הבא
    const nextBtn = document.getElementById('puzzle-next-stage');
    if (this.stage < this.totalStages - 1) {
      nextBtn.style.display = 'block';
      nextBtn.onclick = () => {
        this.stage++;
        this.renderGame();
        nextBtn.style.display = 'none';
        document.getElementById('puzzle-feedback').textContent = '';
      };
    } else {
      nextBtn.textContent = 'סיימת את כל השלבים!';
      nextBtn.style.display = 'block';
      nextBtn.onclick = () => {
        const modal = document.querySelector('.game-modal');
        if (modal) {
          modal.remove();
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
        }
      };
    }
  }
}; 