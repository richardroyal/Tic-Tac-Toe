var express = require("express");
var logfmt = require("logfmt");
var sass = require("node-sass");
var app = express();

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(logfmt.requestLogger());
app.use(sass.middleware({
  src: __dirname + '/sass',
  dest: __dirname + '/public/css',
  debug: true,
  outputStyle: 'compressed'
}));


app.get('/', function(req, res) {
  res.render('index', {
    title: 'Tic Tac Toe Challenge',
    asdf: "asdf"
  });  
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
