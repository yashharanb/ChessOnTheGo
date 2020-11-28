import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootswatch/dist/slate/bootstrap.min.css';

import {LoginPage} from './login/login';
import {RegisterPage} from './login/registration';
import { PlayerMainMenu } from './MainMenu/PlayerMainMenu';
import { PlayerStatistics } from "./PlayerStatistics";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChessKing } from '@fortawesome/free-solid-svg-icons'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";





function App() {
  return (
    <Router>

    <div className="App">
      <Route path="/login" component={LoginPage} />
      <Route path="/registration" component= {RegisterPage}/>
    </div>

      <div className="App d-flex justify-content-center h-100 align-middle">
        <Route path="/menu" component={PlayerMainMenu} />
        <Route path="/PlayerStatistics" component= {PlayerStatistics}/>
      </div>

    </Router>
  );
}

export default App;
