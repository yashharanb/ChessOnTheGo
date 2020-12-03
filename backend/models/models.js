const {Schema, model} = require('mongoose');

const UserSchema = new Schema(
{
	email: {type: String, required: true},
	username: {type: String, required: true},
	password: {type: String, required: true},
	isAdmin: {type: Boolean, default: false},
	elo: {type: Intl, default: 500},
	dateRegistered: {type: Date, default: Date.now},
	state:{type:String}
},
{	//if no colection is specified, then the default is Users
	collection: 'Users'
});

const User = model('User', UserSchema);

const QueuedUserSchema=new Schema({

})

const QueuedUser="queue model"
const HistoricalGame="historical game"
const CurrentGame = "current game"


module.exports={User,QueuedUser,CurrentGame, HistoricalGame}