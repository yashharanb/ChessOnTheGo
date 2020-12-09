import 'bootswatch/dist/slate/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import logo from '../logo.png';
import {Router, Route, Link} from 'react-router-dom';
import {ChessMove, getPlayerStats, HistoricalGame, InputChessMove, useChessPlayerState} from "../ServerHooks";
export function LoginPage(){

  const [validated] = useState(false);
  const playerState=useChessPlayerState(console.log);
  const defaultMove:ChessMove={promotion:"b",piece:"p",captured:"p",color:"w",flags:"c",from:"b2",to:"c3",san:"pc3"};
  const moveToMake:ChessMove=playerState.gameState?.possibleMoves?.[0] ?? defaultMove;
  const chessInputMove:InputChessMove={to:moveToMake.to,piece:moveToMake.piece,from:moveToMake.from,promotion:moveToMake.promotion}
  const [stats,setStats]=useState<null|HistoricalGame[]>(null);
  // Display the user login screen
  useEffect(()=>{
    const func=async()=>{
      const playerStats=await getPlayerStats();
      setStats(playerStats);
    }
    func()
  },[])
  console.log(playerState)
  return (
      <>
        <div>{JSON.stringify(stats)}</div>

      <div className = "logo">
        <p></p>
        <img src={logo} className="img-fluid" alt="logo" />
      </div>
      <fieldset>
        <div className="form-group">
          <input required type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" style={{width:"40%",display: "inline-block"}}></input>
        </div>
        <div className="form-group">
          <input required type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" style={{width:"40%",display: "inline-block"}}></input>
        </div>
        <div className="loginButton">
          <button type="submit" id="login" className="btn btn-secondary" onClick={()=>playerState.queueForGame(1.8e6)}>Login</button>
        </div>
          <div className="loginButton">
              <button type="button" id="login2" className="btn btn-secondary" onClick={()=>playerState.makeMove(chessInputMove)}>Move</button>
          </div>

        </fieldset>
      </>
    );
}
