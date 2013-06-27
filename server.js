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
	"ac_mode": function(){shell.exec("irsend send_once ac_remote key_mode")},
	"on": function(){shell.exec("gpio write 1 1")},
	"off": function(){shell.exec("gpio write 1 0")}
};

http.createServer( function(request, response){
	console.log("Serving request for " + request.url);
	if (request.url.match("/files/")){
		shell.exec("file --mime-type ." + request.url, function(err, stdout, stderr){
			response.writeHead(200, {'Content-Type': stdout.split(" ")[1]});
			fs.readFile("."+request.url, function(err, data){response.end(data)});
		});		
	}
	else if (request.url.match("/remote_control")){
		response.writeHead(200, {'Content-Type': 'text/html'});
		fs.readFile("./controller.html", function(err, data){response.end(data);});
	}
	else if (request.url.match("/webcam")){
		response.writeHead(200, {'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store'});
		shell.exec("fswebcam -", {encoding: "binary", maxBuffer: 200000*1024}, function(error, stdout, stderr){
			response.write(stdout, "binary");
			response.end();
		});
	}
	else if (remoteCommands[request.url.slice(1)]){
		remoteCommands[request.url.slice(1)]();
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end("success");
	}
	else {
		response.writeHead(200, {'Content-Type': 'text/html'});
		fs.readFile("files/index.html", function(err, data){response.end(data)});
	}
	
}).listen(1337);
console.log("Server Started");
