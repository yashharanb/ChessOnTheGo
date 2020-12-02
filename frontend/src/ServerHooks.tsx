import {useCallback, useMemo, useState} from "react";


export interface User{
    _id:number;
    state:"none"|"queued"|"game"|"deleted";
    username:string;
    email:string;
    isAdmin:boolean;
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
    deleteUser:(id:number)=>void;
}

/**
 * A function which is called when there is an error. Displays an error message to user.
 */
export type ErrorFunc=(error:Error)=>void;

export function AdminState(onError:ErrorFunc):AdminHookReturn{
    const [thisUser, setThisUser]=useState<User|null>({username:"theadminlol",elo:1223,email:"admin@admin.com",isAdmin:true,state:"none",_id:1});
    const [allUsers, setAllUsers]=useState<User[]>([
        {username:"theadminlol",elo:1223,email:"admin@admin.com",isAdmin:true,state:"none",_id:1},
        {username:"kevin",elo:2390,email:"kevin@kevin.com",isAdmin:false,state:"game",_id:2},
        {username:"nicole",elo:876,email:"nicole@gmail.com",isAdmin:false,state:"game",_id:3},
        {username:"yesha",elo:987,email:"nicole@gmail.com",isAdmin:false,state:"none",_id:4},
        {username:"yashhhhharan",elo:790,email:"yashhhhhhhhharan@gmail.com",isAdmin:false,state:"queued",_id:5},
        {username:"krl",elo:888,email:"krl@gmail.com",isAdmin:false,state:"none",_id:6},
    ]);

    const deleteUser=useCallback((id:number)=> {
        const userToDelete=allUsers.find(user=>user._id===id);
        if(typeof userToDelete==="undefined"){
            onError(new Error("error, could not find user to delete"));
        }
        else if(userToDelete.isAdmin){
            onError(new Error("cannot delete an admin"));
        }
        else if (userToDelete.state!=="none"){
            onError(new Error(`error, can only delete users who state is none, user state was ${userToDelete.state}`));
        }
        else{
            setAllUsers(allUsers.filter(user=>user._id!==id));
        }
    },[allUsers, onError]);

    const allUsersWithoutDeleted=useMemo(()=>allUsers.filter(user=>user.state!=="deleted"),
        [allUsers])

    return {thisUser,allUsers:allUsersWithoutDeleted,deleteUser}
}