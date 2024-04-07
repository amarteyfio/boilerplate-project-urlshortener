require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  url: String,
  shorturl: Number
});

let  Surl

Surl = mongoose.model('Surl', Schema);

//add a url
const createUrl = (url,done) => {
  const shorturl = Math.floor(Math.random() * 10000);
  const newUrl = new Surl({url,shorturl});
  newUrl.save((err,data) => {
    if(err) return done(err);
    done(null,data);
  });
}

//find a url by number
const findUrlByNumber = (shorturl,done) => {
  Surl.findOne({shorturl},(err,data) => {
    if(err) return done(err);
    done(null,data);
  });
}

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});




app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const urlRegex = /^https?:\/\/www\./;
  if (!urlRegex.test(url)) {
    res.json({ error: 'invalid URL' });
    return;
  }
  createUrl(url, (err, data) => {
    if (err) {
      res.json({ error: 'database error' });
      return;
    }
    res.json({ original_url: url, short_url: data.shorturl });
  });
})



app.get('/api/shorturl/:shorturl', (req, res) => {
  const shorturl = req.params.shorturl;
  findUrlByNumber(shorturl, (err, data) => {
    if (err) {
      res.json({ error: 'database error' });
      return;
    }
    res.redirect(data.url);
  });
  
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
