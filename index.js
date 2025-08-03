const Gameboard = (function () {
    let board = [[], [], []];
    let occupiedCells;

    const _buildBoard = (size=3) => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                board[i][j] = " ";
            }
        }
    }

    const place = function (symbol, x, y) {
        if (board[y][x] !== " ") {
            return false;
        }
        board[y][x] = symbol;
        occupiedCells++;
        return true;
    }


    const _AreAllItemsInArrayEqual = (row) => {
        let first = row[0];
        if (first === " ") return false;
        for (let i = 1; i < row.length; i++) {
            if (first !== row[i]) return false;
        }
        return true;
    }

    const _getAllPossibleVariations = () => {
        const cols = [[], [], []];
        const diag = [[], []];
        let allPossibleVariations = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++)
                cols[i].push(board[j][i]);
            diag[0].push(board[i][i]);
            diag[1].push(board[i][board.length - 1 - i]);
            allPossibleVariations.push(board[i]);
        };
        allPossibleVariations = [...allPossibleVariations, ...cols, ...diag];
        return allPossibleVariations;
    }
    const getBoard = () => board;


    const _hasSomeoneWon = () => {
        const allPossibleVariations = _getAllPossibleVariations();
        for (let i = 0; i < allPossibleVariations.length; i++) {
            let variation = allPossibleVariations[i];
            if (_AreAllItemsInArrayEqual(variation)) return true;
        }
        return false;
    }

    const resetBoard = () => {
        occupiedCells = 0;
        board = [[], [], []];
        _buildBoard();
    }

    const _isDraw = () => occupiedCells === 9;

    const getGameState = () => {
        const hasSomeoneWon = _hasSomeoneWon();
        const isDraw = _isDraw();
        if (!hasSomeoneWon && !isDraw) return 0;
        if (hasSomeoneWon) {
            return 1;
        } else if (isDraw) {
            return 2;
        }
    }

    return { place, getBoard, getGameState, resetBoard };

})();

const player = function (name, symbol) {
    return { name, symbol, wins: 0 };
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
    let activePlayer;
    const dc = displayController(play, chooseRandomPlayer);

    const _init = () => {
        chooseRandomPlayer();
        dc.renderNames(player1.name, player2.name);
        dc.renderTurn(activePlayer.name);
        dc.renderStatus("IN GAME");
    }

    const changeActivePlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    function chooseRandomPlayer() {
        activePlayer = Math.random() < 0.5 ? player1 : player2;
        return activePlayer;
    }

    const _hasGameEnded = () => {
        const result = Gameboard.getGameState();
        if (result === 0) return false;
        else if (result === 1) {
            activePlayer.wins++;
            activePlayer === player1 ? dc.renderP1Win(activePlayer.wins) : dc.renderP2Win(activePlayer.wins);
            dc.renderMessage(`${activePlayer.name} has won!`, 1.5);
        } else {
            dc.renderMessage("It's a draw!", 1.5);
        }
        dc.renderStatus("GAME ENDED");
        return true;
    }

    function play(x, y) {
        if (Gameboard.getGameState() !== 0) return;
        const moved = Gameboard.place(activePlayer.symbol, x, y);
        dc.renderBoard();
        if (moved && !_hasGameEnded()) {
            changeActivePlayer();
            dc.renderTurn(activePlayer.name);
        }
    }

    _init();
});

const displayController = ((play, chooseRandomPlayer) => {
    let overlay, overlayText, gameDiv, players, startButton, 
    restartButton,infoStatus, turn, wonP1, wonP2

    const _cacheDom = () => {
        overlay = document.querySelector(".overlay");
        overlayText = overlay.querySelector(".text");
        gameDiv = document.querySelector(".game");
        players = document.querySelector(".players");
        startButton = document.querySelector("#start");

        const info = document.querySelector(".info");
        restartButton = info.querySelector("#restart");
        infoStatus = info.querySelector(".game-status");
        turn = info.querySelector(".turn");
        const gamesWon = info.querySelector(".games-won");
        wonP1 = gamesWon.querySelector(".p1");
        wonP2 = gamesWon.querySelector(".p2");
    }

    const _showGame = () => {
        players.style.display = "none";
        startButton.style.display = "none";
        gameDiv.style.display = "grid";
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

    const restart = () => {
        Gameboard.resetBoard();
        const activePlayer = chooseRandomPlayer();
        renderBoard();
        renderStatus("IN GAME");
        renderTurn(activePlayer.name);
    }

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        gameDiv.innerHTML = "";
        board.forEach((row, rowNum) => {
            row.forEach((col, colNum) => {
                const colDiv = _createCol(col, rowNum, colNum);
                gameDiv.appendChild(colDiv);
            });
        });
    };

    const renderNames = (player1Name, player2Name) => {
        wonP1.innerText = `${player1Name}'S WINS: 0`;
        wonP2.innerText = `${player2Name}'S WINS: 0`;
    }

    const renderTurn = (activePlayerName) => {
        turn.innerText = `${activePlayerName}'s turn`
    }

    const renderStatus = (status) => {
        infoStatus.innerText = `STATUS: ${status}`;
    }

    const renderP1Win = (amount) => {
        const currentText = wonP1.innerText;
        wonP1.innerText = `${currentText.split(": ")[0]}: ${amount}`;
    }

    const renderP2Win = (amount) => {
        const currentText = wonP2.innerText;
        wonP2.innerText = `${currentText.split(": ")[0]}: ${amount}`;
    }

    const renderMessage = (message, duration) => {
        overlay.style.display = "flex";
        overlayText.innerText = message;
        setTimeout(() => {
            overlay.style.display = "none";
        }, duration * 1000);
    }

    const _onCellClick = (event) => {
        const divClicked = event.target;
        const x = divClicked.dataset.x;
        const y = divClicked.dataset.y;
        play(x, y);
    }

    const _init = () => {
        _cacheDom();
        _showGame();
        renderBoard();
        restartButton.addEventListener("click", restart);
    }

    _init();

    return { renderBoard, renderMessage, renderTurn, renderStatus, renderNames, renderP1Win, renderP2Win };
});