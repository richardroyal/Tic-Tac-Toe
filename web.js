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
  app.use(express.cookieParser());
  app.use(express.session({ secret: "O5DqWbS8sERTz5xL" }));
  app.use(express.csrf());
  app.use(sass.middleware({
    src: __dirname + '/public/',
    dest: __dirname + '/public/',
    debug: true,
    outputStyle: 'compressed'
  }));
});

function csrf(req, res, next) {
  req.csrfToken()
  next();
}


/* Routes
------------------------------------------------*/
app.get('/', csrf, function(req, res) {
  var nonce = crypto.pseudoRandomBytes(256).toString('hex');

  MongoClient.connect( mongo_uri, function(err, db) {
    if( ! err ) {
  
      db.createCollection('nonce', function(err, collection) {
        var result = { result: req.params.result };
        collection.insert( { key: nonce }, { w: 0 } );
      });

    }
  });

  res.render('index', {
    title: 'Tic Tac Toe Challenge',
    nonce: nonce
  });  
});


app.get('/results/:result', function(req, res){

  if( ['win', 'loss', 'tie'].indexOf(req.params.result) !== -1 ){
    
    MongoClient.connect( mongo_uri, function(err, db) {
      if( ! err ) {

        db.createCollection('nonce', function(err, nonce_collection) {
          nonce_collection.count( { key: req.query.nonce }, function(err, count) {
            if( count ){

              db.createCollection('results', function(err, result_collection) {
                var result = { 
                  result: req.params.result,
                  user_id: req.query.user_id
                };
                result_collection.insert( result, { w: 0 } );
              });
          
              nonce_collection.remove({key: req.query.nonce}, {w:0} );
              res.status(200).send('Result saved.');

            } else {

              res.status(401).send('Invalid authorization.');
            }
          });
        });

      } else {

        res.status(500).send('Database connection issue.');
        
      }
    });

  } else {

    res.status(401).send('Unrecognized result.');

  }
});


/* JSON Data views for charts
------------------------------------------------*/
app.get('/results/data/:set.json', function(req, res){

  var user_id = req.query.user_id;

  // JSON wins, losses, ties in format required by Charts.js
  MongoClient.connect( mongo_uri, function(err, db) {
    if( ! err ) {

      db.createCollection('results', function(err, results) {

        rw = { result: 'win' };
        if( user_id !== undefined ){
          rw.user_id = user_id;
        }
         
        results.count( rw, function(err, wins){
          
          rt = { result: 'tie' };
          if( user_id !== undefined ){
            rt.user_id = user_id;
          }
          results.count( rt, function(err, ties){

            rl = { result: 'loss' };
            if( user_id !== undefined ){
              rl.user_id = user_id;
            }
            results.count( rl, function(err, losses){
              data = [ 
                       { value: wins, color: "#65B042" },
                       { value: losses, color: "#F7464A" },
                       { value: ties, color: "#949FB1"}
                     ];
            
              res.send(data);

            });
          });

        });
      });
    }
  });

});


/* Start Server
------------------------------------------------*/
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
