var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Home'
  });  
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
