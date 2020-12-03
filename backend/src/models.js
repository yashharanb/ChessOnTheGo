const mongoose = require('mongoose');
const {Schema, connect,model,Types}=mongoose;
const env=require('dotenv').config()
console.log(env.parsed)


connect(env.parsed.DB_CONNECTION,{useNewUrlParser: true, useUnifiedTopology: true}).catch(e=>{
    //simply crash program on db error
    throw e;
}).then(value => console.log(value));



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