// האפליקציה הראשית
class KidsApp {
    constructor() {
        this.currentAge = null;
        this.currentCategory = null;
        this.currentGame = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showAgeSelector();
        this.addSoundEffects();
        this.setupMobileScrolling();
    }

    setupEventListeners() {
        // כפתורי חזרה
        document.getElementById('backButton').addEventListener('click', () => {
            this.showAgeSelector();
            this.playSound('click');
        });

        document.getElementById('backToCategoriesButton').addEventListener('click', () => {
            this.showCategories(this.currentAge);
            this.playSound('click');
        });

        // הפעל את כפתור החזרה לקטגוריות
        document.getElementById('backToCategoriesButton').onclick = () => this.showAgeSelector();
        // הפעל את כפתור החץ חזרה לגילאים
        const backToAgesArrow = document.getElementById('backToAgesArrow');
        if (backToAgesArrow) {
            backToAgesArrow.onclick = () => this.showAgeSelector();
        }
    }

    showAgeSelector() {
        // סגור כל מודאל פתוח
        document.querySelectorAll('.game-modal').forEach(modal => modal.remove());
        
        this.currentAge = null;
        this.currentCategory = null;
        this.currentGame = null;

        document.getElementById('ageSelector').style.display = 'block';
        document.getElementById('categoriesContainer').style.display = 'none';
        document.getElementById('gamesContainer').style.display = 'none';

        this.renderAgeButtons();
        if (window.updateBackToCategoriesTopBtn) window.updateBackToCategoriesTopBtn();
    }

    renderAgeButtons() {
        const ageButtonsContainer = document.getElementById('ageButtons');
        const ages = DataManager.getAges();
        
        ageButtonsContainer.innerHTML = ages.map(age => `
            <button class="age-button" data-age="${age.id}" tabindex="0" aria-label="בחר גיל ${age.name}">
                <div class="age-button-content">
                    <div class="age-number">${age.id}</div>
                    <div class="age-description">${age.description}</div>
                </div>
            </button>
        `).join('');
        
        // תמיכה ב־onclick וב־touchstart
        Array.from(ageButtonsContainer.querySelectorAll('.age-button')).forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                app.selectAge(btn.getAttribute('data-age'));
            };
            btn.ontouchstart = (e) => {
                e.preventDefault();
                app.selectAge(btn.getAttribute('data-age'));
            };
        });
    }

    selectAge(ageId) {
        this.currentAge = ageId;
        this.playSound('success');
        this.showCategories(ageId);
    }

    showCategories(ageId) {
        this.currentCategory = null;
        this.currentGame = null;
        document.getElementById('ageSelector').style.display = 'none';
        document.getElementById('categoriesContainer').style.display = 'none';
        document.getElementById('gamesContainer').style.display = 'block';
        const age = DataManager.getAges().find(a => a.id === ageId);
        document.getElementById('selectedCategoryTitle').textContent = `משחקים מומלצים לגיל ${age.name}`;
        // אסוף את כל המשחקים מכל הקטגוריות של הגיל
        const categories = DataManager.getCategoriesForAge(ageId);
        let allGames = [];
        categories.forEach(cat => {
            if (Array.isArray(cat.games)) allGames = allGames.concat(cat.games);
        });
        // הצג את כל המשחקים ברשימה אחת
        const gamesGrid = document.getElementById('gamesGrid');
        gamesGrid.innerHTML = allGames.map(game => {
            const isReady = game.id === 'color-match' || game.id === 'shape-match' || game.id === 'animal-sounds' || game.id === 'count-objects' || game.id === 'what-is-missing' || game.id === 'simple-puzzle' || game.id === 'find-differences';
            return `
                <div class="game-card" data-age="${ageId}" data-game="${game.id}" tabindex="0" aria-label="בחר משחק ${game.name}">
                    ${isReady ? '' : `<div class="game-status-icon" title="בקרוב"><span style='color:#ff9800;font-size:2em;font-weight:bold'>🔒</span></div>`}
                    <span class="game-icon"><span class="icon-circle">${game.icon}</span></span>
                    <h3 class="game-title">${game.name}</h3>
                    <p class="game-description">${game.description}</p>
                </div>
            `;
        }).join('');
        
        // תמיכה ב־onclick וב־touchstart למשחקים
        Array.from(gamesGrid.querySelectorAll('.game-card')).forEach(card => {
            card.onclick = (e) => {
                e.preventDefault();
                const ageId = card.getAttribute('data-age');
                const gameId = card.getAttribute('data-game');
                app.selectGame(ageId, null, gameId);
            };
            card.ontouchstart = (e) => {
                e.preventDefault();
                const ageId = card.getAttribute('data-age');
                const gameId = card.getAttribute('data-game');
                app.selectGame(ageId, null, gameId);
            };
        });
        
        // הפעל את כפתור החזרה
        document.getElementById('backToCategoriesButton').onclick = () => this.showAgeSelector();
        if (window.updateBackToCategoriesTopBtn) window.updateBackToCategoriesTopBtn();
    }

    selectCategory(ageId, categoryId) {
        this.currentCategory = categoryId;
        this.playSound('success');
        this.showGames(ageId, categoryId);
    }

    showGames(ageId, categoryId) {
        this.currentGame = null;

        document.getElementById('ageSelector').style.display = 'none';
        document.getElementById('categoriesContainer').style.display = 'none';
        document.getElementById('gamesContainer').style.display = 'block';

        const age = DataManager.getAges().find(a => a.id === ageId);
        const category = DataManager.getCategory(ageId, categoryId);
        document.getElementById('selectedCategoryTitle').textContent = `${category.name} - ${age.name}`;

        this.renderGames(ageId, categoryId);
        if (window.updateBackToCategoriesTopBtn) window.updateBackToCategoriesTopBtn();
    }

    renderGames(ageId, categoryId) {
        const gamesGrid = document.getElementById('gamesGrid');
        const games = DataManager.getGamesForCategory(ageId, categoryId);
        gamesGrid.innerHTML = games.map(game => {
            const isReady = game.id === 'color-match' || game.id === 'shape-match' || game.id === 'animal-sounds' || game.id === 'count-objects' || game.id === 'what-is-missing' || game.id === 'simple-puzzle' || game.id === 'find-differences';
            return `
                <div class="game-card" data-age="${ageId}" data-category="${categoryId}" data-game="${game.id}" tabindex="0" aria-label="בחר משחק ${game.name}">
                    ${isReady ? '' : `<div class="game-status-icon" title="בקרוב"><span style='color:#ff9800;font-size:2em;font-weight:bold'>🔒</span></div>`}
                    <span class="game-icon"><span class="icon-circle">${game.icon}</span></span>
                    <h3 class="game-title">${game.name}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="difficulty-badge difficulty-${game.difficulty}">
                        ${this.getDifficultyText(game.difficulty)}
                    </div>
                </div>
            `;
        }).join('');
        
        // תמיכה ב־onclick וב־touchstart למשחקים
        Array.from(gamesGrid.querySelectorAll('.game-card')).forEach(card => {
            card.onclick = (e) => {
                e.preventDefault();
                const ageId = card.getAttribute('data-age');
                const categoryId = card.getAttribute('data-category');
                const gameId = card.getAttribute('data-game');
                app.selectGame(ageId, categoryId, gameId);
            };
            card.ontouchstart = (e) => {
                e.preventDefault();
                const ageId = card.getAttribute('data-age');
                const categoryId = card.getAttribute('data-category');
                const gameId = card.getAttribute('data-game');
                app.selectGame(ageId, categoryId, gameId);
            };
        });
    }

    selectGame(ageId, categoryId, gameId) {
        this.currentGame = gameId;
        this.playSound('success');
        this.startGame(ageId, categoryId, gameId);
    }

    startGame(ageId, categoryId, gameId) {
        const game = DataManager.getGame(ageId, categoryId, gameId);
        
        // טעינה דינמית של קובץ המשחק
        const scriptId = `game-script-${gameId}`;
        if (document.getElementById(scriptId)) {
            this.openGameModal(game);
            return;
        }
        const script = document.createElement('script');
        script.src = `js/games/${gameId}.js?v=${Date.now()}`;
        script.id = scriptId;
        script.onload = () => {
            if (window[gameId] && typeof window[gameId].init === 'function') {
                this.openGameModal(game);
            } else {
                alert('אירעה שגיאה בטעינת המשחק. ודא שהקובץ קיים ותקין.');
            }
        };
        script.onerror = () => {
            alert('לא ניתן לטעון את המשחק. ודא שהקובץ קיים בתיקיית js/games.');
        };
        document.body.appendChild(script);
    }

    openGameModal(game) {
        if (window[game.id] && typeof window[game.id].init === 'function') {
            window[game.id].init();
        } else {
            this.showGameMessage(game);
        }
    }

    showGameMessage(game) {
        // יצירת חלון מודאלי למשחק
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = `
            <div class="game-modal-content">
                <button class="close-button" onclick="this.parentElement.parentElement.remove()" style="position:fixed;top:12px;right:12px;z-index:2000;">×</button>
                <div class="game-modal-header">
                    <h2>${game.name}</h2>
                </div>
                <div class="game-modal-body">
                    <div class="game-icon-large">${game.icon}</div>
                    <p>${game.description}</p>
                    <div class="game-status">
                        <p>🎮 המשחק יפותח בקרוב!</p>
                        <p>בינתיים תוכלו לחקור קטגוריות אחרות</p>
                    </div>
                </div>
                <div class="game-modal-footer">
                    <button class="back-button" onclick="this.parentElement.parentElement.parentElement.remove()">
                        חזור לקטגוריות
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.playSound('game-start');
    }

    getDifficultyText(difficulty) {
        const difficultyTexts = {
            'easy': 'קל',
            'medium': 'בינוני', 
            'hard': 'קשה'
        };
        return difficultyTexts[difficulty] || 'לא ידוע';
    }

    addSoundEffects() {
        // הוספת אפקטים קוליים בסיסיים
        this.sounds = {
            click: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            success: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            gameStart: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(() => {
                // התעלם משגיאות קול אם הדפדפן לא תומך
            });
        }
    }

    setupMobileScrolling() {
        // שיפור גלילה במובייל
        if ('ontouchstart' in window) {
            // מניעת zoom על double tap
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);

            // מניעת scroll bounce במובייל
            document.addEventListener('touchmove', function (event) {
                if (event.scale !== 1) {
                    event.preventDefault();
                }
            }, { passive: false });

            // וידוא שהגלילה חלקה
            document.body.style.webkitOverflowScrolling = 'touch';
            
            // מניעת בעיות גלילה במובייל
            document.addEventListener('touchstart', function() {}, {passive: true});
            document.addEventListener('touchmove', function() {}, {passive: true});
            document.addEventListener('touchend', function() {}, {passive: true});
            
            // וידוא שאין אלמנטים שמסתירים את הגלילה
            const style = document.createElement('style');
            style.textContent = `
                * {
                    -webkit-overflow-scrolling: touch !important;
                }
                body, html {
                    overflow-x: hidden !important;
                    position: relative !important;
                }
                .age-button, .game-card, .category-card {
                    position: relative !important;
                    z-index: 10 !important;
                }
            `;
            document.head.appendChild(style);
            
            // תיקון נוסף לגלילה במובייל
            setTimeout(() => {
                // וידוא שהדף נטען כראוי
                document.body.style.height = 'auto';
                document.body.style.minHeight = '100vh';
                
                // מניעת בעיות עם viewport
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
                
                // וידוא שהגלילה עובדת
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }, 100);
        }
    }
}

// הוספת סגנונות CSS למודאל
const modalStyles = `
<style>
.game-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
}

.game-modal-content {
    background: white;
    border-radius: 20px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease-out;
}

.game-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.game-modal-header h2 {
    color: #333;
    margin: 0;
}

.close-button {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.close-button:hover {
    background: #f0f0f0;
    color: #333;
}

.game-icon-large {
    font-size: 4rem;
    margin: 20px 0;
}

.game-status {
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    padding: 20px;
    border-radius: 15px;
    margin: 20px 0;
}

.game-status p {
    margin: 10px 0;
    color: #333;
    font-weight: 600;
}

.difficulty-badge {
    display: inline-block;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-top: 10px;
}

.difficulty-easy {
    background: #4CAF50;
    color: white;
}

.difficulty-medium {
    background: #FF9800;
    color: white;
}

.difficulty-hard {
    background: #F44336;
    color: white;
}

.games-count {
    background: rgba(255, 255, 255, 0.8);
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 0.9rem;
    color: #666;
    margin-top: 10px;
}

@keyframes slideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.age-button-content {
    text-align: center;
}

.age-number {
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 5px;
}

.age-name {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 5px;
}

.age-description {
    font-size: 0.9rem;
    opacity: 0.9;
}
</style>
`;

// הוספת הסגנונות לדף
document.head.insertAdjacentHTML('beforeend', modalStyles);

// יצירת מופע האפליקציה
const app = new KidsApp();
window.app = app;

// פונקציות גלובליות למשחקים
window.showGameSelection = function() {
    app.showCategories(app.currentAge);
};

window.showAgeSelector = function() {
    app.showAgeSelector();
}; 