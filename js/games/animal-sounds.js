window['animal-sounds'] = {
  stage: 0,
  totalStages: 20,
  animals: [
    { name: 'כלב', icon: '🐶', file: 'dog.mp3' },
    { name: 'חתול', icon: '🐱', file: 'cat.mp3' },
    { name: 'תוכי', icon: '🦜', file: 'parrot.mp3' },
    { name: 'פרה', icon: '🐮', file: 'cow.mp3' },
    { name: 'כבשה', icon: '🐑', file: 'sheep.mp3' },
    { name: 'עז', icon: '🐐', file: 'goat.mp3' },
    { name: 'תרנגול', icon: '🐓', file: 'rooster.mp3' },
    { name: 'ברווז', icon: '🦆', file: 'duck.mp3' },
    { name: 'סוס', icon: '🐴', file: 'horse.mp3' },
    { name: 'חמור', icon: '🫏', file: 'donkey.mp3' },
    { name: 'חזיר', icon: '🐷', file: 'pig.mp3' },
    { name: 'אריה', icon: '🦁', file: 'lion.mp3' },
    { name: 'פיל', icon: '🐘', file: 'elephant.mp3' },
    { name: 'קוף', icon: '🐵', file: 'monkey.mp3' },
    { name: 'צפרדע', icon: '🐸', file: 'frog.mp3' },
    { name: 'ינשוף', icon: '🦉', file: 'owl.mp3' },
    { name: 'יונה', icon: '🕊️', file: 'dove.mp3' },
    { name: 'דבורה', icon: '🐝', file: 'bee.mp3' }
  ],
  sounds: {
    success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
    error: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
    next: new Audio('sounds/plop-sound-made-with-my-mouth-100690 (mp3cut.net).mp3')
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
        <button class="close-button" onclick="this.parentElement.parentElement.remove()" style="position:absolute;top:12px;right:12px;z-index:2000;">×</button>
        <div class="game-modal-header">
          <h2>זיהוי חיות וקולות</h2>
        </div>
        <div id="animal-progress-bar-container"></div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>הקשב לקול ובחר את החיה המתאימה!</p>
          <div id="animal-sound-board" style="display: flex; gap: 32px; margin: 24px 0;"></div>
          <div id="animal-sound-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px;"></div>
          <button id="animal-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    // עדכון בר שלבים בראש המודאל
    const modalContent = document.querySelector('.game-modal-content');
    if (modalContent) {
      const stageNum = this.stage + 1;
      const total = this.totalStages;
      const percent = Math.round((stageNum / total) * 100);
      let progressBar = document.getElementById('animal-progress-bar');
      if (!progressBar) {
        const progressDiv = document.createElement('div');
        progressDiv.style.width = '100%';
        progressDiv.style.display = 'flex';
        progressDiv.style.flexDirection = 'column';
        progressDiv.style.alignItems = 'center';
        progressDiv.style.marginBottom = '8px';
        progressDiv.innerHTML = `
          <div id="animal-progress-label" style="font-size:1.3rem; font-weight:900; color:#388e3c; margin-bottom:6px; font-family:'Baloo 2','Heebo',sans-serif;">שלב ${stageNum} מתוך ${total}</div>
          <div style="width: 90%; height: 22px; background: #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px #0001; margin-bottom: 4px;">
            <div id="animal-progress-bar" style="width: ${percent}%; height: 100%; background: linear-gradient(90deg,#43a047,#00e676); border-radius: 12px 0 0 12px; transition: width 0.3s;"></div>
          </div>
        `;
        const container = document.getElementById('animal-progress-bar-container');
        if (container) container.appendChild(progressDiv);
      } else {
        document.getElementById('animal-progress-label').textContent = `שלב ${stageNum} מתוך ${total}`;
        progressBar.style.width = percent + '%';
      }
    }
    // שלב רנדומלי: בחר חיה נכונה ועוד 2 חיות
    const correct = this.animals[this.stage % this.animals.length];
    const others = this.animals.filter(a => a !== correct).sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [correct, ...others].sort(() => Math.random() - 0.5);
    // נגן קול אמיתי
    const playSound = () => {
      this.playAnimalSound(correct.file);
    };
    // נבנה דינמית: אזור כפתור + טקסט פידבק
    let feedbackDiv = document.getElementById('animal-sound-feedback');
    feedbackDiv.innerHTML = `
      <div id="animal-sound-btn-row" style="display:flex; flex-direction:column; align-items:center;">
        <button id="play-animal-sound" style="font-size:2rem; padding:10px 24px; border-radius:16px; background:#ffecb3; border:2px solid #ffd600; cursor:pointer; margin-bottom:10px;">🔊 נגן קול</button>
        <button id="animal-next-stage" style="display:none; margin-top:0; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        <div id="animal-sound-text"></div>
        <div id="animal-feedback-text" style="margin-top:4px;"></div>
      </div>`;
    document.getElementById('play-animal-sound').onclick = () => {
      this.playAnimalSound(correct.file);
      document.getElementById('animal-sound-text').textContent = this.getSoundText(correct.file);
      setTimeout(() => { document.getElementById('animal-sound-text').textContent = ''; }, 1200);
    };
    const nextBtn = document.getElementById('animal-next-stage');
    nextBtn.onclick = () => {
      if (!window.__globalMute) { this.sounds.next.currentTime = 0; this.sounds.next.play(); }
      this.stage++;
      if (this.stage < this.totalStages) {
        this.renderGame();
      } else {
        document.querySelector('.game-modal-body').innerHTML = '<h3>סיימת את כל השלבים! כל הכבוד!</h3>';
      }
    };
    const board = document.getElementById('animal-sound-board');
    board.innerHTML = '';
    options.forEach(animal => {
      const btn = document.createElement('button');
      btn.textContent = animal.icon;
      btn.title = animal.name;
      btn.style.fontSize = '2.5rem';
      btn.style.margin = '0 12px';
      btn.style.background = '#fffbe9';
      btn.style.border = '2px solid #90caf9';
      btn.style.borderRadius = '50%';
      btn.style.width = '70px';
      btn.style.height = '70px';
      btn.style.cursor = 'pointer';
      btn.onclick = () => {
        const feedbackText = document.getElementById('animal-feedback-text');
        if (animal === correct) {
          if (!window.__globalMute) { this.sounds.success.currentTime = 0; this.sounds.success.play(); }
          feedbackText.textContent = 'כל הכבוד!';
          document.getElementById('play-animal-sound').style.display = 'none';
          nextBtn.style.display = 'inline-block';
        } else {
          if (!window.__globalMute) { this.sounds.error.currentTime = 0; this.sounds.error.play(); }
          feedbackText.textContent = 'נסה שוב!';
        }
      };
      board.appendChild(btn);
    });
  },
  getSoundText(file) {
    const sounds = {
      'dog.mp3': 'הב הב',
      'cat.mp3': 'מיאו',
      'parrot.mp3': 'שריקה',
      'cow.mp3': 'מווו',
      'sheep.mp3': 'מהה',
      'goat.mp3': 'מעה',
      'rooster.mp3': 'קוקוריקו',
      'duck.mp3': 'קוואק',
      'horse.mp3': 'צהלה',
      'donkey.mp3': 'נעירה',
      'pig.mp3': 'נחירה',
      'lion.mp3': 'שאגה',
      'elephant.mp3': 'טראמפ',
      'monkey.mp3': 'אוו אה אה',
      'frog.mp3': 'קרקור',
      'owl.mp3': 'הוּ-הוּ',
      'dove.mp3': 'המהום',
      'bee.mp3': 'זמזום'
    };
    return sounds[file] || '';
  },
  playAnimalSound(file) {
    if (window.__globalMute) return;
    const audio = new Audio(`Animal-sounds/${file}`);
    audio.play();
  }
}; 