import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {throttle} from "lodash"
/***
 * A single user in the application. Both admins and non-admins are represented by this type.
 */
export interface User{
    /**
     * What state that particular user is in.
     * none means that the user is not in a game, nor is in queue for a game.
     * queued means that the user is queued for a game, waiting to be matched up with an opponent.
     * game means the user is currently in a game.
     * deleted means the user has been deleted by an administrator.
     */
    state:"none"|"queued"|"game"|"deleted";
    username:string;
    email:string;
    isAdmin:boolean;
    /**
     * A number representing the ELO rating of the player. this is a chess metric for the skill of a player
     * @see {@link https://en.wikipedia.org/wiki/Elo_rating_system }
     */
    elo:number;
}

export interface AdminHookReturn{
    /**
     * The state of the admin user itself.
     * Ie admins username, state,etc.
     */
    thisUser:User|null;

    /**
     * every User, not including the deleted users.
     */
    allUsers:User[];

    /**
     * A function to call to delete multiple users.
     * @param emails - The email of every user you want to delete.
     */
    deleteUsers:(emails:string[])=>void;
}

/**
 * A function which is called when there is an error. Displays an error message to user.
 */
export type ErrorFunc=(error:Error)=>void;


function sendIoMessage(conn:Socket|null,eventName:string,msg:string){
    if(conn===null){
        throw new Error("error, no connection to server");
    }
    else{
        conn.emit(eventName,msg);
    }
}

/**
 * A hook for the admin to connect to socket.io. I would expect this to only be used by the admin page.
 *
 * @param onError - a function to be called whenever there is an error on the server.
 */
export function useAdminState(onError:ErrorFunc):AdminHookReturn{
    const connectionRef=useRef<Socket|null>(null);

    const [thisUser, setThisUser]=useState<User|null>(null);
    const [allUsers, setAllUsers]=useState<User[]>([]);
    useEffect(()=>{
        const connection=io().connect();
        connection.on("user",(msg:string)=>setThisUser(JSON.parse(msg)));
        connection.on("users",(msg:string)=>setAllUsers(JSON.parse(msg)));
        connection.on("input_error",(error:string)=>onError(new Error(error)))
        connectionRef.current=connection;
    },[onError])

    const deleteUsers=useCallback(throttle((emails:string[])=> {
        const deletedEmailsSet=new Set(emails);
        const allUsersToDelete=allUsers.filter(user=>deletedEmailsSet.has(user.email));

        if(allUsersToDelete.length!==emails.length){
            throw new Error("The email address you selected does not belong to a registered user.");
        }
        else if(allUsersToDelete.some(userToDelete=>userToDelete.isAdmin)){
            throw new Error("You can't delete an admin user.");
        }
        else if (allUsersToDelete.some(userToDelete=>userToDelete.state!=="none")){
            throw new Error("You can't delete users who are currently queued or playing a game.");
        }
        else{
            sendIoMessage(connectionRef.current,"delete_users",JSON.stringify(emails))
        }
    },2000),[allUsers]);

    const allUsersWithoutDeleted=useMemo(()=>allUsers.filter(user=>user.state!=="deleted"), [allUsers])

    return {thisUser,allUsers:allUsersWithoutDeleted,deleteUsers}
}
export interface GameWinLossState{
    gameOverState:"winLoss";
    reason:"checkmate"|"timeout"|"forfeit";
    winner:"white"|"black";
}

export interface GameDraw{
    gameOverState:"draw";
    reason:"50-move"|"insufficient-material"|"stalemate"|"threefold-repetition";
    winner:null;
}

export type ChessCoordinate=`${'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'}${'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'}`;
/**
 * String reperesenting a chess peice.
 *
 * p=pawn
 * q=queen
 * r=rook
 * n=knight
 * k=knight again for some reason. Its usually n but theres the odd time where it uses k for some reason.
 * b=bishop
 */
export type ChessPiece='p'|'q'|'r'|'n'|'k'|'b';

/**
 * The possible moves that the user could do on the board.
 *
 * This is gotten from chess.js.
 *
 *
 * @see {@link https://github.com/jhlywa/chess.js} for more details on the verbose moves returned. They are gotten from the history and the move() methods.
 */
export interface ChessMove{
    "color":"w"|"b",
    "from":ChessCoordinate,
    "to":ChessCoordinate,
    /**
     * The flags field in verbose mode may contain one or more of the following values:
     *
     * 'n' - a non-capture
     * 'b' - a pawn push of two squares
     * 'e' - an en passant capture
     * 'c' - a standard capture
     * 'p' - a promotion
     * 'k' - kingside castling
     * 'q' - queenside castling
     * 'pc' - A pawn captured a piece on the 8th rank and promoted.
     */
    "flags":'n'|'b'|'e'|'c'|'p'|'k'|'q'|'pc'|'cp',
    "captured"?:ChessPiece,
    "promotion"?:ChessPiece,
    "piece":ChessPiece,
    /** move in Standard Algebraic Notation */
    "san":string
}

export interface GameState{
    whiteRemainingTimeMs:number;
    blackRemainingTimeMs:number;
    playerTurn:"white"|"black";
    whitePlayer:User;
    blackPlayer:User;
    possibleMoves:ChessMove[];
    fenString:string;
    inCheck:boolean;
    winLoss:GameWinLossState|GameDraw|null;
    history:ChessMove[];
    /**
     * The time that the player who's turn it is to move time started.
     * This is so that the time on the server and client are synchronized properly
     *
     * The way you should use this, is for the timer.
     * The timer for the moving player should always display:
     *
     * Math.round((playerRemainingTimeMs - (new Date(currentTime) - new Date(movingPlayerStartTime)))*1000)
     *
     */
    movingPlayerTurnStartTime:DateTimeStr;
}


/**
 * Any valid chess move. Simply get the value from chess.jsx for the attributes to, from and piece.
 *
 * You should be able to get every one of these values directly from chess.jsx, except promotion. I think we need to do some manual code for promoting pawns.
 *
 * Note that you need to handle upgrading the pawn yourself, before you call the makeMove function.
 */
export interface InputChessMove {
    /** square move is from. Gotten from chess.jsx */
    from: string;
    /** square move is to. Gotten from chess.jsx */
    to: string;
    /** If the move is a pawn moving into the final square, what peice the pawn will be promoted to*/
    promotion?: 'q'|'r'|'n'|'b';
    /** piece the move is moving. Gotten from chess.jsx */
    piece: string;
}

interface ChessPlayerHookReturn{
    /**
     * The state of the chess player.
     * Ie users username, state,etc.
     *
     * Is null when initially loading in value.
     */
    thisUser:User|null;
    /** The state of the game the chess player is currently playing. Is null when not playing a game, or when they have finished a game, and they have not re-queued for another.*/
    gameState:GameState|null;
    /**
     * A function to call when the user wants to queue for a game.
     * @param timeLimitMs - the amount of time the played game will have.
     */
    queueForGame:(timeLimitMs:number)=>void;

    /**
     * A function to call when the user makes a move in the game they are in.
     * Will throw an error if it is called when not in a game
     *
     *
     * Note, in the case you are promoting a pawn, you need to state what you are promoting it to before you call this function.
     *
     */
    makeMove:(move:InputChessMove)=>void

}

function isPlayersTurn(game:GameState,user:User):boolean{
    const isPlayerWhite=user.email === game.whitePlayer.email;
    const isMovingPlayerWhite=game.playerTurn==="white";
    return (!isPlayerWhite&&!isMovingPlayerWhite )||(isPlayerWhite&&isMovingPlayerWhite)
}

/**
 * A hook for a regular user to connect to socket.io. It manages all socket.io state for you.
 *
 * @param onError - a function to be called whenever there is an error on the server.
 */
export function useChessPlayerState(onError:ErrorFunc):ChessPlayerHookReturn{
    const [thisUser,setThisUser]=useState<User|null>({username:"kevin",elo:2390,email:"kevin@kevin.com",isAdmin:false,state:"none"})
    const [gameState,setGameState]=useState<GameState|null>(null);
    // const connectionRef=useRef<any>(null);
    const connectionRef=useRef<Socket|null>(null);

    useEffect(()=>{
        const connection=io().connect();
        connection.on("user",(msg:string)=>setThisUser(JSON.parse(msg)));
        connection.on("game",(msg:string)=>setGameState(JSON.parse(msg)));
        connection.on("input_error",(error:string)=>onError(new Error(error)))
        connectionRef.current=connection;
    },[onError])



    const queueForGame=useCallback(throttle((timeLimit:number)=>{
        if(thisUser!==null){
            setGameState(null);
            sendIoMessage(connectionRef.current,"play_game",timeLimit.toString());
        }
    },2000),[thisUser]);

    const makeMove=useCallback(throttle((move:InputChessMove)=>{
            if(gameState===null){
                throw new Error("error, cannot make move when no game.")
            }
            else if(thisUser === null){
                throw new Error("invalid user");
            }
            else if (thisUser.state!=="game"){
                throw new Error("must be playing game");
            }
            else if(move.to.endsWith("8")||move.to.endsWith("1")){
                if(move.piece.toUpperCase().endsWith("P")&&typeof move.promotion==="undefined"){
                    throw new Error("error, the developer forgot to promote a pawn, before calling makeMove");
                }
            }
            else if(!isPlayersTurn(gameState,thisUser)){
                throw new Error("not your turn!");
            }
            else{
                sendIoMessage(connectionRef.current,"make_move",JSON.stringify(move));
            }
    },2000),[gameState, thisUser]);

    if(thisUser!==null&&gameState!==null&&thisUser.state==="game"&&!isPlayersTurn(gameState,thisUser)){
        const gameStateWithNoMoves:GameState={...gameState,possibleMoves:[]};
        return {gameState:gameStateWithNoMoves,thisUser,makeMove,queueForGame};
    }
    return {gameState,thisUser,makeMove,queueForGame};
}

/**
 * A string, which can be turned into a date easily by passing it to the new Date() constructor.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON}
 */
export type DateTimeStr=string

export interface HistoricalGame{
    whitePlayer: User,
    blackPlayer :User,
    winner :"white"|"black"|"draw",
    startTime:DateTimeStr,
    endTime:DateTimeStr,
    timeLimit:number,
    pgn:string,
    whitePlayerEloBefore:number,
    blackPlayerEloBefore:number,
}

export async function getPlayerStats():Promise<HistoricalGame[]>{
    return [
        {
            whitePlayer:{username:"kevin",elo:2390,email:"kevin@kevin.com",isAdmin:false,state:"none"},
            blackPlayer:{username:"nicole",elo:876,email:"nicole@gmail.com",isAdmin:false,state:"none"},
            blackPlayerEloBefore:920,
            whitePlayerEloBefore:1344,
            endTime:(new Date(2020,2,21,2,21,24)).toJSON(),
            startTime:(new Date(2020,2,21,2,3,12)).toJSON(),
            pgn:"1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 {This opening is called the Ruy Lopez.}\n" +
                "4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7\n" +
                "11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15. Nb1 h6 16. Bh4 c5 17. dxe5\n" +
                "Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21. Nc4 Nxc4 22. Bxc4 Nb6\n" +
                "23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7 27. Qe3 Qg5 28. Qxg5\n" +
                "hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33. f3 Bc8 34. Kf2 Bf5\n" +
                "35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5 40. Rd6 Kc5 41. Ra6\n" +
                "Nf2 42. g4 Bd3 43. Re6 1/2-1/2\n",
            timeLimit:3.6e+6/2,
            winner:"draw"
        }
    ]
}