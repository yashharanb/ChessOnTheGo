function streams(io){
    const passport = require('passport');
    const validate = require('jsonschema').validate;
    const { ChessInstance, Chess } = require('chess.js')

    const {User, CurrentGame,HistoricalGame} = require("./models/models");

    function getUserToSend(user){
        const {state,username,email,isAdmin,elo}=user;
        return {state,username,email,isAdmin,elo};
    }

    async function refreshUsers(){
        const allCurrentUsers=await User.find({});
        io.in("all_users_group").emit("users",JSON.stringify(allCurrentUsers.map(getUserToSend)));
    }
    function getUserRoom(userId){
        return `user_${userId}_room`
    }
    function getGameRoom(game){
        return `game_${game.id}_room`
    }

    async function updateUsers(socket,users,partialUser){
        for(const user of users){
            const afterUpdate=await User.findOneAndUpdate({email:user.email},{"$set":partialUser},{new:true});
            const id=afterUpdate.id;
            io.in(getUserRoom(id)).emit("user",JSON.stringify(getUserToSend(afterUpdate)));
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
     */
    async function onAdminConnect(socket) {
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

    function getChessJsObjectFromGame(game){
        const chess=Chess();
        chess.load_pgn(game.pgn);
        return chess;
    }

    /**
     *
     * @param {ChessInstance} chess
     * @param {CurrentGame} populatedGameModel
     */
    function getGameState(chess,populatedGameModel){
        const {whitePlayerTimeRemaining, blackPlayerTimeRemaining,whitePlayer,blackPlayer,movingPlayerTurnStartTime}=populatedGameModel;
        const playerTurn=chess.turn() === "w" ? "white":"black";
        const possibleMoves=chess.moves({verbose:true});
        const fenString=chess.fen();
        const inCheck=chess.in_check();
        const history=chess.history({verbose:true});
        let winLoss=null;
        const whitePlayerOutOfTime=whitePlayerTimeRemaining===0;
        const blackPlayerOutOfTime=blackPlayerTimeRemaining===0;
        const gameOver=chess.game_over();
        const inDraw=chess.in_draw();
        if(gameOver||inDraw||whitePlayerOutOfTime||blackPlayerOutOfTime){
            const isCheckmate=chess.in_checkmate();
            const isWinOrLoss=whitePlayerOutOfTime||blackPlayerOutOfTime||isCheckmate;
            const gameOverState=isWinOrLoss ? "winLoss":"draw";
            let winner,reason;
            if(isWinOrLoss){
                if(whitePlayerOutOfTime){
                    winner="black";
                    reason="timeout";
                }
                else if (blackPlayerOutOfTime){
                    winner="white";
                    reason="timeout";
                }
                else{
                    winner=chess.turn() === "w"?"black":"white";
                    reason="checkmate";
                }
            }
            else if (inDraw){
                winner=null;
                if(chess.insufficient_material()){
                    reason="insufficient-material";
                }
                else if(chess.in_stalemate()){
                    reason="stalemate";
                }
                else if(chess.in_threefold_repetition()){
                    reason="threefold-repetition";
                }
                else{
                    reason="50-move";
                }
            }
            else{
                throw new Error("internal bug to chess.js, somehow game-over but not drawn or in won state");
            }
            winLoss={gameOverState,reason,winner};
        }

        return {
            whiteRemainingTimeMs:whitePlayerTimeRemaining,
            blackRemainingTimeMs:blackPlayerTimeRemaining,
            playerTurn,
            whitePlayer,
            blackPlayer,
            possibleMoves,
            fenString,
            inCheck,
            winLoss,
            history,
            movingPlayerTurnStartTime,
        }
    }

    async function matchmakeGame(user) {
        const minElo=user.elo-200;
        const maxElo=user.elo+200;
        //todo use min max elo
        return CurrentGame.findOne({blackPlayer:null}).sort("-queueStartTime").limit(1);
    }
    const gameIdToTimeoutObject={}

    async function handleTimeout(gameId){
        console.log("timout!!!")
    //    todo
    }
    /***
     * function to call when a regular user connects.
     *
     * @param {Socket} socket
     * @param {string} usrKey
     */
    async function onRegularConnect(socket,usrKey){

        socket.on("play_game", async (timeLimitMsStr)=>{
            const timeLimitMs=parseInt(timeLimitMsStr);
            const userGame=await CurrentGame.findOne({$or: [{whitePlayer: usrKey}, {blackPlayer: usrKey}]})
                .populate("whitePlayer").populate("blackPlayer");
            if(userGame!==null){
                if(userGame.blackPlayer) {
                    const gameState=getGameState(getChessJsObjectFromGame(userGame),userGame);
                    socket.emit("game",JSON.stringify(gameState));
                }
                socket.join(getGameRoom(userGame));
            }
            else{
                const user=await User.findOne({"_id":usrKey});
                const matchmadeGame=await matchmakeGame(user);

                if(matchmadeGame === null){
                    const newGame=await CurrentGame({ queueStartTime : new Date(), whitePlayer: user, blackPlayer :null,  startTime:null, timeLimit:timeLimitMs, pgn:"",
                        whitePlayerTimeRemaining:timeLimitMs, blackPlayerTimeRemaining:timeLimitMs}).save();
                    socket.join(getGameRoom(newGame));
                    await updateUsers(socket,[user],{state:"queued"});
                }
                else{
                    matchmadeGame.blackPlayer=user._id;
                    matchmadeGame.startTime=new Date();
                    matchmadeGame.pgn="";
                    matchmadeGame.movingPlayerTurnStartTime=new Date();
                    const savedGame=await matchmadeGame.save();
                    const populatedGame=await savedGame.populate('whitePlayer').populate('blackPlayer').execPopulate();
                    socket.join(getGameRoom(populatedGame));
                    const gameState=getGameState(getChessJsObjectFromGame(populatedGame),populatedGame);
                    await updateUsers(socket,[user,populatedGame.whitePlayer],{state:"game"});
                    io.in(getGameRoom(populatedGame)).emit("game",JSON.stringify(gameState));

                    gameIdToTimeoutObject[populatedGame.id]=setTimeout(()=>handleTimeout(populatedGame.id),timeLimitMs);
                }
            }
        });

        socket.on("make_move",async move=>{

        const user=await User.findOne({"_id":usrKey});
        const matchmadeGame=await matchmakeGame(user);
            if(matchmadeGame === null){
                emitError(socket,"error, made move when not in game");
            } //did not specify pawn
            else if(move.to.endsWith("8")||move.to.endsWith("1")){
                if(move.piece.toUpperCase().endsWith("P")&&typeof move.promotion==="undefined"){
                    throw new Error("error, must specify pawn promotion type");
                }
            }
            // else {
            //     // //is p
            //     // else if(!isPlayersTurn(gameState,thisUser)){
            //     //     throw new Error("not your turn!");
            //     // }
        })

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
                socket.join(getUserRoom(usr.id));
                if(usr.isAdmin){
                    await onAdminConnect(socket);
                }
                else{
                    await onRegularConnect(socket,userKey);
                }
            });
        }
        else{
            socket.disconnect(true);
        }

        // socket.on("get_user_statistics",msgWithUserId=>{
        // 	// krl
        // })

    }
    io.on('connection', onConnection)

    return {refreshUsers}
}
module.exports=streams