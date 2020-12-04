function streams(io){
    const passport = require('passport');
    const validate = require('jsonschema').validate;

    const {User, CurrentGame,HistoricalGame,Queue} = require("./models/models");

    function getUserToSend(user){
        const {state,username,email,isAdmin,elo}=user;
        return {state,username,email,isAdmin,elo};
    }

    async function refreshUsers(){
        const allCurrentUsers=await User.find({});
        io.to("all_users_group").emit("users",JSON.stringify(allCurrentUsers.map(getUserToSend)));
    }
    function getUserRoom(userId){
        return `user_${userId}_room`
    }

    async function updateUsers(socket,users,partialUser){
        for(const user of users){
            const afterUpdate=await User.findOneAndUpdate({email:user.email},{"$set":partialUser},{new:true});
            socket.to(getUserRoom(afterUpdate._id)).emit("user",JSON.stringify(getUserToSend(afterUpdate)));
        }
        await refreshUsers();
    }
    function emitError(socket,errorStr){
        console.error(errorStr);
        socket.emit("input_error",errorStr);
    }
    /**
     * function to call when an administrator connects
     *
     * @param {Socket} socket
     * @param {User} usr
     */
    async function onAdminConnect(socket, usr) {
        socket.join("all_users_group");
        await refreshUsers();
        socket.on("delete_users",async usersStr=>{
            const emails=JSON.parse(usersStr);
            const validation=validate(emails,{
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                }
            )
            if(validation.errors.length!==0){
                emitError(socket,"invalid users")
            }
            else{
                const allUsersToDelete=await User.find({email:{$in:emails}});
                if(allUsersToDelete.length!==emails.length){
                    emitError(socket,"The email address you selected does not belong to a registered user.")
                }
                else if(allUsersToDelete.some(userToDelete=>userToDelete.isAdmin)){
                    emitError(socket,"You can't delete an admin user.")
                }
                else if (allUsersToDelete.some(userToDelete=>userToDelete.state!=="none")){
                    emitError(socket,"You can't delete users who are currently queued or playing a game.")
                }
                else{
                    await updateUsers(socket,allUsersToDelete,{state:"deleted"});
                }
            }
        })
    }

    /***
     * function to call when a regular user connects.
     *
     * @param {Socket} socket
     * @param {User} usr
     */
    async function onRegularConnect(socket,usr){
        console.log("regular connection");
    }

    /**
     *
     * @param {Socket} socket
     */
    async function onConnection(socket){
        const userKey= socket.handshake.session?.passport?.user
        if(userKey){
            passport.deserializeUser(userKey,async (err,usr)=>{
                socket.emit("user",JSON.stringify(getUserToSend(usr)));
                socket.join(getUserRoom(userKey));
                if(usr.isAdmin){
                    await onAdminConnect(socket,usr);
                }
                else{
                    await onRegularConnect(socket,usr);
                }
            });
        }
        else{
            socket.disconnect(true);
        }


        socket.on("play_game", ()=>{
            // when a user is queued/starts game, the current_user client event will change. (from subscribe_current_user). T
            // This is to account for use cases where the user is already mid game, (ie opens a different tab).


            // fires (current_user) client event.
            // subscribes to 'game' client event.

            let makeMoveListener=null;
            //when game found:
            makeMoveListener=()=>{
                // fires to 'game' client event, for all clients listening to this particular game.
                // Make a single move on client
            };

            socket.on("make_move",makeMoveListener)


            //when game ended:
            //unsubscribes to game client event
            socket.off("make_move",makeMoveListener)

            // kevin
        })


        // // maybe have outside spectators.... wouldn't be too difficult I think, since code shared with
        // socket.on("subscribe_game",msg=>{
        // 	// subscribes to 'game' client event
        // 	// kevin
        // });
        //
        // socket.on("get_user_statistics",msgWithUserId=>{
        // 	// krl
        // })

    }
    io.on('connection', onConnection)

    return {refreshUsers}
}
module.exports=streams