window['shape-match'] = {
  stage: 0,
  totalStages: 10,
  sounds: {},
  shapes: [],
  async loadShapes() {
    // דוגמה ידנית, אפשר להרחיב לפי כל הקבצים שיש בתיקיה
    this.shapes = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
      { id: 'd', label: 'D' },
      { id: 'e', label: 'E' },
      { id: 'f', label: 'F' },
      { id: 'g', label: 'G' },
      { id: 'h', label: 'H' },
      { id: 'i', label: 'I' },
      { id: 'j', label: 'J' },
      { id: 'k', label: 'K' },
      { id: 'l', label: 'L' },
      { id: 'm', label: 'M' },
      { id: 'n', label: 'N' },
      { id: 'o', label: 'O' },
      { id: 'p', label: 'P' },
      { id: 'q', label: 'Q' },
      { id: 'r', label: 'R' },
      { id: 's', label: 'S' },
      { id: 't', label: 'T' },
      { id: 'u', label: 'U' },
      { id: 'v', label: 'V' },
      { id: 'w', label: 'W' },
      { id: 'x', label: 'X' },
      { id: 'y', label: 'Y' },
      { id: 'z', label: 'Z' },
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
      { id: '4', label: '4' },
      { id: '5', label: '5' },
      { id: '6', label: '6' },
      { id: '7', label: '7' },
      { id: '8', label: '8' },
      { id: '9', label: '9' },
      { id: '0', label: '0' },
      // הוסף כאן שמות נוספים לפי הצורך (למשל one, two וכו')
    ];
  },
  async init() {
    await this.loadShapes();
    this.stage = 0;
    this.loadSounds();
    this.showModal();
    this.renderGame();
  },
  loadSounds() {
    this.sounds = {
      success: new Audio('sounds/success-340660 (mp3cut.net).mp3'),
      wrong: new Audio('sounds/wrong-47985 (mp3cut.net).mp3'),
      click: new Audio('sounds/click-tap-computer-mouse-352734.mp3')
    };
  },
  playSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play().catch(()=>{});
    }
  },
  showModal() {
    window.scrollTo({top: 0, behavior: "auto"});
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="game-modal-content" style="max-width:900px; min-height:unset; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <div class="game-modal-header">
          <h2 style="margin-bottom:0;">התאמת צורות וחיות</h2>
          <button class="close-button" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center; justify-content:center; margin-top:10px; margin-bottom:0; padding-bottom:0; overflow:hidden;">
          <p style="margin:0 0 10px 0; font-size:1.3em;">גרור כל תמונה לצל המתאים לה!</p>
          <div id="shape-match-board" style="display: flex; flex-direction: row; gap: 32px; margin: 0; justify-content: center; align-items:center; overflow:hidden;"></div>
          <div id="shape-match-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px;"></div>
          <button id="shape-next-stage" style="display:none; margin-top:12px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
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
      let progressBar = document.getElementById('shape-progress-bar');
      if (!progressBar) {
        const progressDiv = document.createElement('div');
        progressDiv.style.width = '100%';
        progressDiv.style.display = 'flex';
        progressDiv.style.flexDirection = 'column';
        progressDiv.style.alignItems = 'center';
        progressDiv.style.marginBottom = '8px';
        progressDiv.innerHTML = `
          <div id="shape-progress-label" style="font-size:1.3rem; font-weight:900; color:#388e3c; margin-bottom:6px; font-family:'Baloo 2','Heebo',sans-serif;">שלב ${stageNum} מתוך ${total}</div>
          <div style="width: 90%; height: 22px; background: #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px #0001; margin-bottom: 4px;">
            <div id="shape-progress-bar" style="width: ${percent}%; height: 100%; background: linear-gradient(90deg,#43a047,#00e676); border-radius: 12px 0 0 12px; transition: width 0.3s;"></div>
          </div>
        `;
        modalContent.insertBefore(progressDiv, modalContent.firstChild);
      } else {
        document.getElementById('shape-progress-label').textContent = `שלב ${stageNum} מתוך ${total}`;
        progressBar.style.width = percent + '%';
      }
    }
    // בחר 4–6 צורות רנדומליות
    const allShapes = [...this.shapes];
    const stageShapes = [];
    const usedIds = new Set();
    while (stageShapes.length < 6 && allShapes.length > 0) {
      const idx = Math.floor(Math.random() * allShapes.length);
      const shape = allShapes.splice(idx, 1)[0];
      if (!usedIds.has(shape.id)) {
        stageShapes.push(shape);
        usedIds.add(shape.id);
      }
    }
    // ערבוב סדר עצמאי למטרות ולגרירות
    const targets = stageShapes.slice().sort(() => Math.random() - 0.5);
    const drags = stageShapes.slice().sort(() => Math.random() - 0.5);
    const board = document.getElementById('shape-match-board');
    board.innerHTML = '';
    // מטרות (צללים)
    const targetsDiv = document.createElement('div');
    targetsDiv.style.display = 'grid';
    targetsDiv.style.gridTemplateColumns = 'repeat(2, 1fr)';
    targetsDiv.style.gap = '18px';
    targetsDiv.style.alignItems = 'center';
    targetsDiv.style.justifyItems = 'center';
    if (targets.length > 4) targetsDiv.style.gridTemplateColumns = 'repeat(3, 1fr)';
    targets.forEach((s, i) => {
      const target = document.createElement('div');
      target.className = 'shape-target';
      target.style.background = '#fff';
      target.style.border = '3px dashed #bbb';
      target.style.width = '80px';
      target.style.height = '80px';
      target.style.display = 'flex';
      target.style.alignItems = 'center';
      target.style.justifyContent = 'center';
      target.style.margin = '0 10px';
      target.style.opacity = '1';
      target.style.boxShadow = '0 2px 8px #0001';
      target.dataset.shape = s.id;
      // טען SVG שחור outline בלבד
      fetch(`shapes/black/${s.id}.svg`).then(r => r.text()).then(svg => {
        // הוסף fill/stroke ל-path/g/svg אם חסר
        let processed = false;
        if (svg.includes('<path')) {
          svg = svg.replace(/<path /g, "<path stroke='#111' stroke-width='4' fill='none' ");
          processed = true;
        }
        if (!processed && svg.includes('<g')) {
          svg = svg.replace(/<g /g, "<g stroke='#111' stroke-width='4' fill='none' ");
          processed = true;
        }
        if (!processed && svg.includes('<svg')) {
          svg = svg.replace(/<svg /g, "<svg stroke='#111' stroke-width='4' fill='none' ");
        }
        // אם אחרי הכל אין שום path/g/svg, הצג סימן שאלה
        if (!svg.match(/<path|<g|<svg/)) {
          svg = "<svg width='60' height='60'><text x='30' y='40' text-anchor='middle' font-size='40' fill='#111'>?</text></svg>";
        }
        target.innerHTML = `<div style='width:60px;height:60px;display:flex;align-items:center;justify-content:center;'>${svg}</div>`;
      }).catch(() => {
        target.innerHTML = `<svg width='60' height='60'><text x='30' y='40' text-anchor='middle' font-size='40' fill='red'>×</text></svg>`;
      });
      target.ondragover = e => e.preventDefault();
      target.ondrop = e => {
        const shape = e.dataTransfer.getData('shape');
        if (shape === s.id && !target.classList.contains('filled')) {
          target.classList.add('filled');
          target.style.opacity = '1';
          // טען SVG צבעוני מלא
          fetch(`shapes/color/${s.id}.svg`).then(r => r.text()).then(svg => {
            target.innerHTML = `<div style='width:60px;height:60px;display:flex;align-items:center;justify-content:center;'>${svg}</div>`;
          }).catch(() => {
            target.innerHTML = `<svg width='60' height='60'><text x='30' y='40' text-anchor='middle' font-size='40' fill='red'>×</text></svg>`;
          });
          this.playSound('success');
          document.getElementById('shape-match-feedback').textContent = 'כל הכבוד!';
          // הסר את הצורה מהגרירה
          const dragEl = document.querySelector(`.shape-drag[data-shape='${s.id}']`);
          if (dragEl) dragEl.remove();
          // בדוק אם כל המטרות מולאו
          if (document.querySelectorAll('.shape-target.filled').length === targets.length) {
            this.nextStageButton();
          }
        } else {
          this.playSound('wrong');
          document.getElementById('shape-match-feedback').textContent = 'נסה שוב!';
        }
      };
      targetsDiv.appendChild(target);
    });
    // צורות לגרירה
    const dragsDiv = document.createElement('div');
    dragsDiv.style.display = 'grid';
    dragsDiv.style.gridTemplateColumns = 'repeat(2, 1fr)';
    dragsDiv.style.gap = '18px';
    dragsDiv.style.alignItems = 'center';
    dragsDiv.style.justifyItems = 'center';
    if (drags.length > 4) dragsDiv.style.gridTemplateColumns = 'repeat(3, 1fr)';
    drags.forEach((s, i) => {
      const drag = document.createElement('div');
      drag.className = 'shape-drag';
      drag.style.background = '#fff';
      drag.style.width = '80px';
      drag.style.height = '80px';
      drag.style.display = 'flex';
      drag.style.alignItems = 'center';
      drag.style.justifyContent = 'center';
      drag.style.margin = '0 10px';
      drag.style.cursor = 'grab';
      drag.style.boxShadow = '0 2px 8px #0001';
      drag.dataset.shape = s.id;
      // טען SVG צבעוני לגרירה
      fetch(`shapes/color/${s.id}.svg`).then(r => r.text()).then(svg => {
        drag.innerHTML = `<div style='width:60px;height:60px;display:flex;align-items:center;justify-content:center;'>${svg}</div>`;
      }).catch(() => {
        drag.innerHTML = `<svg width='60' height='60'><text x='30' y='40' text-anchor='middle' font-size='40' fill='red'>×</text></svg>`;
      });
      // --- custom drag logic ---
      let ghost = null;
      let offsetX = 0, offsetY = 0;
      drag.onmousedown = e => {
        e.preventDefault();
        drag.style.visibility = 'hidden';
        ghost = document.createElement('div');
        ghost.className = 'shape-drag-ghost';
        ghost.style.position = 'fixed';
        ghost.style.width = drag.style.width;
        ghost.style.height = drag.style.height;
        ghost.style.display = 'flex';
        ghost.style.alignItems = 'center';
        ghost.style.justifyContent = 'center';
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = 9999;
        ghost.style.opacity = '0.97';
        fetch(`shapes/color/${s.id}.svg`).then(r => r.text()).then(svg => {
          ghost.innerHTML = `<div style=\"width:60px;height:60px;display:flex;align-items:center;justify-content:center;\">${svg}</div>`;
        });
        document.body.appendChild(ghost);
        offsetX = 0;
        offsetY = 0;
        window['shape-match'].playSound('click');
        function moveGhost(ev) {
          ghost.style.left = (ev.clientX - ghost.offsetWidth/2) + 'px';
          ghost.style.top = (ev.clientY - ghost.offsetHeight/2) + 'px';
        }
        document.addEventListener('mousemove', moveGhost);
        document.addEventListener('mouseup', function mouseUpHandler(upEvt) {
          document.removeEventListener('mousemove', moveGhost);
          document.removeEventListener('mouseup', mouseUpHandler);
          if (ghost) { ghost.remove(); ghost = null; }
          let dropped = false;
          const targets = document.querySelectorAll('.shape-target');
          targets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (
              upEvt.clientX >= rect.left && upEvt.clientX <= rect.right &&
              upEvt.clientY >= rect.top && upEvt.clientY <= rect.bottom
            ) {
              if (target.dataset.shape === s.id && !target.classList.contains('filled')) {
                target.classList.add('filled');
                target.style.opacity = '1';
                fetch(`shapes/color/${s.id}.svg`).then(r => r.text()).then(svg => {
                  target.innerHTML = `<div style=\"width:60px;height:60px;display:flex;align-items:center;justify-content:center;\">${svg}</div>`;
                }).catch(() => {
                  target.innerHTML = `<svg width='60' height='60'><text x='30' y='40' text-anchor='middle' font-size='40' fill='red'>×</text></svg>`;
                });
                window['shape-match'].playSound('success');
                document.getElementById('shape-match-feedback').textContent = 'כל הכבוד!';
                drag.remove();
                if (document.querySelectorAll('.shape-target.filled').length === targets.length) {
                  window['shape-match'].nextStageButton();
                }
                dropped = true;
              }
            }
          });
          if (!dropped) {
            drag.style.visibility = 'visible';
            window['shape-match'].playSound('wrong');
            document.getElementById('shape-match-feedback').textContent = 'נסה שוב!';
          }
        });
      };
      dragsDiv.appendChild(drag);
    });
    board.appendChild(dragsDiv);
    board.appendChild(targetsDiv);
    document.getElementById('shape-match-feedback').textContent = '';
    document.getElementById('shape-next-stage').style.display = 'none';

    // תמיכה בגרירה באצבע (touch events) למובייל - תמיד אחרי יצירת dragsDiv
    setTimeout(() => {
      let touchDrag = null;
      let touchGhost = null;
      let touchOffset = {x:0, y:0};
      dragsDiv.addEventListener('touchstart', function(ev) {
        const target = ev.target.closest('.shape-drag');
        if (!target) return;
        ev.preventDefault();
        touchDrag = target;
        const rect = target.getBoundingClientRect();
        touchOffset.x = ev.touches[0].clientX - rect.left;
        touchOffset.y = ev.touches[0].clientY - rect.top;
        touchGhost = target.cloneNode(true);
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
      dragsDiv.addEventListener('touchmove', function(ev) {
        if (!touchGhost) return;
        ev.preventDefault();
        touchGhost.style.left = (ev.touches[0].clientX - touchOffset.x) + 'px';
        touchGhost.style.top = (ev.touches[0].clientY - touchOffset.y) + 'px';
      }, {passive:false});
      dragsDiv.addEventListener('touchend', function(ev) {
        if (!touchGhost || !touchDrag) return;
        const dropX = ev.changedTouches[0].clientX;
        const dropY = ev.changedTouches[0].clientY;
        document.body.removeChild(touchGhost);
        touchGhost = null;
        // בדוק אם שוחרר על מטרה
        const elem = document.elementFromPoint(dropX, dropY);
        const targetDiv = elem && elem.closest('.shape-target');
        if (targetDiv && !targetDiv.classList.contains('filled')) {
          const shape = touchDrag.dataset.shape;
          if (shape === targetDiv.dataset.shape) {
            targetDiv.classList.add('filled');
            targetDiv.style.opacity = '1';
            fetch(`shapes/color/${shape}.svg`).then(r => r.text()).then(svg => {
              targetDiv.innerHTML = `<div style=\"width:60px;height:60px;display:flex;align-items:center;justify-content:center;\">${svg}</div>`;
            }).catch(() => {
              targetDiv.innerHTML = `<svg width='60' height='60'><text x='30' y='40' text-anchor='middle' font-size='40' fill='red'>×</text></svg>`;
            });
            window['shape-match'].playSound('success');
            document.getElementById('shape-match-feedback').textContent = 'כל הכבוד!';
            touchDrag.remove();
            if (document.querySelectorAll('.shape-target.filled').length === document.querySelectorAll('.shape-target').length) {
              window['shape-match'].nextStageButton();
            }
          } else {
            window['shape-match'].playSound('wrong');
            document.getElementById('shape-match-feedback').textContent = 'נסה שוב!';
          }
        }
        touchDrag = null;
      }, {passive:false});
    }, 0);
    // ודא שכפתור הסגירה תמיד מוצג
    setTimeout(() => {
      const closeBtn = document.querySelector('.close-button');
      if(closeBtn) {
        closeBtn.style.display = 'block';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '12px';
        closeBtn.style.right = '12px';
        closeBtn.style.zIndex = 1001;
      }
    }, 100);
  },
  nextStageButton() {
    const btn = document.getElementById('shape-next-stage');
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