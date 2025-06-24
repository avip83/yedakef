window['count-objects'] = {
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
        <div class="game-modal-header">
          <h2>ספור חפצים</h2>
          <button class="close-button" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
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
  renderGame() {
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
      btn.style.margin = '0 8px';
      btn.onclick = () => {
        if (i === num) {
          document.getElementById('count-objects-feedback').textContent = 'כל הכבוד!';
          this.nextStageButton();
        } else {
          document.getElementById('count-objects-feedback').textContent = 'נסה שוב!';
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
      this.stage++;
      if (this.stage < this.totalStages) {
        this.renderGame();
      } else {
        document.querySelector('.game-modal-body').innerHTML = '<h3>סיימת את כל השלבים! כל הכבוד!</h3>';
      }
    };
  }
}; 