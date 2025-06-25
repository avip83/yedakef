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
  get muted() { return !!window.__globalMute; },
  set muted(val) { window.__globalMute = !!val; },
  init() {
    this.stage = 0;
    this.showModal();
    this.renderGame();
  },
  showModal() {
    window.scrollTo({top: 0, behavior: "auto"});
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
    // הגדרת צורות - SVG גדול, ממורכז, דומיננטי
    const shapes = [
      {name: 'circle', svg: `<svg width='56' height='56' viewBox='0 0 60 60' style='display:block;'><circle cx='30' cy='30' r='24' fill='white' stroke='white' stroke-width='2'/></svg>`},
      {name: 'square', svg: `<svg width='56' height='56' viewBox='0 0 60 60' style='display:block;'><rect x='10' y='10' width='40' height='40' rx='8' fill='white' stroke='white' stroke-width='2'/></svg>`},
      {name: 'triangle', svg: `<svg width='56' height='56' viewBox='0 0 60 60' style='display:block;'><polygon points='30,10 52,50 8,50' fill='white' stroke='white' stroke-width='2'/></svg>`}
    ];
    const colors = ['#e53935', '#1e88e5', '#43a047'];
    // ערבוב סדר עצמאי למטרות ולגרירות
    const pairs = shapes.map((shape, i) => ({shape, color: colors[i]}));
    const targets = pairs.slice().sort(() => Math.random() - 0.5); // מטרות (שורה עליונה)
    const drags = pairs.slice().sort(() => Math.random() - 0.5);   // לגרירה (שורה תחתונה)
    // מטרות (עיגולים ריקים)
    const board = document.getElementById('color-match-board');
    board.innerHTML = '';
    targets.forEach((pair, i) => {
      const target = document.createElement('div');
      target.className = 'color-target';
      target.style.background = '#fff';
      target.style.border = `4px dashed ${pair.color}`;
      target.style.width = '76px';
      target.style.height = '76px';
      target.style.borderRadius = '50%';
      target.style.display = 'flex';
      target.style.alignItems = 'center';
      target.style.justifyContent = 'center';
      target.style.margin = '0 12px';
      target.style.boxSizing = 'border-box';
      target.style.opacity = '1';
      // Show only the outline of the shape in the target
      let outlineSvg = pair.shape.svg
        .replace(/fill=['"][^'"]*['"]/g, "fill='none'")
        .replace(/stroke=['"][^'"]*['"]/g, `stroke='${pair.color}'`)
        .replace(/stroke-width=['"][^'"]*['"]/g, "stroke-width='4'");
      target.innerHTML = outlineSvg;
      target.dataset.shape = pair.shape.name;
      target.dataset.color = pair.color;
      target.ondragover = e => e.preventDefault();
      target.ondrop = e => {
        const shape = e.dataTransfer.getData('shape');
        const color = e.dataTransfer.getData('color');
        if (shape === pair.shape.name && color === pair.color) {
          this.playSound('success');
          target.style.background = pair.color;
          target.style.border = '4px solid #fff';
          let svg = pair.shape.svg
            .replace(/fill=['"][^'"]*['"]/g, `fill='#fff'`)
            .replace(/stroke=['"][^'"]*['"]/g, `stroke='#fff'`)
            .replace(/stroke-width=['"][^'"]*['"]/g, "stroke-width='2'");
          target.innerHTML = svg;
          target.classList.add('filled');
          document.getElementById('color-match-feedback').textContent = 'כל הכבוד!';
          const dragEl = document.querySelector(`.color-drag[data-shape='${shape}'][data-color='${color}']`);
          if (dragEl) dragEl.remove();
          if (document.querySelectorAll('.color-target.filled').length === targets.length) {
            this.nextStageButton();
          }
        } else {
          this.playSound('error');
          document.getElementById('color-match-feedback').textContent = 'נסה שוב!';
        }
      };
      board.appendChild(target);
    });
    
    // עיגולים לגרירה
    const dragsContainer = document.getElementById('color-match-drags');
    dragsContainer.innerHTML = '';
    drags.forEach((pair, i) => {
      const drag = document.createElement('div');
      drag.className = 'color-drag';
      drag.style.background = pair.color;
      drag.style.width = '76px';
      drag.style.height = '76px';
      drag.style.borderRadius = '50%';
      drag.style.margin = '0 12px';
      drag.style.cursor = 'grab';
      drag.style.display = 'flex';
      drag.style.alignItems = 'center';
      drag.style.justifyContent = 'center';
      drag.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)';
      drag.style.transition = 'transform 0.15s, box-shadow 0.15s';
      drag.style.opacity = '1';
      drag.draggable = true;
      drag.dataset.shape = pair.shape.name;
      drag.dataset.color = pair.color;
      drag.innerHTML = pair.shape.svg; // הצורה תמיד מוצגת
      // אפקט hover/touch
      drag.onpointerdown = () => { drag.style.transform = 'scale(1.10)'; drag.style.boxShadow = '0 12px 32px rgba(0,0,0,0.28)'; };
      drag.onpointerup = drag.onpointerleave = () => { drag.style.transform = ''; drag.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)'; };
      drag.ondragstart = e => {
        this.playSound('drag');
        e.dataTransfer.setData('shape', pair.shape.name);
        e.dataTransfer.setData('color', pair.color);
      };
      // touch לגרירה במובייל
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
            targetDiv.style.background = color;
            targetDiv.style.border = '4px solid #fff';
            let svg = pair.shape.svg
              .replace(/fill=['"][^'"]*['"]/g, `fill='#fff'`)
              .replace(/stroke=['"][^'"]*['"]/g, `stroke='#fff'`)
              .replace(/stroke-width=['"][^'"]*['"]/g, "stroke-width='2'");
            targetDiv.innerHTML = svg;
            document.getElementById('color-match-feedback').textContent = 'כל הכבוד!';
            drag.remove();
            if (document.querySelectorAll('.color-target.filled').length === targets.length) {
              window['color-match'].nextStageButton();
            }
          } else {
            window['color-match'].playSound('error');
            document.getElementById('color-match-feedback').textContent = 'נסה שוב!';
          }
        }
      }, {passive:false});
      dragsContainer.appendChild(drag);
    });
    
    document.getElementById('color-match-feedback').textContent = '';
    document.getElementById('color-next-stage').style.display = 'none';
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
    if (window.__globalMute) return;
    if (this.sounds[type]) {
      try {
        this.sounds[type].currentTime = 0;
        this.sounds[type].play();
      } catch (e) {}
    }
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