const Gameboard = (function() {
    const board = [[],[],[]];
    
    function place(symbol,x,y) {
        if(!board[y][x])
        {
            board[y][x] = symbol;
        }
        console.log(board);
    }
    return {place};
})();

const player = function(name, symbol) {
    return {name, symbol};
}