var express = require("express");
var logfmt = require("logfmt");
var sass = require("node-sass");
var app = express();
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL ||
               'mongodb://localhost/tictactoe';

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(logfmt.requestLogger());
app.use(sass.middleware({
  src: __dirname + '/sass',
  dest: __dirname + '/public/css',
  debug: true,
  outputStyle: 'compressed'
}));


/* Routes
------------------------------------------------*/
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Tic Tac Toe Challenge',
  });  
});

app.get('/results/win', function(req, res){
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
