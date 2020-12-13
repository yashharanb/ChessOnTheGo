import React, { useEffect } from 'react';
import { GameStateRoute } from './MainMenu/GameStateRoute';
import { Queue } from './Queue/Queue';
import { useChessPlayerState } from './ServerHooks';

export function QueueOrGame() {
    const {thisUser, queueForGame, makeMove, gameState} = useChessPlayerState(console.log);
    const userExists=thisUser!==null;
    // Change state of user to queue for a 30min game
    useEffect(()=>{
        if(userExists){
            queueForGame(600000);
        }
    },[userExists]);

    let toRender;

    if(thisUser?.state==="queued"||gameState===null||thisUser===null) {
        toRender = <Queue/>
    }
    else {
        toRender = <GameStateRoute thisUser={thisUser} makeMove={makeMove} gameState={gameState}/>
    }

    return toRender;
}