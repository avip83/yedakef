// משחק צביעה דיגיטלית מתקדם
class DigitalColoringGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'brush'; // brush, bucket, eraser
        this.currentColor = '#e53935';
        this.brushSize = 10;
        this.tolerance = 30;
        this.coloringImages = [
            'coloring-images/simple-cat.svg',
            'coloring-images/simple-dog.svg',
            'coloring-images/simple-flower.svg',
            'coloring-images/astronaut.png',
            'coloring-images/eagle.png',
            'coloring-images/glass.jpg'
        ];
        this.currentImageIndex = 0;
        this.sounds = {
            success: 'sounds/success-340660 (mp3cut.net).mp3',
            click: 'sounds/click-tap-computer-mouse-352734.mp3',
            complete: 'sounds/game-level-complete-143022.mp3'
        };
        this.originalImageData = null;
        this.setupFloodFill();
    }

    setupFloodFill() {
        // Flood fill algorithm implementation
        this.floodFill = function(imageData, x, y, fillColor, tolerance) {
            const data = imageData.data;
            const width = imageData.width;
            const height = imageData.height;
            const length = data.length;
            const Q = [];
            const i = (x + y * width) * 4;
            
            if (i < 0 || i >= length) return false;
            
            const targetColor = [data[i], data[i + 1], data[i + 2], data[i + 3]];
            
            if (!this.pixelCompare(i, targetColor, fillColor, data, length, tolerance)) {
                return false;
            }
            
            Q.push(i);
            while (Q.length) {
                const currentI = Q.pop();
                if (this.pixelCompareAndSet(currentI, targetColor, fillColor, data, length, tolerance, width)) {
                    let e = currentI;
                    let w = currentI;
                    const mw = Math.floor(currentI / (width * 4)) * (width * 4);
                    const me = mw + width * 4;
                    
                    while (mw < w && mw < (w -= 4) && this.pixelCompareAndSet(w, targetColor, fillColor, data, length, tolerance, width));
                    while (me > e && me > (e += 4) && this.pixelCompareAndSet(e, targetColor, fillColor, data, length, tolerance, width));
                    
                    for (let j = w + 4; j < e; j += 4) {
                        if (j - width * 4 >= 0 && this.pixelCompare(j - width * 4, targetColor, fillColor, data, length, tolerance)) {
                            Q.push(j - width * 4);
                        }
                        if (j + width * 4 < length && this.pixelCompare(j + width * 4, targetColor, fillColor, data, length, tolerance)) {
                            Q.push(j + width * 4);
                        }
                    }
                }
            }
            return true;
        };
    }

    pixelCompare(i, targetColor, fillColor, data, length, tolerance) {
        if (i < 0 || i >= length) return false;
        if (data[i + 3] === 0 && fillColor.a > 0) return true;
        
        if (Math.abs(targetColor[3] - fillColor.a) <= tolerance &&
            Math.abs(targetColor[0] - fillColor.r) <= tolerance &&
            Math.abs(targetColor[1] - fillColor.g) <= tolerance &&
            Math.abs(targetColor[2] - fillColor.b) <= tolerance) {
            return false;
        }
        
        if (targetColor[3] === data[i + 3] &&
            targetColor[0] === data[i] &&
            targetColor[1] === data[i + 1] &&
            targetColor[2] === data[i + 2]) {
            return true;
        }
        
        if (Math.abs(targetColor[3] - data[i + 3]) <= (255 - tolerance) &&
            Math.abs(targetColor[0] - data[i]) <= tolerance &&
            Math.abs(targetColor[1] - data[i + 1]) <= tolerance &&
            Math.abs(targetColor[2] - data[i + 2]) <= tolerance) {
            return true;
        }
        
        return false;
    }

    pixelCompareAndSet(i, targetColor, fillColor, data, length, tolerance, width) {
        if (this.pixelCompare(i, targetColor, fillColor, data, length, tolerance)) {
            data[i] = fillColor.r;
            data[i + 1] = fillColor.g;
            data[i + 2] = fillColor.b;
            data[i + 3] = fillColor.a;
            return true;
        }
        return false;
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
                    
                    <!-- כלי עבודה -->
                    <div class="coloring-toolbar" style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;">
                        <div class="tool-group">
                            <label style="font-weight: bold; color: #333;">כלים:</label>
                            <button class="tool-btn active" data-tool="brush" title="מברשת">🖌️</button>
                            <button class="tool-btn" data-tool="bucket" title="דלי צבע">🪣</button>
                            <button class="tool-btn" data-tool="eraser" title="מחק">🧽</button>
                        </div>
                        
                        <div class="tool-group">
                            <label style="font-weight: bold; color: #333;">גודל מברשת:</label>
                            <input type="range" id="brushSize" min="2" max="30" value="10" style="width: 100px;">
                            <span id="brushSizeValue">10</span>
                        </div>
                        
                        <div class="tool-group">
                            <label style="font-weight: bold; color: #333;">רגישות דלי:</label>
                            <input type="range" id="tolerance" min="0" max="100" value="30" style="width: 100px;">
                            <span id="toleranceValue">30</span>
                        </div>
                    </div>

                    <!-- פלטת צבעים -->
                    <div class="color-palette" style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;">
                        <div class="color-btn active" data-color="#e53935" style="background: #e53935;" title="אדום"></div>
                        <div class="color-btn" data-color="#1e88e5" style="background: #1e88e5;" title="כחול"></div>
                        <div class="color-btn" data-color="#43a047" style="background: #43a047;" title="ירוק"></div>
                        <div class="color-btn" data-color="#fbc02d" style="background: #fbc02d;" title="צהוב"></div>
                        <div class="color-btn" data-color="#ff7043" style="background: #ff7043;" title="כתום"></div>
                        <div class="color-btn" data-color="#8e24aa" style="background: #8e24aa;" title="סגול"></div>
                        <div class="color-btn" data-color="#795548" style="background: #795548;" title="חום"></div>
                        <div class="color-btn" data-color="#607d8b" style="background: #607d8b;" title="אפור כהה"></div>
                        <div class="color-btn" data-color="#f44336" style="background: #f44336;" title="אדום בהיר"></div>
                        <div class="color-btn" data-color="#4caf50" style="background: #4caf50;" title="ירוק בהיר"></div>
                        <div class="color-btn" data-color="#2196f3" style="background: #2196f3;" title="כחול בהיר"></div>
                        <div class="color-btn" data-color="#ff9800" style="background: #ff9800;" title="כתום בהיר"></div>
                        <div class="color-btn" data-color="#9c27b0" style="background: #9c27b0;" title="סגול בהיר"></div>
                        <div class="color-btn" data-color="#000000" style="background: #000000;" title="שחור"></div>
                        <div class="color-btn" data-color="#ffffff" style="background: #ffffff; border: 2px solid #ccc;" title="לבן"></div>
                        <div class="color-btn" data-color="#ffeb3b" style="background: #ffeb3b;" title="צהוב בהיר"></div>
                    </div>

                    <!-- קנבס הצביעה -->
                    <div class="canvas-container" style="position: relative; border: 3px solid #ddd; border-radius: 10px; overflow: hidden; background: white;">
                        <canvas id="coloringCanvas" width="600" height="400" style="display: block; cursor: crosshair;"></canvas>
                        <div class="canvas-loading" id="canvasLoading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 18px; color: #666;">
                            טוען תמונה... 🎨
                        </div>
                    </div>

                    <!-- כפתורי פעולה -->
                    <div class="action-buttons" style="display: flex; gap: 15px; margin-top: 20px; flex-wrap: wrap; justify-content: center;">
                        <button class="action-btn" id="clearCanvas" style="background: #f44336; color: white;">🗑️ נקה הכל</button>
                        <button class="action-btn" id="undoAction" style="background: #ff9800; color: white;">↶ בטל</button>
                        <button class="action-btn" id="saveImage" style="background: #4caf50; color: white;">💾 שמור</button>
                        <button class="action-btn" id="nextImage" style="background: #2196f3; color: white;">🖼️ תמונה הבאה</button>
                        <button class="action-btn" id="prevImage" style="background: #9c27b0; color: white;">🖼️ תמונה קודמת</button>
                    </div>

                    <div class="image-counter" style="margin-top: 10px; font-size: 16px; color: #666;">
                        תמונה <span id="currentImageNum">1</span> מתוך <span id="totalImages">6</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupEventListeners();
        this.loadCurrentImage();
    }

    setupEventListeners() {
        this.canvas = document.getElementById('coloringCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // כלי עבודה
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTool = e.target.dataset.tool;
                this.updateCursor();
                this.playSound('click');
            });
        });

        // צבעים
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentColor = e.target.dataset.color;
                this.playSound('click');
            });
        });

        // גודל מברשת
        const brushSizeSlider = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');
        brushSizeSlider.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            brushSizeValue.textContent = this.brushSize;
            this.updateCursor();
        });

        // רגישות דלי
        const toleranceSlider = document.getElementById('tolerance');
        const toleranceValue = document.getElementById('toleranceValue');
        toleranceSlider.addEventListener('input', (e) => {
            this.tolerance = parseInt(e.target.value);
            toleranceValue.textContent = this.tolerance;
        });

        // אירועי קנבס
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // תמיכה במגע
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));

        // כפתורי פעולה
        document.getElementById('clearCanvas').addEventListener('click', this.clearCanvas.bind(this));
        document.getElementById('undoAction').addEventListener('click', this.undoAction.bind(this));
        document.getElementById('saveImage').addEventListener('click', this.saveImage.bind(this));
        document.getElementById('nextImage').addEventListener('click', this.nextImage.bind(this));
        document.getElementById('prevImage').addEventListener('click', this.prevImage.bind(this));
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                         e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    updateCursor() {
        if (this.currentTool === 'brush') {
            this.canvas.style.cursor = 'crosshair';
        } else if (this.currentTool === 'bucket') {
            this.canvas.style.cursor = 'pointer';
        } else if (this.currentTool === 'eraser') {
            this.canvas.style.cursor = 'grab';
        }
    }

    startDrawing(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);

        if (this.currentTool === 'bucket') {
            this.bucketFill(x, y);
            this.playSound('success');
        } else {
            this.isDrawing = true;
            this.saveState();
            if (this.currentTool === 'brush') {
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.strokeStyle = this.currentColor;
            } else if (this.currentTool === 'eraser') {
                this.ctx.globalCompositeOperation = 'destination-out';
            }
            
            this.ctx.lineWidth = this.brushSize;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.playSound('click');
        }
    }

    draw(e) {
        if (!this.isDrawing || this.currentTool === 'bucket') return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.beginPath();
        }
    }

    bucketFill(x, y) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const fillColor = this.hexToRgb(this.currentColor);
        fillColor.a = 255;
        
        this.saveState();
        if (this.floodFill(imageData, x, y, fillColor, this.tolerance)) {
            this.ctx.putImageData(imageData, 0, 0);
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 0, g: 0, b: 0};
    }

    saveState() {
        if (!this.states) this.states = [];
        if (this.states.length > 10) this.states.shift();
        this.states.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    }

    undoAction() {
        if (this.states && this.states.length > 0) {
            const previousState = this.states.pop();
            this.ctx.putImageData(previousState, 0, 0);
            this.playSound('click');
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.originalImageData) {
            this.ctx.putImageData(this.originalImageData, 0, 0);
        }
        this.states = [];
        this.playSound('click');
    }

    saveImage() {
        const link = document.createElement('a');
        link.download = `coloring-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
        this.playSound('success');
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.coloringImages.length;
        this.loadCurrentImage();
        this.playSound('click');
    }

    prevImage() {
        this.currentImageIndex = this.currentImageIndex === 0 ? 
            this.coloringImages.length - 1 : this.currentImageIndex - 1;
        this.loadCurrentImage();
        this.playSound('click');
    }

    loadCurrentImage() {
        const loading = document.getElementById('canvasLoading');
        const currentNum = document.getElementById('currentImageNum');
        const totalImages = document.getElementById('totalImages');
        
        if (loading) loading.style.display = 'block';
        if (currentNum) currentNum.textContent = this.currentImageIndex + 1;
        if (totalImages) totalImages.textContent = this.coloringImages.length;

        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // חשב גודל התמונה כך שתתאים לקנבס
            const scale = Math.min(this.canvas.width / img.width, this.canvas.height / img.height);
            const newWidth = img.width * scale;
            const newHeight = img.height * scale;
            const x = (this.canvas.width - newWidth) / 2;
            const y = (this.canvas.height - newHeight) / 2;
            
            this.ctx.drawImage(img, x, y, newWidth, newHeight);
            this.originalImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.states = [];
            
            if (loading) loading.style.display = 'none';
        };
        
        img.onerror = () => {
            console.error('Failed to load image:', this.coloringImages[this.currentImageIndex]);
            if (loading) {
                loading.textContent = 'שגיאה בטעינת התמונה 😔';
                loading.style.color = '#f44336';
            }
        };
        
        img.src = this.coloringImages[this.currentImageIndex];
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