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
    
         // פתרון פשוט וגומלם שיעבוד בוודאות
     this.createSimplePuzzle(imageSrc, pieces);
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

  createSimplePuzzle(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <div style="background: linear-gradient(135deg, #4CAF50, #81C784); padding: 25px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: white; margin: 0; font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🧩 פאזל ${pieces} חלקים</h2>
        </div>
        
        <div id="puzzle-board" style="
          background: white; 
          border-radius: 15px; 
          padding: 20px; 
          margin-bottom: 20px;
          box-shadow: inset 0 4px 8px rgba(0,0,0,0.1);
          min-height: 300px;
          position: relative;
        ">
          <div style="text-align: center; padding: 40px; color: #666;">
            <div style="font-size: 48px; margin-bottom: 15px;">🎯</div>
            <div style="font-size: 18px; font-weight: bold;">הרכיב כאן את החתיכות</div>
            <div style="font-size: 14px; margin-top: 10px;">גרור חתיכה מהתחתית לכאן</div>
          </div>
        </div>
        
        <div id="puzzle-pieces" style="
          background: rgba(255,255,255,0.9); 
          border-radius: 15px; 
          padding: 20px;
          min-height: 150px;
          box-shadow: inset 0 4px 8px rgba(0,0,0,0.1);
        ">
          <div style="text-align: center; margin-bottom: 15px; font-weight: bold; color: #4CAF50;">
            🧩 חתיכות הפאזל
          </div>
          <div id="pieces-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            <!-- החתיכות יתווספו כאן -->
          </div>
        </div>
      </div>
    `;
    
    puzzleInfo.innerHTML = `
      <div style="text-align: center; margin-top: 20px;">
        <div id="progress-info" style="margin-bottom: 15px;">
          <div style="background: #e0e0e0; border-radius: 20px; height: 30px; width: 300px; margin: 10px auto; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
            <div id="progress-bar" style="height: 100%; background: linear-gradient(90deg, #4CAF50, #66BB6A); width: 0%; transition: width 0.5s; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;"></div>
          </div>
          <div id="progress-text" style="color: #4CAF50; font-weight: bold; font-size: 16px;">0 מתוך ${pieces} חתיכות הושלמו</div>
        </div>
        <div style="color: #666; font-size: 14px;">
          💡 עצה: גרור כל חתיכה למקום שנראה לך נכון בלוח העליון
        </div>
      </div>
    `;
    
    // טעינת התמונה ויצירת החתיכות
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.initSimplePuzzle(img, pieces);
    };
    img.onerror = () => {
      puzzleArea.innerHTML = `
        <div style="text-align: center; padding: 40px; background: #ffebee; border-radius: 15px; border: 2px solid #f44336;">
          <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
          <div style="color: #d32f2f; font-size: 18px; font-weight: bold;">שגיאה בטעינת התמונה</div>
          <div style="color: #666; margin-top: 10px;">נסה לבחור תמונה אחרת</div>
        </div>
      `;
    };
    img.src = imageSrc;
  },

  initSimplePuzzle(image, pieces) {
    const gridSize = Math.sqrt(pieces);
    const pieceSize = 80;
    const board = document.getElementById('puzzle-board');
    const piecesContainer = document.getElementById('pieces-container');
    
    let solvedPieces = 0;
    let draggedElement = null;
    
    // יצירת אזור הלוח
    board.innerHTML = `
      <div id="board-grid" style="
        display: grid; 
        grid-template-columns: repeat(${gridSize}, ${pieceSize}px);
        grid-template-rows: repeat(${gridSize}, ${pieceSize}px);
        gap: 2px;
        justify-content: center;
        margin: 20px auto;
      "></div>
    `;
    
    const boardGrid = document.getElementById('board-grid');
    
    // יצירת משבצות הלוח
    for (let i = 0; i < pieces; i++) {
      const slot = document.createElement('div');
      slot.className = 'puzzle-slot';
      slot.dataset.pieceId = i;
      slot.style.cssText = `
        width: ${pieceSize}px;
        height: ${pieceSize}px;
        border: 3px dashed #4CAF50;
        border-radius: 8px;
        background: rgba(76, 175, 80, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #4CAF50;
        transition: all 0.3s;
        position: relative;
      `;
      slot.innerHTML = '🧩';
      
      // אירועי drop
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.style.background = 'rgba(76, 175, 80, 0.3)';
        slot.style.transform = 'scale(1.05)';
      });
      
      slot.addEventListener('dragleave', () => {
        slot.style.background = 'rgba(76, 175, 80, 0.1)';
        slot.style.transform = 'scale(1)';
      });
      
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        const pieceId = e.dataTransfer.getData('text/plain');
        const piece = document.querySelector(`[data-piece-id="${pieceId}"]`);
        
        if (piece && slot.dataset.pieceId === pieceId) {
          // חתיכה נכונה!
          slot.innerHTML = '';
          slot.appendChild(piece.cloneNode(true));
          slot.style.background = 'rgba(76, 175, 80, 0.8)';
          slot.style.border = '3px solid #4CAF50';
          piece.remove();
          
          solvedPieces++;
          this.playSound('success');
          this.updateProgress(solvedPieces, pieces);
          
          if (solvedPieces === pieces) {
            this.onPuzzleComplete();
          }
        } else {
          // חתיכה לא נכונה
          this.playSound('wrong');
          slot.style.background = 'rgba(244, 67, 54, 0.3)';
          setTimeout(() => {
            slot.style.background = 'rgba(76, 175, 80, 0.1)';
          }, 1000);
        }
        slot.style.transform = 'scale(1)';
      });
      
      boardGrid.appendChild(slot);
    }
    
    // יצירת החתיכות
    for (let i = 0; i < pieces; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      const piece = document.createElement('div');
      piece.className = 'puzzle-piece';
      piece.dataset.pieceId = i;
      piece.draggable = true;
      
      piece.style.cssText = `
        width: ${pieceSize}px;
        height: ${pieceSize}px;
        border: 2px solid #666;
        border-radius: 8px;
        cursor: grab;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: transform 0.2s;
      `;
      
      // יצירת canvas לכל חתיכה
      const canvas = document.createElement('canvas');
      canvas.width = pieceSize;
      canvas.height = pieceSize;
      const ctx = canvas.getContext('2d');
      
      // ציור החתיכה
      const sourceWidth = image.width / gridSize;
      const sourceHeight = image.height / gridSize;
      const sourceX = col * sourceWidth;
      const sourceY = row * sourceHeight;
      
      ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, pieceSize, pieceSize);
      
      piece.appendChild(canvas);
      
      // אירועי גרירה
      piece.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', i);
        piece.style.opacity = '0.5';
        piece.style.transform = 'rotate(5deg)';
      });
      
      piece.addEventListener('dragend', () => {
        piece.style.opacity = '1';
        piece.style.transform = 'rotate(0deg)';
      });
      
      piece.addEventListener('mouseenter', () => {
        piece.style.transform = 'scale(1.1)';
        piece.style.zIndex = '10';
      });
      
      piece.addEventListener('mouseleave', () => {
        piece.style.transform = 'scale(1)';
        piece.style.zIndex = '1';
      });
      
      piecesContainer.appendChild(piece);
    }
    
    // ערבוב החתיכות
    this.shuffleArray(Array.from(piecesContainer.children));
  },

  shuffleArray(array) {
    const container = array[0].parentNode;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      container.appendChild(array[j]);
    }
  },

  updateProgress(solved, total) {
    const progress = (solved / total) * 100;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    progressBar.style.width = progress + '%';
    progressBar.textContent = Math.round(progress) + '%';
    progressText.textContent = `${solved} מתוך ${total} חתיכות הושלמו`;
    
    if (progress === 100) {
      progressBar.style.background = 'linear-gradient(90deg, #FF9800, #FFC107)';
      progressBar.textContent = '🎉 הושלם!';
    }
  },

  onPuzzleComplete() {
    this.playSound('complete');
    
    setTimeout(() => {
      document.getElementById('puzzle-info').innerHTML = `
        <div style="text-align: center; margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #4CAF50, #66BB6A); border-radius: 15px; color: white; box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);">
          <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
          <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">מזל טוב!</div>
          <div style="font-size: 18px; margin-bottom: 15px;">פתרת את הפאזל בהצלחה! 🏆</div>
          <button onclick="window['simple-puzzle'].newPuzzle()" style="
            padding: 12px 24px; 
            border: none; 
            border-radius: 25px; 
            background: white; 
            color: #4CAF50; 
            font-size: 16px; 
            font-weight: bold; 
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            🧩 פאזל חדש
          </button>
        </div>
      `;
    }, 1000);
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