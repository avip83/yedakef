window['shape-match'] = {
  stage: 0,
  totalStages: 5,
  sounds: {},
  shapes: [
    { id: 'circle', name: 'עיגול', color: '#e53935' },
    { id: 'square', name: 'ריבוע', color: '#1e88e5' },
    { id: 'triangle', name: 'משולש', color: '#43a047' },
    { id: 'star', name: 'כוכב', color: '#ff9800' },
    { id: 'heart', name: 'לב', color: '#e91e63' },
    { id: 'diamond', name: 'יהלום', color: '#9c27b0' }
  ],
  
  init() {
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
      <div class="game-modal-content">
        <div class="game-modal-header">
          <h2>התאמת צורות</h2>
          <button class="close-button" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>גרור כל צורה למקום המתאים!</p>
          <div id="shape-match-board" style="display: flex; flex-direction: column; gap: 32px; margin: 24px 0;"></div>
          <div id="shape-match-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px;"></div>
          <button id="shape-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  
  renderGame() {
    // בחר 3 צורות רנדומליות
    const allShapes = [...this.shapes];
    const stageShapes = [];
    while (stageShapes.length < 3 && allShapes.length > 0) {
      const idx = Math.floor(Math.random() * allShapes.length);
      const shape = allShapes.splice(idx, 1)[0];
      stageShapes.push(shape);
    }
    
    // ערבוב סדר עצמאי למטרות ולגרירות
    const targets = stageShapes.slice().sort(() => Math.random() - 0.5);
    const drags = stageShapes.slice().sort(() => Math.random() - 0.5);
    
    const board = document.getElementById('shape-match-board');
    board.innerHTML = '';
    
    // מטרות (צללים) - שורה עליונה
    const targetsContainer = document.createElement('div');
    targetsContainer.style.display = 'flex';
    targetsContainer.style.justifyContent = 'center';
    targetsContainer.style.alignItems = 'center';
    targetsContainer.style.gap = '12px';
    
    targets.forEach((s, i) => {
      const target = document.createElement('div');
      target.className = 'shape-target';
      target.style.background = '#fff';
      target.style.border = `4px dashed ${s.color}`;
      target.style.width = '76px';
      target.style.height = '76px';
      target.style.borderRadius = '50%';
      target.style.display = 'flex';
      target.style.alignItems = 'center';
      target.style.justifyContent = 'center';
      target.style.margin = '0 12px';
      target.style.boxSizing = 'border-box';
      target.style.opacity = '1';
      target.style.boxShadow = '0 2px 8px #0001';
      target.dataset.shape = s.id;
      target.dataset.color = s.color;
      
      // צור SVG outline פשוט
      let outlineSvg = '';
      switch(s.id) {
        case 'circle':
          outlineSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><circle cx='30' cy='30' r='24' fill='none' stroke='${s.color}' stroke-width='4'/></svg>`;
          break;
        case 'square':
          outlineSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><rect x='10' y='10' width='40' height='40' rx='4' fill='none' stroke='${s.color}' stroke-width='4'/></svg>`;
          break;
        case 'triangle':
          outlineSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,10 52,50 8,50' fill='none' stroke='${s.color}' stroke-width='4'/></svg>`;
          break;
        case 'star':
          outlineSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,5 37,25 55,25 40,35 47,55 30,45 13,55 20,35 5,25 23,25' fill='none' stroke='${s.color}' stroke-width='2'/></svg>`;
          break;
        case 'heart':
          outlineSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><path d='M30,15 C30,15 20,5 10,15 C0,25 10,45 30,55 C50,45 60,25 50,15 C40,5 30,15 30,15' fill='none' stroke='${s.color}' stroke-width='3'/></svg>`;
          break;
        case 'diamond':
          outlineSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,10 50,30 30,50 10,30' fill='none' stroke='${s.color}' stroke-width='4'/></svg>`;
          break;
        default:
          outlineSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><text x='30' y='40' text-anchor='middle' font-size='24' fill='${s.color}'>?</text></svg>`;
      }
      target.innerHTML = outlineSvg;
      
      target.ondragover = e => e.preventDefault();
      target.ondrop = e => {
        const shape = e.dataTransfer.getData('shape');
        const color = e.dataTransfer.getData('color');
        if (shape === s.id && color === s.color) {
          this.playSound('success');
          target.style.background = s.color;
          target.style.border = '4px solid #fff';
          // צור SVG צבעוני מלא
          let filledSvg = '';
          switch(s.id) {
            case 'circle':
              filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><circle cx='30' cy='30' r='24' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
              break;
            case 'square':
              filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><rect x='10' y='10' width='40' height='40' rx='4' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
              break;
            case 'triangle':
              filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,10 52,50 8,50' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
              break;
            case 'star':
              filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,5 37,25 55,25 40,35 47,55 30,45 13,55 20,35 5,25 23,25' fill='#fff' stroke='#fff' stroke-width='1'/></svg>`;
              break;
            case 'heart':
              filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><path d='M30,15 C30,15 20,5 10,15 C0,25 10,45 30,55 C50,45 60,25 50,15 C40,5 30,15 30,15' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
              break;
            case 'diamond':
              filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,10 50,30 30,50 10,30' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
              break;
          }
          target.innerHTML = filledSvg;
          target.classList.add('filled');
          document.getElementById('shape-match-feedback').textContent = 'כל הכבוד!';
          const dragEl = document.querySelector(`.shape-drag[data-shape='${shape}'][data-color='${color}']`);
          if (dragEl) dragEl.remove();
          if (document.querySelectorAll('.shape-target.filled').length === targets.length) {
            this.nextStageButton();
          }
        } else {
          this.playSound('wrong');
          document.getElementById('shape-match-feedback').textContent = 'נסה שוב!';
        }
      };
      targetsContainer.appendChild(target);
    });
    
    // צורות לגרירה - שורה תחתונה
    const dragsContainer = document.createElement('div');
    dragsContainer.id = 'shape-match-drags';
    dragsContainer.style.display = 'flex';
    dragsContainer.style.justifyContent = 'center';
    dragsContainer.style.alignItems = 'center';
    dragsContainer.style.gap = '12px';
    dragsContainer.style.marginTop = '24px';
    
    drags.forEach((s, i) => {
      const drag = document.createElement('div');
      drag.className = 'shape-drag';
      drag.style.background = s.color;
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
      drag.dataset.shape = s.id;
      drag.dataset.color = s.color;
      
      // צור SVG צבעוני לגרירה
      let filledSvg = '';
      switch(s.id) {
        case 'circle':
          filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><circle cx='30' cy='30' r='24' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
          break;
        case 'square':
          filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><rect x='10' y='10' width='40' height='40' rx='4' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
          break;
        case 'triangle':
          filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,10 52,50 8,50' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
          break;
        case 'star':
          filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,5 37,25 55,25 40,35 47,55 30,45 13,55 20,35 5,25 23,25' fill='#fff' stroke='#fff' stroke-width='1'/></svg>`;
          break;
        case 'heart':
          filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><path d='M30,15 C30,15 20,5 10,15 C0,25 10,45 30,55 C50,45 60,25 50,15 C40,5 30,15 30,15' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
          break;
        case 'diamond':
          filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,10 50,30 30,50 10,30' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
          break;
      }
      drag.innerHTML = filledSvg;
      
      // אפקט hover/touch
      drag.onpointerdown = () => { 
        drag.style.transform = 'scale(1.10)'; 
        drag.style.boxShadow = '0 12px 32px rgba(0,0,0,0.28)'; 
      };
      drag.onpointerup = drag.onpointerleave = () => { 
        drag.style.transform = ''; 
        drag.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)'; 
      };
      
      drag.ondragstart = e => {
        this.playSound('click');
        e.dataTransfer.setData('shape', s.id);
        e.dataTransfer.setData('color', s.color);
      };
      
      // touch לגרירה במובייל - בדיוק כמו במשחק הצבעים
      let touchGhost = null;
      let touchOffset = {x:0, y:0};
      drag.addEventListener('touchstart', function(ev) {
        this.playSound('click');
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
      }.bind(this), {passive:false});
      
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
          const shape = drag.dataset.shape;
          const color = drag.dataset.color;
          if (shape === targetDiv.dataset.shape && color === targetDiv.dataset.color) {
            targetDiv.classList.add('filled');
            targetDiv.style.background = color;
            targetDiv.style.border = '4px solid #fff';
            // צור SVG צבעוני מלא
            let filledSvg = '';
            switch(shape) {
              case 'circle':
                filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><circle cx='30' cy='30' r='24' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
                break;
              case 'square':
                filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><rect x='10' y='10' width='40' height='40' rx='4' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
                break;
              case 'triangle':
                filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,10 52,50 8,50' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
                break;
              case 'star':
                filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,5 37,25 55,25 40,35 47,55 30,45 13,55 20,35 5,25 23,25' fill='#fff' stroke='#fff' stroke-width='1'/></svg>`;
                break;
              case 'heart':
                filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><path d='M30,15 C30,15 20,5 10,15 C0,25 10,45 30,55 C50,45 60,25 50,15 C40,5 30,15 30,15' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
                break;
              case 'diamond':
                filledSvg = `<svg width='56' height='56' viewBox='0 0 60 60'><polygon points='30,10 50,30 30,50 10,30' fill='#fff' stroke='#fff' stroke-width='2'/></svg>`;
                break;
            }
            targetDiv.innerHTML = filledSvg;
            this.playSound('success');
            document.getElementById('shape-match-feedback').textContent = 'כל הכבוד!';
            drag.remove();
            if (document.querySelectorAll('.shape-target.filled').length === targets.length) {
              this.nextStageButton();
            }
          } else {
            this.playSound('wrong');
            document.getElementById('shape-match-feedback').textContent = 'נסה שוב!';
          }
        }
      }.bind(this), {passive:false});
      
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