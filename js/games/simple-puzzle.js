window['simple-puzzle'] = {
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
        <div class="game-modal-header">
          <h2>פאזל תמונות פשוט</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>גרור את החלקים למקום הנכון!</p>
          <div id="puzzle-board" style="display: flex; gap: 12px; margin: 24px 0;"></div>
          <div id="puzzle-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px;"></div>
          <button id="puzzle-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    // 2-4 חלקים בצבעים שונים
    const numPieces = 2 + (this.stage % 3); // 2,3,4
    const colors = ['#e53935', '#1e88e5', '#fbc02d', '#43a047'];
    const pieces = Array.from({length: numPieces}, (_, i) => ({ color: colors[i], index: i }));
    const targets = [...pieces];
    const drags = [...pieces].sort(() => Math.random() - 0.5);
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    // מטרות (ריבועים ריקים)
    targets.forEach((p, i) => {
      const target = document.createElement('div');
      target.className = 'puzzle-target';
      target.style.background = '#fff';
      target.style.border = '2px dashed #bbb';
      target.style.width = '70px';
      target.style.height = '70px';
      target.style.display = 'flex';
      target.style.alignItems = 'center';
      target.style.justifyContent = 'center';
      target.style.margin = '0 6px';
      target.dataset.index = p.index;
      target.ondragover = e => e.preventDefault();
      target.ondrop = e => {
        const idx = e.dataTransfer.getData('index');
        if (parseInt(idx) === p.index) {
          target.style.background = colors[p.index];
          target.innerHTML = '✔';
          document.getElementById('puzzle-feedback').textContent = 'כל הכבוד!';
          this.nextStageButton();
        } else {
          document.getElementById('puzzle-feedback').textContent = 'נסה שוב!';
        }
      };
      board.appendChild(target);
    });
    // חלקים לגרירה
    drags.forEach((p, i) => {
      const drag = document.createElement('div');
      drag.className = 'puzzle-drag';
      drag.style.background = p.color;
      drag.style.width = '60px';
      drag.style.height = '60px';
      drag.style.margin = '0 6px';
      drag.style.cursor = 'grab';
      drag.style.display = 'inline-block';
      drag.draggable = true;
      drag.ondragstart = e => e.dataTransfer.setData('index', p.index);
      board.appendChild(drag);
    });
    document.getElementById('puzzle-feedback').textContent = '';
    document.getElementById('puzzle-next-stage').style.display = 'none';
  },
  nextStageButton() {
    const btn = document.getElementById('puzzle-next-stage');
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