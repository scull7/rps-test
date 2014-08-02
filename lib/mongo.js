var MongoClient   = require('mongodb').MongoClient,
    server        = require('mongodb').Server,
    format        = require('util').format
;
module.exports = function (config) {
  config = config || {};

  var host  = config.host || 'localhost',
      user  = config.user || '',
      pass  = config.password || '',
      port  = config.port || 27017,
      db_name = config.db_name || 'rps-test',

      url   = 'mongodb://',

      database = null
  ;

  if (user) {
    url += user;

    if (password) {
      url += ':'+pass;
    }
    url += '@';
  }
  url += format('%s:%s/%s', host, port, db_name);

  function connect (cb) {
    if (database) {
      return cb(null, database);
    }
    MongoClient.connect(url, function (err, db) {
      if (err) {
        return cb(err);
      }
      database = db;
      return cb(null, database);
    });
  };


  return function (req, res, next) {
    if (database) {
      req.mongodb = database;
      return next();
    }
    connect(function (err, mongodb) {
      if (err) {
        return next(err);
      }
      req.mongodb = mongodb;
      return next();
    })
  }
};