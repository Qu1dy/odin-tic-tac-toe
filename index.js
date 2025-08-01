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