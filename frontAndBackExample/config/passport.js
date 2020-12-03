//for autentication

const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load "User" model
const User = require('../models/user');

module.exports = function(passport)
{
	//from http://www.passportjs.org/docs/authenticate/
	passport.use(
		new localStrategy({usernameField: 'email'}, (email, password, done) =>
		{
			//See if there is an account in the Users db that has the following e-mail address entered into the login page of the e-mail
			User.findOne({email:email}).then(user =>
				{
					if(!user)
					{
						//if no match found
						return done(null, false, {message: 'No account found with this e-mail!'});
					}
					//Match password by changing plain text password from the password field of the login page and hashing it. Returns a boolean
					bcrypt.compare(password, user.password, (err, isMatch) =>
					{
						//if there is an error, then just throw it
						if(err) throw err;

						if(isMatch)
						{
							//if password also matches, then return nothing for the error and the user for the user
							return done(null, user);
						}
						else
						{
							//if password does not match, then return nothing for the errorfalse for the user and an error message
							return done(null, false, {message: 'Password is incorrect'});
						}
					});
				})
			.catch(err => console.log(err));
		})
	);
	//to serialize and de-serialize the session for the user
	/*
	Sessions
		In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.

		Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
	*/
	//passport.serializeUser(function(user, done) //just to keep it consistant with the rest of the code, remove "function" and use arrow function:
	passport.serializeUser((user, done) =>
	{
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done)
	{
		User.findById(id, function(err, user)
		{
			done(err, user);
		});
	});
}