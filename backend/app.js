//As Kevin wants me to use express:
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//for the GUI using EJS in the views folder
const expressLayouts = require('express-ejs-layouts');

//for mongoDB Atlas
const mongoose = require('mongoose');
require("dotenv/config");

//for the express session middleware
const flash = require('connect-flash');
const session = require('express-session');

//for passpport.js config called in the "//Needed by passport.js middleware in the config folder and has to be after the //Express session section in here" section
const passport = require('passport');
require('./config/passport')(passport);

//Connect using mongoose to MongoDB Atlas by calling the .env enviroment variable setup for each developer for now
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
	.then(() => console.log('mongoDB Atlas Connected!'))
	.catch(err => console.log(err));

//for middle layer using EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body parser (to get data from the form)
app.use(express.urlencoded({extended: false}));
app.use(express.static("public")); //help from https://stackoverflow.com/questions/17755147/displaying-an-image-with-ejs-in-node-js-express to put pictures accessible from public folder

//Express session from https://github.com/expressjs/session#readme
app.use(session(
{
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//Needed by passport.js middleware in the config folder and has to be after the //Express session section in here
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variables for flashing success colors and error colors
app.use(function(req, res, next)
{
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
 });

//Routes
app.use('/', require('./routes'));		//main page
app.use('/users', require('./routes/users'));	//users page

io.on('connection', socket => {

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



//Port that this will be run on
const PORT = process.env.PORT || 8000;
//Starts the server on specific port
app.listen(PORT, console.log(`Server started on port ${PORT}`));
