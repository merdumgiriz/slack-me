const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.use(bodyParser.json());

const listener = app.listen(process.env.PORT || '3000', function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


app.get('/', function (req, res) {
    const reply = {
        "status": "ok"
    };
    res.json(reply);
});


app.post('/action-endpoint', function (req, res) {
  const challenge = req.body.challenge;
  const reply = {
      "challenge": challenge
  };
  res.json(reply);
});
