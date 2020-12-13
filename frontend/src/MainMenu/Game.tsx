import React, {useEffect, useRef, useState} from 'react';
import Chessboard from 'chessboardjsx';
import timer from '../images/timer.png';
import { InputChessMove } from "../ServerHooks";
import { GameStateRouteProps } from './GameStateRoute';


function getDisplayedTimeFromRemainingTime(timeRemainingMs:number,timeTurnStarted:Date|null):string{
    //if not players turn, simply return rounded TimeRemainingMs
    let actualTimeRemaining;
    if(timeTurnStarted===null){
        actualTimeRemaining=timeRemainingMs
    }
    else{
        const timeElapsedSinceTurnStarted:number=(new Date()).getTime() - timeTurnStarted.getTime();
        actualTimeRemaining=timeRemainingMs-timeElapsedSinceTurnStarted;
    }

    if(actualTimeRemaining<0){
        return "00:00";
    }
    else{
        return new Date(actualTimeRemaining).toLocaleTimeString('en-US', { minute: "numeric", second: "numeric" });
    }
}

/**
 *
 * @param timeRemainingMs
 * @param timeLastMove
 * @constructor
 */
function ChessTimer({timeRemainingMs,timeTurnStarted}:{timeRemainingMs:number,timeTurnStarted:Date|null}){
    const [displayedTime,setDisplayedTime]=useState(getDisplayedTimeFromRemainingTime(timeRemainingMs,timeTurnStarted));
    const propsRef=useRef({timeRemainingMs,timeTurnStarted});

    useEffect(()=>{
        const interval=setInterval(()=>{
            const {timeRemainingMs,timeTurnStarted}=propsRef.current;
            setDisplayedTime(getDisplayedTimeFromRemainingTime(timeRemainingMs,timeTurnStarted))
        },1000);
        return ()=>clearInterval(interval);
    },[]);
    propsRef.current={timeRemainingMs,timeTurnStarted}
    return <>
        <img src={timer} className="img-fluid" alt="timer" />
        {displayedTime}
    </>
}

export function Game({thisUser, makeMove, gameState}:GameStateRouteProps) {
    const [highlightedSquares, setHighlightedSquares]=useState<string[]>([]);

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

    // When a chess piece is moved to a new square
    let onDrop = ({ sourceSquare, targetSquare, piece }:any)=> {
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

    let onMouseOverSquare = (square: string) => {
        const validMoves = gameState.possibleMoves.filter(move => move.from===square);
        setHighlightedSquares(validMoves.map(move => move.to));
    }

    let onMouseOutSquare = () => {
        setHighlightedSquares([]);
    }

    const player1Time=isUserWhite ? gameState?.blackRemainingTimeMs:gameState?.whiteRemainingTimeMs;
    const player2Time=isUserWhite ? gameState?.whiteRemainingTimeMs:gameState?.blackRemainingTimeMs;
    const player1TurnStart=isPlayersTurn ? null:new Date(gameState.movingPlayerTurnStartTime);
    const player2TurnStart=isPlayersTurn ? new Date(gameState.movingPlayerTurnStartTime):null;
   
    // Set CSS for squares that should indicate a possible move
    const squareStyles=Object.fromEntries(highlightedSquares.map(square => [square, {background:"radial-gradient(circle, #595447 36%, transparent 40%)",borderRadius: "50%"}]))

    const opponentName=isUserWhite ? gameState.blackPlayer.username:gameState.whitePlayer.username;

    // Display the chess board
    return (
        <div className="container" id="typehead" >
            <div className="row">
                <div className="col">
                  <div className = "col">
                    {opponentName}
                  </div>
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
                        onMouseOverSquare={onMouseOverSquare}
                        onMouseOutSquare={onMouseOutSquare} 
                        squareStyles={squareStyles}           
                    />
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <ChessTimer timeRemainingMs={player2Time} timeTurnStarted={player2TurnStart} />
                    <div className = "col">
                      {thisUser.username}
                    </div>
                </div>
            </div>
        </div>
    );

}
