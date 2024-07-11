let gameState = {

    board: [

        ["", "r", "", "r", "", "r", "", "r"],

        ["r", "", "r", "", "r", "", "r", ""],

        ["", "r", "", "r", "", "r", "", "r"],

        ["", "", "", "", "", "", "", ""],

        ["", "", "", "", "", "", "", ""],

        ["b", "", "b", "", "b", "", "b", ""],

        ["", "b", "", "b", "", "b", "", "b"],

        ["b", "", "b", "", "b", "", "b", ""]

    ],

    currentPlayer: "black",

    redScore: 0,

    blackScore: 0,

    selectedPiece: null,
    
    validMoves: []
};