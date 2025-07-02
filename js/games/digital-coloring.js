// משחק צביעה דיגיטלית מתקדם - מבוסס על jl-coloringbook
class DigitalColoringGame {
    constructor() {
        this.coloringBookId = `coloring-book-${Date.now()}`;
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
            <div class="game-modal-content" style="max-width: 95vw; max-height: 95vh; width: auto; height: auto; overflow: auto;">
                <div class="game-modal-header">
                    <h2>🎨 צביעה דיגיטלית מתקדמת</h2>
                    <button class="close-modal" onclick="this.closest('.game-modal').remove()">×</button>
                </div>
                <div class="game-modal-body" style="padding: 20px;">
                    
                    <!-- אזור הצביעה -->
                    <div class="coloring-container" style="display: flex; justify-content: center; margin-bottom: 20px;">
                        <jl-coloringbook id="${this.coloringBookId}" style="width: 100%; max-width: 800px; border: 3px solid #333; border-radius: 15px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                            <!-- פלטת צבעים מותאמת אישית -->
                            <i color="rgba(220, 35, 35, 0.8)" title="אדום"></i>
                            <i color="rgba(255, 146, 51, 0.8)" title="כתום"></i>
                            <i color="rgba(255, 238, 51, 0.8)" title="צהוב"></i>
                            <i color="rgba(129, 197, 122, 0.8)" title="ירוק בהיר"></i>
                            <i color="rgba(29, 105, 20, 0.8)" title="ירוק כהה"></i>
                            <i color="rgba(41, 208, 208, 0.8)" title="תכלת"></i>
                            <i color="rgba(42, 75, 215, 0.8)" title="כחול"></i>
                            <i color="rgba(157, 175, 255, 0.8)" title="כחול בהיר"></i>
                            <i color="rgba(129, 38, 192, 0.8)" title="סגול"></i>
                            <i color="rgba(255, 205, 243, 0.8)" title="ורוד"></i>
                            <i color="rgba(129, 74, 25, 0.8)" title="חום"></i>
                            <i color="rgba(87, 87, 87, 0.8)" title="אפור"></i>
                            <i color="rgba(233, 222, 187, 0.8)" title="בז'"></i>
                            <i color="rgba(0, 0, 0, 0.8)" title="שחור"></i>
                            <i color="rgba(255, 255, 255, 0.8)" title="לבן"></i>
                            <i color="rgba(255, 255, 255, 1)" title="מחק"></i>
                            
                            <!-- תמונות לצביעה -->
                            <img src="coloring-images/astronaut.png" alt="אסטרונאוט" />
                            <img src="coloring-images/eagle.png" alt="נשר" />
                            <img src="coloring-images/glass.jpg" alt="כוס" />
                        </jl-coloringbook>
                    </div>

                    <!-- הוראות משחק -->
                    <div class="instructions" style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 20px auto; border-radius: 15px; color: white; max-width: 800px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                        <h3 style="margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎨 איך לשחק?</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; text-align: right;">
                            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; backdrop-filter: blur(10px);">
                                <p style="margin: 5px 0; font-size: 14px;"><strong>🖌️ צביעה:</strong> בחר צבע ולחץ על האזור שתרצה לצבוע</p>
                            </div>
                            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; backdrop-filter: blur(10px);">
                                <p style="margin: 5px 0; font-size: 14px;"><strong>🎚️ גודל מברשת:</strong> השתמש בסליידר לשינוי גודל המברשת</p>
                            </div>
                            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; backdrop-filter: blur(10px);">
                                <p style="margin: 5px 0; font-size: 14px;"><strong>↶ ביטול:</strong> לחץ על כפתור הביטול לביטול הפעולה האחרונה</p>
                            </div>
                            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; backdrop-filter: blur(10px);">
                                <p style="margin: 5px 0; font-size: 14px;"><strong>🖼️ תמונות:</strong> עבור בין תמונות שונות עם החצים</p>
                            </div>
                            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; backdrop-filter: blur(10px);">
                                <p style="margin: 5px 0; font-size: 14px;"><strong>💾 שמירה:</strong> שמור את היצירה שלך למחשב</p>
                            </div>
                            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; backdrop-filter: blur(10px);">
                                <p style="margin: 5px 0; font-size: 14px;"><strong>🖨️ הדפסה:</strong> הדפס את היצירה שלך</p>
                            </div>
                        </div>
                    </div>

                    <!-- תכונות מתקדמות -->
                    <div class="features-info" style="text-align: center; padding: 15px; background: rgba(255,255,255,0.1); margin: 20px auto; border-radius: 15px; max-width: 800px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                        <h4 style="margin-bottom: 10px; color: #333;">✨ תכונות מיוחדות</h4>
                        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                            <span style="background: #4caf50; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">🎨 16 צבעים</span>
                            <span style="background: #2196f3; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">🖌️ מברשת מתכוונת</span>
                            <span style="background: #ff9800; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">↶ ביטול/חזרה</span>
                            <span style="background: #9c27b0; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">💾 שמירה</span>
                            <span style="background: #f44336; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">🖨️ הדפסה</span>
                            <span style="background: #607d8b; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">🔄 שמירה אוטומטית</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.loadJQueryAndLibrary();
    }

    loadJQueryAndLibrary() {
        // בדיקה אם jQuery כבר טעון
        if (typeof jQuery === 'undefined') {
            const jqueryScript = document.createElement('script');
            jqueryScript.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
            jqueryScript.onload = () => {
                this.loadColoringLibrary();
            };
            document.head.appendChild(jqueryScript);
        } else {
            this.loadColoringLibrary();
        }
    }

    loadColoringLibrary() {
        // בדיקה אם הספרייה כבר טעונה
        if (typeof window.customElements !== 'undefined' && window.customElements.get('jl-coloringbook')) {
            this.initializeColoringBook();
            return;
        }

        const script = document.createElement('script');
        script.src = 'js/jl-coloringBook.js';
        script.onload = () => {
            // המתן קצת עד שהספרייה תיטען לחלוטין
            setTimeout(() => {
                this.initializeColoringBook();
            }, 500);
        };
        script.onerror = () => {
            console.error('Failed to load jl-coloringBook.js');
            this.showErrorMessage();
        };
        document.head.appendChild(script);
    }

    initializeColoringBook() {
        try {
            const coloringBookElement = document.getElementById(this.coloringBookId);
            if (coloringBookElement && typeof coloringBookElement.init === 'function') {
                coloringBookElement.init();
                this.setupEventListeners();
                this.playSound('success');
            } else {
                // נסה שוב אחרי זמן קצר
                setTimeout(() => {
                    const element = document.getElementById(this.coloringBookId);
                    if (element && typeof element.init === 'function') {
                        element.init();
                        this.setupEventListeners();
                        this.playSound('success');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error initializing coloring book:', error);
            this.showErrorMessage();
        }
    }

    setupEventListeners() {
        // הוספת אירועי click לכפתורים אם קיימים
        setTimeout(() => {
            const coloringBook = document.getElementById(this.coloringBookId);
            if (coloringBook) {
                // הוספת אפקטים קוליים לכפתורים
                const buttons = coloringBook.shadowRoot?.querySelectorAll('button') || coloringBook.querySelectorAll('button');
                buttons.forEach(button => {
                    button.addEventListener('click', () => {
                        this.playSound('click');
                    });
                });

                // אפקטים קוליים לבחירת צבעים
                const colorButtons = coloringBook.shadowRoot?.querySelectorAll('.color-button') || coloringBook.querySelectorAll('.color-button');
                colorButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        this.playSound('success');
                    });
                });
            }
        }, 1000);
    }

    showErrorMessage() {
        const modal = document.querySelector('.game-modal');
        if (modal) {
            const content = modal.querySelector('.game-modal-body');
            if (content) {
                content.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <h3 style="color: #f44336; margin-bottom: 20px;">⚠️ שגיאה בטעינת המשחק</h3>
                        <p style="margin-bottom: 20px;">מצטערים, לא הצלחנו לטעון את משחק הצביעה.</p>
                        <p style="margin-bottom: 30px;">אנא נסה שוב מאוחר יותר או בחר משחק אחר.</p>
                        <button onclick="this.closest('.game-modal').remove()" 
                                style="background: #4caf50; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px;">
                            חזור למשחקים
                        </button>
                    </div>
                `;
            }
        }
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