const TIE = 0;
const NONE = -1;

function Board(rows, columns) {
    if (rows !== columns) throw 'The board must be squared';

    this.rows = rows;
    this.columns = columns;
    this.grid = [];
    this.remaining = this.rows * this.columns;

    for (let i = 0; i < this.rows; i++) {
        const currentRow = [];
        for (let j = 0; j < this.columns; j++) {
            currentRow.push(-1);
        }
        this.grid.push(currentRow);
    }

    const getCoordinatesFromCellId = (cellId) => {
        const row = Math.floor(cellId / this.columns);
        const column = cellId % this.columns;

        return [row, column];
    }

    this.setPlayed = (player, cellId) => {
        const [row, column] = getCoordinatesFromCellId(cellId);

        if (this.grid[row][column] === NONE) {
            this.grid[row][column] = player;
            this.remaining--;
        }

        return this.grid[row][column];
    }

    this.checkWinner = (cellId) => {
        const [row, column] = getCoordinatesFromCellId(cellId);

        // horizontal
        let winner = this.grid[row][0];
        for (let i = 0; i < this.columns; i++) {
            if (this.grid[row][i] !== winner) {
                winner = NONE;
            }
        }

        if (winner) {
            if (winner !== -1) {
                return winner;
            }
        }

        // vertical
        winner = this.grid[0][column];
        for (let i = 0; i < this.rows; i++) {
            if (this.grid[i][column] !== winner) {
                winner = NONE;
            }
        }

        if (winner) {
            if (winner !== -1) {
                return winner;
            }
        }

        // diagonal 1
        winner = this.grid[0][0];
        for (let i = 0, j = 0; i < this.rows && j < this.columns; i++, j++) {
            if (this.grid[i][j] !== winner) {
                winner = NONE;
            }
        }

        if (winner) {
            if (winner !== -1) {
                return winner;
            }
        }

        // diagonal 2
        winner = this.grid[0][this.columns-1];
        for (let i = 0, j = this.columns-1; i < this.rows && j >= 0; i++, j--) {
            if (this.grid[i][j] !== winner) {
                winner = NONE;
            }
        }

        if (winner) {
            if (winner !== -1) {
                return winner;
            }
        }

        return this.remaining ? NONE : TIE;
    }
}

function Game(playerOneChar, playerTwoChar, board) {
    this.playerOneChar = playerOneChar;
    this.playerTwoChar = playerTwoChar;
    this.playerTurn = this.playerOneChar;

    this.board = board;

    this.play = (cellId) => {
        const playerChar = this.board.setPlayed(this.playerTurn, cellId);

        if (this.playerTurn === this.playerOneChar) {
            this.playerTurn = this.playerTwoChar;
        } else {
            this.playerTurn = this.playerOneChar;
        }

        return [playerChar, this.board.checkWinner(cellId)];
    }
}

let game = new Game('O', 'X', new Board(3, 3));

function onCellClicked(cellId, button) {
    const [playerChar, winner] = game.play(cellId);

    button.innerHTML = playerChar;

    if (winner !== NONE && winner !== TIE) {
        finishGame(`The winner is ${playerChar}`);
    } else if (winner === TIE) {
        finishGame('Tie');
    }
}

function finishGame(promptText) {
    setTimeout(() => {
        alert(promptText);
        restartGame();
    }, 100);
}

function restartGame() {
    game = new Game('O', 'X', new Board(3, 3));
    const buttons = document.querySelectorAll('button.board__cell');
    for (const button of buttons) {
        button.innerHTML = '';
    }
}