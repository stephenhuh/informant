var exec = require('child_process').exec;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//Load the request module
var request = require('request');
//Load fs module
var fs = require('fs');
var youtubedl = require('youtube-dl');
var wit = require('node-wit');
var ACCESS_TOKEN = "JJ6C6JDV5B65NDEVVXDJIOLE5AC5SUOX";

var stream = fs.createReadStream('output_1.mp3');



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

app.get('/dl', function(req, res) {
	var video = youtubedl('https://www.youtube.com/watch?v=DSjgIM6j788',
	  // Optional arguments passed to youtube-dl. 
	['--format=18'],
	  // Additional options can be given for calling `child_process.execFile()`.
	  { cwd: __dirname });

	// Will be called when the download starts.
	video.on('info', function(info) {
	  console.log('Download started');
	  console.log('filename: ' + info.filename);
	  console.log('size: ' + info.size);
	});
	ws = fs.createWriteStream('myvideo.mp4')
	video.pipe(ws);
	ws.on("finish", convert());
	res.send('yo youre downloading a video right now');
});

var convert = function(){
	console.log('yo youre converting a video right now');
	exec('ffmpeg -i myvideo.mp4 myaudio.mp3', null, slice);
}

var slice = function(){
	console.log('splitting now....');
	exec('mp3splt -t 0.05 output', null,);
}

app.get('/slice', function(req, res){
	exec('')
}

app.get('/analyze', function(req, res){
	wit.captureSpeechIntent(ACCESS_TOKEN, stream, "audio/mpeg3", function (err, res) {
	  console.log("Response from Wit for audio stream: ");
	  if (err) console.log("Error: ", err);
	  console.log(JSON.stringify(res, null, " "));
	});
	res.send('yo youre sending your shit now');
});

app.get('/informant', function(req, rest){});
	
server.listen(1337, function() {
  console.log('Server is running on port 1337');
});
