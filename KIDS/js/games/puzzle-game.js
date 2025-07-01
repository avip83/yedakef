// Puzzle Game Setup
const puzzleImage = 'puzzle/6.png';
const pieceShapes = [
  { id: 0, edges: ['flat', 'out', 'out', 'flat'] }, // Top-left corner
  { id: 1, edges: ['flat', 'in', 'out', 'in'] },   // Top-center
  { id: 2, edges: ['flat', 'flat', 'in', 'out'] }, // Top-right corner
  { id: 3, edges: ['in', 'out', 'out', 'flat'] },  // Middle-left
  { id: 4, edges: ['in', 'in', 'out', 'out'] },    // Center
  { id: 5, edges: ['in', 'flat', 'out', 'out'] },  // Middle-right
  { id: 6, edges: ['out', 'out', 'flat', 'flat'] },// Bottom-left corner
  { id: 7, edges: ['out', 'in', 'flat', 'out'] },  // Bottom-center
  { id: 8, edges: ['out', 'flat', 'flat', 'in'] }  // Bottom-right corner
];

// Function to initialize the puzzle
function initPuzzle() {
  const puzzleContainer = document.getElementById('puzzle-container');
  pieceShapes.forEach(shape => {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.style.backgroundImage = `url(${puzzleImage})`;
    piece.dataset.id = shape.id;
    puzzleContainer.appendChild(piece);
  });
}

// Call the initialization function
initPuzzle(); 