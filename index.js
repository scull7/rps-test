var express = require('express'),
    app     = express(),
    xkcd    = require('xkcd-password'),
    mongo   = require(__dirname + '/lib/mongo')({
      host: process.env.RPS_HOST,
      user: process.env.RPS_USER,
      pass: process.env.RPS_PASS,
    }),
    xkcdOpts  = {
      numWords: 4,
      minLength: 5,
      maxLength: 8
    }
;

app.use(mongo);

app.get('/', function (req, res) {
  console.log('/');
  res.send('hello world');
});

app.get('/alive', function (req, res) {
  console.log('/alive');
  res.send(200);
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

var port  = process.env.PORT || 3000
app.listen(port);

console.log("Server listening on port: "+port);
