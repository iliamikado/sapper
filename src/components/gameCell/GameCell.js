import { Component } from "react";

import { CellStatuses } from "../../logic/Sapper";

import './GameCell.css';

class GameCell extends Component {

    constructor(props) {
        super(props);
        const {cellSizePx, x, y} = props;
        this.style = {
            width: cellSizePx,
            height: cellSizePx,
            left: x * cellSizePx,
            top: y * cellSizePx
        }
    }

    onClick = (e) => {
        if (this.props.cellStatus === CellStatuses.FLAG) {
            return;
        }
        this.props.openCell({x: this.props.x, y: this.props.y})
    }

    onRightClick = (e) => {
        e.preventDefault();
        this.props.markCell({x: this.props.x, y: this.props.y});
    }

    render() {

        const {cellStatus} = this.props;

        let c = '';
        if (cellStatus === CellStatuses.FLAG) {
            c = 'f';
        } else if (cellStatus === CellStatuses.MINE) {
            c = 'm';
        } else if (cellStatus !== CellStatuses.CLOSED) {
            c = cellStatus;
        }

        return (
            <div className="game-cell"
                style={this.style}
                onClick={this.onClick}
                onContextMenu={this.onRightClick}>
                    {c}
            </div>
        );
    }
}

export default GameCell;