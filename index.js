const Gameboard = (function() {
    const board = [[],[],[]];
    let occupiedCells = 0;

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
        occupiedCells ++;
        return true;
    }


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
            diag[1].push(board[i][2-i]);
            allPossibleVariations.push(board[i]);
        };
        allPossibleVariations = [...allPossibleVariations, ...cols, ...diag];
        return allPossibleVariations;
    }

    const _hasSomeoneWon = () => {
        const allPossibleVariations = _getAllPossibleVariations();
        for(let i = 0; i<allPossibleVariations.length;i++)
        {
            let variation = allPossibleVariations[i];
            if(_AreAllItemsInArrayEqual(variation)) return true;
        }
        return false;
    }

    const _isDraw = () => occupiedCells === 9;

    const hasGameEnded = () => {
        if(_hasSomeoneWon()) {
            return 1;
        } else if(_isDraw()) {
            return 2;
        }
        return 0;
    }

    _build_board();

    return {place, printBoard, hasGameEnded};

})();

const player = function(name, symbol) {
    return {name, symbol};
};

const gameController = (function(player1, player2) {
    let activePlayer = player1;
    
    const changeActivePlayer = function() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const _checkGameState = () => {
        const result = Gameboard.hasGameEnded();
        if(result === 1) {
            console.log(`${activePlayer.name} has won!`);
            return true;
        } else if(result === 2) {
            console.log(`It's a draw!`);
            return true;
        }
        return false;
    }

    const play = function(x,y) {
        const moved = Gameboard.place(activePlayer.symbol, x,y);
        Gameboard.printBoard();
        if(moved && !_checkGameState()) {
            changeActivePlayer();
        }
    }

    return {play};
});