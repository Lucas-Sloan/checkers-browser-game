
/*------------------------ Cached Element References ------------------------*/

const boardElement = document.querySelector('.board');
const squareElement = document.querySelectorAll('.sqr')
const winnerMessage = document.getElementById('winnerMessage');
const resetButton = document.getElementById('reset');

const redPawnImage = 'images/red-pawn.png';
const blackPawnImage = 'images/black-pawn.png';
const redKingImage = 'images/red-king.png';
const blackKingImage = 'images/black-king.png';

/*-------------------------------- Functions --------------------------------*/

function initBoard() {
    renderBoard();
    boardElement.addEventListener('click', handlePieceClick);
    resetButton.addEventListener('click', resetGame);
}

function handlePieceClick(event) {
    const piece = event.target;
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);

    if(isValidCoordinates(row, col) && gameState.board[row][col].charAt(0) === gameState.currentPlayer.charAt(0)) {
       gameState.selectedPiece = { row, col }; 
       highlightMoves();
    }
}
function isValidCoordinates(row, col) {
    return row >= 0 && row < gameState.board.length && col >= 0 && col < gameState.board[row].length;
}

function highlightMoves() {
    const {row, col} = gameState.selectedPiece;
    const possibleMoves = getPossibleMoves(row, col);

    for (let move of possibleMoves) {
        const [endRow, endCol] = move;
        const squareId = endRow *8 + endCol;
        squareElement[squareId].classList.add('highlight');
    }
}

function clearHighlights() {

}

function handleMoveClick(event) {

}

function getPossibleMoves(row, col, piece) {
    const moves = [];
    const directions =[];

    //Determine move directions
    if (piece === 'r' || piece === 'rk') {
        directions.push([-1, -1], [-1, 1]);
    } else if (piece === 'b' || piece === 'bk') {
        directions.push([1, -1], [1, 1]);
    }
    //Additional directions for kings
    if (piece === 'rk' || piece === 'bk') {
        if (piece === 'r' || piece === 'rk') {
            directions.push([1, -1], [1, 1]);
        } else if (piece === 'b' || piece === 'bk') {
            directions.push([-1, -1], [-1, 1]);
        }
    }

    //Calculate possible moves
    for (const [dRow, dCol] of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;
        if (isValidMove(newRow, newCol)) {
            moves.push([newRow, newCol]);
        }
    }

    return moves;
}

function getCaptures() {

}

function isValidMove(row, col) {
    // Check if the move is within the board
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        // Check if the target square is empty
        return gameState.board[row][col] === "";
    }
    return false;
}

function isValidCapture() {

}

function movePiece() {

}

function promoteKing() {

}

function renderBoard() {
    for (let row = 0; row <8; row++) {
        for (let col = 0; col < 8; col++) {
            const squareId = row * 8 + col;
            const square = squareElement[squareId];

            square.style.backgroundImage = 'none';

            if (gameState.board[row][col] === 'r') {
                square.style.backgroundImage = `url(${redPawnImage})`;
            } else if (gameState.board[row][col] === 'b') {
                square.style.backgroundImage = `url(${blackPawnImage})`; 
            } else if (gameState.board[row][col] === 'rk') {
                square.style.backgroundImage = `url(${redKingImage})`;
            } else if (gameState.board[row][col] === 'bk') {
                square.style.backgroundImage = `url(${blackKingImage})`;
            }
        }
    }
}

function switchPlayer() {
    if(gameState.currentPlayer === 'black') {
        gameState.currentPlayer ='red';
    } else {
        gameState.currentPlayer = 'black'
    }
}

function checkWin() {

}

function resetGame() {

}


initBoard();