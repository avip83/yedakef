window['color-match'] = {
  stage: 0,
  totalStages: 20,
  sounds: {},
  muted: false,
  colors: [
    { color: '#ff1744', name: 'אדום' },
    { color: '#2979ff', name: 'כחול' },
    { color: '#ffd600', name: 'צהוב' },
    { color: '#00e676', name: 'ירוק' },
    { color: '#ab47bc', name: 'סגול' },
    { color: '#ff9100', name: 'כתום' },
    { color: '#757575', name: 'אפור' },
    { color: '#000000', name: 'שחור' },
    { color: '#8d6e63', name: 'חום' },
    { color: '#f06292', name: 'ורוד' }
  ],
  shapes: [
    { name: 'circle', svg: `<svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="COLOR"/></svg>` },
    { name: 'square', svg: `<svg width="60" height="60" viewBox="0 0 60 60"><rect x="12" y="12" width="36" height="36" rx="10" fill="COLOR"/></svg>` },
    { name: 'triangle', svg: `<svg width="60" height="60" viewBox="0 0 60 60"><polygon points="30,10 52,50 8,50" fill="COLOR"/></svg>` }
  ],

  loadSounds() {
    this.sounds = {
      success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
      wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
      drag: new Audio('sounds/plop-sound-made-with-my-mouth-100690 (mp3cut.net).mp3'),
      click: new Audio('sounds/click-tap-computer-mouse-352734.mp3')
    };
    for (const k in this.sounds) this.sounds[k].volume = 1;
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
    this.loadSounds();
    this.stage = 0;
    this.showModal();
    this.renderGame();
  },

  showModal() {
    window.scrollTo({top: 0, behavior: "auto"});
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="game-modal-content">
        <div class="game-modal-header">
          <h2>התאמת צבעים</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <div id="color-stage-bar" style="width:100%;margin-bottom:8px;"></div>
          <p style="margin:0 0 10px 0; font-size:1.3em; color:#ff9800;">גרור כל צורה צבעונית למקום המתאים!</p>
          <div id="color-match-board" style="display: flex; flex-direction: column; gap: 32px; margin: 24px 0;"></div>
          <div id="color-match-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; font-weight: 700;"></div>
          <button id="color-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  getColorsForStage(stage) {
    // שלבים 0-3: 3 צבעים, כל השאר: 4 צבעים
    const num = stage <= 3 ? 3 : 4;
    return this.colors.slice().sort(() => Math.random() - 0.5).slice(0, num);
  },

  renderGame() {
    // עדכון בר שלבים
    const bar = document.getElementById('color-stage-bar');
    if (bar) {
      const percent = Math.round(((this.stage+1)/this.totalStages)*100);
      bar.innerHTML = `<div style="font-size:1.3rem; font-weight:900; color:#43a047; margin-bottom:6px; font-family:'Baloo 2','Heebo',sans-serif;">שלב ${this.stage+1} מתוך ${this.totalStages}</div>
        <div style="width:100%;height:18px;background:#e0e0e0;border-radius:9px;overflow:hidden;box-shadow:0 2px 8px #0001;margin-bottom:4px;">
          <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,#43a047,#00e676);border-radius:9px 0 0 9px;transition:width 0.3s;"></div>
        </div>`;
    }
    // בחר צבעים
    const colors = this.getColorsForStage(this.stage);
    // בחר צורות (תמיד 3)
    const shapes = this.shapes.slice(0, 3);
    // ערבוב עצמאי לגרירות
    const pairs = shapes.map((shape, i) => ({ shape, color: colors[i] }));
    const drags = pairs.slice().sort(() => Math.random() - 0.5);
    // מטרות (outline)
    const board = document.getElementById('color-match-board');
    board.innerHTML = '';
    const rowTargets = document.createElement('div');
    rowTargets.style.display = 'flex';
    rowTargets.style.justifyContent = 'center';
    rowTargets.style.gap = '32px';
    pairs.forEach(pair => {
      const target = document.createElement('div');
      target.className = 'color-target';
      target.style.width = '76px';
      target.style.height = '76px';
      target.style.borderRadius = '50%';
      target.style.display = 'flex';
      target.style.alignItems = 'center';
      target.style.justifyContent = 'center';
      target.style.margin = '0';
      target.style.boxSizing = 'border-box';
      target.style.opacity = '1';
      target.style.border = `4px dashed ${pair.color.color}`;
      // תמיד outline svg
      let outlineSvg = pair.shape.svg
        .replace('fill="COLOR"', 'fill="none"')
        .replace('<svg ', `<svg style='pointer-events:none;' stroke='${pair.color.color}' stroke-width='4' `);
      target.innerHTML = outlineSvg;
      target.dataset.shape = pair.shape.name;
      target.dataset.color = pair.color.color;
      target.ondragover = e => e.preventDefault();
      target.ondrop = e => {
        const shape = e.dataTransfer.getData('shape');
        const color = e.dataTransfer.getData('color');
        if (shape === pair.shape.name && color === pair.color.color && !target.classList.contains('filled')) {
          this.playSound('success');
          target.classList.add('filled');
          // svg מלא בצבע
          let svg = pair.shape.svg
            .replace('fill="COLOR"', `fill="${pair.color.color}"`)
            .replace('<svg ', `<svg style='pointer-events:none;' `);
          target.innerHTML = svg;
          document.getElementById('color-match-feedback').textContent = 'כל הכבוד!';
          document.getElementById('color-match-feedback').style.color = '#43a047';
          const dragEl = document.querySelector(`.color-drag[data-shape='${shape}'][data-color='${color}']`);
          if (dragEl) {
            dragEl.style.visibility = 'hidden';
            dragEl.style.pointerEvents = 'none';
          }
          if (document.querySelectorAll('.color-target.filled').length === pairs.length) {
            this.nextStageButton();
          }
        } else {
          this.playSound('wrong');
          document.getElementById('color-match-feedback').textContent = 'נסה שוב!';
          document.getElementById('color-match-feedback').style.color = '#e53935';
        }
      };
      rowTargets.appendChild(target);
    });
    board.appendChild(rowTargets);
    // שורת גרירות
    const rowDrags = document.createElement('div');
    rowDrags.style.display = 'flex';
    rowDrags.style.justifyContent = 'center';
    rowDrags.style.gap = '32px';
    // ערבוב רנדומלי לגרירות
    const dragsShuffled = pairs.slice().sort(() => Math.random() - 0.5);
    dragsShuffled.forEach(pair => {
      const drag = document.createElement('div');
      drag.className = 'color-drag';
      drag.style.background = pair.color.color;
      drag.style.width = '76px';
      drag.style.height = '76px';
      drag.style.borderRadius = '50%';
      drag.style.margin = '0';
      drag.style.cursor = 'grab';
      drag.style.display = 'flex';
      drag.style.alignItems = 'center';
      drag.style.justifyContent = 'center';
      drag.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)';
      drag.style.transition = 'transform 0.15s, box-shadow 0.15s';
      drag.style.opacity = '1';
      drag.draggable = true;
      drag.dataset.shape = pair.shape.name;
      drag.dataset.color = pair.color.color;
      // svg עם fill=color, stroke=white
      drag.innerHTML = pair.shape.svg
        .replace('fill="COLOR"', `fill="${pair.color.color}"`)
        .replace('<svg ', `<svg style='pointer-events:none;' stroke='white' stroke-width='4' `);
      drag.onpointerdown = () => { drag.style.transform = 'scale(1.10)'; drag.style.boxShadow = '0 12px 32px rgba(0,0,0,0.28)'; };
      drag.onpointerup = drag.onpointerleave = () => { drag.style.transform = ''; drag.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)'; };
      drag.ondragstart = e => {
        this.playSound('drag');
        e.dataTransfer.setData('shape', pair.shape.name);
        e.dataTransfer.setData('color', pair.color.color);
      };
      // תמיכה בגרירה במובייל
      let touchGhost = null;
      let touchOffset = {x:0, y:0};
      drag.addEventListener('touchstart', function(ev) {
        window['color-match'].playSound('drag');
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
        touchGhost.style.opacity = '0.97';
        touchGhost.style.zIndex = 9999;
        touchGhost.style.pointerEvents = 'none';
        touchGhost.style.transform = 'scale(1.10)';
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
        const elem = document.elementFromPoint(dropX, dropY);
        const targetDiv = elem && elem.closest('.color-target');
        if (targetDiv && !targetDiv.classList.contains('filled')) {
          const shape = drag.dataset.shape;
          const color = drag.dataset.color;
          if (shape === targetDiv.dataset.shape && color === targetDiv.dataset.color) {
            window['color-match'].playSound('success');
            targetDiv.classList.add('filled');
            let svg = pair.shape.svg
              .replace('fill="COLOR"', `fill="${color}"`)
              .replace('<svg ', `<svg style='pointer-events:none;' `);
            targetDiv.innerHTML = svg;
            document.getElementById('color-match-feedback').textContent = 'כל הכבוד!';
            document.getElementById('color-match-feedback').style.color = '#43a047';
            drag.remove();
            if (document.querySelectorAll('.color-target.filled').length === pairs.length) {
              window['color-match'].nextStageButton();
            }
          } else {
            window['color-match'].playSound('wrong');
            document.getElementById('color-match-feedback').textContent = 'נסה שוב!';
            document.getElementById('color-match-feedback').style.color = '#e53935';
          }
        }
      }, {passive:false});
      rowDrags.appendChild(drag);
    });
    board.appendChild(rowDrags);
    document.getElementById('color-match-feedback').textContent = '';
    document.getElementById('color-next-stage').style.display = 'none';
  },

  nextStageButton() {
    const btn = document.getElementById('color-next-stage');
    btn.style.display = 'inline-block';
    btn.onclick = () => {
      this.playSound('click');
      this.stage++;
      if (this.stage < this.totalStages) {
        this.renderGame();
      } else {
        document.querySelector('.game-modal-body').innerHTML = '<h3 style="font-size:2rem; color:#43a047;">סיימת את כל השלבים! כל הכבוד!</h3>';
      }
    };
  },

  toggleMute() {
    this.muted = !this.muted;
    const btn = document.getElementById('color-match-volume');
    if (btn) {
      if (this.muted) btn.classList.add('muted');
      else btn.classList.remove('muted');
    }
  }
};
