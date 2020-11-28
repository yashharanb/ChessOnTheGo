import React, {Fragment} from 'react';
import './App.css';
import 'bootswatch/dist/slate/bootstrap.min.css';

import {LoginPage} from './login/login';
import {RegisterPage} from './login/registration';
import { PlayerMainMenu } from './MainMenu/PlayerMainMenu';
import { PlayerStatistics } from "./PlayerStatistics";
import { Header } from './header';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChessKing } from '@fortawesome/free-solid-svg-icons';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";


library.add(faChessKing);


function App() {
  return (
    <Router>
    <div className="App">
    <div>
    <Switch>
      <Route path='/login' component={LoginPage} />
      <Route path="/registration" component= {RegisterPage}/>
      <Fragment>
        <Header/>
          <div className="App d-flex justify-content-center h-100 align-middle">
            <Route path='/menu' component={PlayerMainMenu}/>
            <Route path='/PlayerStatistics' component={PlayerStatistics}/>
          </div>
      </Fragment>
    </Switch>
  </div>
  </div>
  </Router>

  );
}

export default App;
