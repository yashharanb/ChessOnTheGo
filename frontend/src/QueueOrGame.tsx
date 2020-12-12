import React, { useEffect } from 'react';
import { GameStateRoute } from './MainMenu/GameStateRoute';
import { Queue } from './Queue/Queue';
import { useChessPlayerState } from './ServerHooks';

export function QueueOrGame() {
    const {thisUser, queueForGame, makeMove, gameState} = useChessPlayerState(console.log);
    const userExists=thisUser!==null;
    // Change state of user to queue for a 30min game
    useEffect(()=>{
        console.log(thisUser?.state);
        if(userExists){
            queueForGame(1.8e6);
        }
        console.log(thisUser?.state);
    },[userExists]);

    let toRender;

    console.log(thisUser?.state);

    if(thisUser?.state==="queued"||gameState===null||thisUser===null) {
        toRender = <Queue/>
    }
    else {
        toRender = <GameStateRoute thisUser={thisUser} makeMove={makeMove} gameState={gameState}/>
    }

    return toRender;
}