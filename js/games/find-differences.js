window['find-differences'] = {
  stage: 0,
  totalStages: 1,
  found: [],
  sounds: {
    success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
    wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3')
  },
  playSound(type) {
    if (window.__globalMute) return;
    if (this.sounds[type]) {
      try {
        this.sounds[type].currentTime = 0;
        this.sounds[type].play();
      } catch (e) {}
    }
  },
  init() {
    this.stage = 0;
    this.found = [];
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
          <h2>מצא את ההבדלים</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>מצא את כל ההבדלים בתמונה!</p>
          <div id="diff-board" style="display: flex; justify-content: center; align-items: center; margin: 24px 0; position:relative;"></div>
          <div id="diff-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; font-weight: 700;"></div>
          <button id="diff-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    this.found = this.found || [];
    const board = document.getElementById('diff-board');
    board.innerHTML = '';
    // הצג את התמונה
    const img = document.createElement('img');
    img.src = 'diffrent/rabit.png';
    img.alt = 'מצא את ההבדלים';
    img.style.width = 'min(95vw, 420px)';
    img.style.maxWidth = '420px';
    img.style.height = 'auto';
    img.style.borderRadius = '24px';
    img.style.boxShadow = '0 4px 24px #0001';
    img.style.display = 'block';
    img.style.position = 'relative';
    board.appendChild(img);
    // הגדר אזורים אינטראקטיביים (קואורדינטות יחסיות)
    const areas = [
      // [left, top, radius, label]
      {left: 0.19, top: 0.36, r: 0.07, label: 'פרח'}, // פרח
      {left: 0.62, top: 0.23, r: 0.07, label: 'יד'}, // יד שמאל למעלה
      {left: 0.73, top: 0.38, r: 0.055, label: 'עין'}, // עין ימין עצומה
      {left: 0.68, top: 0.68, r: 0.09, label: 'נעליים'} // נעליים
    ];
    // שכבת אינטראקציה
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '2';
    overlay.id = 'diff-overlay';
    board.style.position = 'relative';
    board.appendChild(overlay);
    // הפוך את board ל-position:relative
    board.style.position = 'relative';
    // הוסף אזורים אינטראקטיביים
    areas.forEach((area, idx) => {
      const btn = document.createElement('div');
      btn.style.position = 'absolute';
      btn.style.left = (area.left * 100) + '%';
      btn.style.top = (area.top * 100) + '%';
      btn.style.width = (area.r * 2 * 100) + '%';
      btn.style.height = (area.r * 2 * 100) + '%';
      btn.style.transform = 'translate(-50%,-50%)';
      btn.style.borderRadius = '50%';
      btn.style.cursor = 'pointer';
      btn.style.pointerEvents = 'auto';
      btn.style.background = 'rgba(0,0,0,0)';
      btn.title = area.label;
      btn.onclick = (e) => {
        e.stopPropagation();
        if (!this.found.includes(idx)) {
          this.found.push(idx);
          this.drawCircle(area);
          this.playSound('success');
          if (this.found.length === areas.length) {
            document.getElementById('diff-feedback').textContent = 'כל הכבוד!';
            document.getElementById('diff-feedback').style.color = '#43a047';
            this.nextStageButton();
          }
        }
      };
      board.appendChild(btn);
    });
    // לחיצה על אזור לא נכון
    img.onclick = (e) => {
      // חשב קואורדינטות יחסיות
      const rect = img.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      // בדוק אם נלחץ על אחד האזורים
      let hit = false;
      for (let i = 0; i < areas.length; i++) {
        const a = areas[i];
        const dx = x - a.left;
        const dy = y - a.top;
        if (Math.sqrt(dx*dx + dy*dy) < a.r) {
          hit = true;
          break;
        }
      }
      if (!hit) {
        document.getElementById('diff-feedback').textContent = 'נסה שוב!';
        document.getElementById('diff-feedback').style.color = '#e53935';
        this.playSound('wrong');
      }
    };
    // צייר עיגולים על ההבדלים שנמצאו
    this.found.forEach(idx => this.drawCircle(areas[idx]));
    document.getElementById('diff-feedback').textContent = '';
    document.getElementById('diff-next-stage').style.display = 'none';
  },
  drawCircle(area) {
    const overlay = document.getElementById('diff-overlay');
    if (!overlay) return;
    const circle = document.createElement('div');
    circle.style.position = 'absolute';
    circle.style.left = (area.left * 100) + '%';
    circle.style.top = (area.top * 100) + '%';
    circle.style.width = (area.r * 2 * 100) + '%';
    circle.style.height = (area.r * 2 * 100) + '%';
    circle.style.transform = 'translate(-50%,-50%)';
    circle.style.borderRadius = '50%';
    circle.style.border = '4px solid #43a047';
    circle.style.boxShadow = '0 0 16px #43a04788';
    circle.style.pointerEvents = 'none';
    overlay.appendChild(circle);
  },
  nextStageButton() {
    const btn = document.getElementById('diff-next-stage');
    btn.style.display = 'inline-block';
    btn.onclick = () => {
      this.stage++;
      if (this.stage < this.totalStages) {
        this.found = [];
        this.renderGame();
      } else {
        document.querySelector('.game-modal-body').innerHTML = '<h3>סיימת את כל השלבים! כל הכבוד!</h3>';
      }
    };
  }
}; 