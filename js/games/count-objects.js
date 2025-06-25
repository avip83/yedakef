window['count-objects'] = {
  stage: 0,
  totalStages: 20,
  objects: ['🍎','🍌','🍪','🍓','🍇','🧸','🚗','🦋','🐠','🌸','🍉','🍦','🦄','🐻','🦆','🍋','🍒','🍭','🧁','🐶'],
  get muted() { return !!window.__globalMute; },
  set muted(val) { window.__globalMute = !!val; },
  sounds: {
    success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
    wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
    click: new Audio('sounds/click-tap-computer-mouse-352734.mp3')
  },
  playSound(type) {
    if (window.__globalMute) return;
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
    window.scrollTo({top: 0, behavior: "auto"});
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    // חישוב התקדמות
    const stageNum = this.stage + 1;
    const total = this.totalStages;
    const percent = Math.round((stageNum / total) * 100);
    modal.innerHTML = `
      <div class="game-modal-content">
        <div class="game-modal-header">
          <h2>ספור חפצים</h2>
        </div>
        <div style="width:100%; display:flex; flex-direction:column; align-items:center; margin-bottom: 8px;">
          <div style="font-size:1.1rem; font-weight:900; color:#388e3c; margin-bottom:6px; font-family:'Baloo 2','Heebo',sans-serif;">שלב ${stageNum} מתוך ${total}</div>
          <div style="width: 90%; height: 18px; background: #e0e0e0; border-radius: 9px; overflow: hidden; box-shadow: 0 2px 8px #0001; margin-bottom: 4px;">
            <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg,#43a047,#00e676); border-radius: 9px 0 0 9px; transition: width 0.3s;"></div>
          </div>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>כמה חפצים יש בתמונה?</p>
          <div id="count-objects-board" style="display: flex; gap: 16px; margin: 24px 0; flex-wrap: wrap;"></div>
          <div id="count-objects-buttons" style="display: flex; gap: 24px; margin: 16px 0;"></div>
          <div id="count-objects-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; margin-bottom: 8px;"></div>
          <button id="count-next-stage" style="display:none; margin-top:8px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  toggleMute() {
    this.muted = !this.muted;
    const btn = document.getElementById('count-objects-volume');
    if (btn) {
      if (this.muted) btn.classList.add('muted');
      else btn.classList.remove('muted');
    }
  },
  renderGame() {
    setTimeout(() => {
      if (!document.getElementById('count-objects-volume')) {
        const modalContent = document.querySelector('.game-modal-content');
        if (modalContent) {
          const btn = document.createElement('button');
          btn.className = 'volume-button' + (this.muted ? ' muted' : '');
          btn.id = 'count-objects-volume';
          btn.title = 'הפעל/השתק צלילים';
          btn.onclick = () => window['count-objects'].toggleMute();
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
    setTimeout(() => {
      if (!document.getElementById('count-objects-back')) {
        const modalContent = document.querySelector('.game-modal-content');
        if (modalContent) {
          const btn = document.createElement('button');
          btn.className = 'volume-button back-arrow-button';
          btn.id = 'count-objects-back';
          btn.title = 'חזור';
          btn.style.position = 'absolute';
          btn.style.top = '18px';
          btn.style.right = '18px';
          btn.style.left = '';
          btn.style.zIndex = '2000';
          btn.style.width = '54px';
          btn.style.height = '54px';
          btn.style.background = '#7c5b33';
          btn.style.border = '2px solid #fff';
          btn.style.borderRadius = '50%';
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          btn.style.cursor = 'pointer';
          btn.style.padding = '0';
          btn.innerHTML = `
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              <path d="M12 16h12" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
              <path d="M18 10l6 6-6 6" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
          btn.onclick = function() {
            const modal = modalContent.parentElement;
            if (modal) modal.remove();
            document.getElementById('gamesContainer').style.display = 'block';
          };
          modalContent.appendChild(btn);
        }
      }
    }, 0);
    // בחר מספר אובייקטים (1-5) ושלב אקראי
    const num = 1 + Math.floor(Math.random() * 5);
    const obj = this.objects[Math.floor(Math.random() * this.objects.length)];
    const board = document.getElementById('count-objects-board');
    board.innerHTML = '';
    for (let i = 0; i < num; i++) {
      const span = document.createElement('span');
      span.textContent = obj;
      span.style.fontSize = '3rem';
      span.style.margin = '0 6px';
      board.appendChild(span);
    }
    // כפתורי מספרים
    const btns = document.getElementById('count-objects-buttons');
    btns.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.style.fontSize = '2rem';
      btn.style.width = '60px';
      btn.style.height = '60px';
      btn.style.borderRadius = '50%';
      btn.style.background = '#fffbe9';
      btn.style.border = '2px solid #90caf9';
      btn.style.cursor = 'pointer';
      btn.style.margin = '0 4px';
      btn.onclick = () => {
        this.playSound('click');
        if (i === num) {
          document.getElementById('count-objects-feedback').textContent = 'כל הכבוד!';
          document.getElementById('count-objects-feedback').style.color = '#43a047';
          btn.style.border = '3px solid #43a047';
          this.playSound('success');
          this.nextStageButton();
        } else {
          document.getElementById('count-objects-feedback').textContent = 'נסה שוב!';
          document.getElementById('count-objects-feedback').style.color = '#e53935';
          btn.style.border = '3px solid #e53935';
          this.playSound('wrong');
          setTimeout(() => { btn.style.border = '2px solid #90caf9'; }, 700);
        }
      };
      btns.appendChild(btn);
    }
    document.getElementById('count-objects-feedback').textContent = '';
    document.getElementById('count-next-stage').style.display = 'none';
  },
  nextStageButton() {
    const btn = document.getElementById('count-next-stage');
    btn.style.display = 'inline-block';
    btn.onclick = () => {
      this.playSound('click');
      this.stage++;
      if (this.stage < this.totalStages) {
        this.renderGame();
      } else {
        document.querySelector('.game-modal-body').innerHTML = '<h3>סיימת את כל השלבים! כל הכבוד!</h3>';
      }
    };
  },
  closeModal() {
    document.querySelectorAll('.game-modal').forEach(m => m.remove());
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
}; 