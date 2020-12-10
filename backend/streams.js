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

    async function updateUsers(users,partialUser){
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
                    await updateUsers(allUsersToDelete,{state:"deleted"});
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
    function isPlayersTurn(playerWhoMoved,user,userGame){
        const isPlayerWhite=user.email === userGame.whitePlayer.email;
        const isMovingPlayerWhite=playerWhoMoved==="w";
        return (!isPlayerWhite&&!isMovingPlayerWhite )||(isPlayerWhite&&isMovingPlayerWhite)
    }


    async function matchmakeGame(user,timeLimitMs) {
        const minElo=user.elo-200;
        const maxElo=user.elo+200;
        const currentGamesWithFilteredPlayers=await CurrentGame.find({blackPlayer:null, timeLimit:timeLimitMs}).populate({path:"whitePlayer",match:{elo:{$lt:maxElo,$gt:minElo}}}).sort("-queueStartTime");
        for(const game of currentGamesWithFilteredPlayers){
            if(game.whitePlayer!==null){
                return game;
            }
        }
        return null;
    }
    const gameIdToTimeoutObject={}

    /**
     *  note, call this method before adding a move to a chessgame. Otherwise will say the wrong peron timed out.
     *  also make sure that populatedGameModel is populated.
     */
    async function handleGameTimeout(populatedGameModel, chessgame){
        console.log("timout!!!");
        if(typeof gameIdToTimeoutObject[populatedGameModel._id] !== "undefined"){
            delete gameIdToTimeoutObject[populatedGameModel._id];
        }

        let winner
        if(chessgame.turn() === "w"){
            populatedGameModel.whitePlayerTimeRemaining=0;
            winner="black";
        }
        else{
            populatedGameModel.blackPlayerTimeRemaining=0;
            winner="white";
        }
        await handleGameOver(populatedGameModel,winner);
        const gameState=getGameState(chessgame,populatedGameModel);
        io.in(getGameRoom(populatedGameModel)).emit("game",JSON.stringify(gameState));
    }
    async function handleTimeout(gameId){
        const game=await CurrentGame.findById(gameId).populate('whitePlayer').populate('blackPlayer');
        const chessgame=getChessJsObjectFromGame(game);
        return handleGameTimeout(game,chessgame);
    }

    function calculateElos(whiteElo,blackElo,winner){
        let [whiteNum,blackNum] = [1,0];
        if(winner === "black"){
            [whiteNum,blackNum]=[0,1];
        }
        //source - https://www.geeksforgeeks.org/elo-rating-algorithm/
        const probabilityWhite = (1.0 / (1.0 + Math.pow(10, ((blackElo - whiteElo) / 400))));
        const probabilityBlack = (1.0 / (1.0 + Math.pow(10, ((whiteElo - blackElo) / 400))));
        const newEloWhite=whiteElo + 30*(whiteNum - probabilityWhite);
        const newEloBlack=blackElo + 30*(blackNum - probabilityBlack);
        return [newEloWhite,newEloBlack]

    }

    async function handleGameOver(userGame, winnerOrDraw) {
        const {whitePlayer,blackPlayer,startTime,timeLimit,pgn}=userGame;
        const whitePlayerEloBefore=whitePlayer.elo;
        const blackPlayerEloBefore=blackPlayer.elo;
        await (new HistoricalGame({whitePlayer,blackPlayer,startTime,timeLimit,pgn, winner :winnerOrDraw, whitePlayerEloBefore, blackPlayerEloBefore})).save()
        await CurrentGame.findByIdAndDelete(userGame.id);
        if(winnerOrDraw==="draw"){
            await updateUsers([whitePlayer,blackPlayer],{state:"none"})
        }
        else{
            const [whiteNewElo,blackNewElo]=calculateElos(whitePlayerEloBefore,blackPlayerEloBefore,winnerOrDraw);
            await updateUsers([whitePlayer], {state:"none", elo:whiteNewElo});
            await updateUsers([blackPlayer], {state:"none", elo:blackNewElo});
        }
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
                const matchmadeGame=await matchmakeGame(user,timeLimitMs);

                if(matchmadeGame === null){
                    const newGame=await (new CurrentGame({ queueStartTime : new Date(), whitePlayer: user, blackPlayer :null,  startTime:null, timeLimit:timeLimitMs, pgn:"",
                        whitePlayerTimeRemaining:timeLimitMs, blackPlayerTimeRemaining:timeLimitMs})).save();
                    socket.join(getGameRoom(newGame));
                    await updateUsers([user],{state:"queued"});
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
                    await updateUsers([user,populatedGame.whitePlayer],{state:"game"});
                    io.in(getGameRoom(populatedGame)).emit("game",JSON.stringify(gameState));

                    gameIdToTimeoutObject[populatedGame.id]=setTimeout(()=>handleTimeout(populatedGame.id),timeLimitMs);
                }
            }
        });

        socket.on("make_move",async moveStr=>{
            const move=JSON.parse(moveStr);
            const user=await User.findOne({"_id":usrKey});
            const userGame=await CurrentGame.findOne({$or: [{whitePlayer: usrKey}, {blackPlayer: usrKey}]})
                .populate("whitePlayer").populate("blackPlayer");

            //basic validation of data
            const validation=validate(move,{
                    "type": "object",
                    "properties": {
                        from:{"type": "string"},
                        to:{"type": "string"},
                        promotion:{"type": "string"},
                        piece:{"type": "string"}
                    },
                    "required":["from","to","piece"]
                });
            if(validation.errors.length!==0){
                emitError(socket,"improperly formatted move object inputted");
            }
            else if(userGame === null){
                emitError(socket,"error, made move when not in game");
            } //did not specify pawn
            else if(move.piece.toUpperCase().endsWith("P")&&(typeof move.promotion==="undefined")&&(move.to.endsWith("8")||move.to.endsWith("1"))){
                emitError(socket,"error, must specify pawn promotion type");
            }
            else {
                //main part which checks the chess game, and does appropriate action depending on the games state.

                const chessgame=getChessJsObjectFromGame(userGame);
                const nextPlayerTurnStartTime=new Date();
                const timeElapsedSinceLastMove=nextPlayerTurnStartTime-userGame.movingPlayerTurnStartTime;
                const playerWhoMoved=chessgame.turn();
                const movingPlayerTimeRemaining=playerWhoMoved ==="w" ? userGame.whitePlayerTimeRemaining:userGame.blackPlayerTimeRemaining;
                const nextPlayerTimeRemaining=playerWhoMoved ==="w" ? userGame.blackPlayerTimeRemaining:userGame.whitePlayerTimeRemaining;
                if(!isPlayersTurn(playerWhoMoved,user,userGame)){
                    emitError(socket,"not your turn!");
                }
                else if(timeElapsedSinceLastMove > movingPlayerTimeRemaining){
                    await handleGameTimeout(userGame,chessgame);
                }
                else{
                    const outputtedMove=chessgame.move(move);
                    if(outputtedMove===null){
                        emitError(socket,"invalid move inputted");
                    }
                    else{
                        //clear the timeout, so the game does not reach a 'time limit reached' error
                        if(userGame.id in gameIdToTimeoutObject){
                            try{
                                clearTimeout(gameIdToTimeoutObject[userGame.id]);
                            }catch (e) {
                                console.error(e.message);
                            }
                        }

                        if(playerWhoMoved==="w"){
                            userGame.whitePlayerTimeRemaining=userGame.whitePlayerTimeRemaining - timeElapsedSinceLastMove;
                        }
                        else{
                            userGame.blackPlayerTimeRemaining=userGame.blackPlayerTimeRemaining - timeElapsedSinceLastMove;
                        }
                        userGame.movingPlayerTurnStartTime=nextPlayerTurnStartTime;
                        userGame.pgn=chessgame.pgn();
                        const gameState=getGameState(chessgame,userGame);
                        if(gameState.winLoss===null){
                            await userGame.save();
                            gameIdToTimeoutObject[userGame.id]=setTimeout(()=>handleTimeout(userGame.id),nextPlayerTimeRemaining);
                        }
                        else{
                            const winnerOrDraw=gameState.winLoss.winner ?? "draw";
                            delete gameIdToTimeoutObject[userGame.id];
                            await handleGameOver(userGame,winnerOrDraw);
                        }
                        io.in(getGameRoom(userGame)).emit("game",JSON.stringify(gameState));
                    }
                }

            }
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