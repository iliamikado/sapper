import { Component } from "react";

import GameCell from "../gameCell/GameCell";

import './GameField.css';

class GameField extends Component {
    constructor(props) {
        super(props);
        this.style = {
            height: props.size * props.cellSizePx,
            width: props.size * props.cellSizePx
        }
    }

    shouldComponentUpdate(nextProps) {
        const {cellsStatus, playable} = this.props;
        return cellsStatus !== nextProps.cellsStatus || playable !== nextProps.playable;
    }

    render() {
        const {size, cellSizePx, cellsStatus, openCell, markCell, setFace, playable, openCellsByNumber} = this.props;

        const cells = [];
        for (let x = 0; x < size; ++x) {
            for (let y = 0; y < size; ++y) {
                cells.push(<GameCell cellSizePx={cellSizePx}
                    x={x} y={y}
                    key={x * size + y}
                    cellStatus={cellsStatus[x][y]}
                    openCell={openCell}
                    markCell={markCell}
                    setFace={setFace}
                    playable={playable}
                    openCellsByNumber={openCellsByNumber}
                    />);
            }
        }

        return (
            <div className="game-field" style={this.style}>
                {cells}
            </div>
        );
    }
}

export default GameField;