const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
{
	email: {type: String, required: true},
	username: {type: String, required: true},
	password: {type: String, required: true},
	isAdmin: {type: Boolean, default: false},
	elo: {type: Intl, default: 500},
	dateRegistered: {type: Date, default: Date.now},
	sate:{type:String}
},
{	//if no colection is specified, then the default is Users
	collection: 'Users'
});

const User = mongoose.model('User', UserSchema);


module.exports = {User};