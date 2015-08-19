
'use strict';

var server;
var express = require('express');
var app = express();

app.set('port', process.env.PORT);
app.set('views', process.env.VIEWS);
app.set('view engine', process.env.VIEW_ENGINE);
app.set('express.static', express.static);
app.set('lobby.servers', JSON.parse(process.env.SERVERS_JSON));
app.set('lobby.admins', JSON.parse(process.env.ADMINS_JSON));
app.set('lobby.maps', JSON.parse(process.env.MAPS_JSON));

require('./app/middleware/static').call(app);
require('./app/middleware/request').call(app);
require('./app/middleware/auth').call(app);

require('./app/routes/auth').call(app);
require('./app/routes/index').call(app);

server = require('http').createServer(app);

require('./app/ws').call({
  http: server,
  express: app
});

process.nextTick(function() {
  server.listen(app.get('port'), function() {
    console.log('server running in mode', process.env.NODE_ENV);
  });
});
