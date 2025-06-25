window['shape-match'] = {
  stage: 0,
  totalStages: 20,
  sounds: {},
  allShapes: [],
  currentShapes: [],

  async init() {
    await this.loadShapes();
    this.loadSounds();
    this.stage = 0;
    this.showModal();
    this.renderGame();
  },

  async loadShapes() {
    // Load all available shape names from the color SVGs directory
    // We'll assume a fixed list for now, but you can replace with dynamic loading if needed
    this.allShapes = [
      'circle','square','triangle','star','heart','diamond','hexagon','pentagon','octagon','cross','moon','cloud','drop','flower','leaf','arrow','plus','minus','wave','zigzag','parallelogram','trapezoid','crescent','egg','bean','bolt','crown','key','puzzle','spiral','sun','umbrella','fish','cat','dog','bird','turtle','bee','butterfly','lion','elephant','dino','cube','cone','cylinder' // add more as needed
    ];
    // Filter only those that exist in both color and black folders (optional: implement existence check)
  },

  loadSounds() {
    this.sounds = {
      success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
      wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
      drag: new Audio('sounds/plop-sound-made-with-my-mouth-100690 (mp3cut.net).mp3'),
      click: new Audio('sounds/click-tap-computer-mouse-352734.mp3')
    };
  },

  playSound(type) {
    if (this.sounds[type]) {
      try {
        this.sounds[type].currentTime = 0;
        this.sounds[type].play();
      } catch (e) {}
    }
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
          <h2>התאמת צורות</h2>
          <button class="close-button" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <div id="shape-stage-bar" style="width:100%;margin-bottom:8px;"></div>
          <p style="margin:0 0 10px 0; font-size:1.3em; color:#ff9800;">גרור כל צורה למקום המתאים!</p>
          <div id="shape-match-board" style="display: flex; flex-direction: column; gap: 32px; margin: 24px 0;"></div>
          <div id="shape-match-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px;"></div>
          <button id="shape-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  getShapesForStage(stage) {
    // שלב 1: 3, שלב 2: 4 ... עד 9
    const num = Math.min(3 + Math.floor(stage / 3), 9);
    // בחר צורות אקראיות
    const shapes = this.allShapes.slice().sort(() => Math.random() - 0.5).slice(0, num);
    return shapes;
  },

  async renderGame() {
    // עדכון בר שלבים
    const bar = document.getElementById('shape-stage-bar');
    if (bar) {
      const percent = Math.round(((this.stage+1)/this.totalStages)*100);
      bar.innerHTML = `<div style="width:100%;height:18px;background:#e0e0e0;border-radius:9px;overflow:hidden;box-shadow:0 2px 8px #0001;margin-bottom:4px;">
        <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,#43a047,#00e676);border-radius:9px 0 0 9px;transition:width 0.3s;"></div>
      </div>
      <div style="font-size:1.1em;font-weight:700;color:#1976d2;margin-top:2px;">שלב ${this.stage+1} מתוך ${this.totalStages}</div>`;
    }
    // בחר צורות
    const shapes = this.getShapesForStage(this.stage);
    this.currentShapes = shapes;
    // מטרות (צלליות)
    const board = document.getElementById('shape-match-board');
    board.innerHTML = '';
    // מטרות - שורה עליונה
    const targetsContainer = document.createElement('div');
    targetsContainer.style.display = 'flex';
    targetsContainer.style.justifyContent = 'center';
    targetsContainer.style.alignItems = 'center';
    targetsContainer.style.gap = '18px';
    shapes.forEach(shape => {
      const target = document.createElement('div');
      target.className = 'shape-target';
      target.style.background = '#fff';
      target.style.border = '3px dashed #bbb';
      target.style.width = '76px';
      target.style.height = '76px';
      target.style.borderRadius = '50%';
      target.style.display = 'flex';
      target.style.alignItems = 'center';
      target.style.justifyContent = 'center';
      target.style.margin = '0 8px';
      target.style.boxSizing = 'border-box';
      target.style.opacity = '1';
      target.style.boxShadow = '0 2px 8px #0001';
      target.dataset.shape = shape;
      // טען SVG שחור
      fetch(`shapes/black/${shape}.svg`).then(r => r.text()).then(svg => {
        target.innerHTML = `<div style='width:60px;height:60px;display:flex;align-items:center;justify-content:center;'>${svg}</div>`;
      }).catch(() => {
        target.innerHTML = `<svg width='60' height='60'><text x='30' y='40' text-anchor='middle' font-size='40' fill='red'>×</text></svg>`;
      });
      target.ondragover = e => e.preventDefault();
      target.ondrop = e => {
        const shapeId = e.dataTransfer.getData('shape');
        if (shapeId === shape && !target.classList.contains('filled')) {
          this.playSound('success');
          target.classList.add('filled');
          // טען SVG צבעוני
          fetch(`shapes/color/${shape}.svg`).then(r => r.text()).then(svg => {
            target.innerHTML = `<div style='width:60px;height:60px;display:flex;align-items:center;justify-content:center;'>${svg}</div>`;
          }).catch(() => {
            target.innerHTML = `<svg width='60' height='60'><text x='30' y='40' text-anchor='middle' font-size='40' fill='red'>×</text></svg>`;
          });
          document.getElementById('shape-match-feedback').textContent = 'כל הכבוד!';
          const dragEl = document.querySelector(`.shape-drag[data-shape='${shape}']`);
          if (dragEl) dragEl.remove();
          if (document.querySelectorAll('.shape-target.filled').length === shapes.length) {
            this.nextStageButton();
          }
        } else {
          this.playSound('wrong');
          document.getElementById('shape-match-feedback').textContent = 'נסה שוב!';
        }
      };
      targetsContainer.appendChild(target);
    });
    // גרירות - שורה תחתונה
    const dragsContainer = document.createElement('div');
    dragsContainer.id = 'shape-match-drags';
    dragsContainer.style.display = 'flex';
    dragsContainer.style.justifyContent = 'center';
    dragsContainer.style.alignItems = 'center';
    dragsContainer.style.gap = '18px';
    dragsContainer.style.marginTop = '24px';
    // ערבוב עצמאי לגרירות
    const drags = shapes.slice().sort(() => Math.random() - 0.5);
    drags.forEach(shape => {
      const drag = document.createElement('div');
      drag.className = 'shape-drag';
      drag.style.background = '#fff';
      drag.style.width = '76px';
      drag.style.height = '76px';
      drag.style.borderRadius = '50%';
      drag.style.margin = '0 8px';
      drag.style.cursor = 'grab';
      drag.style.display = 'flex';
      drag.style.alignItems = 'center';
      drag.style.justifyContent = 'center';
      drag.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)';
      drag.style.transition = 'transform 0.15s, box-shadow 0.15s';
      drag.style.opacity = '1';
      drag.draggable = true;
      drag.dataset.shape = shape;
      // טען SVG צבעוני
      fetch(`shapes/color/${shape}.svg`).then(r => r.text()).then(svg => {
        drag.innerHTML = `<div style='width:60px;height:60px;display:flex;align-items:center;justify-content:center;'>${svg}</div>`;
      }).catch(() => {
        drag.innerHTML = `<svg width='60' height='60'><text x='30' y='40' text-anchor='middle' font-size='40' fill='red'>×</text></svg>`;
      });
      // אפקט hover/touch
      drag.onpointerdown = () => { drag.style.transform = 'scale(1.10)'; drag.style.boxShadow = '0 12px 32px rgba(0,0,0,0.28)'; };
      drag.onpointerup = drag.onpointerleave = () => { drag.style.transform = ''; drag.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)'; };
      drag.ondragstart = e => {
        this.playSound('drag');
        e.dataTransfer.setData('shape', shape);
      };
      // Touch events
      let touchGhost = null;
      let touchOffset = {x:0, y:0};
      drag.addEventListener('touchstart', function(ev) {
        window['shape-match'].playSound('drag');
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
        const targetDiv = elem && elem.closest('.shape-target');
        if (targetDiv && !targetDiv.classList.contains('filled')) {
          const shapeId = drag.dataset.shape;
          if (shapeId === targetDiv.dataset.shape) {
            window['shape-match'].playSound('success');
            targetDiv.classList.add('filled');
            fetch(`shapes/color/${shapeId}.svg`).then(r => r.text()).then(svg => {
              targetDiv.innerHTML = `<div style='width:60px;height:60px;display:flex;align-items:center;justify-content:center;'>${svg}</div>`;
            }).catch(() => {
              targetDiv.innerHTML = `<svg width='60' height='60'><text x='30' y='40' text-anchor='middle' font-size='40' fill='red'>×</text></svg>`;
            });
            document.getElementById('shape-match-feedback').textContent = 'כל הכבוד!';
            drag.remove();
            if (document.querySelectorAll('.shape-target.filled').length === shapes.length) {
              window['shape-match'].nextStageButton();
            }
          } else {
            window['shape-match'].playSound('wrong');
            document.getElementById('shape-match-feedback').textContent = 'נסה שוב!';
          }
        }
      }, {passive:false});
      dragsContainer.appendChild(drag);
    });
    board.appendChild(targetsContainer);
    board.appendChild(dragsContainer);
    document.getElementById('shape-match-feedback').textContent = '';
    document.getElementById('shape-next-stage').style.display = 'none';
  },

  nextStageButton() {
    const btn = document.getElementById('shape-next-stage');
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
  }
}; 