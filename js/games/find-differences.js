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
    // תיבת קואורדינטות מוצגת מעל התמונה (מחוץ ללוח)
    let coordsBox = document.getElementById('debug-coords-box');
    if (!coordsBox) {
      coordsBox = document.createElement('div');
      coordsBox.id = 'debug-coords-box';
      coordsBox.style.position = 'fixed';
      coordsBox.style.top = '16px';
      coordsBox.style.left = '50%';
      coordsBox.style.transform = 'translateX(-50%)';
      coordsBox.style.background = '#fff';
      coordsBox.style.color = 'red';
      coordsBox.style.fontWeight = 'bold';
      coordsBox.style.fontSize = '15px';
      coordsBox.style.padding = '4px 12px';
      coordsBox.style.borderRadius = '10px';
      coordsBox.style.boxShadow = '0 2px 8px #0002';
      coordsBox.style.pointerEvents = 'auto';
      coordsBox.style.zIndex = '9999';
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
        const text = Array.from(coordsBox.querySelectorAll('.debug-coords-text')).map(el => el.textContent).join('\n');
        navigator.clipboard.writeText(text);
        copyBtn.textContent = '✔️';
        setTimeout(() => { copyBtn.textContent = '📋'; }, 900);
      };
      coordsBox.appendChild(copyBtn);
      // אזור לשורות נתונים
      const coordsList = document.createElement('div');
      coordsList.id = 'debug-coords-list';
      coordsBox.appendChild(coordsList);
      document.body.appendChild(coordsBox);
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
    // פונקציה ליצירת זוג עיגולים מקושרים
    function createLinkedDebugCircles(leftP, topP, widthP, heightP) {
      coordsBox.style.display = 'block';
      // צור שני עיגולים
      const circles = [];
      // left side
      circles.push(createDebugCircle({
        left: (leftP || 30) / 2,
        top: topP || 30,
        w: (widthP || 10) / 2,
        h: heightP || 10
      }, 0));
      // right side
      circles.push(createDebugCircle({
        left: 0.5 + (leftP || 30) / 2,
        top: topP || 30,
        w: (widthP || 10) / 2,
        h: heightP || 10
      }, 1));
      // קישור בין העיגולים
      circles.forEach((c, idx) => {
        c.onclick = (ev) => {
          if (ev.target.classList.contains('debug-resize-handle') || ev.target.classList.contains('close-btn')) return;
          // מחק סימון קודם
          document.querySelectorAll('.debug-circle.selected').forEach(c2 => c2.classList.remove('selected'));
          circles.forEach(c2 => c2.classList.add('selected'));
          updateCoordsBox();
        };
      });
      // עדכן תיבת קואורדינטות
      updateCoordsBox();
    }
    // פונקציה ליצירת עיגול בודד (בשימוש פנימי בלבד)
    function createDebugCircle(area, side) {
      // ודא שה-board קיים
      let board = document.getElementById('diff-board');
      if (!board) {
        board = document.querySelector('#diff-board');
        if (!board) {
          console.error('לא נמצא board עבור עיגול עזר');
          return null;
        }
      }
      const debugCircle = document.createElement('div');
      debugCircle.className = 'debug-circle';
      debugCircle.style.position = 'absolute';
      debugCircle.style.left = (area.left) * 100 + '%';
      debugCircle.style.top = (area.top) * 100 + '%';
      debugCircle.style.width = (area.w) * 100 + '%';
      debugCircle.style.height = (area.h) * 100 + '%';
      debugCircle.style.transform = 'translate(-50%,-50%)';
      debugCircle.style.borderRadius = '50%';
      debugCircle.style.border = '3px solid red';
      debugCircle.style.pointerEvents = 'auto';
      debugCircle.style.zIndex = '200';
      debugCircle.style.boxShadow = '0 0 8px red';
      debugCircle.style.background = 'rgba(255,0,0,0.15)'; // יותר בולט
      debugCircle.style.display = 'flex';
      debugCircle.style.alignItems = 'center';
      debugCircle.style.justifyContent = 'center';
      debugCircle.style.userSelect = 'none';
      debugCircle.style.minWidth = '2%';
      debugCircle.style.minHeight = '2%';
      // כפתור סגירה
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✖';
      closeBtn.className = 'close-btn';
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
      closeBtn.onclick = (ev) => { ev.stopPropagation(); debugCircle.remove(); updateCoordsBox(); };
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
      // גרירה
      let drag = false, startX, startY, startLeft, startTop;
      debugCircle.addEventListener('pointerdown', ev => {
        if (ev.target.classList.contains('debug-resize-handle') || ev.target.classList.contains('close-btn')) {
          debugCircle.focus();
          return;
        }
        drag = true;
        startX = ev.clientX;
        startY = ev.clientY;
        startLeft = parseFloat(debugCircle.style.left);
        startTop = parseFloat(debugCircle.style.top);
        debugCircle.setPointerCapture(ev.pointerId);
      });
      debugCircle.addEventListener('pointermove', ev => {
        if (drag) {
          const imgRect = img.getBoundingClientRect();
          const dx = (ev.clientX - startX) / imgRect.width * 100;
          const dy = (ev.clientY - startY) / imgRect.height * 100;
          debugCircle.style.left = (startLeft + dx) + '%';
          debugCircle.style.top = (startTop + dy) + '%';
          updateCoordsBox();
        }
      });
      debugCircle.addEventListener('pointerup', () => { drag = false; });
      // מתיחה (אליפסה)
      let resize = false, resizeDir, startW, startH;
      debugCircle.querySelectorAll('.debug-resize-handle').forEach(h => {
        h.addEventListener('pointerdown', ev => {
          ev.stopPropagation();
          resize = true;
          resizeDir = h.dataset.dir;
          startX = ev.clientX;
          startY = ev.clientY;
          startW = parseFloat(debugCircle.style.width);
          startH = parseFloat(debugCircle.style.height);
          debugCircle.setPointerCapture(ev.pointerId);
        });
      });
      debugCircle.addEventListener('pointermove', ev => {
        if (resize) {
          const imgRect = img.getBoundingClientRect();
          let dw = (ev.clientX - startX) / imgRect.width * 100;
          let dh = (ev.clientY - startY) / imgRect.height * 100;
          if (resizeDir.includes('w')) dw = -dw;
          if (resizeDir.includes('n')) dh = -dh;
          let newW = Math.max(2, startW + dw);
          let newH = Math.max(2, startH + dh);
          debugCircle.style.width = newW + '%';
          debugCircle.style.height = newH + '%';
          updateCoordsBox();
        }
      });
      debugCircle.addEventListener('pointerup', () => { resize = false; drag = false; });
      board.appendChild(debugCircle);
      console.log('נוצר עיגול עזר', debugCircle.style.left, debugCircle.style.top, debugCircle.style.width, debugCircle.style.height);
      return debugCircle;
    }
    // עדכון תיבת קואורדינטות: מציג את כל העיגולים הקיימים
    function updateCoordsBox() {
      const list = document.getElementById('debug-coords-list');
      if (!list) return;
      list.innerHTML = '';
      document.querySelectorAll('.debug-circle').forEach(c => {
        const lx = (parseFloat(c.style.left)/100).toFixed(3);
        const ly = (parseFloat(c.style.top)/100).toFixed(3);
        const w = (parseFloat(c.style.width)/100).toFixed(3);
        const h = (parseFloat(c.style.height)/100).toFixed(3);
        const row = document.createElement('div');
        row.className = 'debug-coords-text';
        row.textContent = `left: ${lx}, top: ${ly}, w: ${w}, h: ${h}`;
        list.appendChild(row);
      });
      coordsBox.style.display = document.querySelectorAll('.debug-circle').length ? 'block' : 'none';
    }
    // Shift+Click יוצר זוג עיגולים מקושרים במיקום הלחיצה (רק אם debugMode פעיל)
    img.addEventListener('click', function(ev) {
      if (debugMode && ev.shiftKey) {
        const rect = img.getBoundingClientRect();
        const x = (ev.clientX - rect.left) / rect.width * 100;
        const y = (ev.clientY - rect.top) / rect.height * 100;
        createLinkedDebugCircles(x, y, 10, 10);
      }
    });
    board.appendChild(img);
    // הגדר הבדלים: כל הבדל הוא זוג אזורים (ימין/שמאל) עם קואורדינטות מדויקות
    // left: 0 (שמאל קיצון), 1 (ימין קיצון)
    // צד שמאל: left יחסי ל-0 עד 0.5, צד ימין: left יחסי ל-0.5 עד 1
    // כל עיגול: {left, top, w, h} (left/top/w/h יחסיים)
    // ערכים מעודכנים לפי כלי העזר
    const diffs = [
      // 1
      [ {left: 0.140, top: 0.257, w: 0.062, h: 0.086}, {left: 0.650, top: 0.196, w: 0.074, h: 0.107} ],
      // 2
      [ {left: 0.867, top: 0.418, w: 0.088, h: 0.204}, {left: 0.867, top: 0.418, w: 0.088, h: 0.204} ],
      // 3
      [ {left: 0.729, top: 0.904, w: 0.217, h: 0.096}, {left: 0.729, top: 0.904, w: 0.217, h: 0.096} ],
      // 4
      [ {left: 0.650, top: 0.196, w: 0.074, h: 0.107}, {left: 0.140, top: 0.257, w: 0.062, h: 0.086} ]
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
    // מיפוי קואורדינטות לכל צד
    function mapArea(area, side) {
      // side: 0 = שמאל, 1 = ימין
      return {
        left: side === 0 ? area.left / 2 : 0.5 + area.left / 2,
        top: area.top,
        w: area.w / 2,
        h: area.h
      };
    }
    diffs.forEach((pair, diffIdx) => {
      pair.forEach((area, sideIdx) => {
        const mapped = mapArea(area, sideIdx);
        const btn = document.createElement('div');
        btn.style.position = 'absolute';
        btn.style.left = (mapped.left * 100) + '%';
        btn.style.top = (mapped.top * 100) + '%';
        btn.style.width = (mapped.w * 100) + '%';
        btn.style.height = (mapped.h * 100) + '%';
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
            pair.forEach((a, s) => this.drawCircle(mapArea(a, s)));
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
            if (Math.sqrt(dx*dx + dy*dy) < a.w) {
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
    circle.style.width = (area.w * 100) + '%';
    circle.style.height = (area.h * 100) + '%';
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