function users(refreshUsers) {


	const express = require('express');
	const router = express.Router();

//for passing stuff to and from the database
	require("dotenv/config");
	const {User} = require('../models/models');
	const bcrypt = require('bcryptjs'); //used to encrypt the password by hashing it

//for login page at http://localhost:3000/users/login
//router.get('/login', (req, res) => res.send('Login'));
	router.get('/login', (req, res) => res.render('login')); //render using EJS for login

//for registration page at http://localhost:3000/users/registration
//router.get('/registration', (req, res) => res.send('Register an Account'));
	router.get('/registration', (req, res) => res.render('registration'));

//for login page handling
	const passport = require('passport');

//Registration handler
	router.post('/registration', (req, res) => {
		const obj = JSON.parse(JSON.stringify(req.body)); // console.log(req.body) throws [Object: null prototype] error. This fixes it. From: https://stackoverflow.com/questions/56298481/how-to-fix-object-null-prototype-title-product
		console.log(obj); //for debugging

		//to pull objects out to do error checking:
		const {username, email, password, password2} = req.body;

		//Error array for storing error messages only during the checks
		let errors = [];

		//Check that required fields have input
		if (email == '' || username == '' || password == '' || password2 == '') {
			errors.push({msg: 'Please ensure all fields are filled in!'});
			console.log('Please ensure all fields are filled in!');
		}

		//Check that password and password2 matches
		if (password !== password2) {
			errors.push({msg: 'Passwords do not match!'});
			console.log('Passwords do not match!');
		}

		//Now see how many errors there are in the array. If more than 0, then there are issues
		if (errors.length > 0) {
			res.render('registration', {errors, username, email, password, password2}); //recalls the registration page and puts back in all the inputs
		} else {
			//validation of user fields passed. Now check with the db if there is already a user with the same e-mail address or username
			console.log('Input seems to be ok will now check if email and username is already in the Users db'); //for debugging

			//Search Users db to see if there is already an account that has the same email or username that the user has put in the registration form
			User.findOne({$or: [{email: email}, {username: username}]}).then(user => {
				if (user) //if a reuslt is returned (meaning user != null), then something is already in the Users db, so check for which one
				{
					if (user.email == email) {
						//If user already exists then push an error to the errors array and then recall the registration page with variables intact
						console.log("Email already registered"); //for debugging
						errors.push({msg: 'Email is already registered!'});
						res.render('registration', {errors, username, email, password, password2}); //recalls the registration page and puts back in all the inputs
					} else (user.username == username)
					{
						//If user already exists then push an error to the errors array and then recall the registration page with variables intact
						console.log("Username already registered"); //for debugging
						errors.push({msg: 'Username is already taken!'});
						res.render('registration', {errors, username, email, password, password2}); //recalls the registration page and puts back in all the inputs
					}
				} else {
					//Create new user in the database
					console.log("Adding new registration info to Users db");
					const newUser = new User({username, email, password});
					console.log(newUser); //for debugging

					//Hash the plain text password (found by using newUser.password) for security before sending it to the DB
					//try not the set the number after "bcrypt.genSalt(" too high or else it will take a long time to has the plain text password as the number = the number of times it hashes the plain text passowrd. This will make the user thing that our site has frozen!
					bcrypt.genSalt(5, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;

						//replace the plain text password with the hashed password
						newUser.password = hash;

						//save new user registration information to the db. Since it is a promise, we will use .then() and .catch(), similar to await in async functions
						newUser.save().then(user => {
							refreshUsers()							//if all is good, then show the user the login/welcome page to login
							req.flash('success_msg', 'Registration successful! You can now log in.');
							res.redirect('/');
						})
							.catch(err => console.log(err));
					}))
				}
			});
		}
	});

	//Login handler from the post request from the login/welcome page
	//from: http://www.passportjs.org/docs/authenticate/
	//must have '/login' as that is the "signal" from the welcome/login screen when the user presses the login button
	//error messages for failed  login attempts are generated by the passport.js file in the config folder
	/*router.post('/login', (req, res, next) =>
	{
		passport.authenticate('local',
			{
				//if credentials successful, go to dashboard
				successRedirect: "/dashboard",
				//if credentials fail, go back to login/welcome screen
				failureRedirect: '/',
				failureFlash: true
			})(req, res, next); //as per http://www.passportjs.org/docs/authenticate/
	});*/
	//Leaving above lines in just in case this new code for redirecting Admin logins messes something up. NO ROUTE PROTECTION YET!
	router.post('/login', passport.authenticate('local', {failureRedirect: '/', failureFlash: true}), (req, res) =>
	{
		console.log("Router post isAdmin: " + req.user.isAdmin)
		if (req.user.isAdmin == true)
		{
			//res.redirect('/admin.tsx'); //whichever one works when we do the build
			res.redirect('/admin.html');  //for now as just a place holder for testing to show that the routing works
		}
		if (req.user.isAdmin == false)
		{
			res.redirect('/dashboard');
		}
	});

	//Logout handler for when the user presses the log out button
	router.get('/logout', (req, res) => {
		req.logout();
		req.flash('success_msg', "You have succesfully logged out.");
		res.redirect('/');
	});
	return router
}
module.exports = users;