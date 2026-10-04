// Canvas i kontekst rysowania
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('mainMenu');
const startBtn = document.getElementById('startBtn');

// Stałe
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const GRID_COLS = 32;
const GRID_ROWS = 32;
const TILE_SIZE = 25; // px
const KEEP_SIZE = 2; // 2x2
const PLACEMENT_PHASE_DURATION = 10; // sekund
const ZONE_SIZE = 8; // 8x8 kafelków na narożnik

// Stany gry
const GAME_STATE = {
  MENU: 'menu',
  PLACEMENT: 'placement',
  BATTLE: 'battle'
};

// Rodzaje kafelków
const TILE_TYPE = {
  EMPTY: 0,
  KEEP: 1,
  WALL: 2
};

// Kolory graczy
const PLAYER_COLORS = {
  1: '#6496ff', // niebieski
  2: '#ff4444', // czerwony
  3: '#44cc44', // zielony
  4: '#ffcc00'  // żółty
};

// Stan gry
const board = [];
let gameState = GAME_STATE.MENU;
let placementTimeLeft = PLACEMENT_PHASE_DURATION;
let placementStartTime = 0;
let mouseGridX = -1;
let mouseGridY = -1;
let keepPlaced = false;

// Kolory
const COLORS = {
  background: '#14171d',
  gridLine: '#1e232d',
  zoneValid: 'rgba(68, 204, 68, 0.15)',
  zoneInvalid: 'rgba(255, 68, 68, 0.15)',
  previewValid: 'rgba(68, 204, 68, 0.3)',
  previewInvalid: 'rgba(255, 68, 68, 0.3)',
  border: '#232730'
};

// Inicjalizacja planszy
function initBoard() {
  for (let y = 0; y < GRID_ROWS; y++) {
    board[y] = [];
    for (let x = 0; x < GRID_COLS; x++) {
      board[y][x] = TILE_TYPE.EMPTY;
    }
  }
}

// Funkcja rozpoczęcia gry
function startGame() {
  mainMenu.classList.add('hidden');
  gameState = GAME_STATE.PLACEMENT;
  placementStartTime = Date.now();
  initBoard();
  keepPlaced = false;
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

// Sprawdzenie czy pozycja jest w dozwolonej strefie dla Gracza 1 (lewy-górny róg)
function isValidPlacement(gridX, gridY) {
  if (gridX < 0 || gridY < 0 || gridX + KEEP_SIZE > ZONE_SIZE || gridY + KEEP_SIZE > ZONE_SIZE) {
    return false;
  }
  return true;
}

// Postawienie Keep'u (Donżonu)
function placeKeep(gridX, gridY) {
  if (!isValidPlacement(gridX, gridY)) return;

  for (let dy = 0; dy < KEEP_SIZE; dy++) {
    for (let dx = 0; dx < KEEP_SIZE; dx++) {
      board[gridY + dy][gridX + dx] = TILE_TYPE.KEEP;
    }
  }
  keepPlaced = true;
}

// Obsługa kliknięcia myszą
canvas.addEventListener('click', (e) => {
  if (gameState !== GAME_STATE.PLACEMENT) return;
  if (keepPlaced) return;

  const coords = screenToGrid(e.clientX, e.clientY);
  if (coords.gridX >= 0) {
    placeKeep(coords.gridX, coords.gridY);
  }
});

// Śledzenie ruchu myszy
document.addEventListener('mousemove', (e) => {
  const coords = screenToGrid(e.clientX, e.clientY);
  mouseGridX = coords.gridX;
  mouseGridY = coords.gridY;
});

// Śledzenie opuszczenia okna
document.addEventListener('mouseleave', () => {
  mouseGridX = -1;
  mouseGridY = -1;
});

// Rysowanie siatki
function drawGrid() {
  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 1;

  for (let x = 0; x <= GRID_COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * TILE_SIZE, 0);
    ctx.lineTo(x * TILE_SIZE, CANVAS_HEIGHT);
    ctx.stroke();
  }

  for (let y = 0; y <= GRID_ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * TILE_SIZE);
    ctx.lineTo(CANVAS_WIDTH, y * TILE_SIZE);
    ctx.stroke();
  }
}

// Rysowanie stref narożnych
function drawZones() {
  // Strefa Gracza 1 - lewy-górny róg
  ctx.fillStyle = COLORS.zoneValid;
  ctx.fillRect(0, 0, ZONE_SIZE * TILE_SIZE, ZONE_SIZE * TILE_SIZE);
}

// Rysowanie kafelków (Keep, Walls)
function drawTiles() {
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      const tile = board[y][x];

      if (tile === TILE_TYPE.KEEP) {
        ctx.fillStyle = PLAYER_COLORS[1];
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else if (tile === TILE_TYPE.WALL) {
        ctx.fillStyle = PLAYER_COLORS[1];
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

// Rysowanie podglądu Keep'u pod kursorem (faza rozstawienia)
function drawKeepPreview() {
  if (gameState !== GAME_STATE.PLACEMENT || keepPlaced) return;
  if (mouseGridX < 0 || mouseGridY < 0) return;

  const isValid = isValidPlacement(mouseGridX, mouseGridY);
  ctx.fillStyle = isValid ? COLORS.previewValid : COLORS.previewInvalid;

  ctx.fillRect(
    mouseGridX * TILE_SIZE,
    mouseGridY * TILE_SIZE,
    KEEP_SIZE * TILE_SIZE,
    KEEP_SIZE * TILE_SIZE
  );

  // Obramowanie
  ctx.strokeStyle = isValid ? COLORS.previewValid : COLORS.previewInvalid;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    mouseGridX * TILE_SIZE,
    mouseGridY * TILE_SIZE,
    KEEP_SIZE * TILE_SIZE,
    KEEP_SIZE * TILE_SIZE
  );
}

// Rysowanie HUD (licznik czasu, komunikaty)
function drawHUD() {
  const elapsed = (Date.now() - placementStartTime) / 1000;
  placementTimeLeft = Math.max(0, PLACEMENT_PHASE_DURATION - elapsed);

  ctx.fillStyle = '#e0e6ed';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';

  if (gameState === GAME_STATE.PLACEMENT) {
    if (!keepPlaced) {
      const timeStr = Math.ceil(placementTimeLeft);
      ctx.fillText(`Faza Budowy: Pozostało ${timeStr}s — Postaw Twierdzę (2x2)`, CANVAS_WIDTH / 2, 30);
    } else {
      ctx.fillText('Twierdzę postawiona! Czekanie na pozostałych graczy...', CANVAS_WIDTH / 2, 30);
    }

    // Przejście na fazę walki po upływie czasu
    if (placementTimeLeft <= 0 && gameState === GAME_STATE.PLACEMENT) {
      gameState = GAME_STATE.BATTLE;
    }
  } else if (gameState === GAME_STATE.BATTLE) {
    ctx.fillText('Faza Walki / Rozbudowy', CANVAS_WIDTH / 2, 30);
  }
}

// Główna pętla renderująca
function render() {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawZones();
  drawGrid();
  drawTiles();
  drawKeepPreview();
  drawHUD();

  requestAnimationFrame(render);
}

// Obsługa przycisków menu
startBtn.addEventListener('click', startGame);

// Inicjalizacja gry
initBoard();
render();
