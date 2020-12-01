import 'bootswatch/dist/slate/bootstrap.min.css';
import React from 'react';
import logo from './logo.png';
import { Router, Route, Link } from 'react-router-dom';

export function Header() {
  return (
    <nav className="navbar navbar-inverse" style={{ "backgroundColor": "#A77A23", height: "65px", paddingTop: "5px" }}>
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="#" style={{ margin: "0", padding: "0" }}>
            <img src={logo} className="img-responsive" style={{ height: "50px", paddingRight: "15px", paddingLeft: "5px" }}></img>
          </a>
        </div>

        <ul className="nav navbar-nav navbar-right" style={{ display: "inline-block" }}>
          <li className="navbar-text navbar-right" style={{ color: "#fff", display: "inline-block", fontSize: "20px", marginRight: "1em" }}>
            Name   |
          </li>

          <li className="active" style={{ color: "#ffff", display: "inline-block", fontSize: "20px" }}>
            <Link className="btn btn-outline-light" to="./login" style={{ color: "#ffff", display: "inline-block", fontSize: "20px" }}>Logout</Link>
          </li>

        </ul>
      </div>
    </nav>

  );
}
