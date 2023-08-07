import { MongoClient } from "mongodb";

//Connection uri for the mongoDB cluster
const uri =
	"mongodb+srv://rohanR:12345@cluster0.nabqojw.mongodb.net/?retryWrites=true&w=majority";
const dbname = "blogverse"; //Name of the database
const client = new MongoClient(uri);
const articleCollection = client.db(dbname).collection("articles");

async function connectToDatabase(cb) {
	//Function to connect to the mongoDB cloud database
	try {
		await client.connect();
		console.log(`Connected to the database`);
		cb();
	} catch (err) {
		console.log(`Error Connecting ${err}`);
	}
}

export { connectToDatabase, articleCollection, client };
