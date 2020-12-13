import React, { Fragment } from 'react';
import './App.css';
import 'bootswatch/dist/slate/bootstrap.min.css';

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
import { BlitzGame, RegularGame, SpeedGame } from './QueueOrGame';

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
    <Router basename={process.env.PUBLIC_URL}>
    <div className="App">
    <div>
    <Switch>
      <Fragment>
        <Header/>
          <div className="App d-flex justify-content-center h-100 align-middle">
            <Route path='/menu' component={PlayerMainMenu} exact/>
            <Route path='/blitz' component={BlitzGame} exact/>
            <Route path='/speed' component={SpeedGame} exact/>
            <Route path='/regular' component={RegularGame} exact/>
            <Route path='/playerstats' component={PlayerStatistics} exact/>
            <Route path='/admin' component={Admin} exact/>
            <Route path='/Game' component={Game} exact/>
            <Route path='/GameWon' component={GameWon} exact/>
            <Route path='/GameLost' component={GameLost} exact/>
            <Route path='/GameDraw' component={GameDraw} exact/>
          </div>
      </Fragment>
    </Switch>
  </div>
  </div>
  </Router>
  );
}

export default App;
