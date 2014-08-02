var express = require('express'),
    morgan  = require('morgan'),
    app     = express(),
    xkcd    = require('xkcd-password'),
    mongo   = require(__dirname + '/lib/mongo')({
      host: process.env.RPS_HOST,
      user: process.env.RPS_USER,
      password: process.env.RPS_PASS,
      port: process.env.RPS_PORT
    }),
    xkcdOpts  = {
      numWords: 4,
      minLength: 5,
      maxLength: 8
    }
;

app.use(mongo);
app.use(morgan('short'));

app.get('/', function (req, res) {
  console.log('/');
  res.send('hello world').end();
});

app.get('/alive', function (req, res) {
  console.log('/alive');
  res.send(200).end();
});

app.get('/blitz/insert', function (req, res, next) {
  console.log('/blitz/insert');
  var collection  = req.mongodb.collection('test_insert_speed'),
      pw          = new xkcd();
  //insert a single document.
  pw.generate(xkcdOpts, function (err, password) {
    if (err) return next(err);

    var docs  = [
      { test: (new Date()).getTime(), password: password.join(' ') }
    ];
    collection.insert(docs, {}, function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  })
});

app.get('/loaderio-9f92a625b142537e9921bec28f4b7066/', function (req, res) {
  res.send(200, 'loaderio-9f92a625b142537e9921bec28f4b7066');
});

var port  = process.env.PORT || 3000
app.listen(port);

console.log("Server listening on port: "+port);
