const Gameboard = (function() {
    const board = [[],[],[]];

    function place(symbol,x,y) {
        if(board[y].length < x)
        {
            board[y][x] = symbol;
        }
    }
    return {place}
})();