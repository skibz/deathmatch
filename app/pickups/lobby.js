
'use strict';

var prefixer = require('../etc/prefixer');

module.exports = {
  prototype: {
    add: function(player) {
      if (this.isFull()) return;
      this._players[player] = player;
      this._finalising = !this._finalising && this.isFull() ? true : this._finalising;
      this._finaliser = this._finalising && !this._finaliser ?
        setTimeout(this._afterTimeout, this._timeout) : null;
    },
    rem: function(player) {
      delete this._players[player];
    },
    isAdded: function(player) {
      return player in this._players;
    },
    map: function() {
      return arguments.length ? (
        this._map = arguments[0]
      ) : this._map;
    },
    format: function() {
      return arguments.length ? (
        this._format = arguments[0]
      ) : this._format * 2;
    },
    players: function() {
      return arguments.length ? (
        this._players = arguments[0]
      ) : Object.keys(this._players);
    },
    isFull: function() {
      return Object.keys(
        this._players
      ).length === this._format * 2;
    }
  },
  create: function(options) {

    var properties = prefixer(options);

    if (!('_players' in properties)) {
      properties._players = {
        value: {},
        writable: true,
        enumerable: true,
        configurable: true
      };
    }

    if (!('_map' in properties)) {
      properties._map = {
        value: 'cp_badlands',
        writable: true,
        enumerable: true,
        configurable: true
      };
    }

    if (!('_format' in properties)) {
      properties._format = {
        value: 6,
        writable: true,
        enumerable: true,
        configurable: true
      };
    }

    if (!('_timeout' in properties)) {
      properties._timeout = {
        value: 60000,
        writable: true,
        enumerable: true,
        configurable: true
      };
    }

    properties._createdAt = {
      value: +Date.now(),
      writable: false,
      enumerable: true,
      configurable: true
    };

    properties._finalising = {
      value: false,
      writable: true,
      enumerable: true,
      configurable: true
    };

    properties._finaliser = {
      value: null,
      writable: true,
      enumerable: true,
      configurable: true
    };

    return Object.create(
      module.exports.prototype,
      properties
    );
  }
};
