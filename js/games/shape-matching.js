window['shape-matching'] = {
  stage: 0,
  totalStages: 20,
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
        <button class="close-button" onclick="this.parentElement.parentElement.remove()">×</button>
        <div class="game-modal-header">
          <h2>התאמת צורות</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>גרור את הצורה למקום הנכון!</p>
          <div id="shape-match-board" style="display: flex; gap: 32px; margin: 24px 0;"></div>
          <div id="shape-match-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px;"></div>
          <button id="shape-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    const shapes = [
      {shape: '●'},
      {shape: '■'},
      {shape: '▲'}
    ];
    // שלב רנדומלי: ערבוב סדר
    const targets = [...shapes].sort(() => Math.random() - 0.5);
    const drags = [...shapes].sort(() => Math.random() - 0.5);
    const board = document.getElementById('shape-match-board');
    board.innerHTML = '';
    // מטרות (צורות ריקות)
    targets.forEach((s, i) => {
      const target = document.createElement('div');
      target.className = 'shape-target';
      target.style.background = '#fff';
      target.style.border = '2px dashed #bbb';
      target.style.width = '80px';
      target.style.height = '80px';
      target.style.borderRadius = '20px';
      target.style.display = 'flex';
      target.style.alignItems = 'center';
      target.style.justifyContent = 'center';
      target.style.fontWeight = 'bold';
      target.style.fontSize = '2.5rem';
      target.textContent = s.shape;
      target.dataset.shape = s.shape;
      target.ondragover = e => e.preventDefault();
      target.ondrop = e => {
        const shape = e.dataTransfer.getData('shape');
        if (shape === s.shape) {
          target.textContent = '✔';
          document.getElementById('shape-match-feedback').textContent = 'כל הכבוד!';
          this.nextStageButton();
        } else {
          document.getElementById('shape-match-feedback').textContent = 'נסה שוב!';
        }
      };
      board.appendChild(target);
    });
    // צורות לגרירה
    drags.forEach((s, i) => {
      const drag = document.createElement('div');
      drag.className = 'shape-drag';
      drag.textContent = s.shape;
      drag.style.background = '#e3f2fd';
      drag.style.width = '60px';
      drag.style.height = '60px';
      drag.style.borderRadius = '20px';
      drag.style.margin = '0 10px';
      drag.style.cursor = 'grab';
      drag.style.display = 'inline-flex';
      drag.style.alignItems = 'center';
      drag.style.justifyContent = 'center';
      drag.style.fontSize = '2.5rem';
      drag.draggable = true;
      drag.ondragstart = e => e.dataTransfer.setData('shape', s.shape);
      board.appendChild(drag);
    });
    document.getElementById('shape-match-feedback').textContent = '';
    document.getElementById('shape-next-stage').style.display = 'none';
  },
  nextStageButton() {
    const btn = document.getElementById('shape-next-stage');
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