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

    onClick = () => {
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

        let className = 'cell ';

        switch (cellStatus) {
            case CellStatuses.CLOSED:
                className += 'closed';
                break;
            case CellStatuses.FLAG:
                className += 'flag';
                break;
            case CellStatuses.MINE:
                className += 'boom';
                break;
            case 0:
                className += 'empty';
                break;
            default:
                className += `n${cellStatus}`;
        }

        return (
            <div className={className}
                style={this.style}
                onClick={this.onClick}
                onContextMenu={this.onRightClick}>
            </div>
        );
    }
}

export default GameCell;