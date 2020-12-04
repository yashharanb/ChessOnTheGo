import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {BrowserRouter as Router,Switch, Route,Link} from "react-router-dom";
import loseBanner from '../images/loseBanner.png';
import lose from '../images/lose.svg';

export function GameLost() {
  // Display the statistics of the player when they lose a game
  return(
    <div className="container">
    <div className = "row">
      <div className = "col">
      <img src={loseBanner} className="img-fluid" alt="loseBanner" />
      </div>
    </div>

        <div className="row" style={{width:"50%",display: "inline-block"}}>
            <div className="col" >
                <div className="border border-dark content-container bg-white text-dark" style={{position: "relative", left: 0, top: 0}} >
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
                    <div className = "row">
                    <div className = "col">
                    <img src={lose} className="loseLogo" alt="loseLogo" style={{width:"20%", bottom:"0", position:"absolute", right:"0"}}/>
                    </div>
                    </div>
                </div>

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
