
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

    // console.log(`handlePieceClick - row: ${row}, col: ${col}`);

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

    // console.log(`highlightMoves - possibleMoves: ${JSON.stringify(possibleMoves)}`);

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

    // console.log(`handleMoveClick - row: ${row}, col: ${col}`);

    //If no piece is selected, return
    if (!gameState.selectedPiece) {
        return;
    }

    //Ensure target square is highlighted
    if (!target.classList.contains('highlight')) {
        return;
    }

    //Extract starting position of selected piece
    const { row: startRow, col: startCol } = gameState.selectedPiece;

    //Move selected piece to new position
    movePiece({ row: startRow, col: startCol }, row, col);
    clearHighlights();
    renderBoard();

    if(checkWin()) {
        winnerMessage.textContent = `${gameState.currentPlayer.charAt(0).toUpperCase() + gameState.currentPlayer.slice(1)} wins!`;
    } else {
        switchPlayer();
    }

}

function getPossibleMoves(row, col, piece) {
    const moves = [];
    const directions =[];

    //Determine move directions
    if (piece === 'r' || piece === 'rk') {
        directions.push([1, -1], [1, 1]);
    } else if (piece === 'b' || piece === 'bk') {
        directions.push([-1, -1], [-1, 1]);
    }
    //Additional directions for kings
    if (piece === 'rk' || piece === 'bk') {
        if (piece === 'r' || piece === 'rk') {
            directions.push([-1, -1], [-1, 1]);
        } else if (piece === 'b' || piece === 'bk') {
            directions.push([1, -1], [1, 1]);
        }
    }

    // console.log(`getPossibleMoves - piece: ${piece}, directions: ${JSON.stringify(directions)}`);

    //Calculate possible moves
    for (const [dRow, dCol] of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;
        const isValid = isValidMove(newRow, newCol);
        // console.log(`getPossibleMoves - checking move to (${newRow}, ${newCol}), isValid: ${isValid}`);
        if (isValidMove(newRow, newCol)) {
            moves.push([newRow, newCol]);
        }

        //Capture moves
        const captureRow = row + 2 * dRow;
        const captureCol = col + 2 * dCol;
        if (isValidCapture(row, col, captureRow, captureCol)) {
            moves.push([captureRow, captureCol]);
        }
    }
    // console.log(`getPossibleMoves - moves: ${JSON.stringify(moves)}`);

    return moves;
}

function isValidMove(row, col) {
    // Check if the move is within the board
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        // Check if the target square is empty
        const isEmpty = gameState.board[row][col] === "";
        // console.log(`isValidMove - position (${row}, ${col}) is empty: ${isEmpty}`);
        return isEmpty;
    }
    return false;
}

function movePiece(start, endRow, endCol) {
    //Extract row and col from starting position
    const row = start.row;
    const col = start.col;
    
    //Get piece at starting position
    const piece = gameState.board[row][col];
    
    //Clear the starting position
    gameState.board[row][col] = '';

    //Handle capture
    if (Math.abs(endRow - row) === 2 && Math.abs(endCol - col) === 2) {
        const capturedRow = (row + endRow) / 2;
        const capturedCol = (col + endCol) /2;
        gameState.board[capturedRow][capturedCol] = '';
    }

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

function isValidCapture(startRow, startCol, endRow, endCol) {
    //Check if target is on the board
    if (!isValidCoordinates(endRow, endCol)) {
        return false;
    }

    //Check if end position is empty
    if(gameState.board[endRow][endCol] !== '') {
        return false;
    }

    //Determine direction of capture
    const captureDirection = {
        row: (endRow - startRow) / 2,
        col: (endCol - startCol) / 2
    };

    //Calculate position of piece being captured
    const capturedRow = startRow + captureDirection.row;
    const capturedCol = startCol + captureDirection.col;

    //Check if there's a piece to capture
    const opponentPiece = gameState.board[capturedRow][capturedCol];
    return opponentPiece && opponentPiece.charAt(0) !== gameState.currentPlayer.charAt(0);
}

function getCaptures() {
    const captures = [];

    //Iterate through the board
    for (let row =0; row < 8; row++) {
        for (let col =0; col < 8; col++) {
            //Check if current piece belongs to current player
            if (gameState.board[row][col].charAt(0) === gameState.currentPlayer.charAt(0)) {
               // Get possible moves for piece
               const possibleMoves = getPossibleMoves(row, col, gameState.board[row][col]); 

               //Check move for valid capture
               for (let move of possibleMoves) {
                const [endRow, endCol] = move;
                if (isValidCapture(row, col, endRow, endCol)) {
                    captures.push({ start: { row, col }, end: { row: endRow, col: endCol } });
                }
               }
            }
        }
    }
    return captures;
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