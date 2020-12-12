import React from 'react';
import Chessboard from 'chessboardjsx';
import { useWindowResize } from "beautiful-react-hooks";
import timer from '../images/timer.png';
import { InputChessMove, useChessPlayerState } from "../ServerHooks";
import { GameStateRouteProps } from './GameStateRoute';


export function Game({thisUser, makeMove, gameState}:GameStateRouteProps) {
    let calcWidth = ({ screenWidth, screenHeight }: any) => {
        if (document && document.getElementById('typehead')) {
            // @ts-ignore
            return document.getElementById('typehead').clientWidth;
        } else {
            return 500;
        }
    }

    console.log(gameState?.whitePlayer.username);
    console.log(thisUser?.username);
    console.log(gameState?.whiteRemainingTimeMs);
    console.log(gameState?.blackRemainingTimeMs);

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
        makeMove(newMove);
    }

    // Display the chess board
    return (
        <div className="container" id="typehead" >
            <div className="row">
                <div className="col">
                    <img src={timer} className="img-fluid" alt="timer" />
                    {gameState?.whitePlayer.username!==thisUser?.username ? gameState?.whiteRemainingTimeMs:gameState?.blackRemainingTimeMs}
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
                    <img src={timer} className="img-fluid" alt="timer" />
                    {gameState?.whitePlayer.username===thisUser?.username ? gameState?.whiteRemainingTimeMs:gameState?.blackRemainingTimeMs}
                </div>
            </div>
        </div>
    );

}
