var express = require("express");
var logfmt = require("logfmt");
var sass = require("node-sass");
var app = express();
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL ||
               'mongodb://localhost/tictactoe';
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
  res.locals.token = req.session._csrf;
  next();
}


/* Routes
------------------------------------------------*/
app.get('/', csrf, function(req, res) {
  res.render('index', {
    title: 'Tic Tac Toe Challenge',
  });  
});


app.get('/results/win', function(req, res){
  MongoClient.connect( mongoUri, function(err, db) {
    if(err) throw err;

    var collection = db.collection('results');
    collection.insert( { result: 1, ip: req.headers['X-Forwarded-For'] } );
    db.close();

//  res.status(401)
//  res.send('There was an error saving your result.');
  });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
