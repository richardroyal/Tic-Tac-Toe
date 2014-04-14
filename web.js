var express = require("express");
var logfmt = require("logfmt");
var sass = require("node-sass");
var app = express();
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(":memory:");

db.serialize(function() {
  db.run("CREATE TABLE results (wins integer, losses integer)");
});


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
  });  
});

app.get('/results/win', function(req, res){
  db.query("SELECT wins FROM results LIMIT 1", function(records){
    res.write( records );
  });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
