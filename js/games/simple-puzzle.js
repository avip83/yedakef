window['simple-puzzle'] = {
  currentPuzzle: null,
  sounds: {},

  loadSounds() {
    this.sounds = {
      success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
      wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
      click: new Audio('sounds/click-tap-computer-mouse-352734.mp3'),
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

  init() {
    this.loadSounds();
    this.showModal();
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
      <div class="game-modal-content">
        <div class="game-modal-header">
          <h2>🧩 פאזל פשוט</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <div class="puzzle-controls" style="margin-bottom: 20px;">
            <select id="puzzle-image" style="padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #ddd; font-size: 16px;">
              <option value="fruits/apple.jpg">תפוח 🍎</option>
              <option value="fruits/banana.jpg">בננה 🍌</option>
              <option value="fruits/orange.jpeg">תפוז 🍊</option>
              <option value="fruits/strawberry.jpg">תות 🍓</option>
              <option value="fruits/pear.jpg">אגס 🍐</option>
              <option value="fruits/lemon.jpg">לימון 🍋</option>
              <option value="fruits/water melon.jpg">אבטיח 🍉</option>
            </select>
            <select id="puzzle-difficulty" style="padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #ddd; font-size: 16px;">
              <option value="4">קל מאוד (4 חלקים)</option>
              <option value="9" selected>קל (9 חלקים)</option>
              <option value="16">בינוני (16 חלקים)</option>
            </select>
            <button onclick="window['simple-puzzle'].newPuzzle()" style="padding: 10px 20px; margin: 5px; border: none; border-radius: 8px; background: linear-gradient(45deg, #4CAF50, #45a049); color: white; font-size: 16px; cursor: pointer; font-weight: bold;">פאזל חדש</button>
            <button onclick="window['simple-puzzle'].showPreview()" style="padding: 10px 20px; margin: 5px; border: none; border-radius: 8px; background: linear-gradient(45deg, #2196F3, #1976D2); color: white; font-size: 16px; cursor: pointer; font-weight: bold;">תצוגה מקדימה</button>
          </div>
          <div id="puzzle-container" style="width: 100%; display: flex; justify-content: center;">
            <div id="puzzle-area" style="background: #f5f5f5; border: 3px solid #ddd; border-radius: 15px; padding: 20px; min-height: 400px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #666;">
              לחץ על "פאזל חדש" כדי להתחיל!
            </div>
          </div>
          <div id="puzzle-info" style="margin-top: 15px; text-align: center; color: #666; font-size: 14px;">
            <p>בחר תמונה ורמת קושי, ואז לחץ על "פאזל חדש"</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  newPuzzle() {
    this.playSound('click');
    const imageSelect = document.getElementById('puzzle-image');
    const difficultySelect = document.getElementById('puzzle-difficulty');
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    const imageSrc = imageSelect.value;
    const pieces = parseInt(difficultySelect.value);
    
    puzzleArea.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 24px; margin-bottom: 15px;">🔄</div>
        <div>טוען פאזל...</div>
      </div>
    `;
    
    puzzleInfo.innerHTML = `
      <p>נבחר: ${imageSelect.options[imageSelect.selectedIndex].text}</p>
      <p>רמת קושי: ${difficultySelect.options[difficultySelect.selectedIndex].text}</p>
      <p style="color: #ff9800; font-weight: bold;">כאן נטען הפאזל עם הספריה הנבחרת</p>
    `;
    
         // ספריה 4: פתרון מותאם אישית מושלם - HTML5 + Canvas מתקדם
     this.createPerfectPuzzle(imageSrc, pieces);
  },

  showPreview() {
    this.playSound('click');
    const imageSelect = document.getElementById('puzzle-image');
    const imageSrc = imageSelect.value;
    
    const preview = document.createElement('div');
    preview.style.cssText = `
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
    `;
    
    preview.onclick = () => preview.remove();
    
    preview.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 15px; text-align: center; max-width: 90%; max-height: 90%;">
        <h3 style="margin-top: 0;">תצוגה מקדימה</h3>
        <img src="${imageSrc}" style="max-width: 100%; max-height: 70vh; border-radius: 10px;">
        <p style="margin-bottom: 0; color: #666; margin-top: 15px;">לחץ כדי לסגור</p>
      </div>
    `;
    
    document.body.appendChild(preview);
  },

  createPerfectPuzzle(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.2);">
        <canvas id="perfect-puzzle-canvas" width="700" height="500" style="
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          display: block;
          margin: 0 auto;
        "></canvas>
      </div>
    `;
    
    const canvas = document.getElementById('perfect-puzzle-canvas');
    const ctx = canvas.getContext('2d');
    
    // טעינת התמונה
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      this.initPerfectPuzzle(canvas, ctx, image, pieces);
    };
    image.src = imageSrc;
    
    puzzleInfo.innerHTML = `
      <div style="text-align: center; margin-top: 15px;">
        <p style="color: #4CAF50; font-weight: bold; font-size: 18px; margin: 5px 0;">🧩 פאזל מותאם אישית מושלם</p>
        <p style="color: #666; margin: 5px 0;">גרור את החתיכות למקום הנכון! 🎯</p>
        <div id="progress-bar" style="width: 300px; height: 20px; background: #e0e0e0; border-radius: 10px; margin: 10px auto; overflow: hidden;">
          <div id="progress-fill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #4CAF50, #8BC34A); transition: width 0.3s;"></div>
        </div>
        <p id="pieces-counter" style="color: #4CAF50; font-weight: bold; margin: 5px 0;">0 מתוך ${pieces} חתיכות</p>
      </div>
    `;
  },

  initPerfectPuzzle(canvas, ctx, image, pieces) {
    const gridSize = Math.sqrt(pieces);
    const boardSize = 350;
    const pieceSize = boardSize / gridSize;
    const boardX = 50;
    const boardY = 50;
    const piecesAreaY = boardY + boardSize + 50;
    
    let draggedPiece = null;
    let dragOffset = { x: 0, y: 0 };
    let solvedPieces = 0;
    
    // יצירת מערך החתיכות
    const puzzlePieces = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        puzzlePieces.push({
          id: row * gridSize + col,
          correctRow: row,
          correctCol: col,
          currentX: Math.random() * (canvas.width - pieceSize - 100) + 50,
          currentY: piecesAreaY + Math.random() * 50,
          width: pieceSize,
          height: pieceSize,
          solved: false,
          dragging: false
        });
      }
    }
    
    // ערבוב החתיכות
    for (let i = puzzlePieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = puzzlePieces[i].currentX;
      puzzlePieces[i].currentX = puzzlePieces[j].currentX;
      puzzlePieces[j].currentX = temp;
    }
    
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // רקע הלוח
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 4;
      ctx.setLineDash([15, 10]);
      ctx.fillRect(boardX, boardY, boardSize, boardSize);
      ctx.strokeRect(boardX, boardY, boardSize, boardSize);
      ctx.setLineDash([]);
      
      // קווי רשת
      ctx.strokeStyle = 'rgba(76, 175, 80, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 1; i < gridSize; i++) {
        const x = boardX + i * pieceSize;
        const y = boardY + i * pieceSize;
        ctx.beginPath();
        ctx.moveTo(x, boardY);
        ctx.lineTo(x, boardY + boardSize);
        ctx.moveTo(boardX, y);
        ctx.lineTo(boardX + boardSize, y);
        ctx.stroke();
      }
      
      // כותרת הלוח
      ctx.fillStyle = '#4CAF50';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎯 הרכיב כאן את הפאזל 🎯', boardX + boardSize / 2, boardY - 15);
      
      // קו הפרדה
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, piecesAreaY - 20);
      ctx.lineTo(canvas.width, piecesAreaY - 20);
      ctx.stroke();
      
      // כותרת אזור החתיכות
      ctx.fillStyle = '#2196F3';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('🧩 גרור מכאן את החתיכות 🧩', canvas.width / 2, piecesAreaY - 5);
      
      // ציור החתיכות
      puzzlePieces.forEach(piece => {
        const sourceX = piece.correctCol * (image.width / gridSize);
        const sourceY = piece.correctRow * (image.height / gridSize);
        const sourceWidth = image.width / gridSize;
        const sourceHeight = image.height / gridSize;
        
        // צל לחתיכה
        if (!piece.solved) {
          ctx.save();
          ctx.shadowColor = piece.dragging ? 'rgba(33, 150, 243, 0.8)' : 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = piece.dragging ? 20 : 10;
          ctx.shadowOffsetX = piece.dragging ? 8 : 5;
          ctx.shadowOffsetY = piece.dragging ? 8 : 5;
          
          // מסגרת לחתיכה
          ctx.strokeStyle = piece.dragging ? '#2196F3' : '#666';
          ctx.lineWidth = piece.dragging ? 4 : 2;
          ctx.strokeRect(piece.currentX - 2, piece.currentY - 2, piece.width + 4, piece.height + 4);
          
          ctx.restore();
        }
        
        // ציור החתיכה
        if (piece.solved) {
          // חתיכה פתורה - עם הדגשה ירוקה
          const correctX = boardX + piece.correctCol * pieceSize;
          const correctY = boardY + piece.correctRow * pieceSize;
          
          ctx.save();
          ctx.shadowColor = 'rgba(76, 175, 80, 0.8)';
          ctx.shadowBlur = 15;
          ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight,
                       correctX, correctY, piece.width, piece.height);
          
          // מסגרת ירוקה
          ctx.strokeStyle = '#4CAF50';
          ctx.lineWidth = 3;
          ctx.strokeRect(correctX, correctY, piece.width, piece.height);
          ctx.restore();
          
          // סימן V
          ctx.fillStyle = 'rgba(76, 175, 80, 0.9)';
          ctx.beginPath();
          ctx.arc(correctX + piece.width - 15, correctY + 15, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('✓', correctX + piece.width - 15, correctY + 20);
        } else {
          // חתיכה רגילה
          ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight,
                       piece.currentX, piece.currentY, piece.width, piece.height);
        }
      });
    }
    
    function getPieceAt(x, y) {
      for (let i = puzzlePieces.length - 1; i >= 0; i--) {
        const piece = puzzlePieces[i];
        if (!piece.solved && x >= piece.currentX && x <= piece.currentX + piece.width &&
            y >= piece.currentY && y <= piece.currentY + piece.height) {
          return piece;
        }
      }
      return null;
    }
    
    function updateProgress() {
      const progress = (solvedPieces / pieces) * 100;
      document.getElementById('progress-fill').style.width = progress + '%';
      document.getElementById('pieces-counter').textContent = `${solvedPieces} מתוך ${pieces} חתיכות`;
    }
    
    function checkWin() {
      if (solvedPieces === pieces) {
        window['simple-puzzle'].playSound('complete');
        
        // אנימציית זיקוקים
        setTimeout(() => {
          for (let i = 0; i < 30; i++) {
            setTimeout(() => {
              ctx.save();
              ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
              ctx.font = `${Math.random() * 20 + 20}px Arial`;
              ctx.fillText('🎉', Math.random() * canvas.width, Math.random() * canvas.height);
              ctx.restore();
            }, i * 100);
          }
        }, 500);
        
        document.getElementById('puzzle-info').innerHTML = `
          <div style="text-align: center; margin-top: 15px;">
            <div style="font-size: 24px; color: #4CAF50; font-weight: bold; margin: 10px 0;">
              🎉 מזל טוב! פתרת את הפאזל! 🎉
            </div>
            <div style="font-size: 18px; color: #666; margin: 5px 0;">
              השלמת ${pieces} חתיכות בהצלחה! 🏆
            </div>
            <button onclick="window['simple-puzzle'].newPuzzle()" style="
              padding: 12px 24px; margin: 15px 5px; border: none; border-radius: 25px;
              background: linear-gradient(45deg, #4CAF50, #45a049); color: white;
              font-size: 16px; cursor: pointer; font-weight: bold;
              box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            ">פאזל חדש 🧩</button>
          </div>
        `;
      }
    }
    
    // אירועי עכבר
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      draggedPiece = getPieceAt(x, y);
      if (draggedPiece) {
        draggedPiece.dragging = true;
        dragOffset.x = x - draggedPiece.currentX;
        dragOffset.y = y - draggedPiece.currentY;
        
        // העברת החתיכה לחזית
        const index = puzzlePieces.indexOf(draggedPiece);
        puzzlePieces.splice(index, 1);
        puzzlePieces.push(draggedPiece);
      }
    });
    
    canvas.addEventListener('mousemove', (e) => {
      if (draggedPiece) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        draggedPiece.currentX = x - dragOffset.x;
        draggedPiece.currentY = y - dragOffset.y;
        draw();
      }
    });
    
    canvas.addEventListener('mouseup', () => {
      if (draggedPiece) {
        const correctX = boardX + draggedPiece.correctCol * pieceSize;
        const correctY = boardY + draggedPiece.correctRow * pieceSize;
        const tolerance = 30;
        
        if (Math.abs(draggedPiece.currentX - correctX) < tolerance &&
            Math.abs(draggedPiece.currentY - correctY) < tolerance) {
          // חתיכה במקום הנכון!
          draggedPiece.solved = true;
          solvedPieces++;
          window['simple-puzzle'].playSound('success');
          updateProgress();
          checkWin();
        }
        
        draggedPiece.dragging = false;
        draggedPiece = null;
        draw();
      }
    });
    
    // תמיכה במגע למובייל
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      draggedPiece = getPieceAt(x, y);
      if (draggedPiece) {
        draggedPiece.dragging = true;
        dragOffset.x = x - draggedPiece.currentX;
        dragOffset.y = y - draggedPiece.currentY;
        
        const index = puzzlePieces.indexOf(draggedPiece);
        puzzlePieces.splice(index, 1);
        puzzlePieces.push(draggedPiece);
      }
    });
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (draggedPiece) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        draggedPiece.currentX = x - dragOffset.x;
        draggedPiece.currentY = y - dragOffset.y;
        draw();
      }
    });
    
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (draggedPiece) {
        const correctX = boardX + draggedPiece.correctCol * pieceSize;
        const correctY = boardY + draggedPiece.correctRow * pieceSize;
        const tolerance = 30;
        
        if (Math.abs(draggedPiece.currentX - correctX) < tolerance &&
            Math.abs(draggedPiece.currentY - correctY) < tolerance) {
          draggedPiece.solved = true;
          solvedPieces++;
          window['simple-puzzle'].playSound('success');
          updateProgress();
          checkWin();
        }
        
        draggedPiece.dragging = false;
        draggedPiece = null;
        draw();
      }
    });
    
    // ציור ראשוני
    draw();
    updateProgress();
  },

  createCustomPuzzle(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 48px; margin-bottom: 20px;">🧩</div>
        <div style="font-size: 20px; color: #4CAF50; margin-bottom: 15px;">פאזל מותאם אישית</div>
        <img src="${imageSrc}" style="max-width: 400px; max-height: 300px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 10px; color: #e65100;">
          <strong>תמונה נטענה בהצלחה!</strong><br>
          רמת קושי: ${pieces} חלקים<br>
          <small>מצב גיבוי - הספריות החיצוניות לא זמינות</small>
        </div>
      </div>
    `;
    
    puzzleInfo.innerHTML = `
      <p style="color: #ff9800; font-weight: bold;">מצב גיבוי: פתרון מותאם אישית</p>
      <p>הספריות החיצוניות לא זמינות, אבל התמונה נטענה בהצלחה!</p>
    `;
  }
}; 