const {Schema, model} = require('mongoose');
const writeConcern={
	w: 'majority',
	j: true,
	wtimeout: 1000
}
const UserSchema = new Schema(
{
	email: {type: String, required: true,unique:true},
	username: {type: String, required: true,unique:true},
	password: {type: String, required: true},
	isAdmin: {type: Boolean, default: false},
	elo: {type: Intl, default: 500,required:true},
	dateRegistered: {type: Date, default: Date.now,immutable:true},
	state:{type:String,default:"none", required: true, enum:["none","queued","game","deleted"]}
},
{	//if no colection is specified, then the default is Users
	collection: 'Users', validateBeforeSave:true, writeConcern
});

const User = model('User', UserSchema);

const HistoricalGameSchema=new Schema({
	whitePlayer: {type: Schema.Types.ObjectId, ref: 'User',immutable:true},
	blackPlayer :{type: Schema.Types.ObjectId, ref: 'User',immutable:true},
	winner :{type:String,enum:["white","black","draw"],required:true},
	startTime:{type:Date,required:true,immutable:true},
	endTime:{type:Date,default:Date.now,immutable:true},
	timeLimit:{type:Number,required:true,immutable:true},
	pgn:{type:String,immutable:true},
	whitePlayerEloBefore:{type:Number,required:true,immutable:true},
	blackPlayerEloBefore:{type:Number,required:true,immutable:true},
},{ validateBeforeSave:true,writeConcern});

const HistoricalGame=model("HistoricalGame",HistoricalGameSchema);
const CurrentGameSchema=new Schema({
	queueStartTime : {type: Date, default: Date.now, immutable:true},
	whitePlayer: {type: Schema.Types.ObjectId, ref: 'User',immutable:true,unique:true,required:true},
	blackPlayer: {type: Schema.Types.ObjectId, ref: 'User'},
	startTime:{type:Date,default:null},
	timeLimit:{type:Number,required:true,immutable:true},
	pgn:{type:String},
	whitePlayerTimeRemaining:{type:Number,required:true},
	blackPlayerTimeRemaining:{type:Number,required:true},
	movingPlayerTurnStartTime:{type:Date,default:null},
},{ validateBeforeSave:true,writeConcern});

const CurrentGame = model("CurrentGame",CurrentGameSchema);
// CurrentGame.deleteMany({},()=>{})
// User.updateMany({},{state:"none"},null,()=>{})

module.exports={User,CurrentGame, HistoricalGame}