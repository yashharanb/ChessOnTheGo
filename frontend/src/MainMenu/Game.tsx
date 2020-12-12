import React, {useEffect, useState} from 'react';
import Chessboard from 'chessboardjsx';
import { useWindowResize } from "beautiful-react-hooks";
import timer from '../images/timer.png';
import { InputChessMove, useChessPlayerState } from "../ServerHooks";
import { GameStateRouteProps } from './GameStateRoute';


function getDisplayedTimeFromRemainingTime(timeRemainingMs:number,timeTurnStarted:Date|null):number{
    //if not players turn, simply return rounded TimeRemainingMs
    if(timeTurnStarted===null){
        return Math.round(timeRemainingMs/1000);
    }
    else{
        const timeElapsedSinceTurnStarted:number=(new Date()).getTime() - timeTurnStarted.getTime();
        const actualTimeRemaining=timeRemainingMs-timeElapsedSinceTurnStarted;
        return Math.round(actualTimeRemaining/1000);
    }
    // const timeElapsedSinceTurnStarted=
}
/**
 *
 * @param timeRemainingMs
 * @param timeLastMove
 * @constructor
 */
function ChessTimer({timeRemainingMs,timeTurnStarted}:{timeRemainingMs:number,timeTurnStarted:Date|null}){
    const [displayedTime,setDisplayedTime]=useState(getDisplayedTimeFromRemainingTime(timeRemainingMs,timeTurnStarted));

    useEffect(()=>{
        const interval=setInterval(()=>{
            setDisplayedTime(getDisplayedTimeFromRemainingTime(timeRemainingMs,timeTurnStarted))
        },1000);
        return ()=>clearInterval(interval);
    },[timeRemainingMs,timeTurnStarted]);
    return <>
        <img src={timer} className="img-fluid" alt="timer" />
        {displayedTime}
    </>
}

export function Game({thisUser, makeMove, gameState}:GameStateRouteProps) {
    let calcWidth = ({ screenWidth, screenHeight }: any) => {
        if (document && document.getElementById('typehead')) {
            // @ts-ignore
            return document.getElementById('typehead').clientWidth;
        } else {
            return 500;
        }
    }
    const isUserWhite=gameState?.whitePlayer.username===thisUser?.username;
    const isPlayersTurn=(isUserWhite&&gameState.playerTurn==="white")||((!isUserWhite)&&gameState.playerTurn==="black");

    let onDrop = ({ sourceSquare, targetSquare, piece }:any)=> {
        console.log(sourceSquare);
        console.log(targetSquare);
        console.log(piece);
        let newMove:InputChessMove = {
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
            piece: piece
        }
        if(isPlayersTurn){
            makeMove(newMove);
        }
    }
    const player1Time=isUserWhite ? gameState?.blackRemainingTimeMs:gameState?.whiteRemainingTimeMs;
    const player2Time=isUserWhite ? gameState?.whiteRemainingTimeMs:gameState?.blackRemainingTimeMs;
    const player1TurnStart=isPlayersTurn ? null:new Date(gameState.movingPlayerTurnStartTime);
    const player2TurnStart=isPlayersTurn ? new Date(gameState.movingPlayerTurnStartTime):null;
    // Display the chess board
    return (
        <div className="container" id="typehead" >
            <div className="row">
                <div className="col">
                    <ChessTimer timeRemainingMs={player1Time} timeTurnStarted={player1TurnStart} />
                </div>
            </div>

            <div className="row" >
                <div className="col p-0"  >
                    <Chessboard
                        position={gameState.fenString}
                        calcWidth={calcWidth}
                        orientation={gameState?.whitePlayer.username===thisUser?.username ? "white":"black"}
                        onDrop={onDrop}            
                    />
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <ChessTimer timeRemainingMs={player2Time} timeTurnStarted={player2TurnStart} />
                </div>
            </div>
        </div>
    );

}
