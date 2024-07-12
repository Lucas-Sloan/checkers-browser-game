
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

    if (canAnyPieceCapture() && gameState.selectedPiece && gameState.board[row][col].charAt(0) !== gameState.currentPlayer.charAt(0)) {
        return;
    }

    if (canAnyPieceCapture() && !canPieceCapture(row, col)) {
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
    //Check if row index is within range
    const isValidRow = row >= 0 && row < gameState.board.length;
    let isValidCol = false;
    //If row is valid, check if column index is within range
    if (isValidRow) {
        if(col >=0 && col < gameState.board[row]?.length) {
            isValidCol = true;
        }
    }

    // console.log(`isValidCoordinates - row: ${row}, col: ${col}, isValidRow: ${isValidRow}, isValidCol: ${isValidCol}`);
    //return true if valid
    return isValidRow && isValidCol;
}

function highlightMoves() {
    const { row, col } = gameState.selectedPiece;
    const { moves, captureMoves } = getPossibleMoves(row, col, gameState.board[row][col]);

    // console.log(`highlightMoves - possibleMoves: ${JSON.stringify(possibleMoves)}`);

    let possibleMoves;
    //Highlight capture moves first
    if (captureMoves.length > 0) {
        possibleMoves = captureMoves;
    } else {
        possibleMoves = moves;
    }

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

    //Check if capture moves are available
    if(canPieceCapture(startRow, startCol)) {
        //If selected move is not a capture, dont allow the move
        if (!isValidCapture(startRow, startCol, row, col)) {
            return;
        }
    }

    //Move selected piece to new position
    movePiece({ row: startRow, col: startCol }, row, col);
    clearHighlights();
    renderBoard();

    //Allow double jumps
    if (Math.abs(row - startRow) === 2) {
        if (canPieceCapture(row, col)) {
            gameState.selectedPiece = { row, col };
            highlightMoves();
        } else {
            switchPlayer();
            gameState.selectedPiece = null;
        }
    } else {
        switchPlayer();
        gameState.selectedPiece = null;
    }
}

function getPossibleMoves(row, col, piece) {
    const moves = [];
    const captureMoves = [];
    const directions =[];

    //Determine move directions
    if (piece === 'r' || piece === 'rk') {
        directions.push([1, -1], [1, 1]);
    } else if (piece === 'b' || piece === 'bk') {
        directions.push([-1, -1], [-1, 1]);
    }
    //Additional directions for kings
    if (piece === 'rk' || piece === 'bk') {
        directions.push([-1, -1], [-1, 1], [1, -1], [1,1]);
    }

    // console.log(`getPossibleMoves - piece: ${piece}, directions: ${JSON.stringify(directions)}`);

    //Calculate possible moves
    for (const [dRow, dCol] of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;
        const isValid = isValidMove(newRow, newCol);
        // console.log(`getPossibleMoves - checking move to (${newRow}, ${newCol}), isValid: ${isValid}`);
        //Check for regular moves
        if (isValidMove(newRow, newCol)) {
            moves.push([newRow, newCol]);
        }

        //Check for capture moves
        const captureRow = row + 2 * dRow;
        const captureCol = col + 2 * dCol;
        if (isValidCapture(row, col, captureRow, captureCol)) {
            captureMoves.push([captureRow, captureCol]);
        }
    }
    // console.log(`getPossibleMoves - moves: ${JSON.stringify(moves)}`);
    //Determine which moves to return
   return { moves, captureMoves };
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

    //Check if capturedRow and capturedCol are within bounds
    if (!isValidCoordinates(capturedRow, capturedCol)) {
        return false;
    }
    // console.log(`isValidCapture - start: (${startRow}, ${startCol}), end: (${endRow}, ${endCol}), capture: (${capturedRow}, ${capturedCol})`);
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

function canPieceCapture(row, col) {
    const piece = gameState.board[row][col];
    const { captureMoves } = getPossibleMoves(row, col, piece);

    return captureMoves.length > 0;
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
    gameState.selectedPiece = null;
    if(gameState.currentPlayer === 'black') {
        gameState.currentPlayer ='red';
    } else {
        gameState.currentPlayer = 'black'
    }
}
// function to stop players from selecting a different piece after a capture
function canAnyPieceCapture() {
    for (let row = 0; row < 8; row++) {
        for (let col =0; col < 8; col++) {
            if (gameState.board[row][col].charAt(0) === gameState.currentPlayer.charAt(0)) {
                if (canPieceCapture(row, col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function checkWin() {

}

function resetGame() {

}


initBoard();