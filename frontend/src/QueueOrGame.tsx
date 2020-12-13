import React, { useEffect } from 'react';
import { GameStateRoute } from './MainMenu/GameStateRoute';
import { Queue } from './Queue/Queue';
import { useChessPlayerState } from './ServerHooks';

// Create 1.5 min long game
export function BlitzGame(){
    return <QueueOrGame time={90000}/>;
}

// Create 10 min long game
export function SpeedGame(){
    return <QueueOrGame time={600000} />;
}

// Create 30 min long game
export function RegularGame(){
    return <QueueOrGame time={1.8e6} />;
}

export function QueueOrGame({time}:{time:number}) {
    const {thisUser, queueForGame, makeMove, gameState} = useChessPlayerState(console.log);
    const userExists=thisUser!==null;
    // Change state of user to queue for a 30min game
    useEffect(()=>{
        if(userExists){
            queueForGame(time);
        }
    },[userExists,time]);

    let toRender;

    if(thisUser?.state==="queued"||gameState===null||thisUser===null) {
        toRender = <Queue/>
    }
    else {
        toRender = <GameStateRoute thisUser={thisUser} makeMove={makeMove} gameState={gameState}/>
    }

    return toRender;
}