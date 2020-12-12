import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {BrowserRouter as Router,Switch, Route,Link} from "react-router-dom";
import winningBanner from '../images/winningBanner.png';
import celebration from '../images/celebrate.svg';
import { useChessPlayerState,HistoricalGame , getPlayerStats} from "../ServerHooks";

export function GameWon() {

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
    if(thisUser?.username === stats[0].blackPlayer.username){
      if(stats[0].winner === "black"){
          totalWinCounter = totalWinCounter+1;
      }
      else if(stats[0].winner === "white"){
        totalLossCounter = totalLossCounter+1;
      }
      else{
        totalDrawCounter = totalDrawCounter+1;
      }
    }else{
      if(stats[0].winner === "white"){
          totalWinCounter = totalWinCounter+1;
      }
      else if(stats[0].winner === "black"){
        totalLossCounter = totalLossCounter+1;
      }
      else{
        totalDrawCounter = totalDrawCounter+1;
      }
    }
    console.log(totalWinCounter);
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
                        Time: {userTime} Minutes
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
