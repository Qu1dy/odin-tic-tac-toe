const Gameboard = (function() {
    const board = [[],[],[]];
    
    function place(symbol,x,y) {
        if(board[y][x])
        {
            return false;
        }    
        board[y][x] = symbol;
        console.log(board);
        return true;
    }

    const getBoard = () => board;

    return {place, getBoard};

})();

const player = function(name, symbol) {
    return {name, symbol};
};
