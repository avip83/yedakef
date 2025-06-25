window['digital-coloring'] = {
  stage: 0,
  totalStages: 15,
  shapes: [
    { type: 'circle', label: 'עיגול' },
    { type: 'square', label: 'ריבוע' },
    { type: 'star', label: 'כוכב' },
    { type: 'heart', label: 'לב' }
  ],
  colors: [
    { color: '#e53935', name: 'אדום' },
    { color: '#1e88e5', name: 'כחול' },
    { color: '#fbc02d', name: 'צהוב' },
    { color: '#43a047', name: 'ירוק' },
    { color: '#ff7043', name: 'כתום' },
    { color: '#8e24aa', name: 'סגול' }
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
          <h2>צביעה דיגיטלית</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>בחר צבע וצבע את הצורה!</p>
          <div id="coloring-shape" style="margin: 24px 0;"></div>
          <div id="coloring-colors" style="display: flex; gap: 18px; margin: 12px 0;"></div>
          <div id="coloring-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; margin-bottom: 8px;"></div>
          <button id="coloring-next-stage" style="display:none; margin-top:8px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    // בחר צורה וצבע
    const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
    const coloringDiv = document.getElementById('coloring-shape');
    coloringDiv.innerHTML = this.getShapeSVG(shape.type, '#fff', '#bbb');
    // כפתורי צבעים
    const colorsDiv = document.getElementById('coloring-colors');
    colorsDiv.innerHTML = '';
    this.colors.forEach(c => {
      const btn = document.createElement('button');
      btn.style.background = c.color;
      btn.style.width = '48px';
      btn.style.height = '48px';
      btn.style.borderRadius = '50%';
      btn.style.border = '2px solid #fff';
      btn.style.margin = '0 4px';
      btn.title = c.name;
      btn.onclick = () => {
        coloringDiv.innerHTML = this.getShapeSVG(shape.type, c.color, '#bbb');
        document.getElementById('coloring-feedback').textContent = 'כל הכבוד!';
        this.nextStageButton();
      };
      colorsDiv.appendChild(btn);
    });
    document.getElementById('coloring-feedback').textContent = '';
    document.getElementById('coloring-next-stage').style.display = 'none';
  },
  getShapeSVG(type, fill, stroke) {
    if (type === 'circle') {
      return `<svg width='120' height='120'><circle cx='60' cy='60' r='50' fill='${fill}' stroke='${stroke}' stroke-width='6'/></svg>`;
    } else if (type === 'square') {
      return `<svg width='120' height='120'><rect x='15' y='15' width='90' height='90' fill='${fill}' stroke='${stroke}' stroke-width='6' rx='18'/></svg>`;
    } else if (type === 'star') {
      return `<svg width='120' height='120'><polygon points='60,15 73,55 115,55 80,80 92,120 60,95 28,120 40,80 5,55 47,55' fill='${fill}' stroke='${stroke}' stroke-width='6'/></svg>`;
    } else if (type === 'heart') {
      return `<svg width='120' height='120'><path d='M60 110 Q10 60 60 30 Q110 60 60 110 Z' fill='${fill}' stroke='${stroke}' stroke-width='6'/></svg>`;
    }
    return '';
  },
  nextStageButton() {
    const btn = document.getElementById('coloring-next-stage');
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