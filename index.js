const Gameboard = (function() {
    let board = [[],[],[]];
    let occupiedCells;

    const _buildBoard = () => {
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
        for(let i = 0;i<board.length;i++) {
            for(let j = 0;j<board.length;j++)
                cols[i].push(board[j][i]);
            diag[0].push(board[i][i]);
            diag[1].push(board[i][board.length-1-i]);
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

    const resetBoard = () => {
        occupiedCells = 0;
        board = [[],[],[]]; 
        _buildBoard();
        console.log(board);
    }

    const _isDraw = () => occupiedCells === 9;

    const getGameState = () => {
        const hasSomeoneWon = _hasSomeoneWon();
        const isDraw = _isDraw();
        if(!hasSomeoneWon && !isDraw) return 0;
        if(hasSomeoneWon) {
            return 1;
        } else if(isDraw) {
            return 2;
        }
    }

    return {place, getBoard, getGameState, resetBoard};

})();

const player = function(name, symbol) {
    return {name, symbol, wins: 0};
};

const playerHandler = (() => {
    const form = document.querySelector("form");

    let player1, player2;

    const _onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const player1Name = formData.get("player1");
        const player2Name = formData.get("player2");

        player1 = player(player1Name, "X");
        player2 = player(player2Name, "O");

        Gameboard.resetBoard();
        gameController(player1, player2);
    }
    form.addEventListener("submit", _onSubmit)
})();

const gameController = ((player1, player2) => {
    let activePlayer = player1;
    
    const dc = displayController(play);
    dc.renderTurn(activePlayer.name);
    dc.renderStatus("IN GAME");
    const changeActivePlayer = function() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const _hasGameEnded = () => {
        const result = Gameboard.getGameState();
        if(result === 0) return false;
        else if(result === 1) {
            activePlayer.wins++;
            activePlayer === player1 ? dc.renderP1Win(activePlayer.wins) : dc.renderP2Win(activePlayer.wins);
            dc.renderMessage(`${activePlayer.name} has won!`, 3);
        } else {
            dc.renderMessage("It's a draw!", 3);
        }
        dc.renderStatus("GAME ENDED")
        return true;
    }

    function play(x,y) {
        if(Gameboard.getGameState() !== 0) return;
        const moved = Gameboard.place(activePlayer.symbol, x,y);
        dc.renderBoard();
        if(moved && !_hasGameEnded()) {
            changeActivePlayer();
            dc.renderTurn(activePlayer.name);
        }
    }
});

const displayController = ((play) => {
    
    const _cacheDom = () => {
        this.overlay = document.querySelector(".overlay");
        this.overlayText = overlay.querySelector(".text");
        this.gameDiv = document.querySelector(".game");
        this.players = document.querySelector(".players");
        this.startButton = document.querySelector("#start");

        const info = document.querySelector(".info");
        this.infoStatus = info.querySelector(".game-status");
        this.turn = info.querySelector(".turn");
        const gamesWon = info.querySelector(".games-won");
        this.wonP1 = gamesWon.querySelector(".p1");
        this.wonP2 = gamesWon.querySelector(".p2");
    }

    const _showGame = () => {
        this.players.style.display = "none";
        this.startButton.style.display = "none";
        this.gameDiv.style.display = "grid";
    }

    const _createCol = (col, rowNum, colNum) => {
        const colDiv = document.createElement("div");
        colDiv.innerText = col;
        colDiv.dataset.y = rowNum;
        colDiv.dataset.x = colNum;
        colDiv.classList.add("col");
        colDiv.addEventListener("click", _onCellClick);
        return colDiv;
    }

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        this.gameDiv.innerHTML = "";
        board.forEach((row, rowNum) => {
            row.forEach((col, colNum) => {
                const colDiv = _createCol(col, rowNum, colNum);
                this.gameDiv.appendChild(colDiv);
           });
        });
    };

    const renderTurn = (activePlayerName) => {
        this.turn.innerText = `${activePlayerName}'s turn` 
    }

    const renderStatus = (status) => {
        this.infoStatus.innerText = `STATUS: ${status}`;
    }


    const renderP1Win = (amount) => {
        const currentText = this.wonP1.innerText;
        this.wonP1.innerText = `${currentText.split(": ")[0]}: ${amount}`;
    }

    const renderP2Win = (amount) => {
        const currentText = this.wonP2.innerText;
        this.wonP2.innerText = `${currentText.split(": ")[0]}: ${amount}`;
    }

    const renderMessage = (message, duration) => {
        this.overlay.style.display = "flex";
        this.overlayText.innerText = message; 
        setTimeout(() => {
            this.overlay.style.display = "none";
        }, duration*1000);
    }

    const _onCellClick = (event) => {
        const divClicked = event.target;
        const x = divClicked.dataset.x;
        const y = divClicked.dataset.y;
        play(x, y);
    }

    _cacheDom();
    _showGame();
    renderBoard();

    return {renderBoard, renderMessage, renderTurn, renderStatus, renderP1Win, renderP2Win};
});