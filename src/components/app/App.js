import { Component } from "react";
import Sapper from "../../logic/Sapper";

import GameField from "../gameField/GameField";
import Header from "../header/Header";
import { Faces } from "../header/Header";

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
            minesLeft: this.mines,
            face: Faces.SMILE,
            playable: true
        };

        this.timerUpdater = null;
    }

    newGame = () => {
        this.sapper = new Sapper(this.size, this.mines);
        clearInterval(this.timerUpdater);
        this.setState({
            cellsStatus: this.sapper.getVisibleCells(),
            time: 0,
            minesLeft: this.mines,
            face: Faces.SMILE,
            playable: true
        });
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

    openCellsByNumber = (cell) => {
        this.sapper.openCellsByNumber(cell);
        this.updateCells();
    }

    markCell = (cell) => {
        this.sapper.markCell(cell);
        this.setState({minesLeft: this.sapper.getMinesLeft()});
        this.updateCells();
    }

    updateCells = () => {
        this.setState({cellsStatus: this.sapper.getVisibleCells()});

        if (this.sapper.isDefeat()) {
            this.endGame(false);
        } else if (this.sapper.isVictory()) {
            this.endGame(true);
        }
    }

    setFace = (face) => {
        this.setState({face});
    }

    endGame = (win) => {
        if (win) {
            this.setFace(Faces.COOL);  
        } else {
            this.setFace(Faces.DEAD);  
        }
        this.setState({playable: false});
        this.setState({minesLeft: this.sapper.getMinesLeft()});
        clearInterval(this.timerUpdater);
    }

    render() {
        return (
            <div className="app" style={this.style}>
                <Header width={this.size * this.cellSizePx}
                    mines={this.state.minesLeft}
                    time={this.state.time}
                    face={this.state.face}
                    newGame={this.newGame}
                    />
                <div style={{height: this.borderSize}}></div>
                <GameField size={this.size}
                    cellSizePx={this.cellSizePx}
                    cellsStatus={this.state.cellsStatus}
                    openCell={this.openCell}
                    markCell={this.markCell}
                    setFace={this.setFace}
                    playable={this.state.playable}
                    openCellsByNumber={this.openCellsByNumber}
                    />
            </div>
        )
    }
}

export default App;