import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";

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

    const deleteUsers=useCallback((emails:string[])=> {
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
    },[allUsers]);

    const allUsersWithoutDeleted=useMemo(()=>allUsers.filter(user=>user.state!=="deleted"), [allUsers])

    return {thisUser,allUsers:allUsersWithoutDeleted,deleteUsers}
}
export interface GameWinLossState{
    gameOverState:"winLoss";
    reason:"checkmate"|"timeout"|"forfeit";
    winner:"white"|"black";
}

export interface GameDraw{
    gameOverState:"tie";
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
    const timeoutRef=useRef<any>(null);
    const queueForGame=useCallback((timeLimit:number)=>{
        if(thisUser!==null){
            setThisUser({...thisUser, state:"queued"});
            setGameState(null)
            setTimeout(()=>{
                setThisUser({...thisUser, state:"game"})
            },2000)
            setTimeout(()=>{
                const newGame:GameState={
                    whiteRemainingTimeMs:timeLimit,
                    blackRemainingTimeMs:timeLimit,
                    blackPlayer:{username:"kevin",elo:2390,email:"kevin@kevin.com",isAdmin:false,state:"game"},
                    whitePlayer:{username:"nicole",elo:876,email:"nicole@gmail.com",isAdmin:false,state:"game"},
                    fenString:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                    inCheck:false,
                    playerTurn:"white",
                    possibleMoves:[{"color":"w","from":"a2","to":"a3","flags":"n","piece":"p","san":"a3"},{"color":"w","from":"a2","to":"a4","flags":"b","piece":"p","san":"a4"},{"color":"w","from":"b2","to":"b3","flags":"n","piece":"p","san":"b3"},{"color":"w","from":"b2","to":"b4","flags":"b","piece":"p","san":"b4"},{"color":"w","from":"c2","to":"c3","flags":"n","piece":"p","san":"c3"},{"color":"w","from":"c2","to":"c4","flags":"b","piece":"p","san":"c4"},{"color":"w","from":"d2","to":"d3","flags":"n","piece":"p","san":"d3"},{"color":"w","from":"d2","to":"d4","flags":"b","piece":"p","san":"d4"},{"color":"w","from":"e2","to":"e3","flags":"n","piece":"p","san":"e3"},{"color":"w","from":"e2","to":"e4","flags":"b","piece":"p","san":"e4"},{"color":"w","from":"f2","to":"f3","flags":"n","piece":"p","san":"f3"},{"color":"w","from":"f2","to":"f4","flags":"b","piece":"p","san":"f4"},{"color":"w","from":"g2","to":"g3","flags":"n","piece":"p","san":"g3"},{"color":"w","from":"g2","to":"g4","flags":"b","piece":"p","san":"g4"},{"color":"w","from":"h2","to":"h3","flags":"n","piece":"p","san":"h3"},{"color":"w","from":"h2","to":"h4","flags":"b","piece":"p","san":"h4"},{"color":"w","from":"b1","to":"a3","flags":"n","piece":"n","san":"Na3"},{"color":"w","from":"b1","to":"c3","flags":"n","piece":"n","san":"Nc3"},{"color":"w","from":"g1","to":"f3","flags":"n","piece":"n","san":"Nf3"},{"color":"w","from":"g1","to":"h3","flags":"n","piece":"n","san":"Nh3"}],
                    winLoss:null,
                    history:[]
                }
                setGameState(newGame)
            },3000);
            const afterManyMoves:GameState={
                whiteRemainingTimeMs:30000,
                blackRemainingTimeMs:10000,
                blackPlayer:{username:"kevin",elo:2390,email:"kevin@kevin.com",isAdmin:false,state:"game"},
                whitePlayer:{username:"nicole",elo:876,email:"nicole@gmail.com",isAdmin:false,state:"game"},
                fenString:"rn1qkbnr/ppp1pppp/7P/P7/8/1b6/1PpPPPP1/RNBQKBNR b KQkq - 0 7",
                inCheck:false,
                playerTurn:"black",
                possibleMoves:[{"color":"b","from":"b8","to":"d7","flags":"n","piece":"n","san":"Nd7"},{"color":"b","from":"b8","to":"c6","flags":"n","piece":"n","san":"Nc6"},{"color":"b","from":"b8","to":"a6","flags":"n","piece":"n","san":"Na6"},{"color":"b","from":"d8","to":"d7","flags":"n","piece":"q","san":"Qd7"},{"color":"b","from":"d8","to":"d6","flags":"n","piece":"q","san":"Qd6"},{"color":"b","from":"d8","to":"d5","flags":"n","piece":"q","san":"Qd5"},{"color":"b","from":"d8","to":"d4","flags":"n","piece":"q","san":"Qd4"},{"color":"b","from":"d8","to":"d3","flags":"n","piece":"q","san":"Qd3"},{"color":"b","from":"d8","to":"d2","flags":"c","piece":"q","captured":"p","san":"Qxd2+"},{"color":"b","from":"d8","to":"c8","flags":"n","piece":"q","san":"Qc8"},{"color":"b","from":"e8","to":"d7","flags":"n","piece":"k","san":"Kd7"},{"color":"b","from":"g8","to":"h6","flags":"c","piece":"n","captured":"p","san":"Nxh6"},{"color":"b","from":"g8","to":"f6","flags":"n","piece":"n","san":"Nf6"},{"color":"b","from":"a7","to":"a6","flags":"n","piece":"p","san":"a6"},{"color":"b","from":"b7","to":"b6","flags":"n","piece":"p","san":"b6"},{"color":"b","from":"b7","to":"b5","flags":"b","piece":"p","san":"b5"},{"color":"b","from":"c7","to":"c6","flags":"n","piece":"p","san":"c6"},{"color":"b","from":"c7","to":"c5","flags":"b","piece":"p","san":"c5"},{"color":"b","from":"e7","to":"e6","flags":"n","piece":"p","san":"e6"},{"color":"b","from":"e7","to":"e5","flags":"b","piece":"p","san":"e5"},{"color":"b","from":"f7","to":"f6","flags":"n","piece":"p","san":"f6"},{"color":"b","from":"f7","to":"f5","flags":"b","piece":"p","san":"f5"},{"color":"b","from":"g7","to":"g6","flags":"n","piece":"p","san":"g6"},{"color":"b","from":"g7","to":"g5","flags":"b","piece":"p","san":"g5"},{"color":"b","from":"g7","to":"h6","flags":"c","piece":"p","captured":"p","san":"gxh6"},{"color":"b","from":"b3","to":"a4","flags":"n","piece":"b","san":"Ba4"},{"color":"b","from":"b3","to":"c4","flags":"n","piece":"b","san":"Bc4"},{"color":"b","from":"b3","to":"d5","flags":"n","piece":"b","san":"Bd5"},{"color":"b","from":"b3","to":"e6","flags":"n","piece":"b","san":"Be6"},{"color":"b","from":"b3","to":"a2","flags":"n","piece":"b","san":"Ba2"},{"color":"b","from":"c2","to":"d1","flags":"cp","piece":"p","promotion":"q","captured":"q","san":"cxd1=Q#"},{"color":"b","from":"c2","to":"d1","flags":"cp","piece":"p","promotion":"r","captured":"q","san":"cxd1=R#"},{"color":"b","from":"c2","to":"d1","flags":"cp","piece":"p","promotion":"b","captured":"q","san":"cxd1=B"},{"color":"b","from":"c2","to":"d1","flags":"cp","piece":"p","promotion":"n","captured":"q","san":"cxd1=N"},{"color":"b","from":"c2","to":"b1","flags":"cp","piece":"p","promotion":"q","captured":"n","san":"cxb1=Q"},{"color":"b","from":"c2","to":"b1","flags":"cp","piece":"p","promotion":"r","captured":"n","san":"cxb1=R"},{"color":"b","from":"c2","to":"b1","flags":"cp","piece":"p","promotion":"b","captured":"n","san":"cxb1=B"},{"color":"b","from":"c2","to":"b1","flags":"cp","piece":"p","promotion":"n","captured":"n","san":"cxb1=N"}],
                winLoss:null,
                history: [{"color":"w","from":"a2","to":"a3","flags":"n","piece":"p","san":"a3"},{"color":"b","from":"d7","to":"d5","flags":"b","piece":"p","san":"d5"},{"color":"w","from":"a3","to":"a4","flags":"n","piece":"p","san":"a4"},{"color":"b","from":"c8","to":"e6","flags":"n","piece":"b","san":"Be6"},{"color":"w","from":"a4","to":"a5","flags":"n","piece":"p","san":"a5"},{"color":"b","from":"d5","to":"d4","flags":"n","piece":"p","san":"d4"},{"color":"w","from":"h2","to":"h3","flags":"n","piece":"p","san":"h3"},{"color":"b","from":"d4","to":"d3","flags":"n","piece":"p","san":"d3"},{"color":"w","from":"h3","to":"h4","flags":"n","piece":"p","san":"h4"},{"color":"b","from":"d3","to":"c2","flags":"c","piece":"p","captured":"p","san":"dxc2"},{"color":"w","from":"h4","to":"h5","flags":"n","piece":"p","san":"h5"},{"color":"b","from":"e6","to":"b3","flags":"n","piece":"b","san":"Bb3"},{"color":"w","from":"h5","to":"h6","flags":"n","piece":"p","san":"h6"}]
            }
            setTimeout(()=>setGameState(afterManyMoves),5000);

            const afterTimeLimitUp:GameState={
                whiteRemainingTimeMs:30000,
                blackRemainingTimeMs:0,
                blackPlayer:{username:"kevin",elo:2390,email:"kevin@kevin.com",isAdmin:false,state:"game"},
                whitePlayer:{username:"nicole",elo:876,email:"nicole@gmail.com",isAdmin:false,state:"game"},
                fenString:"rn1qkbnr/ppp1pppp/7P/P7/8/1b6/1PpPPPP1/RNBQKBNR b KQkq - 0 7",
                inCheck:false,
                playerTurn:"black",
                possibleMoves:[],
                winLoss:{gameOverState:"winLoss",winner:"white",reason:"timeout"},
                history: [{"color":"w","from":"a2","to":"a3","flags":"n","piece":"p","san":"a3"},{"color":"b","from":"d7","to":"d5","flags":"b","piece":"p","san":"d5"},{"color":"w","from":"a3","to":"a4","flags":"n","piece":"p","san":"a4"},{"color":"b","from":"c8","to":"e6","flags":"n","piece":"b","san":"Be6"},{"color":"w","from":"a4","to":"a5","flags":"n","piece":"p","san":"a5"},{"color":"b","from":"d5","to":"d4","flags":"n","piece":"p","san":"d4"},{"color":"w","from":"h2","to":"h3","flags":"n","piece":"p","san":"h3"},{"color":"b","from":"d4","to":"d3","flags":"n","piece":"p","san":"d3"},{"color":"w","from":"h3","to":"h4","flags":"n","piece":"p","san":"h4"},{"color":"b","from":"d3","to":"c2","flags":"c","piece":"p","captured":"p","san":"dxc2"},{"color":"w","from":"h4","to":"h5","flags":"n","piece":"p","san":"h5"},{"color":"b","from":"e6","to":"b3","flags":"n","piece":"b","san":"Bb3"},{"color":"w","from":"h5","to":"h6","flags":"n","piece":"p","san":"h6"}]
            }
            timeoutRef.current=setTimeout(()=>{
                setGameState(afterTimeLimitUp);
                const newElo=thisUser.elo-50;
                setThisUser({...thisUser,elo:newElo,state:"none"});
                timeoutRef.current=null;
            },15000);
        }
    },[thisUser]);

    const makeMove=useCallback((move:InputChessMove)=>{
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
                if(timeoutRef.current!==null){
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current=null;
                }

                const wonGame:GameState={
                    whiteRemainingTimeMs:30000,
                    blackRemainingTimeMs:4000,
                    blackPlayer:{username:"kevin",elo:2390,email:"kevin@kevin.com",isAdmin:false,state:"game"},
                    whitePlayer:{username:"nicole",elo:876,email:"nicole@gmail.com",isAdmin:false,state:"game"},
                    fenString:"rn1qkbnr/ppp1pppp/7P/P7/8/1b6/1P1PPPP1/RNBqKBNR w KQkq - 0 8",
                    inCheck:false,
                    playerTurn:"white",
                    possibleMoves:[],
                    winLoss:{
                        gameOverState:"winLoss",
                        reason:"checkmate",
                        winner:"black"
                    },
                    history:[{"color":"w","from":"a2","to":"a3","flags":"n","piece":"p","san":"a3"},{"color":"b","from":"d7","to":"d5","flags":"b","piece":"p","san":"d5"},{"color":"w","from":"a3","to":"a4","flags":"n","piece":"p","san":"a4"},{"color":"b","from":"c8","to":"e6","flags":"n","piece":"b","san":"Be6"},{"color":"w","from":"a4","to":"a5","flags":"n","piece":"p","san":"a5"},{"color":"b","from":"d5","to":"d4","flags":"n","piece":"p","san":"d4"},{"color":"w","from":"h2","to":"h3","flags":"n","piece":"p","san":"h3"},{"color":"b","from":"d4","to":"d3","flags":"n","piece":"p","san":"d3"},{"color":"w","from":"h3","to":"h4","flags":"n","piece":"p","san":"h4"},{"color":"b","from":"d3","to":"c2","flags":"c","piece":"p","captured":"p","san":"dxc2"},{"color":"w","from":"h4","to":"h5","flags":"n","piece":"p","san":"h5"},{"color":"b","from":"e6","to":"b3","flags":"n","piece":"b","san":"Bb3"},{"color":"w","from":"h5","to":"h6","flags":"n","piece":"p","san":"h6"},{"color":"b","from":"c2","to":"d1","flags":"cp","piece":"p","promotion":"q","captured":"q","san":"cxd1=Q#"}]
                }
                const newElo=thisUser.elo+1
                setThisUser({...thisUser,elo:newElo,state:"none"})
                setGameState(wonGame);
            }
    },[gameState, thisUser]);

    if(thisUser!==null&&gameState!==null&&thisUser.state==="game"&&!isPlayersTurn(gameState,thisUser)){
        const gameStateWithNoMoves:GameState={...gameState,possibleMoves:[]};
        return {gameState:gameStateWithNoMoves,thisUser,makeMove,queueForGame};
    }
    return {gameState,thisUser,makeMove,queueForGame};
}