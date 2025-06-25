window['what-is-missing'] = {
  stage: 0,
  totalStages: 20,
  fruits: [
    { name: 'אגס', file: 'pear.jpg' },
    { name: 'תפוח', file: 'apple.jpg' },
    { name: 'תפוז', file: 'orange.jpeg' },
    { name: 'לימון', file: 'lemon.jpg' },
    { name: 'אבטיח', file: 'water melon.jpg' },
    { name: 'בננה', file: 'banana.jpg' },
    { name: 'תות', file: 'strawberry.jpg' }
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
        <div class="game-modal-header">
          <h2>מה חסר?</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>איזה פרי חסר בתמונה?</p>
          <div id="missing-board" style="display: flex; gap: 18px; margin: 24px 0;"></div>
          <div id="missing-options" style="display: flex; gap: 24px; margin: 16px 0;"></div>
          <div id="missing-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; font-weight: 700; margin-bottom: 8px;"></div>
          <button id="missing-next-stage" style="display:none; margin-top:8px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    // בחר פרי חסר רנדומלי
    const fruits = this.fruits;
    const missingIdx = Math.floor(Math.random() * fruits.length);
    const missingFruit = fruits[missingIdx];
    // הצג את כל הפירות חוץ מהחסר
    const board = document.getElementById('missing-board');
    board.innerHTML = '';
    fruits.forEach((fruit, i) => {
      if (i !== missingIdx) {
        const img = document.createElement('img');
        img.src = `fruits/${fruit.file}`;
        img.alt = fruit.name;
        img.title = fruit.name;
        img.style.width = '64px';
        img.style.height = '64px';
        img.style.objectFit = 'contain';
        img.style.margin = '0 8px';
        img.style.borderRadius = '16px';
        img.style.background = '#fff';
        img.style.boxShadow = '0 2px 8px #0001';
        board.appendChild(img);
      }
    });
    // הצג את כל הפירות כאופציות
    const optsDiv = document.getElementById('missing-options');
    optsDiv.innerHTML = '';
    fruits.forEach((fruit, i) => {
      const btn = document.createElement('button');
      btn.style.width = '70px';
      btn.style.height = '70px';
      btn.style.borderRadius = '50%';
      btn.style.background = '#fffbe9';
      btn.style.border = '2px solid #90caf9';
      btn.style.cursor = 'pointer';
      btn.style.margin = '0 8px';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.boxShadow = '0 2px 8px #0001';
      btn.title = fruit.name;
      const img = document.createElement('img');
      img.src = `fruits/${fruit.file}`;
      img.alt = fruit.name;
      img.style.width = '48px';
      img.style.height = '48px';
      img.style.objectFit = 'contain';
      btn.appendChild(img);
      btn.onclick = () => {
        if (i === missingIdx) {
          document.getElementById('missing-feedback').textContent = 'כל הכבוד!';
          document.getElementById('missing-feedback').style.color = '#43a047';
          this.nextStageButton();
        } else {
          document.getElementById('missing-feedback').textContent = 'נסה שוב!';
          document.getElementById('missing-feedback').style.color = '#e53935';
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