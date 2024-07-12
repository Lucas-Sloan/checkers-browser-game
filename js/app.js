
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
    squareElement.forEach(square => {
        square.addEventListener('click' , handleMoveClick);
    });
    resetButton.addEventListener('click', resetGame);
}

function handlePieceClick(event) {
    const piece = event.target;
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);

    if(!isValidCoordinates(row, col) || gameState.board[row][col] === '' ) {
       return;
    }

    //clear any previously selected piece
    document.querySelectorAll('.movable').forEach(el => el.classList.remove('movable'));
    //Highlight the selected piece
    if (gameState.board[row][col].charAt(0) === gameState.currentPlayer.charAt(0)) {
        piece.classList.add('movable');
        gameState.selectedPiece = { row, col };
        clearHighlights();
        highlightMoves();

   }
}
function isValidCoordinates(row, col) {
    return row >= 0 && row < gameState.board.length && col >= 0 && col < gameState.board[row].length;
}

function highlightMoves() {
    const { row, col } = gameState.selectedPiece;
    const possibleMoves = getPossibleMoves(row, col, gameState.board[row][col]);

    for (let move of possibleMoves) {
        const [endRow, endCol] = move;
        const squareId = endRow * 8 + endCol;
        squareElement[squareId].classList.add('highlight');
    }
}

function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
}

function handleMoveClick(event) {
    // Get target element
    const target = event.target;

    // Calculate row index of target
    const targetId = parseInt(target.id);
    const row = Math.floor(targetId / 8);
    // Calculate column index of target
    const col = parseInt(targetId) % 8;

    if (!gameState.selectedPiece) {
        return;
    }
   
    const { row: startRow, col: startCol } = gameState.selectedPiece;

    //Move selected piece to new position
    movePiece({ row: startRow, col: startCol }, row, col);
    clearHighlights();
    renderBoard();

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

function movePiece(start, endRow, endCol) {
    //Extract row and col from starting position
    const row = start.row;
    const col = start.col;
    
    //Get piece at starting position
    const piece = gameState.board[row][col];
    
    //Clear the starting position
    gameState.board[row][col] = '';

    //Move piece to target position
    if (piece === 'r' && endRow === 7) {
        // Promote to red king
        gameState.board[endRow][endCol] = 'rk';
    } else if (piece === 'b' && endRow == 0) {
        // Promote to black king
        gameState.board[endRow][endCol] = 'bk';
    } else {
        // For kings, move them as is
        gameState.board[endRow][endCol] = piece;
    }


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