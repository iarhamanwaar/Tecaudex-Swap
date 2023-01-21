import React, { Component } from "react";
import Identicon from "identicon";

class Navbar extends Component {

    componentDidMount() {
        Identicon.generate({ id: this.props.account, size: 30 }, function(err, buffer) {
            if (err) throw err;
      
            var img = new Image();
            img.src = buffer;
            document.getElementById("identicon").appendChild(img);
        })
    }

    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
              <a
                className="navbar-brand col-sm-3 col-md-2 mr-0"
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                TecaudexSwap
              </a>
              <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                    <small className="text-secondary">
                        <small id="account">{this.props.account}</small>
                    </small>
                    <span className="ml-3" id="identicon"></span>
                </li>
              </ul>
              
            </nav>
        );
    }
};

export default Navbar;