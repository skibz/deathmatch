
'use strict';

var http = require('http');
var express = require('express');
var app = express();

var PORT = process.env.PORT;
var VIEWS = process.env.VIEWS;
var SERVER_SOCKET = process.env.SERVER_SOCKET;

// set the port
app.set('port', PORT);

// set up the view engine
app.set('views', VIEWS);
app.set('view engine', 'jade');

// make static accessible for various middlewares
app.set('express.static', express.static);

// attach the middleware layers
require('./app/middleware/static').call(app);
require('./app/middleware/request').call(app);
require('./app/middleware/auth').call(app);

// initialise the websocket server
var server = http.createServer(app);

// bind the app routes
require('./app/routes/auth').call(app);
require('./app/routes/index').call(app);

// bind the websocket events
require('./app/ws').call(server);

// bind the server socket
process.nextTick(function() {
  server.listen(app.get('port'), function() {
    console.log(
      'server listening on',
      SERVER_SOCKET,
      app.get('port')
    );
  });
});
