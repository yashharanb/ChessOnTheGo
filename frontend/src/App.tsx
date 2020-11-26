import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootswatch/dist/slate/bootstrap.min.css';
import {LoginPage} from './login/login';
import {RegisterPage} from './login/registration';
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
    </Router>
  );
}

export default App;
