import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootswatch/dist/slate/bootstrap.min.css';
import { PlayerMainMenu } from './MainMenu/PlayerMainMenu';
import { PlayerStatistics } from "./PlayerStatistics";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App d-flex justify-content-center h-100 align-middle">
        <Route path="/menu" component={PlayerMainMenu} />
        <Route path="/PlayerStatistics" component= {PlayerStatistics}/>
      </div>
    </Router>
  );
}

export default App;
