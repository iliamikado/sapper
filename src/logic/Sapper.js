
const CellStatuses = Object.freeze({
    MINE:       Symbol("Mine"),
    FLAG:       Symbol("Flag"),
    CLOSED:     Symbol("Closed"),
    BOOM:       Symbol("Boom"),
    WRONG_MINE: Symbol("Wrong mine"),
    QUESTION:   Symbol("Question")
});

class Sapper {
    constructor(size, mines) {
        this.size = size;
        this.mines = mines;
        this.cells = [];
        this.visibleCells = [];
        for (let i = 0; i < size; ++i) {
            this.cells.push([]);
            this.visibleCells.push([]);
            for (let j = 0; j < size; ++j) {
                this.visibleCells[i].push(CellStatuses.CLOSED);
            }
        }
        this.stated = false;
        this.victory = false;
        this.defeat = false;

        this.openedCells = 0;
        this.minesLeft = mines;
    }

    startGame({x, y}) {
        this.stated = true;
        const emptyCells = new Set(Array(this.size * this.size).keys());
        emptyCells.delete(this.getCellHash({x, y}));
        this.getNeighbours({x, y}).forEach(neighbour => {emptyCells.delete(this.getCellHash(neighbour))});
        for (let i = 0; i < this.mines; ++i) {
            const cellHash = this.getRandomCell(emptyCells);
            emptyCells.delete(cellHash);
            const cell = this.getCellFromHash(cellHash);
            this.cells[cell.x][cell.y] = CellStatuses.MINE;
        }
        for (let x = 0; x < this.size; ++x) {
            for (let y = 0; y < this.size; ++y) {
                if (this.cells[x][y] !== CellStatuses.MINE) {
                    this.cells[x][y] = this.countNearMines({x, y});
                }
            }
        }
        this.openCell({x, y});
    }

    openCell(cell) {
        const status = this.cells[cell.x][cell.y];

        if (status === CellStatuses.MINE) {
            this.visibleCells[cell.x][cell.y] = CellStatuses.BOOM;
            this.endGameByLosing();
            return;
        }

        this.visibleCells[cell.x][cell.y] = status;
        if (status === 0) {
            this.getNeighbours(cell).forEach(neighbour => {
                if (this.visibleCells[neighbour.x][neighbour.y] === CellStatuses.CLOSED) {
                    this.openCell(neighbour);
                }
            });
        }
        this.openedCells += 1;

        if (this.openedCells + this.mines === this.size * this.size) {
            this.endGameByWinning();
        }
    }

    openCellsByNumber(cell) {
        const mines = this.visibleCells[cell.x][cell.y];
        if (typeof mines !== 'number') {
            return;
        }
        if (this.getNeighbours(cell).filter(({x, y}) => (this.visibleCells[x][y] === CellStatuses.FLAG)).length !== mines) {
            return;
        }
        this.getNeighbours(cell).forEach(({x, y}) => {
            if (this.visibleCells[x][y] === CellStatuses.CLOSED) {
                this.openCell({x, y});
            }
        });
    }

    markCell(cell) {
        switch (this.visibleCells[cell.x][cell.y]) {
            case CellStatuses.CLOSED:
                this.visibleCells[cell.x][cell.y] = CellStatuses.FLAG;
                this.minesLeft -= 1;
                break;
            case CellStatuses.FLAG:
                this.visibleCells[cell.x][cell.y] = CellStatuses.QUESTION;
                this.minesLeft += 1;
                break;
            case CellStatuses.QUESTION:
                this.visibleCells[cell.x][cell.y] = CellStatuses.CLOSED;
                break;
        }
    }

    countNearMines(cell) {
        return this.getNeighbours(cell).filter(cell => (this.cells[cell.x][cell.y] === CellStatuses.MINE)).length;
    }

    getCellHash(cell) {
        return cell.x * this.size + cell.y;
    }

    getCellFromHash(hash) {
        return {
            x: Math.floor(hash / this.size),
            y: hash % this.size
        }
    }

    endGameByLosing() {
        this.defeat = true;
        for (let x = 0; x < this.size; ++x) {
            for (let y  = 0; y < this.size; ++y) {
                if ((this.visibleCells[x][y] === CellStatuses.CLOSED
                        || this.visibleCells[x][y] === CellStatuses.QUESTION)
                        && this.cells[x][y] === CellStatuses.MINE) {
                    this.visibleCells[x][y] = CellStatuses.MINE;
                } else if (this.visibleCells[x][y] === CellStatuses.FLAG && this.cells[x][y] !== CellStatuses.MINE) {
                    this.visibleCells[x][y] = CellStatuses.WRONG_MINE;
                }
            }
        }
    }

    endGameByWinning() {
        this.victory = true;
        this.minesLeft = 0;
        for (let x = 0; x < this.size; ++x) {
            for (let y  = 0; y < this.size; ++y) {
                if (this.cells[x][y] === CellStatuses.MINE) {
                    this.visibleCells[x][y] = CellStatuses.FLAG;
                }
            }
        }
    }

    getNeighbours({x, y}) {
        let ans = [];

        if (x > 0 && y > 0) {
            ans.push({x: x - 1, y: y - 1});
        }
        if (x > 0) {
            ans.push({x: x - 1, y});
        }
        if (x > 0 && y < this.size - 1) {
            ans.push({x: x - 1, y: y + 1});
        }
        if (y > 0) {
            ans.push({x, y: y - 1});
        }
        if (y < this.size - 1) {
            ans.push({x, y: y + 1});
        }
        if (x < this.size - 1 && y > 0) {
            ans.push({x: x + 1, y: y - 1});
        }
        if (x < this.size - 1) {
            ans.push({x: x + 1, y});
        }
        if (x < this.size - 1 && y < this.size - 1) {
            ans.push({x: x + 1, y: y + 1});
        }

        return ans;
    }

    getRandomCell(emptyCells) {
        let items = Array.from(emptyCells);
        return items[Math.floor(Math.random() * items.length)];
    }

    getVisibleCells() {
        return this.visibleCells;
    }

    isStarted() {
        return this.stated;
    }

    isDefeat() {
        return this.defeat;
    }

    isVictory() {
        return this.victory;
    }

    getMinesLeft() {
        return Math.max(this.minesLeft, 0);
    }
}

export default Sapper;
export {CellStatuses};