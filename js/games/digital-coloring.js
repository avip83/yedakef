// משחק צביעה דיגיטלית פשוט - מבוסס על HTML5-Easy-Paint
class DigitalColoringGame {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.started = false;
        this.stampId = '';
        this.lastColor = 'red';
        this.lastStampId = '';
        this.isDrawing = false;
        
        // צבעים זמינים
        this.colors = [
            { id: 'red', name: 'אדום', color: 'red' },
            { id: 'pink', name: 'ורוד', color: 'pink' },
            { id: 'orange', name: 'כתום', color: 'orange' },
            { id: 'yellow', name: 'צהוב', color: 'yellow' },
            { id: 'lime', name: 'ירוק בהיר', color: 'lime' },
            { id: 'green', name: 'ירוק', color: 'green' },
            { id: 'blue', name: 'כחול', color: 'blue' },
            { id: 'purple', name: 'סגול', color: 'purple' },
            { id: 'black', name: 'שחור', color: 'black' },
            { id: 'white', name: 'לבן', color: 'white' }
        ];
        
        // חותמות זמינות
        this.stamps = [
            { id: 'cat', name: 'חתול', src: 'coloring-images/cat.png' },
            { id: 'dog', name: 'כלב', src: 'coloring-images/dog.png' },
            { id: 'heart', name: 'לב', src: 'coloring-images/heart.png' },
            { id: 'fly', name: 'זבוב', src: 'coloring-images/fly.png' },
            { id: 'bug', name: 'חיפושית', src: 'coloring-images/bug.png' }
        ];
        
        this.sounds = {
            success: 'sounds/success-340660 (mp3cut.net).mp3',
            click: 'sounds/click-tap-computer-mouse-352734.mp3',
            complete: 'sounds/game-level-complete-143022.mp3'
        };
    }

    init() {
        this.showModal();
        this.playSound('click');
    }

    showModal() {
        window.scrollTo({top: 0, behavior: "auto"});
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = `
            <div class="game-modal-content" style="max-width: 95vw; max-height: 95vh; width: auto; height: auto;">
                <div class="game-modal-header">
                    <h2>🎨 צביעה דיגיטלית</h2>
                    <button class="close-modal" onclick="this.closest('.game-modal').remove()">×</button>
                </div>
                <div class="game-modal-body" style="display: flex; justify-content: center; align-items: flex-start; padding: 20px; gap: 20px; flex-wrap: wrap;">
                    
                    <!-- פלטת כלים -->
                    <div class="paint-toolbar" style="display: flex; flex-direction: column; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: 2px solid #333; border-radius: 15px; padding: 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                        
                        <!-- צבעים -->
                        <div class="colors-section" style="margin-bottom: 15px;">
                            <h3 style="color: white; text-align: center; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">צבעים</h3>
                            <div class="colors-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
                                ${this.colors.map(color => `
                                    <div class="color-btn ${color.id === 'red' ? 'active' : ''}" 
                                         data-color="${color.id}" 
                                         style="background: ${color.color}; width: 50px; height: 50px; cursor: pointer; border-radius: 8px; border: 2px solid ${color.id === 'red' ? 'white' : 'transparent'}; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"
                                         title="${color.name}">
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <hr style="border: 1px solid rgba(255,255,255,0.3); margin: 10px 0;">

                        <!-- כלים -->
                        <div class="tools-section" style="margin-bottom: 15px;">
                            <h3 style="color: white; text-align: center; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">כלים</h3>
                            <div class="tools-grid" style="display: flex; flex-direction: column; gap: 8px;">
                                <button class="tool-btn" data-tool="fill" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;">
                                    🪣 מלא רקע
                                </button>
                                <button class="tool-btn" data-tool="save" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;">
                                    💾 שמור
                                </button>
                                <button class="tool-btn" data-tool="clear" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;">
                                    🗑️ נקה
                                </button>
                            </div>
                        </div>

                        <hr style="border: 1px solid rgba(255,255,255,0.3); margin: 10px 0;">

                        <!-- חותמות -->
                        <div class="stamps-section">
                            <h3 style="color: white; text-align: center; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">חותמות</h3>
                            <div class="stamps-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
                                ${this.stamps.map(stamp => `
                                    <div class="stamp-btn" 
                                         data-stamp="${stamp.id}" 
                                         style="width: 50px; height: 50px; cursor: pointer; border-radius: 8px; border: 2px solid transparent; transition: all 0.3s ease; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; overflow: hidden;"
                                         title="${stamp.name}">
                                        <img src="${stamp.src}" style="width: 40px; height: 40px; object-fit: contain;" alt="${stamp.name}">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- אזור הציור -->
                    <div class="canvas-container" style="position: relative; border: 3px solid #333; border-radius: 15px; overflow: hidden; background: white; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                        <canvas id="paintCanvas" width="600" height="400" style="display: block; cursor: crosshair; background: white;"></canvas>
                        <div class="canvas-info" style="position: absolute; bottom: 5px; left: 5px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-family: monospace;">
                            <span id="mousePosition">0, 0</span>
                        </div>
                    </div>
                </div>

                <div class="instructions" style="text-align: center; padding: 20px; background: rgba(255,255,255,0.1); margin: 20px; border-radius: 15px; color: #333;">
                    <h3 style="margin-bottom: 10px;">🎨 איך לשחק?</h3>
                    <p style="margin: 5px 0;">✨ בחר צבע ועבור עם העכבר על הקנבס כדי לצבוע</p>
                    <p style="margin: 5px 0;">🪣 לחץ על "מלא רקע" כדי למלא את כל הקנבס בצבע הנבחר</p>
                    <p style="margin: 5px 0;">🖼️ בחר חותמת ולחץ על הקנבס כדי להדביק אותה</p>
                    <p style="margin: 5px 0;">💾 לחץ על "שמור" כדי להוריד את היצירה שלך</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas = document.getElementById('paintCanvas');
        this.context = this.canvas.getContext('2d');
        
        // הגדרות ציור ברירת מחדל
        this.context.strokeStyle = 'red';
        this.context.lineWidth = 3;
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
    }

    setupEventListeners() {
        // אירועי ציור על הקנבס
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('click', this.onClick.bind(this));
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));

        // תמיכה במגע
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouch.bind(this));

        // בחירת צבעים
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.onColorClick(e.target.dataset.color);
                this.playSound('click');
            });
            
            // אפקטי hover
            btn.addEventListener('mouseenter', (e) => {
                if (!e.target.classList.contains('active')) {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
                }
            });
            
            btn.addEventListener('mouseleave', (e) => {
                if (!e.target.classList.contains('active')) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                }
            });
        });

        // כלים
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.target.dataset.tool;
                this.onToolClick(tool);
                this.playSound('click');
            });
            
            // אפקטי hover
            btn.addEventListener('mouseenter', (e) => {
                e.target.style.background = 'rgba(255,255,255,0.4)';
                e.target.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', (e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
            });
        });

        // חותמות
        document.querySelectorAll('.stamp-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.onStampClick(e.currentTarget.dataset.stamp);
                this.playSound('click');
            });
            
            // אפקטי hover
            btn.addEventListener('mouseenter', (e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'scale(1.1)';
            });
            
            btn.addEventListener('mouseleave', (e) => {
                if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                }
            });
        });
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0] || e.changedTouches[0];
        const mouseEvent = new MouseEvent(e.type.replace('touch', 'mouse').replace('start', 'down').replace('end', 'up'), {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        
        // עדכון מיקום העכבר
        const positionElement = document.getElementById('mousePosition');
        if (positionElement) {
            positionElement.textContent = `${x}, ${y}`;
        }
        
        // ציור רק אם לא נבחרה חותמת
        if (this.stampId.length === 0) {
            if (!this.started) {
                this.started = true;
                this.context.beginPath();
                this.context.moveTo(x, y);
            } else if (this.isDrawing) {
                this.context.lineTo(x, y);
                this.context.stroke();
            }
        }
    }

    onMouseDown(e) {
        this.isDrawing = true;
        this.started = false;
    }

    onMouseUp(e) {
        if (this.isDrawing) {
            this.context.closePath();
            this.isDrawing = false;
            this.started = false;
        }
    }

    onMouseLeave(e) {
        this.context.beginPath();
        this.isDrawing = false;
        this.started = false;
    }

    onClick(e) {
        if (this.stampId.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const stampImg = document.querySelector(`[data-stamp="${this.stampId}"] img`);
            if (stampImg) {
                const img = new Image();
                img.onload = () => {
                    this.context.drawImage(img, x - 40, y - 40, 80, 80);
                };
                img.src = stampImg.src;
            }
            this.playSound('success');
        }
    }

    onColorClick(colorId) {
        // עדכון הצבע הפעיל
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.border = '2px solid transparent';
            btn.style.transform = 'scale(1)';
        });
        
        const selectedBtn = document.querySelector(`[data-color="${colorId}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
            selectedBtn.style.border = '2px solid white';
            selectedBtn.style.transform = 'scale(1.2)';
        }
        
        // התחלת מסלול חדש עם הצבע החדש
        this.context.closePath();
        this.context.beginPath();
        this.context.strokeStyle = colorId;
        
        // ביטול בחירת חותמת
        this.clearStampSelection();
        
        this.lastColor = colorId;
    }

    onToolClick(tool) {
        switch (tool) {
            case 'fill':
                this.fillCanvas();
                break;
            case 'save':
                this.saveCanvas();
                break;
            case 'clear':
                this.clearCanvas();
                break;
        }
    }

    onStampClick(stampId) {
        // ביטול בחירת חותמת קודמת
        this.clearStampSelection();
        
        if (this.stampId === stampId) {
            // אם לחצו על אותה חותמת - בטל בחירה
            this.stampId = '';
            this.canvas.style.cursor = 'crosshair';
        } else {
            // בחירת חותמת חדשה
            this.stampId = stampId;
            this.canvas.style.cursor = 'pointer';
            
            const selectedBtn = document.querySelector(`[data-stamp="${stampId}"]`);
            if (selectedBtn) {
                selectedBtn.classList.add('active');
                selectedBtn.style.border = '2px solid white';
                selectedBtn.style.background = 'rgba(255,255,255,0.4)';
            }
        }
        
        this.lastStampId = stampId;
    }

    clearStampSelection() {
        document.querySelectorAll('.stamp-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.border = '2px solid transparent';
            btn.style.background = 'rgba(255,255,255,0.1)';
        });
        this.stampId = '';
        this.canvas.style.cursor = 'crosshair';
    }

    fillCanvas() {
        this.context.closePath();
        this.context.beginPath();
        this.context.fillStyle = this.context.strokeStyle;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.playSound('success');
    }

    saveCanvas() {
        const link = document.createElement('a');
        link.download = `painting-${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
        this.playSound('complete');
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.started = false;
        this.isDrawing = false;
        this.playSound('click');
    }

    playSound(soundType) {
        try {
            if (this.sounds[soundType]) {
                const audio = new Audio(this.sounds[soundType]);
                audio.volume = 0.3;
                audio.play().catch(() => {});
            }
        } catch (error) {
            console.log('Could not play sound:', error);
        }
    }
}

// Global function to start the game
function startDigitalColoring() {
    const game = new DigitalColoringGame();
    game.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DigitalColoringGame;
}

// Register the game globally
window['digital-coloring'] = {
    init: startDigitalColoring
};