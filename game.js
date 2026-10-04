// Canvas i kontekst rysowania
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Stałe
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const GRID_COLS = 16;
const GRID_ROWS = 16;
const TILE_SIZE = 50; // px

// Stan gry
const board = [];
let mouseGridX = -1;
let mouseGridY = -1;

// Kolory
const COLORS = {
  background: '#14171d',
  gridLine: '#1e232d',
  tileHover: 'rgba(100, 150, 255, 0.3)',
  border: '#232730'
};

// Inicjalizacja planszy
function initBoard() {
  for (let y = 0; y < GRID_ROWS; y++) {
    board[y] = [];
    for (let x = 0; x < GRID_COLS; x++) {
      board[y][x] = 0; // 0 = puste pole
    }
  }
}

// Przeliczanie współrzędnych myszy na współrzędne siatki
function screenToGrid(screenX, screenY) {
  const canvasRect = canvas.getBoundingClientRect();
  const x = screenX - canvasRect.left;
  const y = screenY - canvasRect.top;

  const gridX = Math.floor(x / TILE_SIZE);
  const gridY = Math.floor(y / TILE_SIZE);

  if (gridX >= 0 && gridX < GRID_COLS && gridY >= 0 && gridY < GRID_ROWS) {
    return { gridX, gridY };
  }
  return { gridX: -1, gridY: -1 };
}

// Śledzenie ruchu myszy
document.addEventListener('mousemove', (e) => {
  const coords = screenToGrid(e.clientX, e.clientY);
  mouseGridX = coords.gridX;
  mouseGridY = coords.gridY;
});

// Śledzenie opuszczenia okna przeglądarki
document.addEventListener('mouseleave', () => {
  mouseGridX = -1;
  mouseGridY = -1;
});

// Rysowanie siatki
function drawGrid() {
  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 1;

  // Linie pionowe
  for (let x = 0; x <= GRID_COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * TILE_SIZE, 0);
    ctx.lineTo(x * TILE_SIZE, CANVAS_HEIGHT);
    ctx.stroke();
  }

  // Linie poziome
  for (let y = 0; y <= GRID_ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * TILE_SIZE);
    ctx.lineTo(CANVAS_WIDTH, y * TILE_SIZE);
    ctx.stroke();
  }
}

// Rysowanie podświetlenia kafelka pod kursorem
function drawHoverTile() {
  if (mouseGridX >= 0 && mouseGridY >= 0) {
    ctx.fillStyle = COLORS.tileHover;
    ctx.fillRect(
      mouseGridX * TILE_SIZE,
      mouseGridY * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  }
}

// Główna pętla renderująca
function render() {
  // Czyste tło
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Rysowanie siatki
  drawGrid();

  // Rysowanie podświetlenia
  drawHoverTile();

  // Następna klatka
  requestAnimationFrame(render);
}

// Inicjalizacja gry
initBoard();
render();
