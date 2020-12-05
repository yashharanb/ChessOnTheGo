const express = require('express');
const router = express.Router();

 //for route protection
 const {ensureAuthenticated} = require('../config/authentication')


//for homepage default with login where no auth is needed in order to access it
//router.get('/', (req, res) => res.send('Welcome to Chess on the Go!'));
router.get('/', (req, res) => res.render('welcome')); //rendering the welcome page using EJS

//router.get('/dashboard', (req, res) => res.render('dashboard')); //rendering the dashboard page using EJS, but unprotected
//router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard')); //rendering the dashboard page using EJS, PROTECTED!

//rendering the dashboard page using EJS, PROTECTED and shows username!
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard',
{
	username: req.user.username
}));

//rendering the adminDashboard page using EJS, PROTECTED and shows username!
router.get('/adminDashboard', ensureAuthenticated, (req, res) => res.render('adminDashboard',
{
	username: req.user.username
}));

ensureAuthenticated
module.exports = router;