import React from 'react';
import ChessBoard from 'chessboardjsx';
import { useWindowResize } from "beautiful-react-hooks";
import timer from '../images/timer.png';
import { useChessPlayerState } from "../ServerHooks";

const { useState } = React;
export function Game() {



  let calcWidth=({screenWidth,screenHeight}:any)=>{
    if(document && document.getElementById('typehead')){
      // @ts-ignore
      return document.getElementById('typehead').clientWidth;
    }else{
      return 500;
    }
  }

  const {gameState,thisUser,makeMove,queueForGame} = useChessPlayerState(console.log);

// Display the chess board
  return(
    <div className="container" id="typehead" >
    <div className="row">
    <div className="col">
      <img src={timer} className="img-fluid" alt="timer" />
      21:00
    </div>
    </div>

      <div className="row" >
        <div className="col p-0"  >
          <ChessBoard position="start" calcWidth={calcWidth}
                      orientation={gameState?.playerTurn}/>
        </div>
      </div>

      <div className="row">
      <div className="col">
        <img src={timer} className="img-fluid" alt="timer" />
        11:21
      </div>
    </div>


    </div>
  );

}
