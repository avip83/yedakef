window['color-match'] = {
  stage: 0,
  totalStages: 20,
  get muted() { return !!window.__globalMute; },
  set muted(val) { window.__globalMute = !!val; },
  playSound(type) {
    if (this.muted) return;
    if (this.sounds && this.sounds[type]) {
      try {
        this.sounds[type].currentTime = 0;
        this.sounds[type].play();
      } catch (e) {}
    }
  },
  init() {
    this.stage = 0;
    this.showModal();
    this.renderGame();
  },
  showModal() {
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="game-modal-content">
        <button class="volume-button${this.muted ? ' muted' : ''}" id="color-matching-volume" title="הפעל/השתק צלילים" onclick="window['color-match'].toggleMute()">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12h6l8-7v22l-8-7H6z" fill="currentColor"/>
            <line x1="8" y1="8" x2="24" y2="24" class="mute-line"/>
          </svg>
        </button>
        <div class="game-modal-header">
          <h2>התאמת צבעים</h2>
          <button class="close-button" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>גרור את העיגול הצבעוני למקום הנכון!</p>
          <div id="color-match-board" style="display: flex; gap: 32px; margin: 24px 0;"></div>
          <div id="color-match-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px;"></div>
          <button id="color-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  toggleMute() {
    this.muted = !this.muted;
    const btn = document.getElementById('color-matching-volume');
    if (btn) {
      if (this.muted) btn.classList.add('muted');
      else btn.classList.remove('muted');
    }
  },
  renderGame() {
    setTimeout(() => {
      if (!document.getElementById('color-matching-volume')) {
        const modalContent = document.querySelector('.game-modal-content');
        if (modalContent) {
          const btn = document.createElement('button');
          btn.className = 'volume-button' + (this.muted ? ' muted' : '');
          btn.id = 'color-matching-volume';
          btn.title = 'הפעל/השתק צלילים';
          btn.onclick = () => window['color-match'].toggleMute();
          btn.innerHTML = `
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12h6l8-7v22l-8-7H6z" fill="currentColor"/>
              <line x1="8" y1="8" x2="24" y2="24" class="mute-line"/>
            </svg>
          `;
          modalContent.appendChild(btn);
        }
      }
    }, 0);
    const colors = [
      {color: '#e53935'},
      {color: '#1e88e5'},
      {color: '#fbc02d'}
    ];
    // שלב רנדומלי: ערבוב סדר
    const targets = [...colors].sort(() => Math.random() - 0.5);
    const drags = [...colors].sort(() => Math.random() - 0.5);
    const board = document.getElementById('color-match-board');
    board.innerHTML = '';
    // מטרות (עיגולים ריקים)
    targets.forEach((c, i) => {
      const target = document.createElement('div');
      target.className = 'color-target';
      target.style.background = '#fff';
      target.style.border = '2px dashed #bbb';
      target.style.width = '80px';
      target.style.height = '80px';
      target.style.borderRadius = '50%';
      target.style.display = 'flex';
      target.style.alignItems = 'center';
      target.style.justifyContent = 'center';
      target.style.margin = '0 10px';
      target.dataset.color = c.color;
      target.ondragover = e => e.preventDefault();
      target.ondrop = e => {
        const color = e.dataTransfer.getData('color');
        if (color === c.color) {
          target.style.background = color;
          target.innerHTML = '✔';
          document.getElementById('color-match-feedback').textContent = 'כל הכבוד!';
          this.nextStageButton();
        } else {
          document.getElementById('color-match-feedback').textContent = 'נסה שוב!';
        }
      };
      board.appendChild(target);
    });
    // עיגולים לגרירה
    drags.forEach((c, i) => {
      const drag = document.createElement('div');
      drag.className = 'color-drag';
      drag.style.background = c.color;
      drag.style.width = '60px';
      drag.style.height = '60px';
      drag.style.borderRadius = '50%';
      drag.style.margin = '0 10px';
      drag.style.cursor = 'grab';
      drag.style.display = 'inline-block';
      drag.draggable = true;
      drag.ondragstart = e => e.dataTransfer.setData('color', c.color);
      board.appendChild(drag);
    });
    document.getElementById('color-match-feedback').textContent = '';
    document.getElementById('color-next-stage').style.display = 'none';
  },
  nextStageButton() {
    const btn = document.getElementById('color-next-stage');
    btn.style.display = 'inline-block';
    btn.onclick = () => {
      this.stage++;
      if (this.stage < this.totalStages) {
        this.renderGame();
      } else {
        document.querySelector('.game-modal-body').innerHTML = '<h3>סיימת את כל השלבים! כל הכבוד!</h3>';
      }
    };
  }
}; 