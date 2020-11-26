import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootswatch/dist/slate/bootstrap.min.css';
import {PlayerMainMenu} from './MainMenu/PlayerMainMenu';


function App() {
  return (
    <div className="App d-flex justify-content-center h-100 align-middle">
      <PlayerMainMenu/>
    </div>
  );
}

export default App;
