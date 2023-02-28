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
        return (
            <div className="header" style={this.style}>

            </div>
        );
    }
}

export default Header;