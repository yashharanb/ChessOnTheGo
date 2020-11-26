const mongoose = require('mongoose');
const {Schema, connect,model,Types}=mongoose;

connect('mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb',{useNewUrlParser: true, useUnifiedTopology: true}).catch(e=>{
    //simply crash program on db error
    throw e;
});



//_id added by default on all schemas.
const UserSchema=new Schema({
    email_address: String,
    username:String,
    passsword:String,
    is_admin:String,
    elo:Number,
});

const QueuedUserSchema=new Schema({

})

const User=model("User",UserSchema)
const QueuedUser="queue model"
const HistoricalGame="historical game"
const CurrentGame = "current game"

module.exports={User,QueuedUser,CurrentGame, HistoricalGame}