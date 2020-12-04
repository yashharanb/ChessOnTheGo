const {Schema, model} = require('mongoose');

const UserSchema = new Schema(
{
	email: {type: String, required: true},
	username: {type: String, required: true},
	password: {type: String, required: true},
	isAdmin: {type: Boolean, default: false},
	elo: {type: Intl, default: 500,required:true},
	dateRegistered: {type: Date, default: Date.now,immutable:true},
	state:{type:String,default:"none", required: true, enum:["none","queued","game","deleted"]}
},
{	//if no colection is specified, then the default is Users
	collection: 'Users'
});

const User = model('User', UserSchema);

const QueuedUserSchema=new Schema({
	// user:{type:Ref}
	queueStartTime : {type: Date, default: Date.now, immutable:true},
	user:{type: Schema.Types.ObjectId, ref: 'User',immutable:true},
	gameTimeLimit:{type:Number,immutable:true}
})
const Queue=model("Queue",QueuedUserSchema);

const HistoricalGameSchema=new Schema({
	whitePlayer: {type: Schema.Types.ObjectId, ref: 'User',immutable:true},
	blackPlayer :{type: Schema.Types.ObjectId, ref: 'User',immutable:true},
	winner :{type:String,enum:["white","black","draw"],required:true},
	startTime:{type:Date,required:true,immutable:true},
	endTime:{type:Date,default:Date.now,immutable:true},
	timeLimit:{type:Number,required:true,immutable:true},
	pgn:{type:String,required:true,immutable:true},
	whitePlayerEloBefore:{type:Number,required:true,immutable:true},
	blackPlayerEloBefore:{type:Number,required:true,immutable:true},
});
const HistoricalGame=model("HistoricalGame",HistoricalGameSchema);
const CurrentGameSchema=new Schema({
	whitePlayer: {type: Schema.Types.ObjectId, ref: 'User',immutable:true},
	blackPlayer :{type: Schema.Types.ObjectId, ref: 'User',immutable:true},
	startTime:{type:Date,required:true,immutable:true,default:Date.now},
	timeLimit:{type:Number,required:true,immutable:true},
	pgn:{type:String,required:true,immutable:true},
	whitePlayerTimeRemaining:{type:Number,required:true},
	blackPlayerTimeRemaining:{type:Number,required:true},
});

const CurrentGame = model("CurrentGame",CurrentGameSchema);


module.exports={User,Queue,CurrentGame, HistoricalGame}