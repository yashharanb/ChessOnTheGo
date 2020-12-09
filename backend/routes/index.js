const express = require('express');
const {HistoricalGame}=require('../models/models')
const router = express.Router();

 //for route protection
 const {ensureAuthenticated} = require('../config/authentication')


//for homepage default with login
//router.get('/', (req, res) => res.send('Welcome to Chess on the Go!'));
router.get('/', (req, res) => res.render('welcome')); //rendering the welcome page using EJS

//router.get('/dashboard', (req, res) => res.render('dashboard')); //rendering the dashboard page using EJS, but unprotected
//router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard')); //rendering the dashboard page using EJS, PROTECTED!

//rendering the dashboard page using EJS, PROTECTED and shows username!
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard',
{
	username: req.user.username
}));

function getUserToSend(user){
    const {state,username,email,isAdmin,elo}=user;
    return {state,username,email,isAdmin,elo};
}

router.get('/previousGames',ensureAuthenticated,async (req,res)=>{
    const id=req.user.id;
    const games=await HistoricalGame.find({$or: [{whitePlayer: id}, {blackPlayer: id}]}).populate("whitePlayer").populate("blackPlayer");
    const gamesToSend=games.map(game=>{
        const whitePlayer=getUserToSend(game.whitePlayer);
        const blackPlayer=getUserToSend(game.blackPlayer);
        const gameJson=game.toJSON();
        return {...gameJson,whitePlayer,blackPlayer};
    })
    res.send(JSON.stringify(gamesToSend));
});




ensureAuthenticated
module.exports = router;