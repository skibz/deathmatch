
'use strict';

var http = require('http'), server;
var express = require('express');
var app = express();

var PORT = process.env.PORT;
var VIEWS = process.env.VIEWS;
var VIEW_ENGINE = process.env.VIEW_ENGINE;
var HOST = process.env.HOST;

// set the port
app.set('port', PORT);

// set up the view engine
app.set('views', VIEWS);
app.set('view engine', VIEW_ENGINE);

// make static accessible for various middlewares
app.set('express.static', express.static);

// initialise database collections
require('./app/database').call(app);

// attach the middleware layers
require('./app/middleware/static').call(app);
require('./app/middleware/request').call(app);
require('./app/middleware/auth').call(app);

// initialise the websocket server
server = http.createServer(app);

// bind the app routes
require('./app/routes/auth').call(app);
require('./app/routes/user').call(app);
require('./app/routes/index').call(app);

// bind the websocket events
require('./app/ws').call(server);

// bind the server socket
process.nextTick(function() {
  server.listen(app.get('port'), function() {
    console.log('server listening on', HOST, app.get('port'));
  });
});
