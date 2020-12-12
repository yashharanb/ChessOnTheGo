import React, {useEffect, useState} from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { PlayerStatistics } from "../PlayerStatistics";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { useChessPlayerState,HistoricalGame , getPlayerStats} from "../ServerHooks";


// This page displays the player's general game stats, and allows users to play a new game or view detailed stats.
// TODO: replace the 4s with actual data from the db
export function PlayerMainMenu() {
// Use a use effect and get request

const {gameState,thisUser,makeMove,queueForGame} = useChessPlayerState(console.log);
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
let numberOfGamesPlayed = stats?.length;
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
    return (
        <div className="container player_menu">
            <div className="row">
                <div className="col">
                    <div className="jumbotron brown-border content-container">
                        <p className="lead">
                            <FontAwesomeIcon icon="chess-king" className="chess-king fa-3x"  style={{marginLeft: 15}}/>
                            Games played: {numberOfGamesPlayed}
                        </p>
                        <p className="lead">
                            <FontAwesomeIcon icon="chess-king" className="chess-king fa-3x"/>
                            Games won: {totalWinCounter}
                        </p>
                        <p className="lead">
                            <FontAwesomeIcon icon="chess-king" className="chess-king fa-3x"/>
                            Games lost: {totalLossCounter}
                        </p>
                        <p className="lead">
                            <FontAwesomeIcon icon="chess-king" className="chess-king fa-3x"/>
                            Games tied: {totalDrawCounter}
                        </p>
                        <p className="lead">
                            <FontAwesomeIcon icon="chess-king" className="chess-king fa-3x"/>
                            ELO Score: {thisUser?.elo}
                        </p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Link className="btn btn-secondary" to="../Game">New Game</Link>
                </div>
                <div className="col">
                    <Link className="btn btn-secondary" to="../playerstats">Player Stats</Link>
                </div>
            </div>
        </div>
    )
}
