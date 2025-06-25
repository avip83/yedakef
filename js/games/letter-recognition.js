window['letter-recognition'] = {
  stage: 0,
  totalStages: 30,
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
          <h2>זיהוי אותיות</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>בחר את האות המתאימה:</p>
          <div id="letter-question" style="font-size: 2.5rem; margin: 16px 0;">א</div>
          <div id="letter-options" style="display: flex; gap: 24px;"></div>
          <div id="letter-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px;"></div>
          <button id="letter-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => {
      if (!document.getElementById('letter-recognition-back')) {
        const modalContent = document.querySelector('.game-modal-content');
        if (modalContent) {
          const btn = document.createElement('button');
          btn.className = 'volume-button back-arrow-button';
          btn.id = 'letter-recognition-back';
          btn.title = 'חזור';
          btn.style.position = 'absolute';
          btn.style.top = '18px';
          btn.style.right = '18px';
          btn.style.left = '';
          btn.style.zIndex = '2000';
          btn.style.width = '54px';
          btn.style.height = '54px';
          btn.style.background = '#7c5b33';
          btn.style.border = '2px solid #fff';
          btn.style.borderRadius = '50%';
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          btn.style.cursor = 'pointer';
          btn.style.padding = '0';
          btn.innerHTML = `
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              <path d="M12 16h12" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
              <path d="M18 10l6 6-6 6" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
          btn.onclick = function() {
            const modal = modalContent.parentElement;
            if (modal) modal.remove();
            document.getElementById('gamesContainer').style.display = 'block';
            if (window.updateGlobalBackBtn) window.updateGlobalBackBtn();
          };
          modalContent.appendChild(btn);
        }
      }
    }, 0);
  },
  renderGame() {
    const allLetters = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];
    const letters = allLetters.slice(0, 4 + Math.floor(this.stage / 5)); // עולה קושי
    const answer = letters[Math.floor(Math.random() * letters.length)];
    document.getElementById('letter-question').textContent = answer;
    const options = [...letters].sort(() => Math.random() - 0.5);
    const optionsDiv = document.getElementById('letter-options');
    optionsDiv.innerHTML = '';
    options.forEach(l => {
      const btn = document.createElement('button');
      btn.textContent = l;
      btn.style.fontSize = '2rem';
      btn.style.padding = '16px 24px';
      btn.style.margin = '0 4px';
      btn.style.borderRadius = '16px';
      btn.style.border = '2px solid #1976d2';
      btn.style.background = '#fff';
      btn.style.cursor = 'pointer';
      btn.onclick = () => {
        if (l === answer) {
          document.getElementById('letter-feedback').textContent = 'כל הכבוד!';
          this.nextStageButton();
        } else {
          document.getElementById('letter-feedback').textContent = 'נסה שוב!';
        }
      };
      optionsDiv.appendChild(btn);
    });
    document.getElementById('letter-feedback').textContent = '';
    document.getElementById('letter-next-stage').style.display = 'none';
  },
  nextStageButton() {
    const btn = document.getElementById('letter-next-stage');
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