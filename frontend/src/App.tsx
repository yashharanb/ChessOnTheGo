import React, { Fragment } from 'react';
import './App.css';
import 'bootswatch/dist/slate/bootstrap.min.css';

import { LoginPage } from './login/login';
import { Queue } from './Queue/Queue';
import { RegisterPage } from './login/registration';
import { PlayerMainMenu } from './MainMenu/PlayerMainMenu';
import { PlayerStatistics } from "./PlayerStatistics";
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
        <Switch>
          <Route path='/' exact component={LoginPage} />
          <Route path="/registration" component={RegisterPage} />
          <Fragment>
            <Header />
            <div>
              <div className="App d-flex justify-content-center h-100 align-middle">
                <Route path='/menu' component={PlayerMainMenu} />
                <Route path='/queue' component={Queue} />
                <Route path='/PlayerStatistics' component={PlayerStatistics} />
              </div>
            </div>
          </Fragment>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
