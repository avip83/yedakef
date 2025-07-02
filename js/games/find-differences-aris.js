window['find-differences-aris'] = {
  currentLevel: 0,
  totalLevels: 50,
  lives: 3,
  score: 0,
  timeLeft: 45,
  timer: null,
  gameActive: false,
  differencesFound: 0,
  totalDifferences: 4,
  
  gameData: {
    levels: [
      {
        id: 1,
        a_src: "diffrent/rabit_a.jpg",
        b_src: "diffrent/rabit_b.jpg",
        differences: [
          { left: 80, top: 120, width: 40, height: 30 },
          { left: 200, top: 80, width: 35, height: 25 },
          { left: 150, top: 200, width: 45, height: 35 },
          { left: 300, top: 150, width: 30, height: 40 }
        ]
      }
    ]
  },

  sounds: {
    success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
    wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
    click: new Audio('sounds/click-tap-computer-mouse-352734.mp3'),
    complete: new Audio('sounds/game-level-complete-143022.mp3')
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
    this.generateLevels();
    this.currentLevel = 0;
    this.lives = 3;
    this.score = 0;
    this.timeLeft = 45;
    this.gameActive = false;
    this.differencesFound = 0;
    this.showModal();
  },

  generateLevels() {
    // יצירת 50 שלבים עם וריאציות
    for (let i = 1; i < 50; i++) {
      this.gameData.levels.push({
        id: i + 1,
        a_src: "diffrent/rabit_a.jpg",
        b_src: "diffrent/rabit_b.jpg",
        differences: [
          { left: 80 + (i * 3), top: 120 + (i * 2), width: 40, height: 30 },
          { left: 200 + (i * 2), top: 80 + (i * 3), width: 35, height: 25 },
          { left: 150 + (i * 4), top: 200 + (i * 1), width: 45, height: 35 },
          { left: 300 + (i * 1), top: 150 + (i * 4), width: 30, height: 40 }
        ]
      });
    }
  },

  showModal() {
    window.scrollTo({top: 0, behavior: "auto"});
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="game-modal-content find-differences-aris-modal">
        <div class="modal-header">
          <button class="back-btn" onclick="this.closest('.game-modal').remove(); window.showGameSelection();">
            ← חזרה
          </button>
          <h2>🔍 מצא את ההבדלים - מתקדם</h2>
        </div>
        <div class="modal-body">
          <div class="game-info">
            <p>🎯 <strong>המשימה:</strong> מצא 4 הבדלים בכל תמונה</p>
            <p>❤️ <strong>חיים:</strong> 3 חיים - כל טעות גוזלת חיים</p>
            <p>⏰ <strong>זמן:</strong> 45 שניות לכל שלב</p>
            <p>🏆 <strong>ניקוד:</strong> +20 נקודות לכל הבדל, -30 לטעות</p>
            <p>📊 <strong>שלבים:</strong> ${this.totalLevels} שלבים מאתגרים</p>
          </div>
          <div class="game-features">
            <h3>🛠️ כלי עזר:</h3>
            <p>💣 <strong>פצצה:</strong> דלג על השלב הנוכחי</p>
            <p>🎯 <strong>מטרה:</strong> הדגש את כל ההבדלים לשנייה</p>
            <p>⏳ <strong>זמן נוסף:</strong> קבל 15 שניות נוספות</p>
          </div>
          <button class="start-btn" onclick="window['find-differences-aris'].startGame()">
            🚀 התחל לשחק
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  startGame() {
    this.renderGame();
    this.startTimer();
    this.gameActive = true;
  },

  renderGame() {
    const modal = document.querySelector('.game-modal');
    if (!modal) return;
    
    const level = this.gameData.levels[this.currentLevel];
    
    const gameHtml = `
      <div class="game-modal-content find-differences-aris-game">
        <div class="game-header">
          <button class="back-btn" onclick="window['find-differences-aris'].endGame();">← חזרה</button>
          <h2>🔍 מצא את ההבדלים</h2>
        </div>
        
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-icon">❤️</span>
            <span id="lives-display">${this.lives}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⏰</span>
            <span id="timer-display">${this.formatTime(this.timeLeft)}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🏆</span>
            <span id="score-display">${this.score}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📊</span>
            <span>${this.currentLevel + 1}/${this.totalLevels}</span>
          </div>
        </div>

        <div class="helpers-bar">
          <button class="helper-btn" onclick="window['find-differences-aris'].useBomb()" title="דלג על השלב">
            💣 פצצה
          </button>
          <button class="helper-btn" onclick="window['find-differences-aris'].showTarget()" title="הצג הבדלים לשנייה">
            🎯 מטרה
          </button>
          <button class="helper-btn" onclick="window['find-differences-aris'].addTime()" title="הוסף 15 שניות">
            ⏳ זמן נוסף
          </button>
        </div>
        
        <div class="images-container">
          <div class="image-wrapper" id="image-left">
            <img src="${level.a_src}" alt="תמונה מקורית" id="img-a">
            <div class="differences-overlay" id="overlay-a"></div>
            <div class="crosshair" id="crosshair-a"></div>
          </div>
          <div class="image-wrapper" id="image-right">
            <img src="${level.b_src}" alt="תמונה עם הבדלים" id="img-b">
            <div class="differences-overlay" id="overlay-b"></div>
            <div class="crosshair" id="crosshair-b"></div>
          </div>
        </div>

        <div class="game-instructions">
          <p>👆 לחץ על ההבדלים בתמונות. זהירות - טעות גוזלת חיים!</p>
        </div>
      </div>
    `;
    
    modal.innerHTML = gameHtml;
    this.setupDifferences();
    this.setupMouseTracking();
  },

  setupDifferences() {
    const level = this.gameData.levels[this.currentLevel];
    const overlayA = document.getElementById('overlay-a');
    const overlayB = document.getElementById('overlay-b');
    
    if (!overlayA || !overlayB) return;
    
    overlayA.innerHTML = '';
    overlayB.innerHTML = '';
    
    level.differences.forEach((diff, index) => {
      const diffA = document.createElement('div');
      const diffB = document.createElement('div');
      
      diffA.className = diffB.className = 'difference-zone';
      diffA.dataset.index = diffB.dataset.index = index;
      
      const style = `left: ${diff.left}px; top: ${diff.top}px; width: ${diff.width}px; height: ${diff.height}px;`;
      diffA.style.cssText = style;
      diffB.style.cssText = style;
      
      diffA.onclick = diffB.onclick = (e) => this.handleDifferenceClick(e, index);
      
      overlayA.appendChild(diffA);
      overlayB.appendChild(diffB);
    });
    
    document.getElementById('image-left').onclick = (e) => {
      if (e.target.id === 'img-a') this.handleWrongClick(e);
    };
    document.getElementById('image-right').onclick = (e) => {
      if (e.target.id === 'img-b') this.handleWrongClick(e);
    };
  },

  setupMouseTracking() {
    const imageLeft = document.getElementById('image-left');
    const imageRight = document.getElementById('image-right');
    const crosshairA = document.getElementById('crosshair-a');
    const crosshairB = document.getElementById('crosshair-b');
    
    if (!imageLeft || !imageRight) return;
    
    imageLeft.onmousemove = (e) => {
      const rect = imageLeft.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      crosshairB.style.left = x + 'px';
      crosshairB.style.top = y + 'px';
      crosshairB.style.display = 'block';
      crosshairA.style.display = 'none';
    };
    
    imageRight.onmousemove = (e) => {
      const rect = imageRight.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      crosshairA.style.left = x + 'px';
      crosshairA.style.top = y + 'px';
      crosshairA.style.display = 'block';
      crosshairB.style.display = 'none';
    };
    
    imageLeft.onmouseleave = imageRight.onmouseleave = () => {
      crosshairA.style.display = 'none';
      crosshairB.style.display = 'none';
    };
  },

  handleDifferenceClick(e, index) {
    e.stopPropagation();
    if (!this.gameActive) return;
    
    const allDiffs = document.querySelectorAll(`[data-index="${index}"]`);
    if (allDiffs[0].classList.contains('found')) return;
    
    this.playSound('success');
    this.differencesFound++;
    this.score += 20;
    
    allDiffs.forEach(diff => {
      diff.classList.add('found');
      diff.innerHTML = '✓';
    });
    
    this.updateDisplay();
    
    if (this.differencesFound >= this.totalDifferences) {
      this.completeLevel();
    }
  },

  handleWrongClick(e) {
    if (!this.gameActive) return;
    
    this.playSound('wrong');
    this.lives--;
    this.score = Math.max(0, this.score - 30);
    
    this.showWrongEffect(e);
    this.updateDisplay();
    
    if (this.lives <= 0) {
      this.gameOver();
    }
  },

  showWrongEffect(e) {
    const effect = document.createElement('div');
    effect.className = 'wrong-effect';
    effect.textContent = '-30';
    effect.style.left = e.offsetX + 'px';
    effect.style.top = e.offsetY + 'px';
    
    e.target.parentNode.appendChild(effect);
    
    setTimeout(() => {
      if (effect.parentNode) effect.remove();
    }, 1500);
  },

  updateDisplay() {
    const livesDisplay = document.getElementById('lives-display');
    const scoreDisplay = document.getElementById('score-display');
    
    if (livesDisplay) livesDisplay.textContent = this.lives;
    if (scoreDisplay) scoreDisplay.textContent = this.score;
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      const timerDisplay = document.getElementById('timer-display');
      if (timerDisplay) {
        timerDisplay.textContent = this.formatTime(this.timeLeft);
      }
      
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
    this.playSound('complete');
    
    const bonusPoints = this.timeLeft * 2;
    this.score += bonusPoints;
    
    this.showLevelComplete(bonusPoints);
  },

  showLevelComplete(bonus) {
    const modal = document.createElement('div');
    modal.className = 'game-modal level-complete-modal';
    modal.innerHTML = `
      <div class="game-modal-content">
        <div class="success-animation">🎉</div>
        <h2>כל הכבוד!</h2>
        <p>השלמת את השלב ${this.currentLevel + 1}</p>
        <div class="score-breakdown">
          <p>נקודות הבדלים: ${this.differencesFound * 20}</p>
          <p>בונוס זמן: +${bonus}</p>
          <p><strong>ניקוד כולל: ${this.score}</strong></p>
        </div>
        <button class="next-btn" onclick="window['find-differences-aris'].nextLevel()">
          ➡️ שלב הבא
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  },

  nextLevel() {
    document.querySelector('.level-complete-modal').remove();
    this.currentLevel++;
    
    if (this.currentLevel >= this.totalLevels) {
      this.gameComplete();
      return;
    }
    
    this.differencesFound = 0;
    this.timeLeft = 45;
    this.renderGame();
    this.startTimer();
    this.gameActive = true;
  },

  gameComplete() {
    const modal = document.createElement('div');
    modal.className = 'game-modal game-complete-modal';
    modal.innerHTML = `
      <div class="game-modal-content">
        <div class="success-animation">🏆</div>
        <h2>מזל טוב!</h2>
        <p>השלמת את כל ${this.totalLevels} השלבים!</p>
        <p><strong>הניקוד הסופי שלך: ${this.score}</strong></p>
        <div class="action-buttons">
          <button class="play-again-btn" onclick="window['find-differences-aris'].playAgain()">
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
    modal.className = 'game-modal game-over-modal';
    modal.innerHTML = `
      <div class="game-modal-content">
        <div class="game-over-animation">💔</div>
        <h2>המשחק הסתיים</h2>
        <p>הגעת לשלב ${this.currentLevel + 1}</p>
        <p>הניקוד שלך: ${this.score}</p>
        <div class="action-buttons">
          <button class="try-again-btn" onclick="window['find-differences-aris'].tryAgain()">
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

  useBomb() {
    if (!this.gameActive) return;
    this.completeLevel();
  },

  showTarget() {
    if (!this.gameActive) return;
    const diffs = document.querySelectorAll('.difference-zone:not(.found)');
    diffs.forEach(diff => {
      diff.style.background = 'rgba(255, 255, 0, 0.6)';
      diff.style.border = '2px solid #ffeb3b';
    });
    
    setTimeout(() => {
      diffs.forEach(diff => {
        diff.style.background = '';
        diff.style.border = '';
      });
    }, 1500);
  },

  addTime() {
    if (!this.gameActive) return;
    this.timeLeft += 15;
    this.updateDisplay();
  },

  tryAgain() {
    document.querySelector('.game-over-modal').remove();
    this.currentLevel = 0;
    this.lives = 3;
    this.score = 0;
    this.differencesFound = 0;
    this.timeLeft = 45;
    this.renderGame();
    this.startTimer();
    this.gameActive = true;
  },

  playAgain() {
    document.querySelector('.game-complete-modal').remove();
    this.init();
  },

  endGame() {
    this.gameActive = false;
    this.stopTimer();
    const modal = document.querySelector('.game-modal');
    if (modal) modal.remove();
    window.showGameSelection();
  }
}; 