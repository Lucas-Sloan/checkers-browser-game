
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
}

function handlePieceClick(event) {
    const piece = event.target;
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);
}

function highlightMoves() {

}

function clearHighlights() {

}

function handleMoveClick(event) {

}

function getPossibleMoves() {

}

function getCaptures() {

}

function isValidMove() {

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




/*----------------------------- Event Listeners -----------------------------*/
boardElement.addEventListener('click', handlePieceClick);
resetButton.addEventListener('click', resetGame);

initBoard();