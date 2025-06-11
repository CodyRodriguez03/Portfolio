import express from 'express';

const articleInfo = [
    { name: 'learn-node', upvotes: 0, comments: [] },
    { name: 'learn-react', upvotes: 0, comments: [] },
    { name: 'mongodb', upvotes: 0, comments: [] },
]

const app = express();

app.use(express.json());

app.post('/api/articles/:name/upvote', function(req, res) {
    const article = articleInfo.find(a => a.name === req.params.name);
    article.upvotes += 1;

    res.json(article);
});

app.post('/api/articles/:name/comments', function(req, res) {
    const name = req.params.name;
    const { postedBy, text } = req.body;

    const article = articleInfo.find(a => a.name === name);

    article.comments.push({
        postedBy,
        text,
    });

    res.json(article);
});

//simple get/post requests

app.get('/hello', function(req, res) { 
    res.send('Hello from a GET endpoint!');
});

app.get('/hello/:name', function(req, res) {
    res.send('Hello, ' + req.params.name);
});

app.post('/hello', function(req, res){
    res.send('Hello ' + req.body.name + ' from a POST endpoint!');
});

app.listen(8000, function() {
    console.log('Server is listening of port 8000');
});