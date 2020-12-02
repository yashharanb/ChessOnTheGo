import React, { Fragment } from 'react';
import './App.css';
import 'bootswatch/dist/slate/bootstrap.min.css';

import { LoginPage } from './login/login';
import { Queue } from './Queue/Queue';
import { RegisterPage } from './login/registration';
import { PlayerMainMenu } from './MainMenu/PlayerMainMenu';
import { PlayerStatistics } from "./PlayerStatistics";
import { Admin } from './Admin';
import { Header } from './header';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChessKing, faSpinner } from '@fortawesome/free-solid-svg-icons';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";


library.add(faChessKing, faSpinner);


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/login' component={LoginPage} />
          <Route path="/registration" component={RegisterPage} />
          <Fragment>
            <Header />
            <div className="h-100">
              <div className="App d-flex justify-content-center h-100 align-middle">
                <Route path='/menu' component={PlayerMainMenu} />
                <Route path='/queue' component={Queue} />
                <Route path='/PlayerStatistics' component={PlayerStatistics} />
                <Route path='/admin' component={Admin} />
              </div>
            </div>
          </Fragment>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
