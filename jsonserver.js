var jsonServer = require('json-server')

var server = jsonServer.create() // Returns an Express server
var router = jsonServer.router( 'huishoudboek-app/data/db.json' ) // Returns an Express router

server.use(jsonServer.defaults) // logger, static and cors middlewares
server.use(router) // Mount router on '/'

// server.use("/", express.static(__dirname));

server.listen(3000);
console.log('json-server:Listening on port 3000');