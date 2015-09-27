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

exec('screencapture -R106,157,640,360 ./public/screenshot.jpeg', function (error, stdout, stderr){
});
fs.watchFile('./public/screenshot.jpeg', function(curr, prev) {
  console.log('the current mtime is: ' + curr.mtime);
  console.log('the previous mtime was: ' + prev.mtime);
  setTimeout(function() {
    exec('screencapture -R106,157,640,360 ./public/screenshot.jpeg', function (error, stdout, stderr){
    });
  }, 2000);
});

var detectFaceParams = function(payload, content) {
  return {
    options : {
  		uri: "/detections",
      baseUrl: "https://api.projectoxford.ai/face/v0/",
  		qs: {
  			analyzesFaceLandmarks : "false",
  			analyzesAge : "false",
  			analyzesGender : "false",
  			analyzesHeadPose: "false"
  		},
  		method: "POST",
  		headers: {
  			"Content-Type" : content,
  			"Ocp-Apim-Subscription-Key"	: "0067f293c7b6446db4bde094604c4426",
  		},
  		body: payload
  	},
    callback : function(error, response, body){
      if (error) {
        console.log(error.message);
        return;
      }
      console.log("got data from Project Oxford");
      // fs.createWriteStream('views/data.json').write(JSON.stringify(body, null, 2));
  	}
  }
}

app.get('/', function(req, res) {
  var source = fs.createReadStream('./public/screenshot.jpeg');
  var params = detectFaceParams('', 'application/octet-stream');
  var cb = function(error, response, body) {
    console.log("got data from project oxford");
    console.log(body);
    res.send(JSON.stringify(body,null, 2));
    // var stream = fs.createWriteStream('views/data.ejs');
    // stream.write(JSON.stringify(body, null, 2));
    // stream.end("ok!");
    // stream.on("finish", function() {
    //   res.send('data.ejs');
    // });
  };
  console.log("POSTING to project oxford");
  // var dummyData = fs.createReadStream('./apiDataMinimal.json');
  // dummyData.pipe(res);
  source.pipe(request.post(params.options, cb));
  // res.render('index.ejs');
});

app.post('/image', function(req, res) {
  destination = fs.createWriteStream("./written.jpeg");
  req.pipe(destination);
});


server.listen(1337, function() {
  console.log('Server is running on port 1337');
});
