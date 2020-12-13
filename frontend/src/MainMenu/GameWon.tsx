import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {BrowserRouter as Router,Switch, Route,Link} from "react-router-dom";
import winningBanner from '../images/winningBanner.png';
import celebration from '../images/celebrate.svg';
import { GameStateRouteProps } from './GameStateRoute';
import { HistoricalGame , getPlayerStats} from "../ServerHooks";

export function GameWon({thisUser,makeMove, gameState}:GameStateRouteProps) {

  let opponentName = '';
  let userTime;
  let duration;
  let durationTimeDateFormat;
  if(gameState){
    if(thisUser?.email === gameState.whitePlayer.email){
      opponentName = gameState.blackPlayer.username;
      userTime = 1800000 - gameState.whiteRemainingTimeMs;
      durationTimeDateFormat = new Date(userTime);
      duration = durationTimeDateFormat.getUTCMinutes() + ':' + durationTimeDateFormat.getUTCSeconds();
    }else{
      opponentName = gameState.whitePlayer.username;
      userTime = 1800000 - gameState.blackRemainingTimeMs;
      durationTimeDateFormat = new Date(userTime);
      duration = durationTimeDateFormat.getUTCMinutes() + ':' + durationTimeDateFormat.getUTCSeconds();
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
                        {thisUser?.username} Vs. {opponentName}
                    </p>
                    <p className="lead">
                        Time: {duration} Minutes
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
