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

  getRandomPuzzleImage() {
    // תמונות פאזל מתיקיית puzzle (1.png עד 20.png)
    // נתיב נכון לאתר GitHub Pages
    const baseUrl = 'https://avip83.github.io/KIDS/puzzle/';
    const imageNumber = Math.floor(Math.random() * 20) + 1;
    const imageUrl = `${baseUrl}${imageNumber}.png`;
    
    console.log('Selected puzzle image:', imageUrl);
    
    // בדיקה שהתמונה זמינה (אופציונלי)
    const img = new Image();
    img.onload = () => console.log('✅ Image loaded successfully:', imageUrl);
    img.onerror = () => console.error('❌ Failed to load image:', imageUrl);
    img.src = imageUrl;
    
    return imageUrl;
  },

  startRandomPuzzle() {
    const imageSrc = this.getRandomPuzzleImage();
    const pieces = 9; // ברירת מחדל 9 חלקים
    this.createJigsawExplorerPuzzle(imageSrc, pieces);
  },

  init() {
    this.loadSounds();
    this.showModal();
    // התחלה ישירה עם פאזל ברירת מחדל
    setTimeout(() => {
      this.startRandomPuzzle();
    }, 100);
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
            <select id="puzzle-difficulty" style="padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #ddd; font-size: 16px;">
              <option value="4">קל מאוד (4 חלקים)</option>
              <option value="9" selected>קל (9 חלקים)</option>
              <option value="16">בינוני (16 חלקים)</option>
            </select>
            <button onclick="window['simple-puzzle'].newPuzzle()" style="padding: 10px 20px; margin: 5px; border: none; border-radius: 8px; background: linear-gradient(45deg, #1976d2, #42a5f5); color: white; font-size: 16px; cursor: pointer; font-weight: bold;">פאזל חדש</button>
            <button onclick="window['simple-puzzle'].showPreview()" style="padding: 10px 20px; margin: 5px; border: none; border-radius: 8px; background: linear-gradient(45deg, #90caf9, #bbdefb); color: #1976d2; font-size: 16px; cursor: pointer; font-weight: bold;">תצוגה מקדימה</button>
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
    const difficultySelect = document.getElementById('puzzle-difficulty');
    const puzzleArea = document.getElementById('puzzle-area');
    
    // בחירת תמונה רנדומלית חדשה
    const imageSrc = this.getRandomPuzzleImage();
    const pieces = difficultySelect ? parseInt(difficultySelect.value) : 9;
    
    puzzleArea.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 48px; margin-bottom: 15px; animation: spin 1s linear infinite;">🧩</div>
        <div style="color: #1976d2; font-size: 18px; font-weight: bold;">טוען פאזל חדש...</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    // טעינת הפאזל החדש
    setTimeout(() => {
      this.createJigsawExplorerPuzzle(imageSrc, pieces);
    }, 500);
  },

  nextLevel() {
    this.playSound('click');
    const difficultySelect = document.getElementById('puzzle-difficulty');
    
    // מעבר לרמת קושי הבאה
    const currentDifficulty = difficultySelect ? parseInt(difficultySelect.value) : 9;
    let nextDifficulty;
    
    if (currentDifficulty === 4) {
      nextDifficulty = 9;
    } else if (currentDifficulty === 9) {
      nextDifficulty = 16;
    } else {
      // אם זה הרמה הקשה ביותר, עבור לתמונה חדשה ברמה הקלה
      nextDifficulty = 4;
    }
    
    if (difficultySelect) {
      difficultySelect.value = nextDifficulty;
    }
    
    // תמונה חדשה רנדומלית עם הרמה החדשה
    const imageSrc = this.getRandomPuzzleImage();
    this.createJigsawExplorerPuzzle(imageSrc, nextDifficulty);
  },

  showPreview() {
    this.playSound('click');
    // נשתמש בתמונה רנדומלית לתצוגה מקדימה
    const imageSrc = this.getRandomPuzzleImage();
    
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

  createJigsawExplorerPuzzle(imageSrc, pieces) {
    const puzzleArea = document.getElementById('puzzle-area');
    const puzzleInfo = document.getElementById('puzzle-info');
    
    puzzleArea.innerHTML = `
      <div style="background: white; border-radius: 10px; padding: 10px; box-shadow: 0 4px 15px rgba(30, 136, 229, 0.15); border: 2px solid #90caf9;">
        <div id="jigsaw-puzzle-container" style="width: 100%; height: 450px; border: 2px solid #1976d2; border-radius: 8px; overflow: hidden; position: relative;">
          <!-- JigsawExplorer יטען כאן -->
        </div>
      </div>
    `;
    
    puzzleInfo.innerHTML = '';
    
    // יצירת iframe עם JigsawExplorer
    this.loadJigsawExplorer(imageSrc, pieces);
  },

  loadJigsawExplorer(imageSrc, pieces) {
    const container = document.getElementById('jigsaw-puzzle-container');
    
    console.log('Loading JigsawExplorer with image:', imageSrc, 'pieces:', pieces);
    
    // יצירת URL עבור JigsawExplorer עם התמונות מתיקיית puzzle
    const jigsawUrl = `https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?` + 
      `url=${encodeURIComponent(imageSrc)}&` +
      `pieces=${pieces}&` +
      `bgcolor=%23fffde4&` +
      `bcolor=%231976d2&` +
      `title=${encodeURIComponent('פאזל לילדים')}&` +
      `autostart=true`;
    
    console.log('JigsawExplorer URL:', jigsawUrl);
    
    container.innerHTML = `
      <iframe 
        src="${jigsawUrl}" 
        width="100%" 
        height="100%" 
        frameborder="0" 
        allowfullscreen
        style="border-radius: 8px; transition: opacity 0.5s;"
        onload="console.log('JigsawExplorer iframe loaded'); document.getElementById('loading-overlay').style.display='none';"
      ></iframe>
      
      <div id="loading-overlay" style="
        position: absolute; 
        top: 0; left: 0; right: 0; bottom: 0; 
        background: rgba(255,255,255,0.95); 
        display: flex; 
        flex-direction: column;
        align-items: center; 
        justify-content: center;
        border-radius: 8px;
        z-index: 1000;
      ">
        <div style="font-size: 48px; margin-bottom: 15px; animation: spin 2s linear infinite;">🧩</div>
        <div style="color: #1976d2; font-weight: bold; font-size: 18px;">טוען פאזל...</div>
        <div style="color: #666; font-size: 14px; margin-top: 5px;">טוען תמונה מתיקיית הפאזלים</div>
        <div style="color: #888; font-size: 12px; margin-top: 8px; font-family: monospace;">${imageSrc}</div>
      </div>
      
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    // הסרת overlay הטעינה אחרי 4 שניות (יותר זמן לטעינת תמונות)
    setTimeout(() => {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
        }, 500);
      }
    }, 3000);
    
        // לא מוסיפים כפתורים נוספים - הכל זמין בחלק העליון
  },

  showPreview() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
      background: rgba(0,0,0,0.8); 
      display: flex; align-items: center; justify-content: center; 
      z-index: 10000;
      animation: fadeIn 0.3s;
    `;
    
    // נשתמש בתמונה רנדומלית
    const currentImage = this.getRandomPuzzleImage();
    modal.innerHTML = `
      <div style="
        background: white; 
        padding: 20px; 
        border-radius: 15px; 
        max-width: 90%; 
        max-height: 90%; 
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      ">
        <h3 style="color: #1976d2; margin-bottom: 15px;">👁️ תצוגה מקדימה</h3>
        <img src="${currentImage}" style="max-width: 100%; max-height: 400px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <br>
        <button onclick="this.parentElement.parentElement.remove()" style="
          margin-top: 15px; 
          padding: 10px 20px; 
          border: none; 
          border-radius: 25px; 
          background: #1976d2; 
          color: white; 
          font-weight: bold; 
          cursor: pointer;
        ">סגור</button>
      </div>
      
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(modal);
    
    // סגירה בלחיצה על הרקע
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  },

  showHints() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
      background: rgba(0,0,0,0.8); 
      display: flex; align-items: center; justify-content: center; 
      z-index: 10000;
      animation: fadeIn 0.3s;
    `;
    
    modal.innerHTML = `
      <div style="
        background: white; 
        padding: 25px; 
        border-radius: 15px; 
        max-width: 500px; 
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      ">
        <h3 style="color: #FF9800; margin-bottom: 20px; font-size: 24px;">💡 רמזים ועצות</h3>
        
        <div style="text-align: right; line-height: 2; color: #555;">
          <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
            <strong style="color: #4CAF50;">🔍 התחל עם הקצוות:</strong><br>
            חפש חתיכות עם קו ישר - אלה החתיכות של המסגרת
          </div>
          
          <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
            <strong style="color: #2196F3;">🎨 קבץ לפי צבעים:</strong><br>
            חפש חתיכות עם צבעים דומים ונסה לחבר אותן
          </div>
          
          <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
            <strong style="color: #FF9800;">🔗 חפש תבניות:</strong><br>
            שים לב לפרטים כמו עלים, פסים או צורות מיוחדות
          </div>
          
          <div style="padding: 10px; background: #f8f9fa; border-radius: 8px;">
            <strong style="color: #9C27B0;">⚡ שלבים קטנים:</strong><br>
            אל תנסה לפתור הכל בבת אחת - עבוד על אזורים קטנים
          </div>
        </div>
        
        <button onclick="this.parentElement.parentElement.remove()" style="
          margin-top: 20px; 
          padding: 12px 24px; 
          border: none; 
          border-radius: 25px; 
          background: linear-gradient(45deg, #FF9800, #FFB74D); 
          color: white; 
          font-weight: bold; 
          cursor: pointer;
          font-size: 16px;
        ">הבנתי! 👍</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
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