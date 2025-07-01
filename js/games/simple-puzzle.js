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
    
         // ספריה 3: Fabric.js - ספריית Canvas מקצועית ועוצמתית
     this.loadFabricJS(imageSrc, pieces);
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

  loadFabricJS(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    // טעינת ספריית Fabric.js - ספריית Canvas מקצועית ועוצמתית
    if (!window.fabric) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js';
      script.onload = () => {
        this.initFabricJS(imageSrc, pieces);
      };
      script.onerror = () => {
        // אם לא עובד, ננסה עם ספריית Paper.js
        this.loadPaperJS(imageSrc, pieces);
      };
      document.head.appendChild(script);
    } else {
      this.initFabricJS(imageSrc, pieces);
    }
  },

  initFabricJS(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <canvas id="fabric-canvas" width="700" height="600" style="border: 2px solid #ddd; border-radius: 10px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); box-shadow: 0 8px 25px rgba(0,0,0,0.1);"></canvas>
    `;
    
    try {
      const canvas = new fabric.Canvas('fabric-canvas', {
        backgroundColor: 'rgba(245, 247, 250, 0.8)',
        selection: false
      });
      
      // טעינת התמונה
      fabric.Image.fromURL(imageSrc, (img) => {
        this.createFabricPuzzlePieces(canvas, img, pieces);
      }, { crossOrigin: 'anonymous' });
      
      puzzleInfo.innerHTML = `
        <p style="color: #4CAF50; font-weight: bold;">ספריה: Fabric.js</p>
        <p>גרור את החתיכות למקום הנכון! חתיכות נכונות יהפכו לירוקות 🟢</p>
      `;
      
    } catch (error) {
      console.error('Fabric.js error:', error);
      this.loadPaperJS(imageSrc, pieces);
    }
  },

  createFabricPuzzlePieces(canvas, img, pieces) {
    const puzzleInfo = document.getElementById('puzzle-info');
    const gridSize = Math.sqrt(pieces);
    const boardWidth = 400;
    const boardHeight = 300;
    const pieceWidth = boardWidth / gridSize;
    const pieceHeight = boardHeight / gridSize;
    
    // שינוי גודל התמונה
    img.scaleToWidth(boardWidth);
    img.scaleToHeight(boardHeight);
    
    let solvedPieces = 0;
    const tolerance = 25;
    
    // יצירת אזור הלוח
    const boardRect = new fabric.Rect({
      left: 50,
      top: 50,
      width: boardWidth,
      height: boardHeight,
      fill: 'rgba(255,255,255,0.3)',
      stroke: '#4CAF50',
      strokeWidth: 3,
      strokeDashArray: [10, 5],
      selectable: false,
      evented: false
    });
    canvas.add(boardRect);
    
    // טקסט הדרכה
    const instructionText = new fabric.Text('גרור את החתיכות לכאן ⬆️', {
      left: 150,
      top: 20,
      fontSize: 18,
      fill: '#4CAF50',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      selectable: false,
      evented: false
    });
    canvas.add(instructionText);
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const correctX = 50 + col * pieceWidth;
        const correctY = 50 + row * pieceHeight;
        
        // יצירת מסיכה לחתיכת הפאזל
        const clipPath = new fabric.Rect({
          left: 0,
          top: 0,
          width: pieceWidth,
          height: pieceHeight
        });
        
        // שיבוט התמונה לכל חתיכה
        img.clone((clonedImg) => {
          clonedImg.set({
            left: Math.random() * 300 + 400, // מיקום התחלתי באזור החתיכות
            top: Math.random() * 200 + 400,
            clipPath: clipPath,
            originX: 'left',
            originY: 'top',
            scaleX: 1,
            scaleY: 1
          });
          
          // קביעת איזה חלק של התמונה להציג
          clonedImg.filters.push(new fabric.Image.filters.Crop({
            left: col / gridSize,
            top: row / gridSize,
            width: 1 / gridSize,
            height: 1 / gridSize
          }));
          clonedImg.applyFilters();
          
          // הוספת מסגרת יפה
          const group = new fabric.Group([clonedImg], {
            left: Math.random() * 250 + 450,
            top: Math.random() * 150 + 420,
            shadow: new fabric.Shadow({
              color: 'rgba(0,0,0,0.3)',
              blur: 10,
              offsetX: 3,
              offsetY: 3
            }),
            borderColor: '#2196F3',
            borderScaleFactor: 2,
            cornerColor: '#2196F3',
            cornerStyle: 'circle',
            cornerSize: 12,
            transparentCorners: false
          });
          
          // הוספת אירועי גרירה
          group.on('moving', () => {
            group.set({
              shadow: new fabric.Shadow({
                color: 'rgba(33, 150, 243, 0.5)',
                blur: 15,
                offsetX: 5,
                offsetY: 5
              })
            });
            canvas.renderAll();
          });
          
          group.on('modified', () => {
            const pos = group.getCenterPoint();
            const targetX = correctX + pieceWidth / 2;
            const targetY = correctY + pieceHeight / 2;
            
            if (Math.abs(pos.x - targetX) < tolerance && Math.abs(pos.y - targetY) < tolerance) {
              // חתיכה במקום הנכון!
              group.set({
                left: correctX,
                top: correctY,
                selectable: false,
                evented: false,
                shadow: new fabric.Shadow({
                  color: 'rgba(76, 175, 80, 0.8)',
                  blur: 20,
                  offsetX: 0,
                  offsetY: 0
                })
              });
              
              // הוספת אפקט הצלחה
              const successCircle = new fabric.Circle({
                left: correctX + pieceWidth / 2,
                top: correctY + pieceHeight / 2,
                radius: 30,
                fill: 'rgba(76, 175, 80, 0.8)',
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false
              });
              
              const checkmark = new fabric.Text('✓', {
                left: correctX + pieceWidth / 2,
                top: correctY + pieceHeight / 2,
                fontSize: 24,
                fill: 'white',
                fontWeight: 'bold',
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false
              });
              
              canvas.add(successCircle, checkmark);
              
              // הסרת האפקט אחרי 2 שניות
              setTimeout(() => {
                canvas.remove(successCircle, checkmark);
              }, 2000);
              
              solvedPieces++;
              this.playSound('success');
              
              if (solvedPieces === pieces) {
                this.playSound('complete');
                puzzleInfo.innerHTML = `
                  <div style="color: #4CAF50; font-size: 18px; font-weight: bold;">
                    🎉 מדהים! פתרת את הפאזל! 🎉
                  </div>
                `;
                
                // אפקט זיקוקים
                this.createFireworks(canvas);
              }
            } else {
              // החזרת הצל הרגיל
              group.set({
                shadow: new fabric.Shadow({
                  color: 'rgba(0,0,0,0.3)',
                  blur: 10,
                  offsetX: 3,
                  offsetY: 3
                })
              });
            }
            canvas.renderAll();
          });
          
          canvas.add(group);
        });
      }
    }
  },

  createFireworks(canvas) {
    for (let i = 0; i < 20; i++) {
      const star = new fabric.Text('⭐', {
        left: Math.random() * canvas.width,
        top: Math.random() * canvas.height,
        fontSize: Math.random() * 20 + 15,
        fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
        selectable: false,
        evented: false
      });
      
      canvas.add(star);
      
      setTimeout(() => {
        canvas.remove(star);
      }, 3000);
    }
  },

  loadPaperJS(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    // ננסה עם ספריית Paper.js
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/paper@0.12.17/dist/paper-full.min.js';
    script.onload = () => {
      this.initPaperJS(imageSrc, pieces);
    };
    script.onerror = () => {
      // אם שום דבר לא עובד, ניצור פאזל מותאם אישית
      this.createCustomPuzzle(imageSrc, pieces);
    };
    document.head.appendChild(script);
  },

  initPaperJS(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <canvas id="paper-canvas" width="700" height="600" style="border: 2px solid #ddd; border-radius: 10px; background: #f0f8ff; box-shadow: 0 8px 25px rgba(0,0,0,0.1);"></canvas>
    `;
    
    try {
      paper.setup('paper-canvas');
      
      puzzleInfo.innerHTML = `
        <p style="color: #4CAF50; font-weight: bold;">ספריה: Paper.js</p>
        <p>פאזל עם גרפיקה וקטורית מתקדמת!</p>
      `;
      
      // כאן יהיה הקוד של Paper.js
      this.createCustomPuzzle(imageSrc, pieces);
      
    } catch (error) {
      console.error('Paper.js error:', error);
      this.createCustomPuzzle(imageSrc, pieces);
    }
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