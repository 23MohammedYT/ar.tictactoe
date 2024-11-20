const mainMenu = document.getElementById('main-menu');
const gameSection = document.getElementById('game');
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const pvpButton = document.getElementById('pvp');
const pvcButton = document.getElementById('pvc');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let isVsComputer = false; // Track game mode

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function createBoard() {
    board.innerHTML = '';
    gameState = ['', '', '', '', '', '', '', '', ''];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = `دور اللاعب ${currentPlayer}`;
}

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (gameState[index] !== '' || !gameActive) return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    checkResult();

    if (isVsComputer && gameActive && currentPlayer === 'O') {
        computerMove();
    }
}

function computerMove() {
    if (!gameActive) return;

    // Helper function to find a winning move
    function findWinningMove(player) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            const line = [gameState[a], gameState[b], gameState[c]];
            const emptyIndex = line.indexOf('');
            if (line.filter(val => val === player).length === 2 && emptyIndex !== -1) {
                return condition[emptyIndex];
            }
        }
        return null;
    }

    // 1. Try to win
    let bestMove = findWinningMove('O');
    if (bestMove !== null) {
        makeMove(bestMove);
        return;
    }

    // 2. Block opponent
    bestMove = findWinningMove('X');
    if (bestMove !== null) {
        makeMove(bestMove);
        return;
    }

    // 3. Choose strategic positions
    const strategicPositions = [4, 0, 2, 6, 8]; // Center and corners
    bestMove = strategicPositions.find(pos => gameState[pos] === '');
    if (bestMove !== undefined) {
        makeMove(bestMove);
        return;
    }

    // 4. Fallback to a random move
    const availableCells = gameState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(bestMove);
}

// Helper function to make a move
function makeMove(index) {
    gameState[index] = 'O';
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = 'O';
    cell.classList.add('taken');

    checkResult();
}

function checkResult() {
    let roundWon = false;

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `فاز اللاعب ${currentPlayer}!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusText.textContent = 'تعادل!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `دور اللاعب ${currentPlayer}`;
}

resetButton.addEventListener('click', createBoard);

pvpButton.addEventListener('click', () => {
    isVsComputer = false;
    mainMenu.style.display = 'none';
    gameSection.style.display = 'block';
    createBoard();
});

pvcButton.addEventListener('click', () => {
    isVsComputer = true;
    mainMenu.style.display = 'none';
    gameSection.style.display = 'block';
    createBoard();
});