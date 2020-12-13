import React from 'react';
import { InputChessMove, User, GameState } from '../ServerHooks';
import { Game } from './Game';
import { GameDraw } from './GameDraw';
import { GameLost } from './GameLost';
import { GameWon } from './GameWon';

export type GameStateRouteProps = {thisUser:User, makeMove:(move:InputChessMove)=>void, gameState:GameState};
export function GameStateRoute({thisUser, makeMove, gameState}:GameStateRouteProps) {
    let toRender;
    let userColor = gameState?.whitePlayer.username===thisUser?.username ? "white":"black";

    if(gameState.winLoss && gameState.winLoss.gameOverState=="draw"){
        toRender = <GameDraw thisUser={thisUser} makeMove={makeMove} gameState={gameState}/>
    }
    else if(gameState.winLoss && gameState.winLoss.winner===userColor){
        toRender = <GameWon thisUser={thisUser} makeMove={makeMove} gameState={gameState}/>
    }
    else if(gameState.winLoss && gameState.winLoss.winner!==userColor){
        toRender = <GameLost thisUser={thisUser} makeMove={makeMove} gameState={gameState}/>
    }
    else{
        toRender = <Game thisUser={thisUser} makeMove={makeMove} gameState={gameState}/>
    }
    return toRender;
}
