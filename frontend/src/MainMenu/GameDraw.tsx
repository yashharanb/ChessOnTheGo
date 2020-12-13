import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {BrowserRouter as Router,Switch, Route,Link} from "react-router-dom";
import drawBanner from '../images/drawBanner.png';
import chessGame from '../images/chess-game.svg';
import { HistoricalGame , getPlayerStats} from "../ServerHooks";
import { GameStateRouteProps } from './GameStateRoute';

export function GameDraw({thisUser,makeMove, gameState}:GameStateRouteProps) {

  let opponentName = '';
  let userTime;
  let opponentTime;

  if(gameState){
    if(thisUser?.username === gameState.whitePlayer.username){
      opponentName = gameState.blackPlayer.username;
      opponentTime = new Date(gameState.blackRemainingTimeMs).toLocaleTimeString('en-US', { minute: "numeric", second: "numeric" });
      userTime = new Date(gameState.whiteRemainingTimeMs).toLocaleTimeString('en-US', { minute: "numeric", second: "numeric" });

    }else{
      opponentName = gameState.whitePlayer.username;
      opponentTime = new Date(gameState.whiteRemainingTimeMs).toLocaleTimeString('en-US', { minute: "numeric", second: "numeric" });
      userTime = new Date(gameState.blackRemainingTimeMs).toLocaleTimeString('en-US', { minute: "numeric", second: "numeric" });

    }
  }


  const [stats,setStats]=useState<null|HistoricalGame[]>(null);
  // Display the user login screen
  useEffect(()=>{
    const func=async()=>{
      const playerStats=await getPlayerStats();
      setStats(playerStats);
    }
    func()
  },[])

  console.log(stats);

  let totalWinCounter = 0;
  let totalLossCounter = 0;
  let totalDrawCounter = 0;

  if(stats){
    for( let i = 0; i<stats.length; i++){
    if(thisUser?.username === stats[i].blackPlayer.username){
      if(stats[i].winner === "black"){
          totalWinCounter = totalWinCounter+1;
      }
      else if(stats[i].winner === "white"){
        totalLossCounter = totalLossCounter+1;
      }
      else{
        totalDrawCounter = totalDrawCounter+1;
      }

    }else{
      if(stats[i].winner === "white"){
          totalWinCounter = totalWinCounter+1;
      }
      else if(stats[i].winner === "black"){
        totalLossCounter = totalLossCounter+1;
      }
      else{
        totalDrawCounter = totalDrawCounter+1;
      }
    }
  }
  }

  let elo;
  if(thisUser){
    elo = Math.round(thisUser.elo);
  }
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
                        {thisUser?.username} Vs. {opponentName}
                    </p>
                    <p className="lead">
                        {thisUser?.username} Time Remaining: {userTime} Minutes
                    </p>
                    <p className="lead">
                        {opponentName} Time Remaining: {opponentTime} Minutes
                    </p>
                    <p className="lead">
                        Total Wins: {totalWinCounter}
                    </p>
                    <p className="lead">
                        Total Loss: {totalLossCounter}
                    </p>
                    <p className="lead">
                        Total Draws: {totalDrawCounter}
                    </p>
                    <p className="lead">
                        ELO Score: {elo}
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
            <div className="col"  >
              <Link className="btn btn-secondary " to="./menu" >Main Menu</Link>
            </div>
          </div>
        </div>
    </div>
  );


}
