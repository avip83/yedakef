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
        <div id="missing-progress-bar-container"></div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>איזה פרי חסר בתמונה?</p>
          <div id="missing-board" style="display: flex; justify-content: center; align-items: center; margin: 24px 0;"></div>
          <div id="missing-options" style="display: flex; flex-direction: column; gap: 16px; margin: 16px 0; align-items: center;"></div>
          <div id="missing-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; font-weight: 700; margin-bottom: 8px;"></div>
          <button id="missing-next-stage" style="display:none; margin-top:8px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    // בר שלבים דינמי
    const modalContent = document.querySelector('.game-modal-content');
    if (modalContent) {
      const stageNum = this.stage + 1;
      const total = this.totalStages;
      const percent = Math.round((stageNum / total) * 100);
      let progressBar = document.getElementById('missing-progress-bar');
      if (!progressBar) {
        const progressDiv = document.createElement('div');
        progressDiv.style.width = '100%';
        progressDiv.style.display = 'flex';
        progressDiv.style.flexDirection = 'column';
        progressDiv.style.alignItems = 'center';
        progressDiv.style.marginBottom = '8px';
        progressDiv.innerHTML = `
          <div id="missing-progress-label" style="font-size:1.3rem; font-weight:900; color:#43a047; margin-bottom:6px; font-family:'Baloo 2','Heebo',sans-serif;">שלב ${stageNum} מתוך ${total}</div>
          <div style="width: 90%; height: 22px; background: #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px #0001; margin-bottom: 4px;">
            <div id="missing-progress-bar" style="width: ${percent}%; height: 100%; background: linear-gradient(90deg,#43a047,#00e676); border-radius: 12px 0 0 12px; transition: width 0.3s;"></div>
          </div>
        `;
        const container = document.getElementById('missing-progress-bar-container');
        if (container) container.appendChild(progressDiv);
      } else {
        document.getElementById('missing-progress-label').textContent = `שלב ${stageNum} מתוך ${total}`;
        progressBar.style.width = percent + '%';
      }
    }
    // בחר פרי חסר רנדומלי
    const fruits = this.fruits;
    const missingIdx = Math.floor(Math.random() * fruits.length);
    const missingFruit = fruits[missingIdx];
    // הצג את כל הפירות חוץ מהחסר כריבוע גדול
    const board = document.getElementById('missing-board');
    board.innerHTML = '';
    const bigBox = document.createElement('div');
    bigBox.style.width = '420px';
    bigBox.style.height = '220px';
    bigBox.style.background = '#fff';
    bigBox.style.borderRadius = '32px';
    bigBox.style.boxShadow = '0 4px 24px #0001';
    bigBox.style.display = 'flex';
    bigBox.style.flexWrap = 'wrap';
    bigBox.style.alignItems = 'center';
    bigBox.style.justifyContent = 'center';
    bigBox.style.position = 'relative';
    // סדר את הפירות בתוך הריבוע
    let shown = 0;
    fruits.forEach((fruit, i) => {
      if (i !== missingIdx) {
        const img = document.createElement('img');
        img.src = `fruits/${fruit.file}`;
        img.alt = fruit.name;
        img.title = fruit.name;
        img.style.width = '90px';
        img.style.height = '90px';
        img.style.objectFit = 'contain';
        img.style.margin = '12px';
        img.style.borderRadius = '18px';
        img.style.background = '#fff';
        img.style.boxShadow = '0 2px 8px #0001';
        bigBox.appendChild(img);
        shown++;
      }
    });
    board.appendChild(bigBox);
    // הצג את כל הפירות כאופציות ב-2 שורות: 4 למעלה, 3 למטה
    const optsDiv = document.getElementById('missing-options');
    optsDiv.innerHTML = '';
    const row1 = document.createElement('div');
    row1.style.display = 'flex';
    row1.style.gap = '18px';
    row1.style.marginBottom = '8px';
    const row2 = document.createElement('div');
    row2.style.display = 'flex';
    row2.style.gap = '18px';
    fruits.forEach((fruit, i) => {
      const btn = document.createElement('button');
      btn.style.width = '70px';
      btn.style.height = '70px';
      btn.style.borderRadius = '50%';
      btn.style.background = '#fffbe9';
      btn.style.border = '2px solid #90caf9';
      btn.style.cursor = 'pointer';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.boxShadow = '0 2px 8px #0001';
      btn.title = fruit.name;
      btn.style.margin = '0';
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
          this.playSound('success');
          this.nextStageButton();
        } else {
          document.getElementById('missing-feedback').textContent = 'נסה שוב!';
          document.getElementById('missing-feedback').style.color = '#e53935';
          this.playSound('wrong');
        }
      };
      if (i < 4) row1.appendChild(btn);
      else row2.appendChild(btn);
    });
    optsDiv.appendChild(row1);
    optsDiv.appendChild(row2);
    document.getElementById('missing-feedback').textContent = '';
    document.getElementById('missing-next-stage').style.display = 'none';
    // התאמות מובייל: הקטן ריווחים, גובה, פונט
    if (window.innerWidth < 600) {
      bigBox.style.width = '98vw';
      bigBox.style.height = '120px';
      bigBox.style.marginBottom = '8px';
      row1.style.gap = '8px';
      row2.style.gap = '8px';
      document.querySelector('.game-modal-body p').style.fontSize = '1.1rem';
      document.querySelector('.game-modal-body p').style.marginBottom = '6px';
    }
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