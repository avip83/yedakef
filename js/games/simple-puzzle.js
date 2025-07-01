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
    
         // ספריה 2: Headbreaker - ספריה מתקדמת עם חתיכות פאזל אמיתיות
     this.loadHeadbreaker(imageSrc, pieces);
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

  loadHeadbreaker(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    // טעינת ספריית Headbreaker - מתקדמת ועם חתיכות פאזל אמיתיות
    if (!window.Headbreaker) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/headbreaker@1.1.0/lib/headbreaker.js';
      script.onload = () => {
        this.initHeadbreaker(imageSrc, pieces);
      };
      script.onerror = () => {
        // אם לא עובד, ננסה עם Canvas2D
        this.loadCanvas2D(imageSrc, pieces);
      };
      document.head.appendChild(script);
    } else {
      this.initHeadbreaker(imageSrc, pieces);
    }
  },

  initHeadbreaker(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <canvas id="headbreaker-canvas" style="width: 100%; max-width: 600px; height: 500px; background: #fff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);"></canvas>
    `;
    
    try {
      const canvas = document.getElementById('headbreaker-canvas');
      canvas.width = 600;
      canvas.height = 500;
      
      // יצירת הפאזל עם Headbreaker
      const puzzle = new Headbreaker.Puzzle({
        canvas: canvas,
        image: imageSrc,
        pieces: pieces,
        pieceSize: 80,
        proximity: 15,
        borderFill: 10,
        strokeWidth: 2,
        lineSoftness: 0.18,
        preventOffstageDragging: true,
        onComplete: () => {
          this.playSound('complete');
          puzzleInfo.innerHTML = `
            <div style="color: #4CAF50; font-size: 18px; font-weight: bold;">
              🎉 מזל טוב! פתרת את הפאזל! 🎉
            </div>
          `;
        }
      });
      
      puzzle.shuffle(0.8);
      puzzle.draw();
      
      puzzleInfo.innerHTML = `
        <p style="color: #4CAF50; font-weight: bold;">ספריה: Headbreaker</p>
        <p>גרור את החתיכות למקום הנכון! החתיכות יצטמדו אוטומטית</p>
      `;
      
    } catch (error) {
      console.error('Headbreaker error:', error);
      this.loadCanvas2D(imageSrc, pieces);
    }
  },

  loadCanvas2D(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    // ננסה עם ספריית Canvas2D פשוטה
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/konva@9/konva.min.js';
    script.onload = () => {
      this.initKonvaPuzzle(imageSrc, pieces);
    };
    script.onerror = () => {
      // אם שום דבר לא עובד, ניצור פאזל HTML פשוט
      this.createHTMLPuzzle(imageSrc, pieces);
    };
    document.head.appendChild(script);
  },

  initKonvaPuzzle(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <div id="konva-container" style="width: 100%; height: 500px; background: #f5f5f5; border-radius: 10px; display: flex; justify-content: center; align-items: center;"></div>
    `;
    
    try {
      const stage = new Konva.Stage({
        container: 'konva-container',
        width: 600,
        height: 500
      });
      
      const layer = new Konva.Layer();
      stage.add(layer);
      
      // טעינת התמונה
      const imageObj = new Image();
      imageObj.onload = () => {
        this.createKonvaPuzzlePieces(stage, layer, imageObj, pieces);
      };
      imageObj.src = imageSrc;
      
      puzzleInfo.innerHTML = `
        <p style="color: #4CAF50; font-weight: bold;">ספריה: Konva.js</p>
        <p>גרור את החתיכות למקום הנכון!</p>
      `;
      
    } catch (error) {
      console.error('Konva error:', error);
      this.createHTMLPuzzle(imageSrc, pieces);
    }
  },

  createKonvaPuzzlePieces(stage, layer, imageObj, pieces) {
    const puzzleInfo = document.getElementById('puzzle-info');
    const gridSize = Math.sqrt(pieces);
    const pieceWidth = 400 / gridSize;
    const pieceHeight = 300 / gridSize;
    
    let solvedPieces = 0;
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const piece = new Konva.Image({
          image: imageObj,
          x: Math.random() * 200 + 50,
          y: Math.random() * 200 + 300,
          width: pieceWidth,
          height: pieceHeight,
          crop: {
            x: col * (imageObj.width / gridSize),
            y: row * (imageObj.height / gridSize),
            width: imageObj.width / gridSize,
            height: imageObj.height / gridSize
          },
          draggable: true,
          shadowColor: 'black',
          shadowBlur: 10,
          shadowOpacity: 0.3
        });
        
        const correctX = 100 + col * pieceWidth;
        const correctY = 50 + row * pieceHeight;
        
        piece.on('dragend', () => {
          const pos = piece.position();
          if (Math.abs(pos.x - correctX) < 30 && Math.abs(pos.y - correctY) < 30) {
            piece.position({ x: correctX, y: correctY });
            piece.draggable(false);
            piece.shadowColor('green');
            piece.shadowBlur(5);
            solvedPieces++;
            this.playSound('success');
            
            if (solvedPieces === pieces) {
              this.playSound('complete');
              puzzleInfo.innerHTML = `
                <div style="color: #4CAF50; font-size: 18px; font-weight: bold;">
                  🎉 מזל טוב! פתרת את הפאזל! 🎉
                </div>
              `;
            }
          }
          layer.draw();
        });
        
        layer.add(piece);
      }
    }
    
    layer.draw();
  },

  createHTMLPuzzle(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 48px; margin-bottom: 20px;">🧩</div>
        <div style="font-size: 20px; color: #4CAF50; margin-bottom: 15px;">פאזל HTML פשוט</div>
        <img src="${imageSrc}" style="max-width: 400px; max-height: 300px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 10px; color: #1565c0;">
          <strong>תמונה נטענה בהצלחה!</strong><br>
          רמת קושי: ${pieces} חלקים<br>
          <small>מצב גיבוי - הספריות החיצוניות לא זמינות</small>
        </div>
      </div>
    `;
    
    puzzleInfo.innerHTML = `
      <p style="color: #ff9800; font-weight: bold;">מצב גיבוי: HTML פשוט</p>
      <p>הספריות החיצוניות לא זמינות, אבל התמונה נטענה בהצלחה!</p>
    `;
  }
}; 