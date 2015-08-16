
'use strict';

var Lobby = require('../core/lobby/lobby');
var Rcon = require('../core/lobby/rcon');

var clients = {};

module.exports = function() {

  var io = require('socket.io')(this.http);
  var servers = this.express.get('lobby.servers');
  var admins = this.express.get('lobby.admins');
  var lobby = Lobby.create({
    server: servers[process.env.DEFAULT_SERVER],
    format: 6,
    map: process.env.DEFAULT_MAP,
    timeout: 60000,
    started: function() {
      io.sockets.emit('lobby#started', {
        connect: 'steam://connect/' +
          lobby._server.host + ':' +
          lobby._server.port + '/' +
          lobby._server.password
      });
    },
    postponed: function() {
      io.sockets.emit('lobby#postponed');
    }
  });

  io.on('connection', function(socket) {

    socket.emit('client#identity');

    socket.on('client#identify', function(who) {
      clients[socket.id] = {
        socket: socket.id,
        displayname: who.displayname,
        twitch: who.twitch,
        steam: who.steam
      };

      socket.emit('client#list', Object.keys(clients).map(function(client) {
        return clients[client];
      }));

      socket.broadcast.emit('chat#joined', clients[socket.id]);
    });

    socket.on('chat#message', function(message) {
      socket.broadcast.emit('chat#message', message);
    });

    socket.on('lobby#player-add', function() {
      var player = clients[socket.id].displayname;
      if (!lobby.isAdded(player)) {
        io.emit('lobby#add', {
          displayname: player,
          id: clients[socket.id].steam || clients[socket.id].twitch
        });
        lobby.add(player);
      }
    });

    socket.on('lobby#player-rem', function() {
      var player = clients[socket.id].displayname;
      if (lobby.isAdded(player)) {
        io.emit('lobby#rem', {
          displayname: player,
          id: clients[socket.id].steam || clients[socket.id].twitch
        });
        lobby.rem(player);
      }
    });

    socket.on('error', console.error.bind(console));

    socket.on('disconnect', function() {
      var client = clients[socket.id];
      io.emit('chat#left', client);
      var player = client.displayname;
      if (lobby.isAdded(player)) {
        lobby.rem(player);
        io.emit('lobby#rem', {
          displayname: player,
          id: clients[socket.id].steam || clients[socket.id].twitch
        });
      }
      delete clients[socket.id];
    });

  });
};
