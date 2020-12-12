import React,{useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {BrowserRouter as Router,Switch, Route,Link} from "react-router-dom";
import drawBanner from '../images/drawBanner.png';
import chessGame from '../images/chess-game.svg';
import { useChessPlayerState } from "../ServerHooks";


export function GameDraw() {

  const {gameState,thisUser,makeMove,queueForGame} = useChessPlayerState(console.log);
  let opponentName = '';
  let userTime;

  if(gameState){
    if(thisUser?.username === gameState.whitePlayer.username){
      opponentName = gameState.blackPlayer.username;
      userTime = gameState.whiteRemainingTimeMs;
    }else{
      opponentName = gameState.whitePlayer.username;
      userTime = gameState.blackRemainingTimeMs;
    }
  }

  useEffect(()=>{
    queueForGame(2);
  },[]);



  // Display the player statistics if the game is a draw
  return(
    <div className="container">
      <img src={drawBanner} className="img-fluid banner" alt="drawBanner"  />
      <div className="row">
      <div className="col">
        <img src={chessGame} className="img-fluid" alt="drawIcon" />
      </div>
        <div className="row" style={{width:"50%"}}>

            <div className="col" >
                <div className="border border-dark content-container bg-white text-dark" >
                    <p className="lead">
                        {thisUser?.username} Vs. {gameState?.whitePlayer.username}
                    </p>
                    <p className="lead">
                        Time: {userTime} Minutes
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
