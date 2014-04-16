var express = require("express");
var logfmt = require("logfmt");
var sass = require("node-sass");
var crypto = require('crypto')

var app = express();
var mongo_uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
                'mongodb://localhost:27017/tictactoe';

var MongoClient = require('mongodb').MongoClient;

app.configure(function(){
  app.set('view engine', 'jade');
  app.use(express.static('public'));
  app.use(logfmt.requestLogger());
  app.use(sass.middleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public/css',
    debug: true,
    outputStyle: 'compressed'
  }));
  app.use(express.cookieParser());
  app.use(express.session({ secret: "O5DqWbS8sERTz5xL" }));
  app.use(express.csrf());
});
function csrf(req, res, next) {
  req.csrfToken()
  next();
}


/* Routes
------------------------------------------------*/
app.get('/', csrf, function(req, res) {
  nonce: crypto.pseudoRandomBytes(256).toString('hex');

  MongoClient.connect( mongo_uri, function(err, db) {
    if( ! err ) {
  
      db.createCollection('nonce', function(err, collection) {
        var result = { result: req.params.result };
        collection.insert( { key: nonce }, { w: 0 } );
      });
    }
  }

  res.render('index', {
    title: 'Tic Tac Toe Challenge',
    nonce: nonce
  });  
});


app.get('/results/:result', function(req, res){

  if( ['win', 'loss', 'tie'].indexOf(req.params.result) !== -1 ){
    
    MongoClient.connect( mongo_uri, function(err, db) {
      if( ! err ) {
  
        db.createCollection('results', function(err, collection) {
          var result = { result: req.params.result };
          collection.insert( result, { w: 0 } );
        });
    
        res.status(200).send('Result saved.');

      } else {

        res.status(500).send('Database connection issue.');
        
      }
    });

  } else {

    res.status(401).send('Unrecognized result.');

  }
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
