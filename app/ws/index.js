
'use strict';

function get(property, value) {
  for (var i in this) {
    if (this[i][property] === value) {
      return this[i];
    }
  }
}

function pop(property, value) {
  for (var i in this) {
    if (this[i][property] === value) {
      return this.splice(i, 1);
    }
  }
}

function add(element) {
  this.push(element);
}

var io;

var clients = {
  // socket: {}
};

var auth = {
  // socket: deathmatch
};

var resetLobby = {
  id: null, // Date.now
  format: 6,
  players: [],
  map: null,
  server: null,
  closing: false
};

var lobby = {
  id: null, // Date.now
  format: 6,
  players: [],
  map: null,
  server: null,
  closing: false
};

var challenges = [
  // duelling players
];

// `this` should be bound to http server from /index.js
module.exports = function() {

  io = require('socket.io')(this);

  io.on('connection', function(socket) {

    socket.on('identify', function(steam, twitch, displayName, deathmatch) {
      clients[socket.id] = {
        socket: socket.id,
        displayName: displayName,
        twitch: twitch,
        steam: steam
      };

      auth[socket.id] = deathmatch;

      socket.emit('client list', Object.keys(clients).map(
        function(key) { return clients[key]; }
      ));

      var joined = {
        joined: true,
        steam: clients[socket.id].steam,
        twitch: clients[socket.id].twitch,
        displayName: clients[socket.id].displayName,
        socket: clients[socket.id].socket
      };
      socket.broadcast.emit('someone joined', joined);
    });
    socket.on('chat message', function(message) {
      socket.broadcast.emit('chat message', message);
    });
    socket.on('public add player', function(player) {
      // block the hax
      if (player.id !== socket.id) return;

      // player isn't added and lobby has space
      if (lobby.players.indexOf(player.id) === -1 &&
          lobby.players.length < lobby.format * 2) {

        // if player is taking the final spot
        if (lobby.players.length === (lobby.format * 2) - 1) {
          lobby.closing = true;
          lobby.closingTimer = setTimeout(function() {
            // reset the lobby and tell everyone
            // to join the server
            lobby = resetLobby;
          }, 60000);
        }

        lobby.players.push(player);
        io.emit('lobby changed', lobby);
      }
    });
    socket.on('public remove player', function(player) {
      // block the hax
      if (player.id !== socket.id) return;
      // player is added
      if (lobby.players.indexOf(player.id) > -1) {
        if (lobby.players.length === lobby.format * 2) {
          // check for lobby.closing === false on the frontend
          // and clear any timeouts for posting desktop notifications
          // clear any timeouts, here, for resetting lobby entirely
          clearTimeout(lobby.closingTimer);
          lobby.closing = false;
        }
        for (var p in lobby.players) {
          if (lobby.players[p].id === player.id) {
            lobby.players.splice(p, 1);
          }
        }
        io.emit('lobby changed', lobby);
      }
    });
    socket.on('public last game', function() {});
    socket.on('admin add players', function(players) {});
    socket.on('admin remove players', function(players) {});
    socket.on('admin change map', function(map) {});
    socket.on('admin change server', function(server) {});
    socket.on('admin change format', function(format) {});
    socket.on('error', function(err) {
      console.error('socket error', err);
    });
    socket.on('disconnect', function() {
      var parted = {
        parted: true,
        steam: clients[socket.id].steam,
        twitch: clients[socket.id].twitch,
        displayName: clients[socket.id].displayName,
        socket: clients[socket.id].socket
      };
      io.emit('someone left', parted);
      delete clients[socket.id];
      delete auth[socket.id];
    });
  });
};
