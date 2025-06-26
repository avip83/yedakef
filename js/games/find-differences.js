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
    // תיבת קואורדינטות בפינה העליונה של הלוח
    let coordsBox = document.getElementById('debug-coords-box');
    if (!coordsBox) {
      coordsBox = document.createElement('div');
      coordsBox.id = 'debug-coords-box';
      coordsBox.style.position = 'absolute';
      coordsBox.style.top = '8px';
      coordsBox.style.left = '8px';
      coordsBox.style.background = '#fff';
      coordsBox.style.color = 'red';
      coordsBox.style.fontWeight = 'bold';
      coordsBox.style.fontSize = '15px';
      coordsBox.style.padding = '4px 12px';
      coordsBox.style.borderRadius = '10px';
      coordsBox.style.boxShadow = '0 2px 8px #0002';
      coordsBox.style.pointerEvents = 'auto';
      coordsBox.style.zIndex = '300';
      coordsBox.style.display = 'none';
      // כפתור העתקה
      const copyBtn = document.createElement('button');
      copyBtn.textContent = '📋';
      copyBtn.title = 'העתק נתונים';
      copyBtn.style.marginRight = '8px';
      copyBtn.style.background = '#fff';
      copyBtn.style.color = 'red';
      copyBtn.style.border = '1px solid #d32f2f';
      copyBtn.style.borderRadius = '6px';
      copyBtn.style.cursor = 'pointer';
      copyBtn.style.fontSize = '15px';
      copyBtn.style.padding = '2px 6px';
      copyBtn.style.verticalAlign = 'middle';
      copyBtn.onclick = function(e) {
        e.stopPropagation();
        const text = coordsBox.textContent;
        navigator.clipboard.writeText(text);
        copyBtn.textContent = '✔️';
        setTimeout(() => { copyBtn.textContent = '📋'; }, 900);
      };
      coordsBox.appendChild(copyBtn);
      // תוכן הנתונים
      const coordsText = document.createElement('span');
      coordsText.id = 'debug-coords-text';
      coordsBox.appendChild(coordsText);
      board.appendChild(coordsBox);
    }
    // כפתור כלי עזר - מעל המשפט הכתום
    let debugMode = false;
    const debugBtn = document.createElement('button');
    debugBtn.textContent = 'הפעל כלי עזר';
    debugBtn.style.margin = '0 auto 12px auto';
    debugBtn.style.display = 'block';
    debugBtn.style.background = '#fffbe9';
    debugBtn.style.color = '#d32f2f';
    debugBtn.style.fontWeight = 'bold';
    debugBtn.style.fontSize = '1.1rem';
    debugBtn.style.padding = '6px 18px';
    debugBtn.style.borderRadius = '12px';
    debugBtn.style.border = '2px solid #d32f2f';
    debugBtn.style.cursor = 'pointer';
    debugBtn.style.zIndex = '100';
    // הוסף את הכפתור לפני המשפט הכתום
    const modalBody = document.querySelector('.game-modal-body');
    if (modalBody) {
      modalBody.insertBefore(debugBtn, modalBody.firstChild);
    }
    debugBtn.onclick = () => {
      debugMode = !debugMode;
      debugBtn.textContent = debugMode ? 'כבה כלי עזר' : 'הפעל כלי עזר';
      if (!debugMode) {
        // כיבוי: הסר עיגולים ותיבת קואורדינטות
        document.querySelectorAll('.debug-circle').forEach(c => c.remove());
        coordsBox.style.display = 'none';
      }
    };
    // פונקציה ליצירת עיגול עזר
    function createDebugCircle(leftP, topP, sizeP) {
      coordsBox.style.display = 'block';
      const debugCircle = document.createElement('div');
      debugCircle.className = 'debug-circle';
      debugCircle.style.position = 'absolute';
      debugCircle.style.left = (leftP || 30) + '%';
      debugCircle.style.top = (topP || 30) + '%';
      const size = sizeP || 10;
      debugCircle.style.width = size + '%';
      debugCircle.style.height = size + '%';
      debugCircle.style.transform = 'translate(-50%,-50%)';
      debugCircle.style.borderRadius = '50%';
      debugCircle.style.border = '3px solid red';
      debugCircle.style.pointerEvents = 'auto';
      debugCircle.style.zIndex = '200';
      debugCircle.style.boxShadow = '0 0 8px red';
      debugCircle.style.background = 'rgba(255,0,0,0.07)';
      debugCircle.style.display = 'flex';
      debugCircle.style.alignItems = 'center';
      debugCircle.style.justifyContent = 'center';
      debugCircle.style.userSelect = 'none';
      debugCircle.style.minWidth = '2%';
      debugCircle.style.minHeight = '2%';
      // כפתור סגירה
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✖';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '-18px';
      closeBtn.style.right = '-18px';
      closeBtn.style.background = '#fff';
      closeBtn.style.color = 'red';
      closeBtn.style.border = '2px solid red';
      closeBtn.style.borderRadius = '50%';
      closeBtn.style.width = '28px';
      closeBtn.style.height = '28px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.fontWeight = 'bold';
      closeBtn.onclick = (ev) => { ev.stopPropagation(); debugCircle.remove(); if (!document.querySelector('.debug-circle')) coordsBox.style.display = 'none'; };
      debugCircle.appendChild(closeBtn);
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
      // עדכון קואורדינטות
      function updateLabel() {
        const lx = (parseFloat(debugCircle.style.left)/100).toFixed(3);
        const ly = (parseFloat(debugCircle.style.top)/100).toFixed(3);
        const r = (parseFloat(debugCircle.style.width)/100).toFixed(3);
        document.getElementById('debug-coords-text').textContent = `left: ${lx}, top: ${ly}, r: ${r}`;
      }
      // גרירה
      let drag = false, startX, startY, startLeft, startTop;
      debugCircle.addEventListener('pointerdown', ev => {
        if (ev.target.classList.contains('debug-resize-handle') || ev.target === closeBtn) {
          debugCircle.focus();
          return;
        }
        drag = true;
        startX = ev.clientX;
        startY = ev.clientY;
        startLeft = parseFloat(debugCircle.style.left);
        startTop = parseFloat(debugCircle.style.top);
        debugCircle.setPointerCapture(ev.pointerId);
        updateLabel();
      });
      debugCircle.addEventListener('pointermove', ev => {
        if (drag) {
          const imgRect = img.getBoundingClientRect();
          const dx = (ev.clientX - startX) / imgRect.width * 100;
          const dy = (ev.clientY - startY) / imgRect.height * 100;
          debugCircle.style.left = (startLeft + dx) + '%';
          debugCircle.style.top = (startTop + dy) + '%';
          updateLabel();
        }
      });
      debugCircle.addEventListener('pointerup', () => { drag = false; });
      // מתיחה (רק עיגול מושלם)
      let resize = false, resizeDir, startSize;
      debugCircle.querySelectorAll('.debug-resize-handle').forEach(h => {
        h.addEventListener('pointerdown', ev => {
          ev.stopPropagation();
          resize = true;
          resizeDir = h.dataset.dir;
          startX = ev.clientX;
          startY = ev.clientY;
          startSize = parseFloat(debugCircle.style.width);
          debugCircle.setPointerCapture(ev.pointerId);
          updateLabel();
        });
      });
      debugCircle.addEventListener('pointermove', ev => {
        if (resize) {
          const imgRect = img.getBoundingClientRect();
          let d = Math.max(
            (ev.clientX - startX) / imgRect.width * 100,
            (ev.clientY - startY) / imgRect.height * 100
          );
          if (resizeDir === 'nw' || resizeDir === 'sw' || resizeDir === 'ne' || resizeDir === 'se') {
            if (resizeDir.includes('w') || resizeDir.includes('n')) d = -d;
          }
          let newSize = Math.max(2, startSize + d);
          debugCircle.style.width = newSize + '%';
          debugCircle.style.height = newSize + '%';
          updateLabel();
        }
      });
      debugCircle.addEventListener('pointerup', () => { resize = false; drag = false; });
      // בלחיצה על עיגול – הצג את ערכיו
      debugCircle.onclick = (ev) => {
        if (ev.target.classList.contains('debug-resize-handle') || ev.target === closeBtn) return;
        updateLabel();
      };
      updateLabel();
      board.appendChild(debugCircle);
    }
    // Shift+Click יוצר עיגול עזר נוסף במיקום הלחיצה (רק אם debugMode פעיל)
    img.addEventListener('click', function(ev) {
      if (debugMode && ev.shiftKey) {
        const rect = img.getBoundingClientRect();
        const x = (ev.clientX - rect.left) / rect.width * 100;
        const y = (ev.clientY - rect.top) / rect.height * 100;
        createDebugCircle(x, y, 10);
      }
    });
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
          // אם Shift לחוץ – אל תעשה כלום (כלי עזר פעיל)
          if (e.shiftKey) return;
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
        // צור overlay אם לא קיים
        let overlay = document.getElementById('diff-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'diff-overlay';
          overlay.style.position = 'absolute';
          overlay.style.left = '0';
          overlay.style.top = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.pointerEvents = 'auto';
          overlay.style.zIndex = '2';
          img.parentElement.appendChild(overlay);
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