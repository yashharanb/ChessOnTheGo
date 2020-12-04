const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser())

app.use(express.static(__dirname + '/public'))

const http = require('http').createServer(app);
const io = require('socket.io')(http);

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

// for middle layer using EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body parser (to get data from the form)
app.use(express.urlencoded({extended: false}));
app.use(express.static("public")); //help from https://stackoverflow.com/questions/17755147/displaying-an-image-with-ejs-in-node-js-express to put pictures accessible from public folder

//Express session from https://github.com/expressjs/session#readme
const sessionMiddleware = session({secret: 'secret',resave: true, saveUninitialized: true})
app.use(sessionMiddleware);

const sharedsession = require("express-socket.io-session");

io.use(sharedsession(sessionMiddleware, {
	autoSave:true
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

const {refreshUsers} = require("./streams")(io);
const users=require('./routes/users')(refreshUsers);

app.use('/users', users);	//users page

const portNum=process.env.PORT ||8000
http.listen(portNum, () => {
    console.log('listening on *:'+portNum);
});