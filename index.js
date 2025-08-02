const Gameboard = (function() {
    let board;
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

    const getBoard = () => board;

    const _hasSomeoneWon = () => {
        const allPossibleVariations = _getAllPossibleVariations();
        for(let i = 0; i<allPossibleVariations.length;i++)
        {
            let variation = allPossibleVariations[i];
            if(_AreAllItemsInArrayEqual(variation)) return true;
        }
        return false;
    }

    const _resetBoard = () => {
        board = [[],[],[]];
        _build_board();
    }

    const _isDraw = () => occupiedCells === 9;

    const hasGameEnded = () => {
        const hasSomeoneWon = _hasSomeoneWon();
        const isDraw = _isDraw();
        if(!hasSomeoneWon && !isDraw) return 0;
        _resetBoard();
        if(hasSomeoneWon) {
            return 1;
        } else if(isDraw) {
            return 2;
        }
    }

    _resetBoard();

    return {place, getBoard, hasGameEnded};

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
        displayController.render();
        if(result === 1) {
            return true;
        } else if(result === 2) {
            return true;
        }
        return false;
    }

    const play = function(x,y) {
        const moved = Gameboard.place(activePlayer.symbol, x,y);
        displayController.render();
        if(moved && !_checkGameState()) {
            changeActivePlayer();
        }
    }

    return {play};
});

const displayController = (() => {
    const gameDiv = document.querySelector(".game");

    const render = () => {
        const board = Gameboard.getBoard();
        gameDiv.innerHTML = "";
        board.forEach((row, rowNum) => {
            row.forEach((col, colNum) => {
                const colDiv = document.createElement("div");
                colDiv.innerText = col;
                colDiv.dataset.y = rowNum;
                colDiv.dataset.x = colNum;
                colDiv.classList.add("col");
                colDiv.addEventListener("click", _onCellClick);
                gameDiv.appendChild(colDiv);
           });
        });
    };

    const _onCellClick = (event) => {
        const divClicked = event.target;
        const x = divClicked.dataset.x;
        const y = divClicked.dataset.y;
        controller.play(x, y);
    }

    const createPopUp = (message) => {
        alert(message);
    }

    render();

    return {render, createPopUp};
})();

const player1 = player("aaa", "o");
const player2 = player("bbb", "x");
const controller = gameController(player1, player2);