const prompt = require('prompt-sync')(); 

const Gameboard = (function() {
    const board = [[],[],[]];
    
    function _build_board() {
        for(let i =0;i<3;i++) {
            for(let j=0;j<3;j++) {
                board[i][j] = " ";
            }
        }
    }


    const place = function(symbol,x,y) {
        if(board[y][x] !== " ")
        {
            return false;
        }
        board[y][x] = symbol;
        return true;
    }

    const printBoard = () => {
        board.forEach(row => {
            console.log(row.join("|"));
        })
    };

    _build_board();

    return {place, printBoard};

});

const player = function(name, symbol) {
    return {name, symbol};
};

const gameController = (function(player1, player2) {

    const board = Gameboard();
    let activePlayer = player1;
    
    const changeActivePlayer = function() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const getActivePlayer = () => activePlayer;
    
    const play = function() {
        console.log(`It is ${controller.getActivePlayer().name}'s turn`)
        const x = prompt("enter X");
        const y = prompt("entet Y")
        _place(x,y);
        board.printBoard();
    }

    const _place = function(x,y)
    {
        const isCellFree = board.place(activePlayer.symbol, x,y);
        if(isCellFree)
            changeActivePlayer();
        else
            console.log("This is taken!");
    }

    return {play, getActivePlayer} 
});

const player1 = player("meow", "o");
const player2 = player("avi", "x");

const controller = gameController(player1,player2); 
while(true) {
    controller.play();
}