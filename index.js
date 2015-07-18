
'use strict';

var http = require('http');
var express = require('express');
var path = require('path');
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
var io = require('socket.io')(server);

// bind the app routes
require('./app/routes/auth').call(app);
require('./app/routes/index').call(app);

// bind the websocket events
io.on('connection', function(socket) {

  console.log('a user connected');

  socket.on('chat message', function(message) {
    console.log('message received:', message);
    socket.emit('chat message acknowledged');
  }).on('error', function(err) {
    console.error('socket error', err);
  }).on('disconnect', function() {
    console.log('a user disconnected');
  }).on('reconnect', function(attempts) {
    console.log('a user reconnected after', attempts, 'attempts');
  }).on('reconnect_attempt', function() {
    console.log('a user is attempting to reconnect');
  }).on('reconnecting', function(attempt) {
    console.log('a user has tried', attempt, 'times to reconnect');
  }).on('reconnect_error', function(err) {
    console.error('reconnection error', err);
  }).on('reconnect_failed', function() {
    console.log('reconnection failed');
  });
});

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
