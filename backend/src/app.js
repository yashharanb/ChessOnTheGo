const {HistoricalGame,CurrentGame,User,QueuedUser}=require("./models")


const express = require("express");
const app = express();
const port = 8000;

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get("/", (req, res) => res.send("Good monring sunshine!"));


// user in message has info:
// email_address, username,isAdmin, elo,  'state' <= queue,game,none,invalid

//note, before connecting,
io.on('connection', socket => {
//    authenticate....

    socket.on("subscribe_users",()=>{
        // make sure is admin.
        // maybe have range of users... like is futures proofed this way, but also needs a lot of state... not sure if worth.
        // each message has full list of all users (stateless) (assuming that is what u guys want).


        //    subscribes to "users" client event
    });

    socket.on("subscribe_current_user",()=>{
        //    has singular user state in it. Ie
        //    subscribes to (current_user) client event.
    //    would also technicall fire (users) client event, wh

    });

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

    // maybe have outside spectators.... wouldn't be too difficult I think, since code shared with
    socket.on("subscribe_game",msg=>{
        // subscribes to 'game' client event
        // kevin
    });

    socket.on("get_user_statistics",msgWithUserId=>{
        // krl
    })

})


app.listen(port, () => console.log(
    `Example app listening on port ${port}!`
));
