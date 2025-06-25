window['tower-builder'] = {
  stage: 0,
  totalStages: 15,
  colors: ['#e53935','#1e88e5','#fbc02d','#43a047','#8e24aa','#ff7043'],
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
          <h2>בניית מגדל קוביות</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>גרור את הקוביות ובנה מגדל!</p>
          <div id="tower-base" style="display: flex; flex-direction: column-reverse; align-items: center; min-height: 220px; margin: 24px 0;"></div>
          <div id="tower-blocks" style="display: flex; gap: 18px; margin: 12px 0;"></div>
          <div id="tower-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; margin-bottom: 8px;"></div>
          <button id="tower-next-stage" style="display:none; margin-top:8px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    // מספר קוביות עולה עם שלבים
    const numBlocks = 2 + (this.stage % 4); // 2-5 קוביות
    const blocks = Array.from({length: numBlocks}, (_, i) => ({ color: this.colors[i % this.colors.length], id: i }));
    const shuffled = [...blocks].sort(() => Math.random() - 0.5);
    // בסיס המגדל
    const base = document.getElementById('tower-base');
    base.innerHTML = '';
    // אזור גרירה
    const blocksDiv = document.getElementById('tower-blocks');
    blocksDiv.innerHTML = '';
    shuffled.forEach(block => {
      const div = document.createElement('div');
      div.className = 'tower-block';
      div.style.background = block.color;
      div.style.width = '70px';
      div.style.height = '40px';
      div.style.borderRadius = '10px';
      div.style.margin = '0 6px';
      div.style.cursor = 'grab';
      div.style.display = 'inline-block';
      div.draggable = true;
      div.ondragstart = e => e.dataTransfer.setData('block', block.id);
      div.textContent = '';
      blocksDiv.appendChild(div);
    });
    // הפוך את הבסיס לדרופ-זון
    base.ondragover = e => e.preventDefault();
    base.ondrop = e => {
      const blockId = e.dataTransfer.getData('block');
      if (blockId !== '') {
        // מצא את הבלוק
        const idx = shuffled.findIndex(b => b.id == blockId);
        if (idx !== -1) {
          // הוסף ל-base
          const block = shuffled[idx];
          const div = document.createElement('div');
          div.className = 'tower-block';
          div.style.background = block.color;
          div.style.width = '70px';
          div.style.height = '40px';
          div.style.borderRadius = '10px';
          div.style.margin = '0 0 4px 0';
          div.style.display = 'block';
          base.appendChild(div);
          // הסר מהגרירה
          blocksDiv.removeChild(blocksDiv.children[idx]);
          shuffled.splice(idx, 1);
          // בדוק אם סיימנו
          if (shuffled.length === 0) {
            document.getElementById('tower-feedback').textContent = 'כל הכבוד! בנית מגדל!';
            this.nextStageButton();
          }
        }
      }
    };
    document.getElementById('tower-feedback').textContent = '';
    document.getElementById('tower-next-stage').style.display = 'none';
  },
  nextStageButton() {
    const btn = document.getElementById('tower-next-stage');
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