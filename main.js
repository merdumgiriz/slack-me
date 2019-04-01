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
  const challenge = req.body.challenge; // this challenge is needed to ensure slack that our bot works

  const reply = {
      "challenge": challenge
  };

  const headers = {
    'Content-type': 'application/json',
    'Authorization': `Bearer ${process.env.TOKEN}` // this token you need to set on heroku
  }

  // console.log(req.body.event);

//paamater comes from line 35 to 65
  if (req.body.event.subtype != 'bot_message') { // se we won't reply to ourselves...
    request.get('https://api.coindesk.com/v1/bpi/currentprice/TRY.json', function(err, res, body) {
      if (err) {
        console.log(err);
      }
      else {
        const coindesk = JSON.parse(body);
        const rate = coindesk.bpi.TRY.rate;
        const reply = {
          'channel': req.body.event.channel,
          text: `Current BTC rate: ${parseInt(rate.replace(",", "")) * parseFloat(req.body.event.text.replace(",",".")).toFixed()} TRY per ${req.body.event.text} BTC`
        }

        const options = {
          url:   'https://slack.com/api/chat.postMessage',
          method: 'POST',
          headers,
          body:  JSON.stringify(reply)
        };

        console.log(body);

        request.post(options, function(err, res, body) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }

  res.json(reply);
});
