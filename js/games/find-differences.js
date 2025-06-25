window['find-differences'] = {
  stage: 0,
  totalStages: 20,
  emojiPairs: [
    ['😀','😃'], ['🐶','🐺'], ['🍎','🍏'], ['🌞','🌝'], ['🚗','🚙'],
    ['🍦','🍧'], ['🌻','🌼'], ['🐱','🦁'], ['🍌','🌽'], ['⚽','🏀']
  ],
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
        <button class="close-button" onclick="this.parentElement.parentElement.remove()" style="position:absolute;top:12px;right:12px;z-index:2000;">×</button>
        <div class="game-modal-header">
          <h2>מצא את ההבדלים</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>מצא את ההבדל בין התמונות!</p>
          <div id="diff-board" style="display: flex; gap: 32px; margin: 24px 0;"></div>
          <div id="diff-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px;"></div>
          <button id="diff-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    // בחר זוג אקראי
    const pair = this.emojiPairs[this.stage % this.emojiPairs.length];
    const board = document.getElementById('diff-board');
    board.innerHTML = '';
    pair.forEach((emoji, i) => {
      const btn = document.createElement('button');
      btn.textContent = emoji;
      btn.style.fontSize = '3rem';
      btn.style.margin = '0 18px';
      btn.style.background = '#fffbe9';
      btn.style.border = '2px solid #90caf9';
      btn.style.borderRadius = '16px';
      btn.style.width = '90px';
      btn.style.height = '90px';
      btn.style.cursor = 'pointer';
      btn.onclick = () => {
        if (i === 1) {
          document.getElementById('diff-feedback').textContent = 'כל הכבוד!';
          this.nextStageButton();
        } else {
          document.getElementById('diff-feedback').textContent = 'נסה שוב!';
        }
      };
      board.appendChild(btn);
    });
    document.getElementById('diff-feedback').textContent = '';
    document.getElementById('diff-next-stage').style.display = 'none';
  },
  nextStageButton() {
    const btn = document.getElementById('diff-next-stage');
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