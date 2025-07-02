// משחק צביעה מתקדם עם דלי צבע - מבוסס על floodfill.js
class FloodFillColoringGame {
    constructor() {
        this.gameContainer = null;
        this.isInitialized = false;
        this.canvas = null;
        this.ctx = null;
        this.currentColor = '#FF6B6B';
        this.tolerance = 32;
        this.currentImageIndex = 0;
        this.sounds = {
            success: 'sounds/success-340660 (mp3cut.net).mp3',
            click: 'sounds/click-tap-computer-mouse-352734.mp3',
            complete: 'sounds/game-level-complete-143022.mp3'
        };
        
        // תמונות לצביעה
        this.coloringImages = [
            { name: 'עיגול', src: 'coloring-images/circle-outline.png' },
            { name: 'כוכב', src: 'coloring-images/star-outline.png' },
            { name: 'אסטרונאוט', src: 'coloring-images/astronaut.png' },
            { name: 'נשר', src: 'coloring-images/eagle.png' },
            { name: 'כוס', src: 'coloring-images/glass.jpg' }
        ];
        
        // פלטת צבעים עשירה
        this.colorPalette = [
            { name: 'אדום', color: '#FF6B6B' },
            { name: 'כתום', color: '#FF9F43' },
            { name: 'צהוב', color: '#FEE135' },
            { name: 'ירוק בהיר', color: '#26de81' },
            { name: 'ירוק כהה', color: '#20bf6b' },
            { name: 'תכלת', color: '#0fb9b1' },
            { name: 'כחול', color: '#45aaf2' },
            { name: 'כחול כהה', color: '#2d98da' },
            { name: 'סגול', color: '#a55eea' },
            { name: 'ורוד', color: '#fd79a8' },
            { name: 'חום', color: '#8b4513' },
            { name: 'אפור', color: '#57606f' },
            { name: 'שחור', color: '#2f3542' },
            { name: 'לבן', color: '#ffffff' },
            { name: 'זהב', color: '#f39c12' },
            { name: 'כסף', color: '#bdc3c7' }
        ];
    }

    async init() {
        if (this.isInitialized) return;
        
        this.gameContainer = document.getElementById('game-container');
        if (!this.gameContainer) {
            console.error('Game container not found');
            return;
        }

        try {
            await this.loadFloodFillLibrary();
            await this.setupHTML();
            await this.setupCanvas();
            await this.loadFirstImage();
            this.setupEventListeners();
            this.isInitialized = true;
            
            this.showMessage('🪣 ברוכים הבאים למשחק דלי הצבע!', 'success');
            this.playSound('success');
        } catch (error) {
            console.error('Error initializing Flood Fill Coloring Game:', error);
            this.showFallbackMessage();
        }
    }

    async loadFloodFillLibrary() {
        return new Promise((resolve, reject) => {
            if (typeof floodfill !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'js/floodfill.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async setupHTML() {
        this.gameContainer.innerHTML = `
            <div class="coloring-game-container">
                <div class="game-header">
                    <h2>🪣 משחק דלי הצבע</h2>
                    <div class="game-instructions">
                        <p>🖱️ לחץ על אזור כדי למלא אותו בצבע | 🎨 בחר צבע מהפלטה | 🖼️ החלף תמונות</p>
                    </div>
                </div>

                <div class="game-controls">
                    <div class="color-palette">
                        <h3>🎨 בחר צבע:</h3>
                        <div class="colors-grid">
                            ${this.colorPalette.map((color, index) => `
                                <div class="color-option ${index === 0 ? 'active' : ''}" 
                                     data-color="${color.color}" 
                                     style="background-color: ${color.color};"
                                     title="${color.name}">
                                </div>
                            `).join('')}
                        </div>
                        <div class="custom-color">
                            <label for="color-picker">צבע מותאם:</label>
                            <input type="color" id="color-picker" value="${this.currentColor}">
                        </div>
                    </div>

                    <div class="tolerance-control">
                        <h3>🎯 רגישות מילוי:</h3>
                        <div class="tolerance-slider">
                            <input type="range" id="tolerance-range" min="0" max="128" value="${this.tolerance}">
                            <span id="tolerance-value">${this.tolerance}</span>
                        </div>
                        <p class="tolerance-help">0 = דיוק מלא | 128 = מילוי רחב</p>
                    </div>

                    <div class="image-controls">
                        <h3>🖼️ תמונות לצביעה:</h3>
                        <div class="image-selector">
                            <button id="prev-image" class="nav-btn">◀ הקודמת</button>
                            <span id="current-image-name">${this.coloringImages[0].name}</span>
                            <button id="next-image" class="nav-btn">הבאה ▶</button>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button id="clear-canvas" class="action-btn clear-btn">🗑️ נקה הכל</button>
                        <button id="save-image" class="action-btn save-btn">💾 שמור</button>
                        <button id="undo-action" class="action-btn undo-btn">↶ בטל</button>
                    </div>
                </div>

                <div class="canvas-container">
                    <canvas id="coloring-canvas" width="600" height="400"></canvas>
                    <div class="canvas-overlay" id="canvas-loading">
                        <div class="loading-spinner">🎨</div>
                        <p>טוען תמונה...</p>
                    </div>
                </div>

                <div class="game-tips">
                    <h3>💡 טיפים לצביעה:</h3>
                    <ul>
                        <li>🖱️ לחץ על אזור כדי למלא אותו בצבע הנבחר</li>
                        <li>🎯 התאם את הרגישות למילוי מדויק או רחב</li>
                        <li>🎨 נסה צבעים שונים ויצור יצירות מיוחדות</li>
                        <li>💾 שמור את היצירה שלך כתמונה</li>
                        <li>↶ השתמש בביטול אם טעית</li>
                    </ul>
                </div>
            </div>
        `;
    }

    async setupCanvas() {
        this.canvas = document.getElementById('coloring-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // שמירת מצב לביטול
        this.undoStack = [];
        this.saveCanvasState();
    }

    async loadFirstImage() {
        await this.loadImage(this.currentImageIndex);
    }

    async loadImage(index) {
        const loadingOverlay = document.getElementById('canvas-loading');
        loadingOverlay.style.display = 'flex';
        
        try {
            const imageData = this.coloringImages[index];
            const img = new Image();
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageData.src;
            });
            
            // נקה את הקנבס
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // צייר את התמונה במרכז
            const scale = Math.min(
                this.canvas.width / img.width,
                this.canvas.height / img.height
            );
            
            const x = (this.canvas.width - img.width * scale) / 2;
            const y = (this.canvas.height - img.height * scale) / 2;
            
            this.ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            // עדכן שם התמונה
            document.getElementById('current-image-name').textContent = imageData.name;
            
            // שמור מצב חדש
            this.saveCanvasState();
            
            this.playSound('click');
            
        } catch (error) {
            console.error('Error loading image:', error);
            this.showMessage('❌ שגיאה בטעינת התמונה', 'error');
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    setupEventListeners() {
        // בחירת צבעים
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
                this.currentColor = e.target.dataset.color;
                document.getElementById('color-picker').value = this.currentColor;
                this.playSound('click');
            });
        });

        // בורר צבע מותאם
        document.getElementById('color-picker').addEventListener('change', (e) => {
            this.currentColor = e.target.value;
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
        });

        // רגישות מילוי
        const toleranceRange = document.getElementById('tolerance-range');
        const toleranceValue = document.getElementById('tolerance-value');
        toleranceRange.addEventListener('input', (e) => {
            this.tolerance = parseInt(e.target.value);
            toleranceValue.textContent = this.tolerance;
        });

        // ניווט תמונות
        document.getElementById('prev-image').addEventListener('click', () => {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.coloringImages.length) % this.coloringImages.length;
            this.loadImage(this.currentImageIndex);
        });

        document.getElementById('next-image').addEventListener('click', () => {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.coloringImages.length;
            this.loadImage(this.currentImageIndex);
        });

        // כפתורי פעולה
        document.getElementById('clear-canvas').addEventListener('click', () => {
            this.clearCanvas();
        });

        document.getElementById('save-image').addEventListener('click', () => {
            this.saveImage();
        });

        document.getElementById('undo-action').addEventListener('click', () => {
            this.undoLastAction();
        });

        // לחיצה על קנבס לצביעה
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        
        try {
            // שמור מצב לפני השינוי
            this.saveCanvasState();
            
            // בצע מילוי צבע
            this.ctx.fillStyle = this.currentColor;
            this.ctx.fillFlood(x, y, this.tolerance);
            
            this.playSound('success');
            this.showMessage('🎨 אזור נצבע בהצלחה!', 'success');
            
        } catch (error) {
            console.error('Error during flood fill:', error);
            this.showMessage('❌ שגיאה בצביעה', 'error');
        }
    }

    saveCanvasState() {
        if (this.undoStack.length >= 10) {
            this.undoStack.shift(); // הסר מצב ישן אם יש יותר מ-10
        }
        this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    }

    undoLastAction() {
        if (this.undoStack.length > 1) {
            this.undoStack.pop(); // הסר המצב הנוכחי
            const previousState = this.undoStack[this.undoStack.length - 1];
            this.ctx.putImageData(previousState, 0, 0);
            this.playSound('click');
            this.showMessage('↶ פעולה בוטלה', 'info');
        } else {
            this.showMessage('❌ אין פעולות לביטול', 'warning');
        }
    }

    clearCanvas() {
        if (confirm('האם אתה בטוח שתרצה לנקות את כל הצביעה?')) {
            this.loadImage(this.currentImageIndex);
            this.showMessage('🗑️ הקנבס נוקה', 'info');
        }
    }

    saveImage() {
        try {
            const link = document.createElement('a');
            link.download = `my-coloring-${this.coloringImages[this.currentImageIndex].name}-${Date.now()}.png`;
            link.href = this.canvas.toDataURL('image/png');
            link.click();
            
            this.playSound('complete');
            this.showMessage('💾 התמונה נשמרה בהצלחה!', 'success');
        } catch (error) {
            console.error('Error saving image:', error);
            this.showMessage('❌ שגיאה בשמירת התמונה', 'error');
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;

        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };

        messageDiv.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    showFallbackMessage() {
        this.gameContainer.innerHTML = `
            <div class="error-container">
                <h2>❌ שגיאה בטעינת משחק דלי הצבע</h2>
                <p>מצטערים, לא ניתן לטעון את משחק הצביעה כרגע.</p>
                <div class="fallback-options">
                    <h3>אפשרויות חלופיות:</h3>
                    <ul>
                        <li>נסה לרענן את הדף</li>
                        <li>בדוק את החיבור לאינטרנט</li>
                        <li>נסה שוב מאוחר יותר</li>
                    </ul>
                </div>
                <button onclick="location.reload()" class="retry-button">
                    🔄 נסה שוב
                </button>
            </div>
        `;
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

    destroy() {
        if (this.gameContainer) {
            this.gameContainer.innerHTML = '';
        }
        this.isInitialized = false;
    }
}

// CSS מתקדם למשחק
const floodFillCSS = `
<style>
.coloring-game-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    color: white;
}

.game-header {
    text-align: center;
    margin-bottom: 30px;
}

.game-header h2 {
    margin: 0 0 10px 0;
    font-size: 2.5em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.game-instructions {
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 10px;
    backdrop-filter: blur(10px);
}

.game-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
    background: rgba(255,255,255,0.1);
    padding: 20px;
    border-radius: 15px;
    backdrop-filter: blur(10px);
}

.color-palette h3,
.tolerance-control h3,
.image-controls h3 {
    margin: 0 0 15px 0;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.colors-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 8px;
    margin-bottom: 15px;
}

.color-option {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid transparent;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.color-option:hover {
    transform: scale(1.1);
    border-color: #fff;
}

.color-option.active {
    border-color: #FFD700;
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(255,215,0,0.5);
}

.custom-color {
    display: flex;
    align-items: center;
    gap: 10px;
}

.custom-color input[type="color"] {
    width: 50px;
    height: 35px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.tolerance-control {
    grid-column: span 2;
}

.tolerance-slider {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
}

.tolerance-slider input[type="range"] {
    flex: 1;
    height: 8px;
    border-radius: 5px;
    background: rgba(255,255,255,0.3);
    outline: none;
}

.tolerance-slider span {
    background: rgba(255,255,255,0.2);
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
    min-width: 30px;
    text-align: center;
}

.tolerance-help {
    font-size: 0.9em;
    opacity: 0.8;
    margin: 0;
}

.image-controls {
    grid-column: span 2;
}

.image-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

.nav-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    padding: 10px 15px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s ease;
}

.nav-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}

#current-image-name {
    font-size: 1.2em;
    font-weight: bold;
    padding: 10px 20px;
    background: rgba(255,255,255,0.2);
    border-radius: 8px;
    min-width: 120px;
    text-align: center;
}

.action-buttons {
    grid-column: span 2;
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 15px;
}

.action-btn {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 16px;
}

.clear-btn {
    background: #e74c3c;
    color: white;
}

.save-btn {
    background: #27ae60;
    color: white;
}

.undo-btn {
    background: #f39c12;
    color: white;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.canvas-container {
    position: relative;
    text-align: center;
    margin-bottom: 30px;
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

#coloring-canvas {
    border: 3px solid #333;
    border-radius: 10px;
    cursor: crosshair;
    max-width: 100%;
    height: auto;
}

.canvas-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,0.9);
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
}

.loading-spinner {
    font-size: 3em;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.game-tips {
    background: rgba(255,255,255,0.1);
    padding: 20px;
    border-radius: 15px;
    backdrop-filter: blur(10px);
}

.game-tips h3 {
    margin-top: 0;
    color: #FFD700;
}

.game-tips ul {
    margin: 15px 0;
    padding-right: 20px;
}

.game-tips li {
    margin: 8px 0;
    font-size: 0.95em;
}

.error-container {
    text-align: center;
    padding: 40px;
    background: #fff3cd;
    border: 2px solid #ffeaa7;
    border-radius: 15px;
    color: #856404;
}

.retry-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 15px;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

/* התאמות למובייל */
@media (max-width: 768px) {
    .game-controls {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .colors-grid {
        grid-template-columns: repeat(6, 1fr);
    }
    
    .action-buttons {
        flex-direction: column;
        gap: 10px;
    }
    
    .image-selector {
        flex-direction: column;
        gap: 10px;
    }
}
</style>
`;

// הוספת CSS לדף
document.head.insertAdjacentHTML('beforeend', floodFillCSS);

// יצירת אובייקט המשחק הגלובלי
window.floodFillColoringGame = new FloodFillColoringGame();

// יצירת אובייקט תואם למערכת הראשית
window['digital-coloring'] = {
    init: function() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) {
            // יצירת מודל עם game-container
            const modal = document.createElement('div');
            modal.className = 'game-modal';
            modal.innerHTML = `
                <div class="game-modal-content" style="max-width: 95vw; max-height: 95vh; width: auto; height: auto; overflow: auto;">
                    <div class="game-modal-header">
                        <h2>🪣 דלי הצבע המתקדם</h2>
                        <button class="close-modal" onclick="this.closest('.game-modal').remove()">×</button>
                    </div>
                    <div class="game-modal-body" style="padding: 10px;">
                        <div id="game-container"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        // אתחול המשחק
        if (window.floodFillColoringGame) {
            window.floodFillColoringGame.init();
        }
    }
}; 