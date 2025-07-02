// משחק צביעה דיגיטלית מתקדם - מבוסס על jl-coloringbook
class DigitalColoringGame {
    constructor() {
        this.gameContainer = null;
        this.isInitialized = false;
        this.backgroundImages = [
            'coloring-images/astronaut.png',
            'coloring-images/eagle.png', 
            'coloring-images/glass.jpg'
        ];
        this.currentBackgroundIndex = 0;
    }

    async init() {
        if (this.isInitialized) return;
        
        this.gameContainer = document.getElementById('game-container');
        if (!this.gameContainer) {
            console.error('Game container not found');
            return;
        }

        try {
            await this.loadCSS();
            await this.setupHTML();
            await this.loadScript();
            await this.initializePaint();
            this.setupBackgroundSelector();
            this.isInitialized = true;
            
            // הוספת הודעת הצלחה
            this.showMessage('🎨 ברוכים הבאים למשחק הצביעה המתקדם!', 'success');
        } catch (error) {
            console.error('Error initializing Digital Coloring Game:', error);
            this.showFallbackMessage();
        }
    }

    async loadCSS() {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'canvas-web-paint.css';
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    async loadScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'js/canvas-web-paint.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async setupHTML() {
        this.gameContainer.innerHTML = `
            <div class="coloring-header">
                <h2>🎨 משחק צביעה דיגיטלי מתקדם</h2>
                <div class="background-selector">
                    <label>בחר תמונת רקע:</label>
                    <select id="background-selector">
                        <option value="">ללא רקע</option>
                        <option value="0">אסטרונאוט</option>
                        <option value="1">נשר</option>
                        <option value="2">כוס</option>
                    </select>
                </div>
                <div class="game-instructions">
                    <p>🖌️ בחר כלי ציור | 🎨 בחר צבע | 📏 התאם גודל מברשת | 🗂️ השתמש בטאבים ליצירות מרובות</p>
                </div>
            </div>

            <div style="position: relative; height: 600px; border: 3px solid #2196F3; border-radius: 15px; overflow: hidden; background: #f0f0f0;">
                <div id="paintPage" style="width: 100%; height: 100%;">
                    <div id="paintTabs">
                        <ul id="paintTabsCon">
                            <li class="paintTabBase paintTab active" data-id="1">
                                <label>יצירה 1</label>
                                <svg height="24" viewBox="0 0 512 512" width="24" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"></polygon>
                                </svg>
                            </li>
                        </ul>
                        <div id="paintAdd" class="paintTabBase">
                            <a>
                                <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div id="paintContainer">
                        <label class="paintBtn show" id="paintBtn">
                            <svg class="swap-on" height="24" viewBox="0 0 512 512" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"></path>
                            </svg>
                            <svg class="swap-off" height="24" viewBox="0 0 512 512" width="24" xmlns="http://www.w3.org/2000/svg">
                                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"></polygon>
                            </svg>
                        </label>
                        <div id="paintToolBar">
                            <div id="paintTools">
                                <span data-name="pencil"><i></i> עיפרון</span>
                                <span class="active-tool" data-name="brush"><i></i> מברשת</span>
                                <span data-name="eraser"><i></i> מחק</span>
                            </div>
                            <div id="paintSize">
                                <label for="paintSizeRange">גודל</label>
                                <div class="paintRangeSlider">
                                    <input id="paintSizeRange" max="100" min="1" type="range" value="15">
                                    <div id="paintSizeVal">15</div>
                                </div>
                            </div>
                            <div id="paintColorCon">
                                <div id="paintColors">
                                    <span class="active-color" data-color="black" style="background-color: black;" title="שחור"></span>
                                    <span data-color="white" style="background-color: white;" title="לבן"></span>
                                    <span data-color="red" style="background-color: red;" title="אדום"></span>
                                    <span data-color="orange" style="background-color: orange;" title="כתום"></span>
                                    <span data-color="yellow" style="background-color: yellow;" title="צהוב"></span>
                                    <span data-color="green" style="background-color: green;" title="ירוק"></span>
                                    <span data-color="blue" style="background-color: blue;" title="כחול"></span>
                                    <span data-color="purple" style="background-color: purple;" title="סגול"></span>
                                    <span data-color="gold" style="background-color: gold;" title="זהב"></span>
                                    <span data-color="violet" style="background-color: violet;" title="ויולט"></span>
                                    <span data-color="silver" style="background-color: silver;" title="כסף"></span>
                                    <span data-color="gray" style="background-color: gray;" title="אפור"></span>
                                    <span data-color="pink" style="background-color: pink;" title="ורוד"></span>
                                    <span data-color="brown" style="background-color: brown;" title="חום"></span>
                                    <span data-color="lime" style="background-color: lime;" title="ליים"></span>
                                    <span data-color="cyan" style="background-color: cyan;" title="ציאן"></span>
                                </div>
                                <div id="paintPicker">
                                    <label for="paintColorInput">בחר צבע</label>
                                    <input id="paintColorInput" type="color" value="#ff6b6b">
                                </div>
                            </div>
                            <div id="paintButtons">
                                <button id="paintReset">נקה</button>
                                <a download="my-artwork.png" href="" id="paintSave" target="_blank">שמור</a>
                            </div>
                        </div>
                        <div>
                            <canvas id="paintDraw"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div class="game-footer">
                <div class="tips">
                    <h3>💡 טיפים:</h3>
                    <ul>
                        <li>🖱️ לחץ על כפתור התפריט להסתרה/הצגה של כלי הציור</li>
                        <li>🗂️ השתמש בטאבים ליצירת יצירות מרובות</li>
                        <li>📱 המשחק תומך במגע על מכשירים ניידים</li>
                        <li>🎨 בחר צבע מותאם אישית עם בורר הצבעים</li>
                        <li>💾 שמור את היצירה שלך כתמונה</li>
                    </ul>
                </div>
            </div>
        `;
    }

    async initializePaint() {
        // המתנה קצרה לוודא שהDOM מוכן
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (typeof paintInit === 'function') {
            paintInit();
        } else {
            throw new Error('paintInit function not available');
        }
    }

    setupBackgroundSelector() {
        const selector = document.getElementById('background-selector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.setBackgroundImage(e.target.value);
            });
        }
    }

    async setBackgroundImage(imageIndex) {
        if (imageIndex === '') {
            this.clearBackground();
            return;
        }

        const imageUrl = this.backgroundImages[parseInt(imageIndex)];
        if (!imageUrl) return;

        try {
            const canvas = document.getElementById('paintDraw');
            const ctx = canvas.getContext('2d');
            
            const img = new Image();
            img.onload = () => {
                // שמירת הציור הנוכחי
                const currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // הוספת תמונת הרקע
                ctx.globalCompositeOperation = 'destination-over';
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // החזרת הציור מעל הרקע
                ctx.globalCompositeOperation = 'source-over';
                ctx.putImageData(currentDrawing, 0, 0);
                
                this.showMessage('🖼️ תמונת הרקע נוספה בהצלחה!', 'success');
            };
            img.onerror = () => {
                this.showMessage('❌ שגיאה בטעינת תמונת הרקע', 'error');
            };
            img.src = imageUrl;
        } catch (error) {
            console.error('Error setting background image:', error);
            this.showMessage('❌ שגיאה בהוספת תמונת הרקע', 'error');
        }
    }

    clearBackground() {
        const canvas = document.getElementById('paintDraw');
        const ctx = canvas.getContext('2d');
        
        // שמירת הציור הנוכחי
        const currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // ניקוי הקנבס
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // החזרת הציור בלבד
        ctx.putImageData(currentDrawing, 0, 0);
        
        this.showMessage('🗑️ תמונת הרקע הוסרה', 'info');
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
                <h2>❌ שגיאה בטעינת משחק הצביעה</h2>
                <p>מצטערים, לא ניתן לטעון את משחק הצביעה המתקדם כרגע.</p>
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

    destroy() {
        if (this.gameContainer) {
            this.gameContainer.innerHTML = '';
        }
        this.isInitialized = false;
    }
}

// CSS נוסף למשחק
const additionalCSS = `
<style>
.coloring-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 15px 15px 0 0;
    text-align: center;
    margin-bottom: 10px;
}

.coloring-header h2 {
    margin: 0 0 15px 0;
    font-size: 1.8em;
}

.background-selector {
    margin: 10px 0;
}

.background-selector label {
    display: inline-block;
    margin-left: 10px;
    font-weight: bold;
}

.background-selector select {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    background: white;
    color: #333;
}

.game-instructions {
    background: rgba(255,255,255,0.1);
    padding: 10px;
    border-radius: 8px;
    margin-top: 10px;
}

.game-instructions p {
    margin: 0;
    font-size: 0.9em;
}

.game-footer {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 0 0 15px 15px;
    margin-top: 10px;
}

.tips h3 {
    color: #2196F3;
    margin-top: 0;
}

.tips ul {
    margin: 10px 0;
    padding-right: 20px;
}

.tips li {
    margin: 8px 0;
    color: #555;
}

.error-container {
    text-align: center;
    padding: 40px;
    background: #fff3cd;
    border: 2px solid #ffeaa7;
    border-radius: 15px;
    color: #856404;
}

.fallback-options {
    margin: 20px 0;
    text-align: right;
}

.fallback-options ul {
    display: inline-block;
    text-align: right;
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

.retry-button:hover {
    background: #0056b3;
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

/* התאמות לעברית */
#paintTools span {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#paintButtons button,
#paintButtons a {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* שיפור צבעים */
#paintColors span {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin: 3px;
    cursor: pointer;
    border: 3px solid transparent;
    transition: all 0.2s ease;
}

#paintColors span:hover {
    transform: scale(1.1);
    border-color: #333;
}

#paintColors span.active-color {
    border-color: #2196F3;
    transform: scale(1.2);
}
</style>
`;

// הוספת CSS נוסף לדף
document.head.insertAdjacentHTML('beforeend', additionalCSS);

// יצירת אובייקט המשחק הגלובלי
window.digitalColoringGame = new DigitalColoringGame();