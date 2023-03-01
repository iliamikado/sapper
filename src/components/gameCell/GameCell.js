import { Component } from "react";

import { CellStatuses } from "../../logic/Sapper";
import { Faces } from "../header/Header";

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
        this.active = false;
        this.state = {
            pressed: false
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

    onPointerDown = (e) => {
        e.preventDefault();
        if (this.props.cellStatus !== CellStatuses.CLOSED || e.button !== 0) {
            return;
        }
        this.active = true;
        this.setState({pressed: true});
        this.props.setFace(Faces.SCARED);
    }

    onPointerOut = () => {
        if (this.active) {
            this.active = false;
            this.setState({pressed: false});
            this.props.setFace(Faces.SMILE);
        }
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

        if (this.state.pressed) {
            className += ' empty';
        }

        return (
            <div className={className}
                style={this.style}
                onClick={this.onClick}
                onContextMenu={this.onRightClick}
                onPointerDown={this.onPointerDown}
                onPointerOut={this.onPointerOut}
                onPointerUp={this.onPointerOut}
                >
            </div>
        );
    }
}

export default GameCell;