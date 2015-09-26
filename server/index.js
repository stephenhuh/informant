var exec = require('child_process').exec;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//Load the request module
var request = require('request');
//Load fs module
var fs = require('fs');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  // capture youtube screen
  exec('screencapture -R106,157,640,360 ./public/screenshot.jpeg', function (error, stdout, stderr){
  });
  source = fs.createReadStream('./public/screenshot.jpeg');
  source.pipe(request.post('http://localhost:1337/image'));
  res.render('index.ejs');
});

app.post('/image', function(req, res) {
  destination = fs.createWriteStream("./written.jpeg");
  req.pipe(destination);
});

server.listen(1337, function() {
  console.log('Server is running on port 1337');
});
