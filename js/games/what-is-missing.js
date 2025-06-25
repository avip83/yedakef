window['what-is-missing'] = {
  stage: 0,
  totalStages: 20,
  objects: ['🍎','🍌','🍪','🍓','🍇','🧸','🚗','🦋','🐠','🌸','🍉','🍦','🦄','🐻','🦆','🍋','🍒','🍭','🧁','🐶'],
  init() {
    this.stage = 0;
    this.showModal();
    this.renderGame();
  },
  showModal() {
    window.scrollTo({top: 0, behavior: "auto"});
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="game-modal-content">
        <button class="back-arrow-button" title="חזור לבחירת משחקים" style="position:fixed;top:18px;right:18px;z-index:2000;width:54px;height:54px;background:#7c5b33;border:2px solid #7c5b33;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="display:block;" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 16h12" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M18 10l4 6-4 6" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="game-modal-header">
          <h2>מה חסר?</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>מה חסר בתמונה?</p>
          <div id="missing-board" style="display: flex; gap: 18px; margin: 24px 0;"></div>
          <div id="missing-options" style="display: flex; gap: 24px; margin: 16px 0;"></div>
          <div id="missing-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; margin-bottom: 8px;"></div>
          <button id="missing-next-stage" style="display:none; margin-top:8px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    // Add event to back arrow button
    modal.querySelector('.back-arrow-button').onclick = function() {
      modal.remove();
      document.getElementById('gamesContainer').style.display = 'block';
    };
  },
  renderGame() {
    // בחר 3-4 אובייקטים שונים
    const shuffled = [...this.objects].sort(() => Math.random() - 0.5);
    const num = 3 + Math.floor(Math.random() * 2); // 3 או 4
    const stageObjs = shuffled.slice(0, num);
    const missingIdx = Math.floor(Math.random() * num);
    const missingObj = stageObjs[missingIdx];
    // הצג את הלוח
    const board = document.getElementById('missing-board');
    board.innerHTML = '';
    stageObjs.forEach((obj, i) => {
      const span = document.createElement('span');
      if (i === missingIdx) {
        span.textContent = '?';
        span.style.opacity = '0.3';
        span.style.background = '#eee';
        span.style.borderRadius = '50%';
        span.style.width = '60px';
        span.style.height = '60px';
        span.style.display = 'inline-flex';
        span.style.alignItems = 'center';
        span.style.justifyContent = 'center';
      } else {
        span.textContent = obj;
      }
      span.style.fontSize = '2.5rem';
      span.style.margin = '0 6px';
      board.appendChild(span);
    });
    // אפשרויות בחירה
    const options = [missingObj];
    while (options.length < 3) {
      const candidate = this.objects[Math.floor(Math.random() * this.objects.length)];
      if (!options.includes(candidate)) options.push(candidate);
    }
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    const optsDiv = document.getElementById('missing-options');
    optsDiv.innerHTML = '';
    shuffledOptions.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.style.fontSize = '2rem';
      btn.style.width = '60px';
      btn.style.height = '60px';
      btn.style.borderRadius = '50%';
      btn.style.background = '#fffbe9';
      btn.style.border = '2px solid #90caf9';
      btn.style.cursor = 'pointer';
      btn.style.margin = '0 8px';
      btn.onclick = () => {
        if (opt === missingObj) {
          document.getElementById('missing-feedback').textContent = 'כל הכבוד!';
          this.nextStageButton();
        } else {
          document.getElementById('missing-feedback').textContent = 'נסה שוב!';
        }
      };
      optsDiv.appendChild(btn);
    });
    document.getElementById('missing-feedback').textContent = '';
    document.getElementById('missing-next-stage').style.display = 'none';
  },
  nextStageButton() {
    const btn = document.getElementById('missing-next-stage');
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