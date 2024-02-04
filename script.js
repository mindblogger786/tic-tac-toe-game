document.addEventListener('DOMContentLoaded', init);

let board, currentPlayer, gameOver;

function init() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.textContent = board[i];
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    }

    updateStatus();
}

function handleCellClick(event) {
    if (gameOver) return;

    const index = event.target.getAttribute('data-index');

    if (board[index] === '') {
        board[index] = currentPlayer;
        renderBoard();
        checkGameStatus();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (!gameOver && currentPlayer === 'O') {
            // Simulate AI's turn
            setTimeout(() => makeAIMove(), 500);
        }
    }
}

function makeAIMove() {
    const bestMove = minimax(board, 'O').index;
    board[bestMove] = 'O';
    renderBoard();
    checkGameStatus();
    currentPlayer = 'X';
}

function minimax(board, player) {
    const availableMoves = getEmptyCells(board);

    if (checkWinner(board, 'X')) {
        return { score: -1 };
    } else if (checkWinner(board, 'O')) {
        return { score: 1 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        move.index = availableMoves[i];
        board[availableMoves[i]] = player;

        if (player === 'O') {
            const result = minimax(board, 'X');
            move.score = result.score;
        } else {
            const result = minimax(board, 'O');
            move.score = result.score;
        }

        board[availableMoves[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function getEmptyCells(board) {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            emptyCells.push(i);
        }
    }
    return emptyCells;
}

function checkGameStatus() {
    if (checkWinner(board, 'X')) {
        updateStatus('You win! 😇');
        gameOver = true;
    } else if (checkWinner(board, 'O')) {
        updateStatus('AI wins! 😈');
        gameOver = true;
    } else if (!board.includes('')) {
        updateStatus("It's a tie!");
        gameOver = true;
    }
}

function checkWinner(board, player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        if (board[pattern[0]] === player && board[pattern[1]] === player && board[pattern[2]] === player) {
            return true;
        }
    }

    return false;
}

function updateStatus(message = `${currentPlayer}'s turn`) {
    document.getElementById('status').textContent = message;
}

function restartGame() {
    init();
}
