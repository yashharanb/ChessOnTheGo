//DO NOT USE THIS FILE AS IS! These are just examples, but the examples have been crafted to work with our mongoDB Atlas databases

//This file is called upon by server.js (or maybe app.js on the backend) file as a dependency
const mongoose = require("mongoose");
const {MongoClient} = require('mongodb');
require("dotenv/config");

//Connect using mongoose to MongoDB Atlas by calling the .env enviroment variable setup for each developer for now
mongoose.connect(process.env.DB_CONNECTION,
{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));+

db.once("open", () => 
{
    console.log("Connected to mongoDB Atlas successfully!");
});

async function main()
{
	const uri = (process.env.DB_CONNECTION);
	const clientDB = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
	try
	{
		//connect to mongoDB cluster. The "await" waits for the restuls to come back before continuing onto the next line of code
		await clientDB.connect();
		
		//Calls the listDB function to show the DBs that we have. This confirms the connection is in fact connected
		await listDBs(clientDB);
				
		//Calls the createOne function and inputs a test "document" (aka record) into the Users collection
		await createOne(clientDB,
		//how to send the new 
		{
			username: "test1",
			password: "test1",
		});

		//get current date/time:
		time = new Date(); //Updates the date and time
		updatedTime = String(time.getHours()).padStart(2, '0') + ":" + String(time.getMinutes()).padStart(2, '0')  + ":" + String(time.getSeconds()).padStart(2, '0')  + "." + String(time.getMilliseconds()).padStart(3, '0');
		updatedTime2 = String(time.getHours()).padStart(2, '0') + ":" + String(time.getMinutes()).padStart(2, '0')  + ":" + String(time.getSeconds()).padStart(2, '0')  + "." + String(time.getMilliseconds()).padStart(3, '0');
		//Calls the createMany function and inputs a test "document" (aka record) into the Queue collection
		await createMany(clientDB,
		//how to send the new 
		[{
			queueStartTime : updatedTime,
			user: "test1",
			gameTimeLimit: "1800"
		},
		{
			queueStartTime : updatedTime2,
			user: "test2",
			gameTimeLimit: "1800"
		}]);
		
		//Calls the findOneFromDB function to look for a username in the Users collection
		await findOneFromDB(clientDB, "test1");
		
		//Calls the updateOneByUsername function to look for a username and then updates the username's password 
		await updateOneByUsername(clientDB, "test1", {password: 9876540});
		
		//Calls the findOneFromDB function to look for a username in the Users collection
		await findOneFromDB(clientDB, "test1");
		
		
		//Calls the deleteOneByUsername
		await deleteOneByUsername(clientDB, "test1");
		
		
		//Calls the deleteManyByUsername
		await deleteManyByUsername(clientDB, "test1");
		await deleteManyByUsername(clientDB, "test2");
	}
	catch (e)
	{
		console.error(e);
	}
	finally
	{
		await clientDB.close();
	}
};

main().catch(console.err);

//Function for listing out the DBs in our mongoDB Atlas account collection
async function listDBs(clientDB)
{
	//How to access and then show ALL the databases
	const listDatabases = await clientDB.db().admin().listDatabases();
	console.log("Databases available:");
	listDatabases.databases.forEach(db => console.log(` - ${db.name}`));
}

//Function for creating (part of the Crud) the document (aka record) in the Users collection ONE AT A TIME
async function createOne(clientDB, newInfo)
{
	//How to actually call the Users collection that is in the ChessOnTheGoDB and put stuff into the Users collection using the passed newInfo ONE AT A TIME
	const result = await clientDB.db("ChessOnTheGoDB").collection("Users").insertOne(newInfo);
	console.log(result);
	console.log(`Using createOne function, new listing created with the following id: ${result.insertedId}`);
}

//Function for creating (part of the Crud) the document (aka record) in the Users collection MANY AT A TIME
async function createMany(clientDB, newInfos)
{
	//How to actually call the Users collection that is in the ChessOnTheGoDB and put stuff into the Users collection using the passed newInfo MANY AT A TIME
	const result = await clientDB.db("ChessOnTheGoDB").collection("Queue").insertMany(newInfos);
	//console.log(`Using createMany function, new listing created with the following id: ${result.insertedId}`);
	console.log(`${result.insertedCount} new documents (aka records) created with the following ID(s):`);
	console.log(result.insertedIds);
}

//Function for finding One user (part of the cRud) with the same username from the Users collection. Can be used for when getting login and to ensure there is no duplicated usernames during registration
async function findOneFromDB(clientDB, name)
{
	const result = await clientDB.db("ChessOnTheGoDB").collection("Users").findOne({username: req.name}, {password: req.password});
    if (result)
	{
        console.log(`Found a user with the username '${name}':`);
        console.log(result);
    }
	else
	{
        console.log(`No user found with the username '${name}'`);
	}
}

//Function for updating (part of the crUd) username's password
async function updateOneByUsername(clientDB, name, updatedPassword)
{
    const result = await clientDB.db("ChessOnTheGoDB").collection("Users").updateOne({email: name}, {$set: updatedPassword});

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

//Function for deleting (part of the cruD) ONE user nu username
async function deleteOneByUsername(clientDB, name)
{
    const result = await clientDB.db("ChessOnTheGoDB").collection("Users").deleteOne({username: name});

    console.log(`${result.deletedCount} document(s) was/were deleted from the Users collection via deleteOneByUsername function.`);
}

//Function for deleting (part of the cruD) MANY users with the same username
async function deleteManyByUsername(clientDB, name)
{
    const result1 = await clientDB.db("ChessOnTheGoDB").collection("Users").deleteMany({username: name});

    console.log(`${result1.deletedCount} document(s) was/were deleted from the Users collection.`);
    const result2 = await clientDB.db("ChessOnTheGoDB").collection("Queue").deleteMany({user: name});

	console.log(`${result2.deletedCount} document(s) was/were deleted from the Query collection.`);
}








































