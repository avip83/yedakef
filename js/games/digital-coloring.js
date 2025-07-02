// משחק צביעה דיגיטלית מתקדם - מבוסס על Canvas
class DigitalColoringGame {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.isDrawing = false;
        this.drawColor = '#000000';
        this.drawWidth = 10;
        this.startBackgroundColor = '#ffffff';
        
        // תמונות לצביעה - בוחר תמונות מתאימות לילדים
        this.coloringImages = [
            'coloring-images/bear-monokuma.png',
            'coloring-images/chihiro-fujisaki.png',
            'coloring-images/makoto-naegi.png',
            'coloring-images/girls-with-monokuma.jpg',
            'coloring-images/Beautiful-girls-with-Monokuma.png'
        ];
        this.currentImageIndex = 0;
        
        // מערכי ביטול וחזרה
        this.storeArray = [];
        this.index = -1;
        this.removedArray = [];
        this.indexRemoved = -1;
        
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
                <div class="game-modal-body" style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
                    
                    <!-- אזור הציור -->
                    <div class="drawing-area" style="margin-bottom: 20px;">
                        <canvas id="coloringCanvas" width="500" height="400" style="border: 3px solid #ddd; border-radius: 10px; background: white; cursor: crosshair;"></canvas>
                    </div>

                    <!-- כלי בקרה -->
                    <div class="controls-section" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; align-items: center; background: #f5f5f5; padding: 20px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        
                        <!-- בחירת צבע -->
                        <div class="color-control" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                            <label style="font-weight: bold; color: #333;">צבע:</label>
                            <input type="color" id="colorPicker" value="#000000" style="width: 60px; height: 40px; border: none; border-radius: 8px; cursor: pointer;">
                        </div>

                        <!-- גודל עט -->
                        <div class="pen-control" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                            <label style="font-weight: bold; color: #333;">גודל עט: <span id="penWidth">10</span></label>
                            <input type="range" id="penRange" min="1" max="50" value="10" style="width: 120px;">
                        </div>

                        <!-- כפתורי פעולה -->
                        <div class="action-controls" style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button id="eraseBtn" class="control-btn" style="background: #ff9800; color: white; padding: 10px 15px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🧽 מחק</button>
                            <button id="undoBtn" class="control-btn" style="background: #2196f3; color: white; padding: 10px 15px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">↶ בטל</button>
                            <button id="redoBtn" class="control-btn" style="background: #4caf50; color: white; padding: 10px 15px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;" disabled>↷ חזור</button>
                        </div>
                    </div>

                    <!-- גלריית תמונות -->
                    <div class="gallery-section" style="margin-top: 20px; width: 100%;">
                        <h3 style="text-align: center; color: #333; margin-bottom: 15px;">בחר תמונה לצביעה:</h3>
                        <div class="gallery-images" style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; background: #f9f9f9; padding: 20px; border-radius: 15px;">
                            ${this.coloringImages.map((img, index) => `
                                <div class="gallery-item" style="cursor: pointer; transition: transform 0.3s ease;">
                                    <img class="gallery-image" data-index="${index}" src="${img}" alt="תמונה ${index + 1}" style="width: 120px; height: 90px; object-fit: cover; border: 3px solid #ddd; border-radius: 10px;">
                                    <p style="text-align: center; margin: 5px 0; font-size: 12px; color: #666;">תמונה ${index + 1}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- כפתורי פעולה נוספים -->
                    <div class="additional-controls" style="display: flex; gap: 15px; margin-top: 20px; flex-wrap: wrap; justify-content: center;">
                        <button id="resetBtn" class="action-btn" style="background: #f44336; color: white; padding: 12px 20px; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">🗑️ נקה הכל</button>
                        <button id="saveBtn" class="action-btn" style="background: #4caf50; color: white; padding: 12px 20px; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">💾 שמור</button>
                        <button id="nextImageBtn" class="action-btn" style="background: #9c27b0; color: white; padding: 12px 20px; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">🖼️ תמונה הבאה</button>
                    </div>

                    <div class="image-counter" style="margin-top: 15px; font-size: 16px; color: #666; background: #e3f2fd; padding: 10px 20px; border-radius: 20px; font-weight: bold;">
                        תמונה <span id="currentImageNum">1</span> מתוך <span id="totalImages">${this.coloringImages.length}</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupCanvas();
        this.setupEventListeners();
        this.loadImage(this.coloringImages[0]);
    }

    setupCanvas() {
        this.canvas = document.getElementById('coloringCanvas');
        this.context = this.canvas.getContext('2d');
        
        // הגדרת רקע התחלתי
        this.context.fillStyle = this.startBackgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // שמירת מצב התחלתי
        this.storeArray.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
        this.index += 1;
    }

    setupEventListeners() {
        // אירועי ציור
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        
        // תמיכה במגע
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));

        // בחירת צבע
        document.getElementById('colorPicker').addEventListener('input', (e) => {
            this.drawColor = e.target.value;
            this.playSound('click');
        });

        // גודל עט
        const penRange = document.getElementById('penRange');
        const penWidth = document.getElementById('penWidth');
        penRange.addEventListener('input', (e) => {
            this.drawWidth = e.target.value;
            penWidth.textContent = e.target.value;
        });

        // כפתורי פעולה
        document.getElementById('eraseBtn').addEventListener('click', this.eraseColor.bind(this));
        document.getElementById('undoBtn').addEventListener('click', this.undoLast.bind(this));
        document.getElementById('redoBtn').addEventListener('click', this.redoLast.bind(this));
        document.getElementById('resetBtn').addEventListener('click', this.resetCanvas.bind(this));
        document.getElementById('saveBtn').addEventListener('click', this.saveCanvas.bind(this));
        document.getElementById('nextImageBtn').addEventListener('click', this.nextImage.bind(this));

        // גלריית תמונות
        document.querySelectorAll('.gallery-image').forEach(img => {
            img.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.currentImageIndex = index;
                this.loadImage(this.coloringImages[index]);
                this.updateImageCounter();
                this.playSound('click');
            });
            
            // אפקט hover
            img.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.borderColor = '#2196f3';
            });
            
            img.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.borderColor = '#ddd';
            });
        });
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                         e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    startDrawing(event) {
        this.isDrawing = true;
        this.draw(event);
        event.preventDefault();
    }

    draw(event) {
        if (this.isDrawing) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            this.context.lineTo(x, y);
            this.context.strokeStyle = this.drawColor;
            this.context.lineWidth = this.drawWidth;
            this.context.lineCap = 'round';
            this.context.lineJoin = 'round';
            this.context.stroke();
            
            this.context.beginPath();
            this.context.moveTo(x, y);
            
            event.preventDefault();
        }
    }

    stopDrawing(event) {
        if (this.isDrawing) {
            this.context.stroke();
            this.context.closePath();
            this.isDrawing = false;
            
            // שמירת מצב לביטול
            this.storeArray.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
            this.index += 1;
            
            // איפוס מערך החזרה
            this.removedArray = [];
            this.indexRemoved = -1;
            document.getElementById('redoBtn').disabled = true;
        }
        this.context.beginPath();
        event.preventDefault();
    }

    eraseColor() {
        this.drawColor = this.startBackgroundColor;
        this.playSound('click');
    }

    undoLast() {
        if (this.index === 0) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = this.startBackgroundColor;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (this.index < 0) {
            this.resetCanvas();
        } else {
            this.removedArray.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
            this.indexRemoved += 1;
            
            this.storeArray.pop();
            this.index -= 1;
            
            this.context.putImageData(this.storeArray[this.index], 0, 0);
            document.getElementById('redoBtn').disabled = false;
        }
        this.playSound('click');
    }

    redoLast() {
        if (this.removedArray.length > 0) {
            this.context.putImageData(this.removedArray[this.indexRemoved], 0, 0);
            this.removedArray.pop();
            this.indexRemoved -= 1;
            
            this.storeArray.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
            this.index += 1;
            
            if (this.removedArray.length === 0) {
                document.getElementById('redoBtn').disabled = true;
            }
        }
        this.playSound('click');
    }

    resetCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.startBackgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.loadImage(this.coloringImages[this.currentImageIndex]);
        
        this.storeArray = [];
        this.index = -1;
        this.removedArray = [];
        this.indexRemoved = -1;
        
        document.getElementById('redoBtn').disabled = true;
        this.playSound('click');
    }

    loadImage(imageSrc) {
        const newImage = new Image();
        newImage.onload = () => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = this.startBackgroundColor;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // חישוב גודל התמונה כך שתתאים לקנבס
            const scale = Math.min(this.canvas.width / newImage.width, this.canvas.height / newImage.height);
            const newWidth = newImage.width * scale;
            const newHeight = newImage.height * scale;
            const x = (this.canvas.width - newWidth) / 2;
            const y = (this.canvas.height - newHeight) / 2;
            
            this.context.drawImage(newImage, x, y, newWidth, newHeight);
            
            this.storeArray.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
            this.index += 1;
        };
        
        newImage.onerror = () => {
            console.error('Failed to load image:', imageSrc);
        };
        
        newImage.src = imageSrc;
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.coloringImages.length;
        this.loadImage(this.coloringImages[this.currentImageIndex]);
        this.updateImageCounter();
        this.playSound('click');
    }

    updateImageCounter() {
        const currentNum = document.getElementById('currentImageNum');
        if (currentNum) {
            currentNum.textContent = this.currentImageIndex + 1;
        }
    }

    saveCanvas() {
        const link = document.createElement('a');
        link.download = `coloring-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
        this.playSound('success');
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