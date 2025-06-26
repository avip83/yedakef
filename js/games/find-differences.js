window['find-differences'] = {
  stage: 0,
  totalStages: 1,
  found: [],
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
    this.found = [];
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
          <h2>מצא את ההבדלים</h2>
        </div>
        <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center;">
          <p>מצא את כל ההבדלים בתמונה!</p>
          <div id="diff-board" style="display: flex; justify-content: center; align-items: center; margin: 24px 0; position:relative;"></div>
          <div id="diff-feedback" style="font-size: 1.2rem; color: #388e3c; min-height: 32px; font-weight: 700;"></div>
          <button id="diff-next-stage" style="display:none; margin-top:16px; padding:10px 24px; font-size:1.1rem; border-radius:12px; border:none; background:#1976d2; color:#fff; cursor:pointer;">לשלב הבא</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  renderGame() {
    this.found = this.found || [];
    const board = document.getElementById('diff-board');
    board.innerHTML = '';
    // הצג את התמונה
    const img = document.createElement('img');
    img.src = 'diffrent/rabit.png';
    img.alt = 'מצא את ההבדלים';
    img.style.width = 'min(95vw, 420px)';
    img.style.maxWidth = '420px';
    img.style.height = 'auto';
    img.style.borderRadius = '24px';
    img.style.boxShadow = '0 4px 24px #0001';
    img.style.display = 'block';
    img.style.position = 'relative';
    board.appendChild(img);
    // הגדר הבדלים: כל הבדל הוא זוג אזורים (ימין/שמאל) עם קואורדינטות מדויקות
    // left: 0 (שמאל קיצון), 1 (ימין קיצון)
    // צד שמאל: left יחסי ל-0 עד 0.5, צד ימין: left יחסי ל-0.5 עד 1
    // כל עיגול: [left, top, r] (left/top/radius יחסיים)
    // ערכים מותאמים לפי התמונה שסיפקת
    const diffs = [
      // פרח
      [ {left: 0.13, top: 0.15, r: 0.07}, {left: 0.63, top: 0.15, r: 0.07} ],
      // עין
      [ {left: 0.22, top: 0.29, r: 0.045}, {left: 0.72, top: 0.29, r: 0.045} ],
      // יד
      [ {left: 0.36, top: 0.48, r: 0.09}, {left: 0.86, top: 0.48, r: 0.09} ],
      // נעליים
      [ {left: 0.28, top: 0.83, r: 0.10}, {left: 0.78, top: 0.83, r: 0.10} ]
    ];
    // שכבת אינטראקציה
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '2';
    overlay.id = 'diff-overlay';
    board.style.position = 'relative';
    board.appendChild(overlay);
    // הפוך את board ל-position:relative
    board.style.position = 'relative';
    // הוסף אזורים אינטראקטיביים
    diffs.forEach((pair, diffIdx) => {
      pair.forEach((area, sideIdx) => {
        const btn = document.createElement('div');
        btn.style.position = 'absolute';
        btn.style.left = (area.left * 100) + '%';
        btn.style.top = (area.top * 100) + '%';
        btn.style.width = (area.r * 2 * 100) + '%';
        btn.style.height = (area.r * 2 * 100) + '%';
        btn.style.transform = 'translate(-50%,-50%)';
        btn.style.borderRadius = '50%';
        btn.style.cursor = 'pointer';
        btn.style.pointerEvents = 'auto';
        btn.style.background = 'rgba(0,0,0,0)';
        btn.onclick = (e) => {
          e.stopPropagation();
          if (!this.found.includes(diffIdx)) {
            this.found.push(diffIdx);
            // סמן עיגול ירוק בשני הצדדים
            pair.forEach(a => this.drawCircle(a));
            this.playSound('success');
            if (this.found.length === diffs.length) {
              document.getElementById('diff-feedback').textContent = 'כל הכבוד!';
              document.getElementById('diff-feedback').style.color = '#43a047';
              this.nextStageButton();
            }
          }
        };
        board.appendChild(btn);
      });
    });
    // לחיצה על אזור לא נכון
    img.onclick = (e) => {
      const rect = img.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      // כלי עזר: Shift+Click מציג קואורדינטות, עיגול עזר גריר ומתוח
      if (e.shiftKey) {
        // הסר עיגול עזר קודם אם קיים
        const old = document.getElementById('debug-circle');
        if (old) old.remove();
        const overlay = document.getElementById('diff-overlay');
        // צור עיגול עזר
        const debugCircle = document.createElement('div');
        debugCircle.id = 'debug-circle';
        debugCircle.style.position = 'absolute';
        debugCircle.style.left = (x * 100) + '%';
        debugCircle.style.top = (y * 100) + '%';
        debugCircle.style.width = '12%';
        debugCircle.style.height = '12%';
        debugCircle.style.transform = 'translate(-50%,-50%)';
        debugCircle.style.borderRadius = '50%';
        debugCircle.style.border = '3px solid red';
        debugCircle.style.pointerEvents = 'auto';
        debugCircle.style.zIndex = '20';
        debugCircle.style.boxShadow = '0 0 8px red';
        debugCircle.style.background = 'rgba(255,0,0,0.07)';
        debugCircle.style.display = 'flex';
        debugCircle.style.alignItems = 'center';
        debugCircle.style.justifyContent = 'center';
        debugCircle.style.userSelect = 'none';
        // הודעה עם קואורדינטות
        const label = document.createElement('div');
        label.id = 'debug-coords-label';
        label.style.position = 'absolute';
        label.style.top = '-28px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
        label.style.background = '#fff';
        label.style.color = 'red';
        label.style.fontWeight = 'bold';
        label.style.fontSize = '15px';
        label.style.padding = '2px 8px';
        label.style.borderRadius = '8px';
        label.style.boxShadow = '0 2px 8px #0002';
        label.style.pointerEvents = 'none';
        label.textContent = `left: ${x.toFixed(3)}, top: ${y.toFixed(3)}, r: ${(parseFloat(debugCircle.style.width)/100).toFixed(3)}`;
        debugCircle.appendChild(label);
        // ידיות מתיחה (4 פינות)
        const handles = ['nw','ne','sw','se'];
        handles.forEach(dir => {
          const h = document.createElement('div');
          h.className = 'debug-resize-handle';
          h.dataset.dir = dir;
          h.style.position = 'absolute';
          h.style.width = '16px';
          h.style.height = '16px';
          h.style.background = '#fff';
          h.style.border = '2px solid red';
          h.style.borderRadius = '50%';
          h.style.zIndex = '30';
          h.style.cursor = dir+'-resize';
          if (dir.includes('n')) h.style.top = '-8px'; else h.style.bottom = '-8px';
          if (dir.includes('w')) h.style.left = '-8px'; else h.style.right = '-8px';
          debugCircle.appendChild(h);
        });
        // גרירה
        let drag = false, startX, startY, startLeft, startTop;
        debugCircle.onpointerdown = ev => {
          if (ev.target.classList.contains('debug-resize-handle')) return;
          drag = true;
          startX = ev.clientX;
          startY = ev.clientY;
          startLeft = parseFloat(debugCircle.style.left);
          startTop = parseFloat(debugCircle.style.top);
          debugCircle.setPointerCapture(ev.pointerId);
        };
        debugCircle.onpointermove = ev => {
          if (drag) {
            const dx = (ev.clientX - startX) / rect.width * 100;
            const dy = (ev.clientY - startY) / rect.height * 100;
            debugCircle.style.left = (startLeft + dx) + '%';
            debugCircle.style.top = (startTop + dy) + '%';
            // עדכן קואורדינטות
            const lx = (parseFloat(debugCircle.style.left)/100).toFixed(3);
            const ly = (parseFloat(debugCircle.style.top)/100).toFixed(3);
            const r = (parseFloat(debugCircle.style.width)/100).toFixed(3);
            label.textContent = `left: ${lx}, top: ${ly}, r: ${r}`;
          }
        };
        debugCircle.onpointerup = () => { drag = false; };
        // מתיחה
        let resize = false, resizeDir, startW, startH;
        debugCircle.querySelectorAll('.debug-resize-handle').forEach(h => {
          h.onpointerdown = ev => {
            ev.stopPropagation();
            resize = true;
            resizeDir = h.dataset.dir;
            startX = ev.clientX;
            startY = ev.clientY;
            startW = parseFloat(debugCircle.style.width);
            startH = parseFloat(debugCircle.style.height);
            debugCircle.setPointerCapture(ev.pointerId);
          };
        });
        debugCircle.onpointermove = ev => {
          if (resize) {
            let dw = (ev.clientX - startX) / rect.width * 100;
            let dh = (ev.clientY - startY) / rect.height * 100;
            if (resizeDir.includes('w')) dw = -dw;
            if (resizeDir.includes('n')) dh = -dh;
            let newW = Math.max(4, startW + dw);
            let newH = Math.max(4, startH + dh);
            // שמור עיגול
            debugCircle.style.width = newW + '%';
            debugCircle.style.height = newH + '%';
            // עדכן קואורדינטות
            const lx = (parseFloat(debugCircle.style.left)/100).toFixed(3);
            const ly = (parseFloat(debugCircle.style.top)/100).toFixed(3);
            const r = (parseFloat(debugCircle.style.width)/100).toFixed(3);
            label.textContent = `left: ${lx}, top: ${ly}, r: ${r}`;
          }
        };
        debugCircle.onpointerup = () => { resize = false; drag = false; };
        overlay.appendChild(debugCircle);
        return;
      }
      // בדוק אם נלחץ על אחד האזורים
      let hit = false;
      for (let pair of diffs) {
        for (let a of pair) {
          const dx = x - a.left;
          const dy = y - a.top;
          if (Math.sqrt(dx*dx + dy*dy) < a.r) {
            hit = true;
            break;
          }
        }
        if (hit) break;
      }
      if (!hit) {
        document.getElementById('diff-feedback').textContent = 'נסה שוב!';
        document.getElementById('diff-feedback').style.color = '#e53935';
        this.playSound('wrong');
      }
    };
    // צייר עיגולים על ההבדלים שנמצאו
    this.found.forEach(diffIdx => diffs[diffIdx].forEach(a => this.drawCircle(a)));
    document.getElementById('diff-feedback').textContent = '';
    document.getElementById('diff-next-stage').style.display = 'none';
  },
  drawCircle(area) {
    const overlay = document.getElementById('diff-overlay');
    if (!overlay) return;
    const circle = document.createElement('div');
    circle.style.position = 'absolute';
    circle.style.left = (area.left * 100) + '%';
    circle.style.top = (area.top * 100) + '%';
    circle.style.width = (area.r * 2 * 100) + '%';
    circle.style.height = (area.r * 2 * 100) + '%';
    circle.style.transform = 'translate(-50%,-50%)';
    circle.style.borderRadius = '50%';
    circle.style.border = '4px solid #43a047';
    circle.style.boxShadow = '0 0 16px #43a04788';
    circle.style.pointerEvents = 'none';
    overlay.appendChild(circle);
  },
  nextStageButton() {
    const btn = document.getElementById('diff-next-stage');
    btn.style.display = 'inline-block';
    btn.onclick = () => {
      this.stage++;
      if (this.stage < this.totalStages) {
        this.found = [];
        this.renderGame();
      } else {
        document.querySelector('.game-modal-body').innerHTML = '<h3>סיימת את כל השלבים! כל הכבוד!</h3>';
      }
    };
  }
}; 