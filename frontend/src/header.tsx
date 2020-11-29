import 'bootswatch/dist/slate/bootstrap.min.css';
import React from 'react';
import logo from './logo.png';
import { Router, Route, Link } from 'react-router-dom';

export function Header() {
  return (
    <nav className="navbar navbar-inverse">
      <div className="container-fluid header-container">
        <div className="navbar-header">
          <a className="navbar-brand site-logo" href="#">
            <img src={logo} className="img-responsive"></img>
          </a>
        </div>

        <ul className="nav navbar-nav navbar-right d-inline-block">
          <li className="navbar-text navbar-right d-inline-block">
            Name   |
          </li>

          <li className="active d-inline-block">
            <Link className="btn btn-outline-light btn-logout d-inline-block" to="./login">Logout</Link>
          </li>

        </ul>
      </div>
    </nav>

  );
}
