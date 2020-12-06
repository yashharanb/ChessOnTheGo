import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {BrowserRouter as Router,Switch, Route,Link} from "react-router-dom";
import winningBanner from '../images/winningBanner.png';
import celebration from '../images/celebrate.svg';

export function GameWon() {
  // Display the statistics of the player when they win a game
  return(
    <div className="container">

      <img src={winningBanner} className="img-fluid" alt="winningBanner" />
      <div className="row">
      <div className="col">
        <img src={celebration} className="img-fluid" alt="winIcon"  />
      </div>

        <div className="row" style={{width:"50%"}}>
            <div className="col" >
                <div className="border border-dark content-container bg-white text-dark" >
                    <p className="lead">
                        Player 1 Vs. Player 2
                    </p>
                    <p className="lead">
                        Time: 25:00 Minutes
                    </p>
                    <p className="lead">
                        Total Wins: {2}
                    </p>
                    <p className="lead">
                        Total Wins: {2}
                    </p>
                    <p className="lead">
                        Total Draws: {3}
                    </p>
                </div>
            </div>
          </div>
          <div className="col">
            <img src={celebration} className="img-fluid" alt="winIcon"  />
          </div>
        </div>

        <p></p>
        <div className="container" style={{width:"40%"}}>
        <div className="row"  >
            <div className="col " >
              <Link className="btn btn-secondary " to="./Game" >New Game</Link>
            </div>
            <div className="col"  >
              <Link className="btn btn-secondary " to="./menu" >Main Menu</Link>
            </div>
          </div>
        </div>
    </div>


  );

}
