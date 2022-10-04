var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

const fs = require('fs');
const {load} = require("nodemon/lib/rules");

class Tweet {
    constructor(id, text, created_at, owner) {
        this.id = id;
        this.text = text;
        this.created_at = created_at;
        this.owner = owner;
    }
}

class User {
    constructor(id, realName, displayName) {
        this.id = id;
        this.realName = realName;
        this.displayName = displayName;
    }

    get getID() {
        return this.id;
    }

    get getDisplayName() {
        return this.displayName;
    }

    get getRealName() {
        return this.realName;
    }

}

let tweetData = JSON.parse(fs.readFileSync('favs.json', 'utf-8'));

let tweets = new Map();
let users = new Map();
let searched = [];

// fills the necessary maps
for (const idx in tweetData) {
    let data = tweetData[idx];

    let tweet = new Tweet(data.id, data.text, data.created_at, data.user.id);
    let user = new User(data.user.id, data.user.name, data.user.screen_name);

    tweets.set(data.id, tweet);
    users.set(data.user.id, user);
}

// Send user tweets
app.get('/tweets', function (req, res) {
    res.send(Array.from(tweets.values()));
});

// Get user ids, screen name, name
app.get('/allusers', function (req, res) {
    res.send(Array.from(users.values()));
});

//Shows tweet info given ID
app.get('/tweetinfo', function (req, res) {
    if(req.query.id === undefined) return;

    let tweet = tweets.get(parseInt(req.query.id));

    if(tweet === undefined) tweet = new Tweet(parseInt(req.query.id), "This tweet does not exist", null, null);
    if(!searched.includes(tweet)) searched.push(tweet);

    res.send(tweet);
});

// Returns recently searched tweets
app.get('/search_history', function (req, res) {
    res.send(searched);
});

//Creates a tweet
app.post('/create_tweet', function (req, res) {
    let twtID = req.body.id;
    let twtText = req.body.text;

    if (twtID === undefined || tweets.has(parseInt(twtID))) {
        res.sendStatus(400);
        return;
    }

    tweets.set(twtID, new Tweet(twtID, twtText, new Date(), null));
    res.sendStatus(200);
});

// Delete tweet
app.put('/del_tweet', function (req, res) {
    let twtID = req.body.id;

    if (twtID === undefined) return res.sendStatus(400);
    tweets.delete(parseInt(twtID));
    res.sendStatus(200);
});

// Update username
app.put('/updateuser', function (req, res) {
    if(req.body.name === undefined) return;
    if(req.body.newDisplayName === undefined) return;

    let realName = req.body.name;
    let displayName = req.body.newDisplayName;

    let userArr = Array.from(users.keys());

    for(const idx in userArr) {
        let user = users.get(parseInt(userArr[idx]));
        if(user.realName === realName) user.displayName = displayName;
    }

    res.sendStatus(200);
});


app.listen(PORT, function () {
    console.log('Server listening on ' + PORT);
});

