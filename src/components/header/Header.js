import { Component } from "react";

import './Header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.style = {
            width: props.width
        }
    }

    render() {
        const {time, mines} = this.props;

        return (
            <div className="header" style={this.style}>
                <div className="mines-counter">
                    <div className={`digit d${Math.floor(mines / 100) % 10}`}></div>
                    <div className={`digit d${Math.floor(mines / 10) % 10}`}></div>
                    <div className={`digit d${mines % 10}`}></div>
                </div>

                <div className="face smile"></div>

                <div className="timer">
                    <div className={`digit d${Math.floor(time / 100) % 10}`}></div>
                    <div className={`digit d${Math.floor(time / 10) % 10}`}></div>
                    <div className={`digit d${time % 10}`}></div>
                </div>
            </div>
        );
    }
}

export default Header;