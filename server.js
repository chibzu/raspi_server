var fs = require("fs");
var shell = require("child_process");
var http = require("http");

shell.exec("gpio mode 1 out");
shell.exec("gpio mode 5 out");

var ac_status = false;

var remoteCommands = {
	"ac": function(){shell.exec("irsend send_once ac_remote key_power")},
	"ac_up": function(){shell.exec("irsend send_once ac_remote key_up")},
	"ac_down": function(){shell.exec("irsend send_once ac_remote key_down")},
	"ac_fan": function(){shell.exec("irsend send_once ac_remote key_fn")},
	"ac_mode": function(){shell.exec("irsend send_once ac_remote key_mode")}
};

http.createServer( function(request, response){
	console.log("Serving request for " + request.url);
	if (request.url.match("/file/")){
		
	}
	else if (request.url.match("/remote_control")){
		response.writeHead(200, {'Content-Type': 'text/html'});
		fs.readFile("./controller.html", function(err, data){
			response.end(data);
		});
	}
	else if (request.url.match("/webcam")){
		response.writeHead(200, {'Content-Type': 'image/jpeg'});
		shell.exec("fswebcam -", {encoding: "binary", maxBuffer: 200000*1024}, function(error, stdout, stderr){
			response.write(stdout, "binary");
			response.end();
		});
	}
	else if (remoteCommands(request.url.slice(1))){
		remoteCommands[request.url.slice(1)]();
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end("success");
	}
	
}).listen(1337);
console.log("Server Started");
