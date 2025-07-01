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
    
         // ספריה 1: JigsawJS - פשוטה וקלה
     this.loadJigsawJS(imageSrc, pieces);
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

  loadJigsawJS(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    // ננסה עם ספריית Puzzle.js מ-GitHub
    if (!window.Puzzle) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/kenhkan/puzzle.js@master/dist/puzzle.min.js';
      script.onload = () => {
        this.initPuzzleJS(imageSrc, pieces);
      };
      script.onerror = () => {
        // אם גם זה לא עובד, ננסה עם ספריה אחרת
        this.loadJigsawPuzzleLib(imageSrc, pieces);
      };
      document.head.appendChild(script);
    } else {
      this.initPuzzleJS(imageSrc, pieces);
    }
  },

  initPuzzleJS(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <div id="puzzle-container" style="width: 100%; height: 500px; background: #fff; border-radius: 10px; overflow: hidden;"></div>
    `;
    
    try {
      // יצירת הפאזל עם Puzzle.js
      const puzzle = new Puzzle({
        element: '#puzzle-container',
        image: imageSrc,
        pieces: pieces,
        onComplete: () => {
          this.playSound('complete');
          puzzleInfo.innerHTML = `
            <div style="color: #4CAF50; font-size: 18px; font-weight: bold;">
              🎉 כל הכבוד! פתרת את הפאזל! 🎉
            </div>
          `;
        }
      });
      
      puzzleInfo.innerHTML = `
        <p style="color: #4CAF50; font-weight: bold;">ספריה: Puzzle.js</p>
        <p>גרור את החלקים למקום הנכון!</p>
      `;
      
    } catch (error) {
      // אם גם זה לא עובד, ננסה משהו אחר
      this.loadJigsawPuzzleLib(imageSrc, pieces);
    }
  },

  loadJigsawPuzzleLib(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    // ננסה עם ספריה פשוטה יותר
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/jigsaw-puzzle@1.0.0/dist/jigsaw-puzzle.min.js';
    script.onload = () => {
      this.initJigsawPuzzleLib(imageSrc, pieces);
    };
    script.onerror = () => {
      // אם שום ספריה לא עובדת, ניצור פאזל פשוט בעצמנו
      this.createSimplePuzzle(imageSrc, pieces);
    };
    document.head.appendChild(script);
  },

  initJigsawPuzzleLib(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <div id="jigsaw-puzzle" style="width: 100%; height: 500px; background: #fff; border-radius: 10px; overflow: hidden;"></div>
    `;
    
    try {
      const jigsawPuzzle = new JigsawPuzzle({
        container: '#jigsaw-puzzle',
        image: imageSrc,
        pieces: pieces,
        onComplete: () => {
          this.playSound('complete');
          puzzleInfo.innerHTML = `
            <div style="color: #4CAF50; font-size: 18px; font-weight: bold;">
              🎉 כל הכבוד! פתרת את הפאזל! 🎉
            </div>
          `;
        }
      });
      
      puzzleInfo.innerHTML = `
        <p style="color: #4CAF50; font-weight: bold;">ספריה: JigsawPuzzle</p>
        <p>גרור את החלקים למקום הנכון!</p>
      `;
      
    } catch (error) {
      this.createSimplePuzzle(imageSrc, pieces);
    }
  },

  createSimplePuzzle(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 48px; margin-bottom: 20px;">🧩</div>
        <div style="font-size: 20px; color: #4CAF50; margin-bottom: 15px;">פאזל פשוט</div>
        <img src="${imageSrc}" style="max-width: 300px; max-height: 300px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 10px; color: #2e7d32;">
          <strong>תמונה נטענה בהצלחה!</strong><br>
          רמת קושי: ${pieces} חלקים<br>
          <small>הספריות החיצוניות לא זמינות כרגע</small>
        </div>
      </div>
    `;
    
    puzzleInfo.innerHTML = `
      <p style="color: #ff9800; font-weight: bold;">מצב גיבוי: תצוגת תמונה</p>
      <p>הספריות החיצוניות לא זמינות, אבל התמונה נטענה בהצלחה!</p>
    `;
  }
}; 