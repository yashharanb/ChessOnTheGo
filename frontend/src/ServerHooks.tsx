import {useCallback, useMemo, useState} from "react";

/***
 * A single user in the application. Both admins and non-admins are represented by this type.
 */
export interface User{
    /** A unique identifier for the user */
    _id:number;
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

/**
 * A hook for the admin to connect to socket.io. I would expect this to only be used by the admin page.
 *
 * @param onError - a function to be called whenever there is an error on the server.
 */
export function useAdminState(onError:ErrorFunc):AdminHookReturn{
    const [thisUser, setThisUser]=useState<User|null>({username:"theadminlol",elo:1223,email:"admin@admin.com",isAdmin:true,state:"none",_id:1});
    const [allUsers, setAllUsers]=useState<User[]>([
        {username:"theadminlol",elo:1223,email:"admin@admin.com",isAdmin:true,state:"none",_id:1},
        {username:"kevin",elo:2390,email:"kevin@kevin.com",isAdmin:false,state:"game",_id:2},
        {username:"nicole",elo:876,email:"nicole@gmail.com",isAdmin:false,state:"game",_id:3},
        {username:"yesha",elo:987,email:"yesha@gmail.com",isAdmin:false,state:"none",_id:4},
        {username:"yashhhhharan",elo:790,email:"yashhhhhhhhharan@gmail.com",isAdmin:false,state:"queued",_id:5},
        {username:"krl",elo:888,email:"krl@gmail.com",isAdmin:false,state:"none",_id:6},
    ]);

    const deleteUsers=useCallback((emails:string[])=> {
        const deletedEmailsSet=new Set(emails);
        const allUsersToDelete=allUsers.filter(user=>deletedEmailsSet.has(user.email));

        if(allUsersToDelete.length!==emails.length){
            throw new Error("error, one or more inputted email did not belong to a known user");
        }
        else if(allUsersToDelete.some(userToDelete=>userToDelete.isAdmin)){
            throw new Error("cannot delete an admin");
        }
        else if (allUsersToDelete.some(userToDelete=>userToDelete.state!=="none")){
            throw new Error("error, can only delete users who state is none");
        }
        else{
            // const deletedIds=allUsersToDelete.map(user=>user._id);
            setAllUsers(allUsers.map(user=>{
                if(deletedEmailsSet.has(user.email)){
                    return {...user, state:"deleted"};
                }
                else{
                    return user;
                }
            }));
        }
    },[allUsers]);

    const allUsersWithoutDeleted=useMemo(()=>allUsers.filter(user=>user.state!=="deleted"), [allUsers])

    return {thisUser,allUsers:allUsersWithoutDeleted,deleteUsers}
}

export interface GameState{
    possibleMoves:string;
    fenString:string;
}

export type ChessCoordinate=`${'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'}${'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'}`;

/**
 * Any valid chess move. Simply get the value from chess.jsx for  the attributes to, from and piece.
 *
 * Note that you need to handle upgrading the pawn yourself, before you call the makeMove function.
 */
export interface ChessMove{
    /** square move is from. Gotten from chess.jsx */
    from: string;
    /** square move is to. Gotten from chess.jsx */
    to: string;
    /** If the move is a pawn moving into the final square, what peice the pawn will be promoted to*/
    promotion?: string;
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
    /** The state of the game the chess player is currently playing. Is null when not playing a game */
    currentGame:GameState|null;
    /** A function to call when the user wants to queue for a game.*/
    queueForGame:()=>void;

    /**
     * A function to call when the user makes a move in the game they are in.
     * Will throw an error if it is called when not in a game
     *
     *
     * Note, in the case you are promoting a pawn, you need to state what you are promoting it to before you call this function.
     *
     */
    makeMove:(move:ChessMove)=>void

}

/**
 * A hook for a regular user to connect to socket.io. It manages all socket.io state for you.
 *
 * @param onError - a function to be called whenever there is an error on the server.
 */
// export function useChessPlayerState(onError:ErrorFunc):ChessPlayerHookReturn{
//     const makeMove=useCallback((move:ChessMove)=>{
//             if(move.to.endsWith("8")||move.to.endsWith("1")){
//                 if(move.piece.toUpperCase().endsWith("P")&&typeof move.promotion==="undefined"){
//                     throw new Error("error, the developer forgot to promote a pawn, before calling makeMove");
//                 }
//             }
//
//     },[])
//
//
// }