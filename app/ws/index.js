
'use strict';

var Lobby = require('../pickups/lobby');
var Rcon = require('../pickups/rcon');

var io;
var clients = {}
var auth = {};
var lobby;
var users;

module.exports = function() {

  io = require('socket.io')(this.http);
  users = this.express.get('users.findOne');

  lobby = Lobby.create({
    started: io.emit.bind(io, 'lobby#started'),
    postponed: io.emit.bind(io, 'lobby#postponed')
  });

  io.on('connection', function(socket) {

    socket.on('identify', function(who) {
      auth[socket.id] = who.deathmatch;
      clients[socket.id] = {
        socket: socket.id,
        displayname: who.displayname,
        // twitch: who.twitch,
        steam: who.steam
      };

      socket.emit('client list', Object.keys(clients).map(function(client) {
        return clients[client];
      }));

      socket.broadcast.emit('someone joined', clients[socket.id]);
    });

    socket.on('chat message', function(message) {
      socket.broadcast.emit('chat message', message);
    });

    socket.on('public add player', function() {
      socket.join('lobby', function(err) {
        console.error('public add player', err);
        var player = clients[socket.id].displayname;
        lobby.add(player);
        io.emit('lobby#add', player);
      });
    });

    socket.on('public rem player', function() {
      socket.leave('lobby', function(err) {
        console.error('public rem player', err);
        var player = clients[socket.id].displayname;
        lobby.rem(player);
        io.emit('lobby#rem', player);
      });
    });

    socket.on('error', console.error.bind(console));

    socket.on('disconnect', function() {
      io.emit('someone left', clients[socket.id]);
      // remove client from lobby if added
      var player = clients[socket.id].displayname;
      if (lobby.isAdded(player)) {
        lobby.rem(player);
        io.emit('lobby#rem', player);
      }
      delete clients[socket.id];
      delete auth[socket.id];
    });

  });
};
