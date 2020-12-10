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
import {Game} from './MainMenu/Game'
import { GameWon } from './MainMenu/GameWon';
import { GameLost } from './MainMenu/GameLost';
import { GameDraw } from './MainMenu/GameDraw';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChessKing, faSpinner } from '@fortawesome/free-solid-svg-icons';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";

// This allows Font Awesome icons to be called anywhere within the application.
// To use an icon: add the icon name you want to this and in the import line, use a FontAwesomeIcon tag, and set the icon attribute to the font awesome name.
// e.g. see Queue.tsx
library.add(faChessKing, faSpinner);


function App() {
  // Switch is required when setting up routes, which allows the app to correctly navigate through different pages.
  // Routes specify which component to display
  // Fragment allows only certain pages to have a header component displayed.
  return (
    <Router>
    <div className="App">
    <div>
    <Switch>
      <Route path='/' exact component={LoginPage} />
      <Route path="/registration" component= {RegisterPage}/>
      <Fragment>
        <Header/>
          <div className="App d-flex justify-content-center h-100 align-middle">
            <Route path='/menu' component={PlayerMainMenu}/>
            <Route path='/queue' component={Queue} />
            <Route path='/playerstats' component={PlayerStatistics} />
            <Route path='/admin' component={Admin} />
            <Route path='/Game' component={Game}/>
            <Route path='/GameWon' component={GameWon}/>
            <Route path='/GameLost' component={GameLost}/>
            <Route path='/GameDraw' component={GameDraw}/>
          </div>
      </Fragment>
    </Switch>
  </div>
  </div>
  </Router>
  );
}

export default App;
