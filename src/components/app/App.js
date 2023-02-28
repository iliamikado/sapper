import { Component } from "react";
import Sapper from "../../logic/Sapper";

import GameField from "../gameField/GameField";
import Header from "../header/Header";

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.size = 16;
        this.mines = 40;
        this.cellSizePx = 16;
        this.borderSize = this.cellSizePx;
        this.style = {
            width: `${this.size * this.cellSizePx + this.borderSize * 2}px`,
            padding: `${this.borderSize}px 0 ${this.borderSize}px 0`
        }
        this.sapper = new Sapper(this.size, this.mines);

        this.state = {
            cellsStatus: this.sapper.getVisibleCells(),
            time: 0,
            minesLeft: this.mines
        }

        this.timerUpdater = null;
    }


    componentWillUnmount() {
        clearInterval(this.updateTimer);
    }

    startTimer = () => {
        this.startTime = new Date();
        this.timerUpdater = setInterval(() => {
            const passedTimeSec = Math.floor((new Date() - this.startTime) / 1000);
            if (passedTimeSec > 999) {
                return;
            }
            this.setState({time: passedTimeSec});
        }, 1000);
    }

    openCell = (cell) => {
        if (!this.sapper.isStarted()) {
            this.sapper.startGame(cell);
            this.startTimer()
        } else {
            this.sapper.openCell(cell);
        }
        this.updateCells();
    }

    markCell = (cell) => {
        this.sapper.markCell(cell);
        this.updateCells();
    }

    updateCells = () => {
        this.setState({cellsStatus: this.sapper.getVisibleCells()});
    }

    render() {
        return (
            <div className="app" style={this.style}>
                <Header width={this.size * this.cellSizePx}
                    mines={this.state.minesLeft}
                    time={this.state.time}
                    />
                <div style={{height: this.borderSize}}></div>
                <GameField size={this.size}
                    cellSizePx={this.cellSizePx}
                    cellsStatus={this.state.cellsStatus}
                    openCell={this.openCell}
                    markCell={this.markCell}
                    />
            </div>
        )
    }
}

export default App;