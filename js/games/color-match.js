window['color-match'] = {
  stage: 0,
  totalStages: 20,
  shapes: [
    { name: 'circle', label: 'עיגול', svg: '<svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="COLOR"/></svg>' },
    { name: 'square', label: 'ריבוע', svg: '<svg width="60" height="60" viewBox="0 0 60 60"><rect x="12" y="12" width="36" height="36" rx="10" fill="COLOR"/></svg>' },
    { name: 'triangle', label: 'משולש', svg: '<svg width="60" height="60" viewBox="0 0 60 60"><polygon points="30,10 52,50 8,50" fill="COLOR"/></svg>' },
    { name: 'star', label: 'כוכב', svg: '<svg width="60" height="60" viewBox="0 0 60 60"><polygon points="30,10 36,28 56,28 40,40 46,58 30,46 14,58 20,40 4,28 24,28" fill="COLOR"/></svg>' }
  ],
  colors: [
    { color: '#ff1744', name: 'אדום' },
    { color: '#2979ff', name: 'כחול' },
    { color: '#ffd600', name: 'צהוב' },
    { color: '#00e676', name: 'ירוק' }
  ],
  drags: [],
  targets: [],
  dragsState: [],
  targetsState: [],
  draggedPair: null,
  sounds: {
    success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
    error: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
    drag: new Audio('sounds/plop-sound-made-with-my-mouth-100690 (mp3cut.net).mp3')
  },
  init() {
    this.stage = 0;
    this.showModal();
    this.renderGame();
  },
  showModal() {
    document.querySelectorAll('.game-modal').forEach(m => m.remove());
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    // חישוב התקדמות
    const stageNum = this.stage + 1;
    const total = this.totalStages;
    const percent = Math.round((stageNum / total) * 100);
    modal.innerHTML = `
      <div class="game-modal-content" style="background: #fffbe9; max-width: 520px; width: 96vw; max-height: 100vh; height: auto; border-radius: 24px; box-shadow: 0 8px 32px #0002; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow-y: auto; overflow-x: hidden; box-sizing: border-box; padding: 18px 8px;">
        <div style="width:100%; display:flex; flex-direction:column; align-items:center; margin-bottom: 8px;">
          <div style="font-size:1.3rem; font-weight:900; color:#388e3c; margin-bottom:6px; font-family:'Baloo 2','Heebo',sans-serif;">שלב ${stageNum} מתוך ${total}</div>
          <div style="width: 90%; height: 22px; background: #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px #0001; margin-bottom: 4px;">
            <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg,#43a047,#00e676); border-radius: 12px 0 0 12px; transition: width 0.3s;"></div>
          </div>
        </div>
        <div class="game-modal-header" style="width:100%; display:flex; justify-content: space-between; align-items:center; margin-bottom: 8px;">
          <h2 style="font-size:2.2rem; font-family: 'Baloo 2', 'Heebo', sans-serif; margin:0 auto; text-align:center; flex:1;">התאמת צבעים וצורות</h2>
          <button class="close-button" style="margin-right:0; margin-left:auto;" onclick="window['color-match'].closeModal()">×</button>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center; width:100%; justify-content: center; overflow-x:hidden; box-sizing:border-box;">
          <p style="font-size:1.2rem; font-weight:700; margin: 0 0 10px 0; text-align:center;">גרור כל צורה צבעונית למקום המתאים</p>
          <div id="color-match-board" style="display: flex; gap: 3vw; margin: 10px 0 10px 0; justify-content: center; flex-wrap:wrap; width:100%; overflow-x:hidden; box-sizing:border-box;"></div>
          <div id="color-match-drags" style="display: flex; gap: 2vw; margin: 10px 0 10px 0; justify-content: center; flex-wrap:wrap; width:100%; overflow-x:hidden; box-sizing:border-box;"></div>
          <div id="color-match-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 28px; margin-bottom: 6px; font-weight:700; text-align:center;"></div>
          <button id="color-next-stage" style="display:none; margin-top:12px; padding:14px 28px; font-size:1.1rem; border-radius:16px; border:none; background:#43a047; color:#fff; cursor:pointer; font-weight:900; box-shadow:0 2px 8px #0001;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
      const closeBtn = document.querySelector('.close-button');
      if(closeBtn) {
        closeBtn.style.display = 'block';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '12px';
        closeBtn.style.right = '12px';
        closeBtn.style.zIndex = 1001;
        closeBtn.style.fontSize = '2.2rem';
        closeBtn.style.width = '48px';
        closeBtn.style.height = '48px';
      }
    }, 100);
  },
  closeModal() {
    document.querySelectorAll('.game-modal').forEach(m => m.remove());
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  },
  shuffle(arr) {
    return arr.map(x => [Math.random(), x]).sort().map(x => x[1]);
  },
  renderGame() {
    // בחר N צורות-צבע רנדומליים
    let numPairs = 3;
    if (this.stage >= 5) numPairs = 4;
    if (this.stage >= 10) numPairs = 5;
    const pairs = [];
    const used = new Set();
    while (pairs.length < numPairs) {
      const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const key = shape.name + '-' + color.color;
      if (!used.has(key)) {
        pairs.push({ shape, color });
        used.add(key);
      }
    }
    this.targets = this.shuffle([...pairs]);
    this.drags = this.shuffle([...pairs]);
    this.dragsState = [...this.drags];
    this.targetsState = Array(numPairs).fill(null);
    // בנה יעדים (למעלה)
    const board = document.getElementById('color-match-board');
    board.innerHTML = '';
    this.targets.forEach((pair, i) => {
      const target = document.createElement('div');
      target.className = 'shape-target';
      target.style.background = '#fff';
      target.style.border = `6px solid ${pair.color.color}`;
      target.style.width = 'min(100px, 18vw)';
      target.style.height = 'min(100px, 18vw)';
      target.style.borderRadius = '18px';
      target.style.display = 'flex';
      target.style.alignItems = 'center';
      target.style.justifyContent = 'center';
      target.style.margin = '0 0.7vw';
      target.style.boxShadow = '0 2px 12px #0001';
      target.style.boxSizing = 'border-box';
      target.dataset.shape = pair.shape.name;
      target.dataset.color = pair.color.color;
      target.ondragover = e => e.preventDefault();
      target.ondrop = e => {
        const shape = e.dataTransfer.getData('shape');
        const color = e.dataTransfer.getData('color');
        this.playSound('drag');
        if (shape === pair.shape.name && color === pair.color.color && !this.targetsState[i]) {
          target.innerHTML = pair.shape.svg.replace(/COLOR/g, pair.color.color);
          this.targetsState[i] = true;
          if (this.draggedPair) {
            this.dragsState[this.draggedPair.index] = null;
            this.draggedPair = null;
            this.updateDrags();
          }
          document.getElementById('color-match-feedback').textContent = '';
          if (this.targetsState.every(val => val)) {
            this.playSound('success');
            document.getElementById('color-match-feedback').textContent = 'כל הכבוד!';
            this.nextStageButton();
          }
        } else {
          this.playSound('error');
          document.getElementById('color-match-feedback').textContent = 'נסה שוב!';
        }
      };
      target.onmouseenter = () => { target.style.cursor = 'pointer'; };
      target.onmouseleave = () => { target.style.cursor = 'default'; };
      // הצג רק מסגרת של הצורה עם היקף שחור
      let svgWithStroke = pair.shape.svg.replace(/COLOR/g, '#fff');
      // הוסף היקף שחור לכל הצורות
      if (pair.shape.name === 'circle') {
        svgWithStroke = svgWithStroke.replace('<circle', '<circle stroke="black" stroke-width="3"');
      } else if (pair.shape.name === 'square') {
        svgWithStroke = svgWithStroke.replace('<rect', '<rect stroke="black" stroke-width="3"');
      } else if (pair.shape.name === 'triangle' || pair.shape.name === 'star') {
        svgWithStroke = svgWithStroke.replace('<polygon', '<polygon stroke="black" stroke-width="3"');
      }
      target.innerHTML = svgWithStroke;
      board.appendChild(target);
    });
    this.updateDrags();
    document.getElementById('color-match-feedback').textContent = '';
    document.getElementById('color-next-stage').style.display = 'none';
  },
  updateDrags() {
    const dragsDiv = document.getElementById('color-match-drags');
    dragsDiv.innerHTML = '';
    this.dragsState.forEach((pair, i) => {
      if (!pair) return;
      const span = document.createElement('span');
      span.className = 'shape-drag';
      span.style.display = 'inline-block';
      span.style.margin = '0 0.7vw';
      span.draggable = false;
      span.style.cursor = 'grab';
      let isDragging = false;
      let ghost = null;
      let offsetX = 0, offsetY = 0;
      span.onmousedown = e => {
        e.preventDefault();
        isDragging = true;
        span.style.visibility = 'hidden';
        ghost = document.createElement('div');
        ghost.style.position = 'fixed';
        ghost.style.left = e.clientX - 30 + 'px';
        ghost.style.top = e.clientY - 30 + 'px';
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = 9999;
        ghost.innerHTML = pair.shape.svg.replace(/COLOR/g, pair.color.color);
        document.body.appendChild(ghost);
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        this.draggedPair = { pair, index: i };
        document.onmousemove = moveEvt => {
          if (!isDragging) return;
          ghost.style.left = (moveEvt.clientX - offsetX) + 'px';
          ghost.style.top = (moveEvt.clientY - offsetY) + 'px';
        };
        document.onmouseup = upEvt => {
          document.onmousemove = null;
          document.onmouseup = null;
          if (ghost) { ghost.remove(); ghost = null; }
          let dropped = false;
          const targets = document.querySelectorAll('.shape-target');
          targets.forEach((target, idx) => {
            const rect = target.getBoundingClientRect();
            if (
              upEvt.clientX >= rect.left && upEvt.clientX <= rect.right &&
              upEvt.clientY >= rect.top && upEvt.clientY <= rect.bottom
            ) {
              const shape = pair.shape.name;
              const color = pair.color.color;
              if (
                shape === target.dataset.shape &&
                color === target.dataset.color &&
                !this.targetsState[idx]
              ) {
                target.innerHTML = pair.shape.svg.replace(/COLOR/g, pair.color.color);
                this.targetsState[idx] = true;
                this.dragsState[i] = null;
                this.draggedPair = null;
                this.updateDrags();
                document.getElementById('color-match-feedback').textContent = '';
                this.playSound('drag');
                if (this.targetsState.every(val => val)) {
                  this.playSound('success');
                  document.getElementById('color-match-feedback').textContent = 'כל הכבוד!';
                  this.nextStageButton();
                }
                dropped = true;
              }
            }
          });
          if (!dropped) {
            span.style.visibility = 'visible';
            this.draggedPair = null;
            this.playSound('error');
            document.getElementById('color-match-feedback').textContent = 'נסה שוב!';
          }
          isDragging = false;
        };
      };
      let svg = pair.shape.svg.replace(/COLOR/g, pair.color.color);
      svg = svg.replace(/<svg ([^>]+)>/, '<svg $1 style="background:none">');
      span.innerHTML = svg;
      dragsDiv.appendChild(span);
    });

    // תמיכה בגרירה באצבע (touch events) לכל color-drag
    setTimeout(() => {
      document.querySelectorAll('.color-drag').forEach(drag => {
        let touchGhost = null;
        let touchOffset = {x:0, y:0};
        drag.addEventListener('touchstart', function(ev) {
          ev.preventDefault();
          const rect = drag.getBoundingClientRect();
          touchOffset.x = ev.touches[0].clientX - rect.left;
          touchOffset.y = ev.touches[0].clientY - rect.top;
          touchGhost = drag.cloneNode(true);
          touchGhost.style.position = 'fixed';
          touchGhost.style.left = rect.left + 'px';
          touchGhost.style.top = rect.top + 'px';
          touchGhost.style.width = rect.width + 'px';
          touchGhost.style.height = rect.height + 'px';
          touchGhost.style.opacity = '0.95';
          touchGhost.style.zIndex = 9999;
          touchGhost.style.pointerEvents = 'none';
          document.body.appendChild(touchGhost);
        }, {passive:false});
        drag.addEventListener('touchmove', function(ev) {
          if (!touchGhost) return;
          ev.preventDefault();
          touchGhost.style.left = (ev.touches[0].clientX - touchOffset.x) + 'px';
          touchGhost.style.top = (ev.touches[0].clientY - touchOffset.y) + 'px';
        }, {passive:false});
        drag.addEventListener('touchend', function(ev) {
          if (!touchGhost) return;
          const dropX = ev.changedTouches[0].clientX;
          const dropY = ev.changedTouches[0].clientY;
          document.body.removeChild(touchGhost);
          touchGhost = null;
          // בדוק אם שוחרר על מטרה
          const elem = document.elementFromPoint(dropX, dropY);
          const targetDiv = elem && elem.closest('.color-target');
          if (targetDiv && !targetDiv.classList.contains('filled')) {
            const color = drag.dataset.color;
            if (color === targetDiv.dataset.color) {
              targetDiv.classList.add('filled');
              targetDiv.style.opacity = '1';
              targetDiv.style.background = color;
              window['color-match'].playSound && window['color-match'].playSound('success');
              document.getElementById('color-match-feedback').textContent = 'כל הכבוד!';
              drag.remove();
              if (document.querySelectorAll('.color-target.filled').length === document.querySelectorAll('.color-target').length) {
                window['color-match'].nextStageButton();
              }
            } else {
              window['color-match'].playSound && window['color-match'].playSound('wrong');
              document.getElementById('color-match-feedback').textContent = 'נסה שוב!';
            }
          }
        }, {passive:false});
      });
    }, 0);
  },
  nextStageButton() {
    const btn = document.getElementById('color-next-stage');
    btn.style.display = 'inline-block';
    btn.onclick = () => {
      this.playSound('drag');
      this.stage++;
      this.dragsState = [];
      this.targetsState = [];
      this.targets = [];
      this.drags = [];
      if (this.stage < this.totalStages) {
        this.showModal();
        this.renderGame();
      } else {
        document.querySelector('.game-modal-body').innerHTML = '<h3 style="font-size:2rem; color:#43a047;">סיימת את כל השלבים! כל הכבוד!</h3>';
      }
    };
  },
  playSound(type) {
    if (this.sounds[type]) {
      try {
        this.sounds[type].currentTime = 0;
        this.sounds[type].play();
      } catch (e) {
        console.error('שגיאה בהשמעת צליל:', type, e);
      }
    }
  }
}; 