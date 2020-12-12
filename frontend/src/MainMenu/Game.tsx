import React from 'react';
import Chessboard from 'chessboardjsx';
import { useWindowResize } from "beautiful-react-hooks";
import timer from '../images/timer.png';
import { useChessPlayerState } from "../ServerHooks";
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

    let onDrop = ()=> {
        console.log("DRAG");
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
                        // id="humanVsHuman"
                        // position={gameState.fenString}
                        // calcWidth={calcWidth}
                        // orientation={gameState?.whitePlayer.username===thisUser?.username ? "white":"black"}
                        // onDrop={onDrop}
                        id="humanVsHuman"
                        width={320}
                        position={gameState.fenString}
                        onDrop={()=>console.log("drop")}
                        onMouseOverSquare={()=>console.log("mouseover")}
                        onMouseOutSquare={()=>console.log("mouseout")}
                        boardStyle={{
                          borderRadius: "5px",
                          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                        }}
                        squareStyles={{}}
                        dropSquareStyle={{}}
                        onDragOverSquare={()=>console.log("dragover")}
                        onSquareClick={()=>console.log("click")}
                        onSquareRightClick={()=>console.log("right click")}
            
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
