
'use strict';

var SimpleRcon = require('simple-rcon');
var prefixer = require('../etc/prefixer');

module.exports = {
  prototype: {
    map: function(map) {
      this._context.exec(['sm_map', map].join(' '));
    },
    say: function(message) {
      this._context.exec(['sm_say', message].join(' '));
    },
    kick: function(player, reason) {
      this._context.exec(['sm_kick', player, reason].join(' '));
    },
    ban: function(player, duration, reason) {
      this._context.exec(['sm_ban', player, duration, reason].join(' '));
    },
    unban: function(player) {
      this._context.exec(['sm_unban', player].join(' '));
    },
    exec: function(command) {
      this._context.exec(command);
    },
    disconnect: function() {
      this._context.close();
    }
  },
  create: function(options, done) {

    var rcon;
    var properties = prefixer(options);

    // this could be the leakiest
    // code i have ever written...
    rcon = new SimpleRcon(
      properties._host.value,
      properties._port.value,
      properties._rcon.value
    ).on('error', function(err) {
      console.error(new Date(), 'rcon error', err);
    }).on('authenticated', function() {
      properties._context = {
        value: rcon,
        writable: false,
        enumerable: true,
        configurable: true
      };
      return setImmediate(
        done.bind(this, Object.create(
          module.exports.prototype,
          properties
        ))
      );
    });
  }
};
