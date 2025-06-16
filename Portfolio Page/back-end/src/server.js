import express from 'express';
import { MongoClient, ReturnDocument, ServerApiVersion } from 'mongodb';

const app = express();

app.use(express.json());

let db;

async function connectToDb() {
    const uri = 'mongodb://127.0.0.1:27017';

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();

    db = client.db('full-stack-react-db');
}

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const article = await db.collection('articles').findOne({ name });

    res.json(article);

});

app.post('/api/articles/:name/upvote', async function(req, res) {
    const { name } = req.params;
    const updatedArticle = await db.collection('articles').findOneAndUpdate({ name }, {
        $inc: {upvotes: 1}
    }, {
        ReturnDocument: "after",
    });

    res.json(updatedArticle);
});

app.post('/api/articles/:name/comments', async function(req, res) {
    const name = req.params.name;
    const { postedBy, text } = req.body;
    const newComment = { postedBy, text };

    const updatedArticle = await db.collection('articles').findOneAndUpdate({ name }, {
        $push: { comments: newComment }
    }, {
        ReturnDocument: "after",
    });

    res.json(updatedArticle);
});

//simple get/post requests
/*
app.get('/hello', function(req, res) { 
    res.send('Hello from a GET endpoint!');
});

app.get('/hello/:name', function(req, res) {
    res.send('Hello, ' + req.params.name);
});

app.post('/hello', function(req, res){
    res.send('Hello ' + req.body.name + ' from a POST endpoint!');
});
*/

async function start() {
    await connectToDb();
    app.listen(8000, function() {
        console.log('Server is listening of port 8000');
    });
}

start();