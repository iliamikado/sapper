
const CellStatuses = Object.freeze({
    MINE:   Symbol("Mine"),
    FLAG:   Symbol("Flag"),
    CLOSED: Symbol("Closed")
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
    }

    startGame({x, y}) {
        this.stated = true;
        const emptyCells = new Set(Array(this.size * this.size).keys());
        emptyCells.delete(this.getCellHash({x, y}));
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
        this.visibleCells[cell.x][cell.y] = status;
        if (status === 0) {
            this.getNeighbours(cell).forEach(cell => {
                if (this.visibleCells[cell.x][cell.y] === CellStatuses.CLOSED) {
                    this.openCell(cell);
                }
            });
        }
    }

    markCell(cell) {
        switch (this.visibleCells[cell.x][cell.y]) {
            case CellStatuses.CLOSED:
                this.visibleCells[cell.x][cell.y] = CellStatuses.FLAG;
                break;
            case CellStatuses.FLAG:
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
}

export default Sapper;
export {CellStatuses};