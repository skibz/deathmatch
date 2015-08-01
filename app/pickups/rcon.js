
'use strict';

var SimpleRcon = require('simple-rcon');
var prefixer = require('../etc/prefixer');

module.exports = {
  prototype: {
    map: function(map) {
      this._commands.push('sm_map ' + map);
      return this;
    },
    say: function(message) {
      this._commands.push('sm_say ' + message);
      return this;
    },
    kick: function(player, reason) {
      this._commands.push('sm_kick ' + player + ' ' + reason);
      return this;
    },
    ban: function(player, duration, reason) {
      this._commands.push('sm_ban ' + player + ' ' + duration + ' ' + reason);
      return this;
    },
    unban: function(player) {
      this._commands.push('sm_unban ' + player);
      return this;
    },
    go: function() {
      var rcon = new SimpleRcon(this._host, this._port, this._rcon);
      rcon.on('error', function(err) {
        throw new Error(err);
      }).once('authenticated', rcon.exec.bind(
        rcon, this._commands.join(';'), rcon.close.bind(rcon)
      ));
    }
  },
  create: function(options) {
    options = options || {};
    options.commands = [];
    return Object.create(
      module.exports.prototype,
      prefixer(options)
    );
  }
};
