var http = require('http');
var fs = require('fs');
var path = require('path');
var jsonServer = require('json-server');


var HTTP_SERVER = {}
HTTP_SERVER.start = function( port ){
	http.createServer(function (request, response) {
		console.log('request starting...');

		var filePath = '.' + request.url;
		if (filePath == '.')
			filePath = '.index.html';

		var extname = path.extname(filePath);
		var contentType = 'text/html';
		switch (extname) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
			case '.json':
				contentType = 'application/json';
				break;
			case '.png':
				contentType = 'image/png';
				break;
			case '.jpg':
				contentType = 'image/jpg';
				break;
			case '.wav':
				contentType = 'audio/wav';
				break;
		}

		fs.readFile(filePath, function(error, content) {
			if (error) {
				if(error.code == 'ENOENT'){
					fs.readFile('./404.html', function(error, content) {
						response.writeHead(200, { 'Content-Type': contentType });
						response.end(content, 'utf-8');
					});
				}
				else {
					response.writeHead(500);
					response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
					response.end();
				}
			}
			else {
				response.writeHead(200, { 'Content-Type': contentType });
				response.end(content, 'utf-8');
			}
		});

	}).listen(port);
	console.log('Server running at http://localhost:'+port );
}

var JSON_SERVER = {};
JSON_SERVER.start = function( port ) {
	var server = jsonServer.create() // Returns an Express server
	var router = jsonServer.router('data/db.json') // Returns an Express router

	server.use(jsonServer.defaults) // logger, static and cors middlewares
	server.use(router) // Mount router on '/'

	// server.use("/", express.static(__dirname));

	server.listen( port );
	console.log('json-server:Listening on port '+port );
}

JSON_SERVER.start( 3113 );
HTTP_SERVER.start( 8118 );
