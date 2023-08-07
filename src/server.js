import express from "express";
import { MongoClient } from "mongodb";
const app = express();
app.use(express.json());

//Connection uri for the mongoDB cluster
const uri =
	"mongodb+srv://rohanR:12345@cluster0.nabqojw.mongodb.net/?retryWrites=true&w=majority";
const dbname = "blogverse"; //Name of the database
const client = new MongoClient(uri);
const articleCollection = client.db(dbname).collection("articles");

async function connectToDatabase() {
	//Function to connect to the mongoDB cloud database
	try {
		await client.connect();
		console.log(`Connected to the database`);
	} catch (err) {
		console.log(`Error Connecting ${err}`);
	}
}

app.put("/api/addArticle/:name", async (req, res) => {
	const { name } = req.params;
	const { author, comment, upvote } = req.body;

	try {
		await connectToDatabase();
		let result = await articleCollection.insertOne({
			name,
			author,
			comment,
			upvote,
		});
		res.send(`Inserted Document ${result.insertedId}`);
	} catch (err) {
		console.log(`Error inserting to the database ${err}`);
	} finally {
		client.close();
	}
});

app.get("/api/articles/:name", async (req, res) => {
	const { name } = req.params;
	await connectToDatabase();
	const article = await articleCollection.findOne({ name });
	if (!article) {
		res.send("NO article found");
	} else {
		res.json(article);
	}
});

app.put("/api/articles/:name/upvote", async (req, res) => {
	const { name } = req.params;
	const increase = { $inc: { upvote: 1 } };
	try {
		await connectToDatabase();
		await articleCollection.updateOne({ name: name }, increase);
		res.send(`Upvoted article ${name}`);
	} catch (err) {
		res.send(`Error Occured!! ${err}`);
	} finally {
		client.close();
	}
});

app.post("/api/articles/:name/comments", async (req, res) => {
	const { name } = req.params;
	const { postedBy, text } = req.body;
	try {
		await connectToDatabase();
		await articleCollection.updateOne(
			{ name: { name } },
			{ $push: { comment: [{ postedBy, text }] } }
		);
		res.send(`comment posted successfully by ${postedBy}`);
	} catch (err) {
		res.send(`comment not posted ${err}`);
	} finally {
		client.close();
	}
});

app.listen(5000, () => {
	console.log("running on port 5000");
});
