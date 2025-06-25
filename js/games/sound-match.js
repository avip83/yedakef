window['sound-match'] = {
  stage: 0,
  totalStages: 20,
  sounds: [
    { sound: 'הב הב', emoji: '🐶', label: 'כלב' },
    { sound: 'מיאו', emoji: '🐱', label: 'חתול' },
    { sound: 'מווו', emoji: '🐮', label: 'פרה' },
    { sound: 'קוקוריקו', emoji: '🐔', label: 'תרנגול' },
    { sound: 'קוואק', emoji: '🦆', label: 'ברווז' },
    { sound: 'בום', emoji: '💥', label: 'פיצוץ' },
    { sound: 'צפצוף', emoji: '🚗', label: 'רכב' },
    { sound: 'טראח', emoji: '🧱', label: 'קוביה' },
    { sound: 'צפצוף', emoji: '🐤', label: 'אפרוח' },
    { sound: 'קרקור', emoji: '🐸', label: 'צפרדע' }
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
          <h2>צלילים ראשונים</h2>
          <button class="close-button" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>הקשב לצליל ובחר את התמונה המתאימה!</p>
          <button id="play-sound-btn" style="font-size:2.2rem; margin: 18px 0; padding: 18px 36px; border-radius: 16px; background: #ffecb3; border: 2px solid #ffd600; cursor: pointer;">🔊 נגן צליל</button>
          <div id="sound-match-options" style="display: flex; gap: 32px; margin: 24px 0;"></div>
          <div id="sound-match-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; margin-bottom: 8px;"></div>
          <button id="sound-next-stage" style="display:none; margin-top:8px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    // בחר שלב אקראי
    const correct = this.sounds[this.stage % this.sounds.length];
    // ערבב אופציות
    const others = this.sounds.filter(s => s !== correct).sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [correct, ...others].sort(() => Math.random() - 0.5);
    // הפעלת צליל (טקסט)
    const playBtn = document.getElementById('play-sound-btn');
    playBtn.onclick = () => {
      if (window.__globalMute) return;
      playBtn.textContent = `🔊 ${correct.sound}`;
      setTimeout(() => { playBtn.textContent = '🔊 נגן צליל'; }, 1200);
    };
    // אפשרויות
    const optsDiv = document.getElementById('sound-match-options');
    optsDiv.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt.emoji;
      btn.title = opt.label;
      btn.style.fontSize = '2.5rem';
      btn.style.width = '70px';
      btn.style.height = '70px';
      btn.style.borderRadius = '50%';
      btn.style.background = '#fffbe9';
      btn.style.border = '2px solid #90caf9';
      btn.style.cursor = 'pointer';
      btn.style.margin = '0 8px';
      btn.onclick = () => {
        if (opt === correct) {
          document.getElementById('sound-match-feedback').textContent = 'כל הכבוד!';
          this.nextStageButton();
        } else {
          document.getElementById('sound-match-feedback').textContent = 'נסה שוב!';
        }
      };
      optsDiv.appendChild(btn);
    });
    document.getElementById('sound-match-feedback').textContent = '';
    document.getElementById('sound-next-stage').style.display = 'none';
  },
  nextStageButton() {
    const btn = document.getElementById('sound-next-stage');
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