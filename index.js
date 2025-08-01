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
        });
    };

    const _AreAllItemsInArrayEqual = (row) => {
        let first = row[0];
        if(first === " ") return false;
        for(let i =1;i<row.length;i++) {
            if(first !== row[i]) return false;
        }
        return true;
    }
 
    const _getAllPossibleVariations = () => {
        const cols = [[],[],[]];
        const diag = [[], []];
        let allPossibleVariations = [];
        for(let i = 0;i<3;i++) {
            cols[i].push(board[0][i], board[1][i], board[2][i]);
            diag[0].push(board[i][i]);
            diag[1].push(board[2-i][2-i]);
            allPossibleVariations.push(board[i]);
        };
        allPossibleVariations = [...allPossibleVariations, ...cols, ...diag];
        return allPossibleVariations;
    }
    const hasGameEnded = () => {
        const allPossibleVariations = _getAllPossibleVariations();
        for(let i = 0; i<allPossibleVariations.length;i++)
        {
            let variation = allPossibleVariations[i];
            if(_AreAllItemsInArrayEqual(variation)) return true;
        }
        return false;
    }

    _build_board();

    return {place, printBoard, hasGameEnded};

})();

const player = function(name, symbol) {
    return {name, symbol};
};

const player1 = player("meow", "o");
const player2 = player("avi", "x");

const gameController = (function(player1, player2) {
    let activePlayer = player1;
    
    const changeActivePlayer = function() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }
    
    const play = function() {
        console.log(`It is ${activePlayer.name}'s turn`)
        const x = prompt("enter X ");
        const y = prompt("enter Y ")
        _place(x,y);
        Gameboard.printBoard();
        if(Gameboard.hasGameEnded()) {
            console.log(`${activePlayer.name} has won!`)
        }
    }

    const _place = function(x,y)
    {
        const isCellFree = Gameboard.place(activePlayer.symbol, x,y);
        if(isCellFree)
            changeActivePlayer();
        else
            console.log("This is taken!");
    }

    return {play} 
})(player1, player2);

while(true) {
    gameController.play();
}