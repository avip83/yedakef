window['find-differences-new'] = {
  stage: 0,
  totalStages: 10,
  currentImageIndex: 0,
  foundDifferences: 0,
  totalDifferences: 4,
  timeLeft: 60,
  timer: null,
  gameActive: false,
  sounds: {
    success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
    wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
    click: new Audio('sounds/click-tap-computer-mouse-352734.mp3')
  },
  
  // Game data - 10 levels with difference coordinates
  gameData: {
    count: 10,
    images: [
      {
        src: "diffrent/rabit",
        positions: [
          { x: 50, y: 80, w: 40, h: 50 },
          { x: 150, y: 120, w: 35, h: 45 },
          { x: 250, y: 60, w: 45, h: 40 },
          { x: 100, y: 200, w: 50, h: 35 }
        ]
      },
      {
        src: "diffrent/rabit", 
        positions: [
          { x: 80, y: 90, w: 45, h: 55 },
          { x: 180, y: 140, w: 40, h: 40 },
          { x: 280, y: 70, w: 50, h: 45 },
          { x: 120, y: 180, w: 35, h: 50 }
        ]
      },
      {
        src: "diffrent/rabit",
        positions: [
          { x: 60, y: 100, w: 50, h: 40 },
          { x: 160, y: 80, w: 45, h: 60 },
          { x: 240, y: 150, w: 40, h: 35 },
          { x: 90, y: 220, w: 55, h: 40 }
        ]
      },
      {
        src: "diffrent/rabit",
        positions: [
          { x: 70, y: 60, w: 40, h: 50 },
          { x: 170, y: 110, w: 50, h: 45 },
          { x: 260, y: 90, w: 45, h: 55 },
          { x: 110, y: 190, w: 40, h: 40 }
        ]
      },
      {
        src: "diffrent/rabit",
        positions: [
          { x: 85, y: 70, w: 45, h: 45 },
          { x: 185, y: 100, w: 40, h: 50 },
          { x: 270, y: 130, w: 50, h: 40 },
          { x: 130, y: 210, w: 45, h: 35 }
        ]
      },
      {
        src: "diffrent/rabit",
        positions: [
          { x: 90, y: 85, w: 50, h: 40 },
          { x: 190, y: 125, w: 45, h: 45 },
          { x: 275, y: 75, w: 40, h: 50 },
          { x: 115, y: 205, w: 50, h: 40 }
        ]
      },
      {
        src: "diffrent/rabit",
        positions: [
          { x: 75, y: 95, w: 40, h: 45 },
          { x: 175, y: 85, w: 50, h: 40 },
          { x: 255, y: 140, w: 45, h: 50 },
          { x: 105, y: 215, w: 40, h: 35 }
        ]
      },
      {
        src: "diffrent/rabit",
        positions: [
          { x: 95, y: 75, w: 45, h: 50 },
          { x: 195, y: 115, w: 40, h: 45 },
          { x: 285, y: 85, w: 50, h: 40 },
          { x: 125, y: 195, w: 45, h: 45 }
        ]
      },
      {
        src: "diffrent/rabit",
        positions: [
          { x: 65, y: 105, w: 50, h: 35 },
          { x: 165, y: 75, w: 45, h: 55 },
          { x: 245, y: 155, w: 40, h: 40 },
          { x: 95, y: 225, w: 55, h: 35 }
        ]
      },
      {
        src: "diffrent/rabit",
        positions: [
          { x: 55, y: 65, w: 45, h: 55 },
          { x: 155, y: 135, w: 50, h: 40 },
          { x: 235, y: 95, w: 45, h: 45 },
          { x: 85, y: 185, w: 40, h: 50 }
        ]
      }
    ]
  },

  playSound(type) {
    if (window.__globalMute) return;
    if (this.sounds[type]) {
      try {
        this.sounds[type].currentTime = 0;
        this.sounds[type].volume = 0.5;
        this.sounds[type].play();
      } catch (e) {
        console.log('Sound play failed:', e);
      }
    }
  },

  init() {
    this.stage = 0;
    this.currentImageIndex = 0;
    this.foundDifferences = 0;
    this.timeLeft = 60;
    this.gameActive = false;
    this.showModal();
  },

  showModal() {
    window.scrollTo({top: 0, behavior: "auto"});
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="game-modal-content find-differences-modal">
        <div class="modal-header">
          <button class="back-btn" onclick="this.closest('.game-modal').remove(); window.showGameSelection();">
            ← חזרה
          </button>
          <h2>🔍 מצא את ההבדלים</h2>
        </div>
        <div class="modal-body">
          <div class="game-info">
            <p>🎯 <strong>המשימה:</strong> מצא 4 הבדלים בין שתי התמונות</p>
            <p>⏰ <strong>זמן:</strong> 60 שניות לכל שלב</p>
            <p>⚠️ <strong>שים לב:</strong> לחיצה שגויה תגרע 10 שניות!</p>
            <p>📊 <strong>שלבים:</strong> 10 שלבים מאתגרים</p>
          </div>
          <div class="progress-info">
            <div class="level-progress">
              <span>שלב <span id="current-stage">1</span> מתוך <span id="total-stages">10</span></span>
              <div class="progress-bar-container">
                <div class="progress-bar" id="stage-progress"></div>
              </div>
            </div>
          </div>
          <button class="start-btn" onclick="window['find-differences-new'].startGame()">
            🚀 התחל לשחק
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    this.updateProgress();
  },

  startGame() {
    document.querySelector('.game-modal').remove();
    this.renderGame();
    this.startTimer();
    this.gameActive = true;
  },

  renderGame() {
    const gameHtml = `
      <div class="find-differences-game">
        <div class="game-header">
          <button class="back-btn" onclick="window['find-differences-new'].endGame();">← חזרה</button>
          <h2>🔍 מצא את ההבדלים</h2>
          <div class="game-stats">
            <div class="timer-display">
              <span>⏰ <span id="time-display">${this.timeLeft}</span></span>
            </div>
            <div class="differences-display">
              <span>🎯 <span id="found-count">${this.foundDifferences}</span>/${this.totalDifferences}</span>
            </div>
          </div>
        </div>
        
        <div class="stage-info">
          <span>שלב ${this.stage + 1} מתוך ${this.totalStages}</span>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${((this.stage + 1) / this.totalStages) * 100}%"></div>
          </div>
        </div>

        <div class="images-container">
          <div class="image-wrapper">
            <div class="image-title">תמונה מקורית</div>
            <div class="picture-container" id="top-picture">
              <img src="${this.gameData.images[this.currentImageIndex].src}_a.jpg" alt="תמונה מקורית">
              <div class="click-layer" id="top-layer"></div>
            </div>
          </div>
          
          <div class="image-wrapper">
            <div class="image-title">מצא את ההבדלים</div>
            <div class="picture-container" id="bottom-picture">
              <img src="${this.gameData.images[this.currentImageIndex].src}_b.jpg" alt="תמונה עם הבדלים">
              <div class="click-layer" id="bottom-layer"></div>
            </div>
          </div>
        </div>

        <div class="game-instructions">
          <p>👆 לחץ על האזורים השונים בתמונות כדי למצוא את ההבדלים</p>
        </div>
      </div>
    `;
    
    document.getElementById('gameArea').innerHTML = gameHtml;
    this.setupDifferences();
  },

  setupDifferences() {
    const topLayer = document.getElementById('top-layer');
    const bottomLayer = document.getElementById('bottom-layer');
    const positions = this.gameData.images[this.currentImageIndex].positions;
    
    // Clear existing differences
    topLayer.innerHTML = '';
    bottomLayer.innerHTML = '';
    
    // Create clickable areas for differences
    positions.forEach((pos, index) => {
      const topDiff = document.createElement('div');
      const bottomDiff = document.createElement('div');
      
      topDiff.className = bottomDiff.className = 'difference-area';
      topDiff.dataset.index = bottomDiff.dataset.index = index;
      
      // Set position and size
      const style = `left: ${pos.x}px; top: ${pos.y}px; width: ${pos.w}px; height: ${pos.h}px;`;
      topDiff.style.cssText = style;
      bottomDiff.style.cssText = style;
      
      // Add click handlers
      topDiff.onclick = bottomDiff.onclick = (e) => this.handleDifferenceClick(e, index);
      
      topLayer.appendChild(topDiff);
      bottomLayer.appendChild(bottomDiff);
    });
    
    // Add wrong click handlers for the layers
    topLayer.onclick = bottomLayer.onclick = (e) => {
      if (e.target === topLayer || e.target === bottomLayer) {
        this.handleWrongClick();
      }
    };
  },

  handleDifferenceClick(e, index) {
    e.stopPropagation();
    
    if (!this.gameActive) return;
    
    const allDifferences = document.querySelectorAll(`[data-index="${index}"]`);
    const isAlreadyFound = allDifferences[0].classList.contains('found');
    
    if (!isAlreadyFound) {
      this.playSound('success');
      this.foundDifferences++;
      
      // Mark as found
      allDifferences.forEach(diff => {
        diff.classList.add('found');
        diff.style.pointerEvents = 'none';
      });
      
      // Update display
      document.getElementById('found-count').textContent = this.foundDifferences;
      
      // Check if level completed
      if (this.foundDifferences >= this.totalDifferences) {
        this.completeLevel();
      }
    }
  },

  handleWrongClick() {
    if (!this.gameActive) return;
    
    this.playSound('wrong');
    this.timeLeft = Math.max(0, this.timeLeft - 10);
    document.getElementById('time-display').textContent = this.timeLeft;
    
    // Show wrong click effect
    this.showWrongClickEffect();
    
    if (this.timeLeft <= 0) {
      this.gameOver();
    }
  },

  showWrongClickEffect() {
    const effect = document.createElement('div');
    effect.className = 'wrong-click-effect';
    effect.textContent = '-10 שניות';
    document.querySelector('.find-differences-game').appendChild(effect);
    
    setTimeout(() => {
      effect.remove();
    }, 2000);
  },

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      document.getElementById('time-display').textContent = this.timeLeft;
      
      if (this.timeLeft <= 0) {
        this.gameOver();
      }
    }, 1000);
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  completeLevel() {
    this.gameActive = false;
    this.stopTimer();
    this.stage++;
    
    if (this.stage >= this.totalStages) {
      this.gameComplete();
    } else {
      this.showLevelComplete();
    }
  },

  showLevelComplete() {
    const modal = document.createElement('div');
    modal.className = 'game-modal level-complete';
    modal.innerHTML = `
      <div class="game-modal-content">
        <div class="success-animation">🎉</div>
        <h2>כל הכבוד!</h2>
        <p>השלמת את השלב ${this.stage}</p>
        <p>זמן שנותר: ${this.timeLeft} שניות</p>
        <div class="progress-info">
          <span>שלב ${this.stage + 1} מתוך ${this.totalStages}</span>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${((this.stage + 1) / this.totalStages) * 100}%"></div>
          </div>
        </div>
        <button class="next-btn" onclick="window['find-differences-new'].nextLevel()">
          ➡️ שלב הבא
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  },

  nextLevel() {
    document.querySelector('.level-complete').remove();
    this.currentImageIndex = this.stage;
    this.foundDifferences = 0;
    this.timeLeft = 60;
    this.renderGame();
    this.startTimer();
    this.gameActive = true;
  },

  gameComplete() {
    const modal = document.createElement('div');
    modal.className = 'game-modal game-complete';
    modal.innerHTML = `
      <div class="game-modal-content">
        <div class="success-animation">🏆</div>
        <h2>מזל טוב!</h2>
        <p>השלמת את כל השלבים!</p>
        <p>אתה מומחה במציאת הבדלים! 🔍</p>
        <div class="final-score">
          <p>שלבים שהושלמו: ${this.totalStages}/${this.totalStages}</p>
        </div>
        <div class="action-buttons">
          <button class="play-again-btn" onclick="window['find-differences-new'].playAgain()">
            🔄 שחק שוב
          </button>
          <button class="back-btn" onclick="this.closest('.game-modal').remove(); window.showGameSelection();">
            🏠 חזרה לתפריט
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  gameOver() {
    this.gameActive = false;
    this.stopTimer();
    
    const modal = document.createElement('div');
    modal.className = 'game-modal game-over';
    modal.innerHTML = `
      <div class="game-modal-content">
        <div class="game-over-animation">⏰</div>
        <h2>הזמן נגמר!</h2>
        <p>השלמת ${this.stage} שלבים</p>
        <p>הבדלים שמצאת בשלב הנוכחי: ${this.foundDifferences}/${this.totalDifferences}</p>
        <div class="action-buttons">
          <button class="try-again-btn" onclick="window['find-differences-new'].tryAgain()">
            🔄 נסה שוב
          </button>
          <button class="back-btn" onclick="this.closest('.game-modal').remove(); window.showGameSelection();">
            🏠 חזרה לתפריט
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  tryAgain() {
    document.querySelector('.game-over').remove();
    this.foundDifferences = 0;
    this.timeLeft = 60;
    this.renderGame();
    this.startTimer();
    this.gameActive = true;
  },

  playAgain() {
    document.querySelector('.game-complete').remove();
    this.init();
  },

  updateProgress() {
    const progressBar = document.getElementById('stage-progress');
    const currentStage = document.getElementById('current-stage');
    const totalStages = document.getElementById('total-stages');
    
    if (progressBar) {
      progressBar.style.width = `${((this.stage + 1) / this.totalStages) * 100}%`;
    }
    if (currentStage) {
      currentStage.textContent = this.stage + 1;
    }
    if (totalStages) {
      totalStages.textContent = this.totalStages;
    }
  },

  endGame() {
    this.gameActive = false;
    this.stopTimer();
    this.showModal();
  }
}; 