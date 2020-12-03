import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {BrowserRouter as Router,Switch, Route,Link} from "react-router-dom";
import drawBanner from './drawBanner.png';
import chessGame from './chess-game.svg'

export function GameDraw() {
  // Display the player statistics if the game is a draw
  return(
    <div className="container">
      <img src={drawBanner} className="img-fluid" alt="drawBanner"  />
      <div className="row">
      <div className="col">
        <img src={chessGame} className="img-fluid" alt="drawIcon" />
      </div>
        <div className="row" style={{width:"50%",display: "inline-block"}}>

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
          <img src={chessGame} className="img-fluid" alt="drawIcon"  />
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
