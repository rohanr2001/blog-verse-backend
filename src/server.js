import express from "express";
import { articleCollection, connectToDatabase } from "./dbConnection.js";
const app = express();
app.use(express.json());

app.get("/api/articles/:name", async (req, res) => {
	//Get Article information endpoint
	const { name } = req.params;
	const article = await articleCollection.findOne({ name });
	if (!article) {
		res.sendStatus(404);
	} else {
		res.json(article);
	}
});

app.put("/api/addArticle/:name", async (req, res) => {
	//Adding a new article endpoint
	const { name } = req.params;
	const { author, comment, upvote } = req.body;

	try {
		let result = await articleCollection.insertOne({
			name,
			author,
			comment,
			upvote,
		});
		res.send(`Inserted Document ${result.insertedId}`);
	} catch (err) {
		console.log(`Error inserting to the database ${err}`);
	}
});

app.put("/api/articles/:name/upvote", async (req, res) => {
	//Increasing the upvote end point
	const { name } = req.params;
	const increase = { $inc: { upvote: 1 } };
	try {
		await articleCollection.updateOne({ name: name }, increase);
		res.send(`Upvoted article ${name}`);
	} catch (err) {
		res.send(`Error Occured!! ${err}`);
	}
});

app.post("/api/articles/:name/comments", async (req, res) => {
	//Add comment to the article endpoint
	const { name } = req.params;
	const { postedBy, text } = req.body;
	try {
		await articleCollection.updateOne(
			{ name },
			{ $push: { comment: { postedBy, text } } }
		);
		res.send(`comment posted successfully by ${postedBy}`);
	} catch (err) {
		res.send(`comment not posted ${err}`);
	}
});

connectToDatabase(() => {
	app.listen(5000, () => {
		console.log("running on port 5000");
	});
});
