require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');

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

//urls
let urls = [

];

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const urlRegex = /^https?:\/\/www\./;
  if (!urlRegex.test(url)) {
    res.json({ error: 'invalid URL' });
    return;
  }
  const shorturl = Math.floor(Math.random() * 10000);
  urls.push({ url, shorturl });
  res.json({ original_url: url, short_url: shorturl });
})


app.get('/api/shorturl/:shorturl', (req, res) => {
  const shorturl = parseInt(req.params.shorturl);
  const url = urls.find((url) => url.shorturl === shorturl);
  if (!url) {
    res.json({ error: 'No short URL found for the given input' });
    return;
  }
  res.redirect(url.url);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
