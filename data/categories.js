// מבנה נתונים מודולרי לניהול הקטגוריות והמשחקים
const KIDS_DATA = {
    ages: [
        {
            id: "2-3",
            name: "גיל 2-3",
            description: "משחקים פשוטים",
            color: "#ff9a9e"
        },
        {
            id: "3-4", 
            name: "גיל 3-4",
            description: "למידה דרך משחק",
            color: "#a8edea"
        },
        {
            id: "4-5",
            name: "גיל 4-5", 
            description: "פיתוח מיומנויות",
            color: "#ffecd2"
        },
        {
            id: "5-6",
            name: "הכנה לבית ספר",
            description: "הכנה לבית ספר",
            color: "#ff9a9e"
        },
        {
            id: "6-7",
            name: "העמקת ידע בסיסי",
            description: "למידה מתקדמת",
            color: "#a8edea"
        },
        {
            id: "7-8",
            name: "פיתוח חשיבה לוגית",
            description: "פיתוח חשיבה",
            color: "#ffecd2"
        }
    ],
    
    categories: {
        "2-3": [
            {
                id: "all-2-3",
                name: "כל המשחקים לגיל 2-3",
                description: "מגוון משחקים חינוכיים לגיל 2-3",
                icon: "🎲",
                games: [
                    { id: 'color-match', name: 'התאמת צבעים', description: 'גרור כל צבע למקום המתאים', icon: '🎨', difficulty: 'easy' },
                    { id: 'shape-match', name: 'התאמת צורות', description: 'גרור צורה מתאימה למקום הנכון', icon: '🔷', difficulty: 'easy' },
                    { id: 'animal-sounds', name: 'זיהוי חיות וקולות', description: 'התאם בין חיה לקול שלה', icon: '🐶', difficulty: 'easy' },
                    { id: 'simple-puzzle', name: 'פאזל תמונות פשוט', description: 'הרכב תמונה החל מ-9 חלקים', icon: '🧩', difficulty: 'easy' },
                    { id: 'find-differences', name: 'מצא את ההבדלים', description: 'מצא 4 הבדלים בין תמונות - 10 שלבים', icon: '🔍', difficulty: 'easy' },
    
                    { id: 'count-objects', name: 'ספור חפצים', description: 'ספר חפצים עד 3', icon: '🔢', difficulty: 'easy' },
                    { id: 'what-is-missing', name: 'מה חסר?', description: 'מצא את הפריט החסר בתמונה', icon: '❓', difficulty: 'easy' },
                    { id: 'sound-match', name: 'צלילים ראשונים', description: 'התאם צליל לתמונה', icon: '🔊', difficulty: 'easy' },
                    { id: 'tower-builder', name: 'בניית מגדל קוביות', description: 'גרור קוביות ובנה מגדל', icon: '🧱', difficulty: 'easy' },
                    { id: 'digital-coloring', name: 'צביעה דיגיטלית', description: 'מלא שטחים בצבעים', icon: '🖌️', difficulty: 'easy' },
                ]
            }
        ],
        
        "3-4": [
            {
                id: "all-3-4",
                name: "כל המשחקים לגיל 3-4",
                description: "מגוון משחקים חינוכיים לגיל 3-4",
                icon: "🎲",
                games: [
                    { id: 'advanced-color-match', name: 'התאמת צבעים מתקדמת', description: 'התאם גוונים נוספים', icon: '🎨', difficulty: 'easy' },
                    { id: 'complex-shape-match', name: 'התאמת צורות מורכבות', description: 'התאם צורות כמו לב, כוכב, אליפסה', icon: '⭐', difficulty: 'medium' },
                    { id: 'first-letters', name: 'זיהוי אותיות ראשונות', description: 'התאם אות לתמונה', icon: 'א', difficulty: 'medium' },
                    { id: 'count-to-5', name: 'ספור חפצים (עד 5)', description: 'ספר חפצים ובחר את המספר', icon: '🔢', difficulty: 'easy' },
                    { id: 'odd-one-out', name: 'היוצא דופן', description: 'בחר את התמונה שלא שייכת לקבוצה', icon: '❓', difficulty: 'medium' },
                    { id: 'puzzle-4-6', name: 'פאזל תמונה (4–6 חלקים)', description: 'הרכב תמונה מחלקים', icon: '🧩', difficulty: 'medium' },
                    { id: 'complete-sequence', name: 'השלם את הסדרה', description: 'בחר מה ממשיך בסדרה של צבעים/צורות', icon: '➡️', difficulty: 'medium' },
                    { id: 'shadow-match', name: 'התאם צל לצורה', description: 'גרור צורה לצל המתאים', icon: '🌑', difficulty: 'medium' },
                    { id: 'repeat-sound', name: 'הקשב וחזור', description: 'חזור על צליל/מילה שנשמעה', icon: '🔊', difficulty: 'easy' },
                    { id: 'category-drag', name: 'גרור לאן שייך', description: 'גרור פריט לקטגוריה הנכונה', icon: '🗂️', difficulty: 'medium' },
                    { id: 'count-and-compare', name: 'ספור וקבע מי גדול/קטן', description: 'ספר והשווה כמויות', icon: '🔢', difficulty: 'medium' },
                ]
            }
        ],
        
        "4-5": [
            {
                id: "all-4-5",
                name: "כל המשחקים לגיל 4-5",
                description: "מגוון משחקים חינוכיים לגיל 4-5",
                icon: "🎲",
                games: [
                    { id: 'letter-recognition', name: 'זיהוי אותיות', description: 'התאם אות לתמונה', icon: 'א', difficulty: 'medium' },
                    { id: 'number-recognition', name: 'זיהוי מספרים', description: 'התאם מספר לכמות', icon: '🔢', difficulty: 'medium' },
                    { id: 'simple-addition', name: 'חיבור פשוט', description: 'חבר מספרים עד 5', icon: '➕', difficulty: 'medium' },
                    { id: 'puzzle-6-8', name: 'פאזל תמונה (6–8 חלקים)', description: 'הרכב תמונה מחלקים', icon: '🧩', difficulty: 'medium' },
                    { id: 'pair-match', name: 'התאם זוגות', description: 'התאם אות–תמונה, מספר–כמות', icon: '👫', difficulty: 'medium' },
                    { id: 'emotion-recognition', name: 'זיהוי רגשות בתמונה', description: 'בחר איזו הבעה מתאימה לסיטואציה', icon: '😊', difficulty: 'medium' },
                    { id: 'chronological-order', name: 'סדר כרונולוגי', description: 'סדר תמונות לפי סדר הגיוני', icon: '⏳', difficulty: 'medium' },
                    { id: 'sound-to-letter', name: 'התאם צליל לאות', description: 'התאם צליל לאות המתאימה', icon: '🔊', difficulty: 'medium' },
                    { id: 'color-by-instruction', name: 'צביעת דמויות לפי הוראות', description: 'צבע דמות לפי הוראות קוליות/כתובות', icon: '🖍️', difficulty: 'medium' },
                ]
            }
        ],
        
        "5-6": [
            {
                id: "all-5-6",
                name: "כל המשחקים לגיל 5-6",
                description: "מגוון משחקים חינוכיים לגיל 5-6",
                icon: "🎲",
                games: [
                    { id: 'simple-reading', name: 'קריאת מילים פשוטות', description: 'קרא מילים מהברות פשוטות', icon: '📖', difficulty: 'medium' },
                    { id: 'addition-subtraction', name: 'חיבור וחיסור עד 10', description: 'פתור תרגילים פשוטים', icon: '➕', difficulty: 'medium' },
                    { id: 'advanced-puzzle', name: 'פאזל מתקדם (8–12 חלקים)', description: 'הרכב תמונה מחלקים רבים', icon: '🧩', difficulty: 'hard' },
                    { id: 'complete-sentence', name: 'השלם משפט', description: 'בחר מילה מתאימה להשלמת משפט', icon: '✏️', difficulty: 'hard' },
                    { id: 'story-order', name: 'סדר את הסיפור', description: 'סדר תמונות לפי רצף סיפור', icon: '📚', difficulty: 'medium' },
                    { id: 'complete-word', name: 'השלם את המילה', description: 'השלם אות חסרה במילה', icon: '🔡', difficulty: 'hard' },
                    { id: 'word-to-picture', name: 'התאם מילה לתמונה', description: 'התאם מילה לתמונה מתאימה', icon: '🖼️', difficulty: 'medium' },
                    { id: 'pattern-completion', name: 'השלם תבנית', description: 'בחר מה ממשיך בתבנית של מספרים/צורות', icon: '🔲', difficulty: 'hard' },
                    { id: 'vehicle-match', name: 'התאם כלי תחבורה לסביבה', description: 'התאם רכב למקום המתאים', icon: '🚗', difficulty: 'medium' },
                    { id: 'memory-game', name: 'משחקי זיכרון', description: 'מצא זוגות קלפים תואמים', icon: '🃏', difficulty: 'medium' },
                ]
            }
        ],
        
        "6-7": [
            {
                id: "geography-israel",
                name: "גיאוגרפיה של ישראל",
                description: "למד על מפת ישראל",
                icon: "🗺️",
                games: [
                    {
                        id: "israel-map",
                        name: "מפת ישראל",
                        description: "זהה ערים בישראל",
                        icon: `<svg viewBox='0 0 32 32' width='32' height='32' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='16' cy='16' r='16' fill='#fffbe9'/><path d='M16 6l3.09 6.26L26 13.27l-5 4.87L22.18 26 16 21.77 9.82 26 11 18.14l-5-4.87 6.91-1.01L16 6z' fill='#FFD600' stroke='#A1887F' stroke-width='1.2'/><ellipse cx='13.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><ellipse cx='18.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><path d='M14 19c.5.5 2.5.5 3 0' stroke='#A1887F' stroke-width='1' stroke-linecap='round'/></svg>`,
                        difficulty: "hard"
                    }
                ]
            },
            {
                id: "history-israel",
                name: "היסטוריה של ישראל",
                description: "למד על דמויות חשובות",
                icon: `<svg viewBox='0 0 32 32' width='32' height='32' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='16' cy='16' r='16' fill='#fffbe9'/><path d='M16 6l3.09 6.26L26 13.27l-5 4.87L22.18 26 16 21.77 9.82 26 11 18.14l-5-4.87 6.91-1.01L16 6z' fill='#FFD600' stroke='#A1887F' stroke-width='1.2'/><ellipse cx='13.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><ellipse cx='18.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><path d='M14 19c.5.5 2.5.5 3 0' stroke='#A1887F' stroke-width='1' stroke-linecap='round'/></svg>`,
                games: [
                    {
                        id: "famous-people",
                        name: "דמויות חשובות",
                        description: "למד על דמויות בהיסטוריה",
                        icon: `<svg viewBox='0 0 32 32' width='32' height='32' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='16' cy='16' r='16' fill='#fffbe9'/><path d='M16 6l3.09 6.26L26 13.27l-5 4.87L22.18 26 16 21.77 9.82 26 11 18.14l-5-4.87 6.91-1.01L16 6z' fill='#FFD600' stroke='#A1887F' stroke-width='1.2'/><ellipse cx='13.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><ellipse cx='18.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><path d='M14 19c.5.5 2.5.5 3 0' stroke='#A1887F' stroke-width='1' stroke-linecap='round'/></svg>`,
                        difficulty: "hard"
                    }
                ]
            }
        ],
        
        "7-8": [
            {
                id: "math-advanced",
                name: "מתמטיקה מתקדמת",
                description: "כפל וחלוקה",
                icon: `<svg viewBox='0 0 32 32' width='32' height='32' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='16' cy='16' r='16' fill='#fffbe9'/><path d='M16 6l3.09 6.26L26 13.27l-5 4.87L22.18 26 16 21.77 9.82 26 11 18.14l-5-4.87 6.91-1.01L16 6z' fill='#FFD600' stroke='#A1887F' stroke-width='1.2'/><ellipse cx='13.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><ellipse cx='18.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><path d='M14 19c.5.5 2.5.5 3 0' stroke='#A1887F' stroke-width='1' stroke-linecap='round'/></svg>`,
                games: [
                    {
                        id: "multiplication",
                        name: "לוח הכפל",
                        description: "למד כפל פשוט",
                        icon: `<svg viewBox='0 0 32 32' width='32' height='32' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='16' cy='16' r='16' fill='#fffbe9'/><path d='M16 6l3.09 6.26L26 13.27l-5 4.87L22.18 26 16 21.77 9.82 26 11 18.14l-5-4.87 6.91-1.01L16 6z' fill='#FFD600' stroke='#A1887F' stroke-width='1.2'/><ellipse cx='13.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><ellipse cx='18.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><path d='M14 19c.5.5 2.5.5 3 0' stroke='#A1887F' stroke-width='1' stroke-linecap='round'/></svg>`,
                        difficulty: "hard"
                    }
                ]
            },
            {
                id: "programming-basic",
                name: "תכנות בסיסי",
                description: "לוגיקה ותכנות",
                icon: `<svg viewBox='0 0 32 32' width='32' height='32' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='16' cy='16' r='16' fill='#fffbe9'/><path d='M16 6l3.09 6.26L26 13.27l-5 4.87L22.18 26 16 21.77 9.82 26 11 18.14l-5-4.87 6.91-1.01L16 6z' fill='#FFD600' stroke='#A1887F' stroke-width='1.2'/><ellipse cx='13.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><ellipse cx='18.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><path d='M14 19c.5.5 2.5.5 3 0' stroke='#A1887F' stroke-width='1' stroke-linecap='round'/></svg>`,
                games: [
                    {
                        id: "coding-logic",
                        name: "לוגיקה ותכנות",
                        description: "למד יסודות התכנות",
                        icon: `<svg viewBox='0 0 32 32' width='32' height='32' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='16' cy='16' r='16' fill='#fffbe9'/><path d='M16 6l3.09 6.26L26 13.27l-5 4.87L22.18 26 16 21.77 9.82 26 11 18.14l-5-4.87 6.91-1.01L16 6z' fill='#FFD600' stroke='#A1887F' stroke-width='1.2'/><ellipse cx='13.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><ellipse cx='18.5' cy='15.5' rx='1.2' ry='1.5' fill='#A1887F'/><path d='M14 19c.5.5 2.5.5 3 0' stroke='#A1887F' stroke-width='1' stroke-linecap='round'/></svg>`,
                        difficulty: "hard"
                    }
                ]
            }
        ]
    }
};

// פונקציות עזר לניהול הנתונים
const DataManager = {
    // קבל את כל הגילאים
    getAges() {
        return KIDS_DATA.ages;
    },
    
    // קבל קטגוריות לגיל מסוים
    getCategoriesForAge(ageId) {
        return KIDS_DATA.categories[ageId] || [];
    },
    
    // קבל משחקים לקטגוריה מסוימת
    getGamesForCategory(ageId, categoryId) {
        const categories = this.getCategoriesForAge(ageId);
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.games : [];
    },
    
    // קבל קטגוריה ספציפית
    getCategory(ageId, categoryId) {
        const categories = this.getCategoriesForAge(ageId);
        return categories.find(cat => cat.id === categoryId);
    },
    
    // קבל משחק ספציפי
    getGame(ageId, categoryId, gameId) {
        if (categoryId) {
            const games = this.getGamesForCategory(ageId, categoryId);
            return games.find(game => game.id === gameId);
        } else {
            // חפש בכל הקטגוריות של הגיל
            const categories = this.getCategoriesForAge(ageId);
            for (const cat of categories) {
                const found = cat.games.find(game => game.id === gameId);
                if (found) return found;
            }
            return undefined;
        }
    },
    
    // הוסף קטגוריה חדשה
    addCategory(ageId, category) {
        if (!KIDS_DATA.categories[ageId]) {
            KIDS_DATA.categories[ageId] = [];
        }
        KIDS_DATA.categories[ageId].push(category);
    },
    
    // הוסף משחק חדש
    addGame(ageId, categoryId, game) {
        const category = this.getCategory(ageId, categoryId);
        if (category) {
            category.games.push(game);
        }
    },
    
    // עדכן קטגוריה
    updateCategory(ageId, categoryId, updatedCategory) {
        const categories = this.getCategoriesForAge(ageId);
        const index = categories.findIndex(cat => cat.id === categoryId);
        if (index !== -1) {
            categories[index] = { ...categories[index], ...updatedCategory };
        }
    },
    
    // עדכן משחק
    updateGame(ageId, categoryId, gameId, updatedGame) {
        const games = this.getGamesForCategory(ageId, categoryId);
        const index = games.findIndex(game => game.id === gameId);
        if (index !== -1) {
            games[index] = { ...games[index], ...updatedGame };
        }
    },
    
    // מחק קטגוריה
    deleteCategory(ageId, categoryId) {
        const categories = this.getCategoriesForAge(ageId);
        const index = categories.findIndex(cat => cat.id === categoryId);
        if (index !== -1) {
            categories.splice(index, 1);
        }
    },
    
    // מחק משחק
    deleteGame(ageId, categoryId, gameId) {
        const games = this.getGamesForCategory(ageId, categoryId);
        const index = games.findIndex(game => game.id === gameId);
        if (index !== -1) {
            games.splice(index, 1);
        }
    }
}; 