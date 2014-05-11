var WebSocket = require('ws');
var shell = require("child_process");

remoteCommands = {
		"ac": function(){shell.exec("irsend send_once ac_remote key_power")},
		"ac_up": function(){shell.exec("irsend send_once ac_remote key_up")},
		"ac_down": function(){shell.exec("irsend send_once ac_remote key_down")},
		"ac_fan": function(){shell.exec("irsend send_once ac_remote key_fn")},
		"ac_mode": function(){shell.exec("irsend send_once ac_remote key_mode")},
		"on": function(){shell.exec("gpio write 1 1")},
		"off": function(){shell.exec("gpio write 1 0")}
}
ws = null;

function createSocket() {
	try {
		ws = new WebSocket("ws://dstnpreuss.com:8008");
		ws.on("open", function(){
			console.log("opened socket");
			
		});	
		ws.on("message", function(message) {
				console.log("received: " + message);
				remoteCommands[message]();
		});
		ws.on("close", function() {
			console.log("socket close");
		});
	}
	catch (e) {
		console.log("error creating socket");
	}
}

process.on("uncaughtException", function(err){
	console.log("caught error");
	console.log(err);	
});

createSocket();
setInterval(function(){ 
	if (ws === null || (ws.readyState != 0 && ws.readyState != 1)) 
		createSocket();
	}, 10000);
