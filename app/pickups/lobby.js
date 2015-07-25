
'use strict';

var prefixer = require('../etc/prefixer');

module.exports = {
  prototype: {
    add: function(player) {
      if (this.isFull()) return;
      this._players[player] = player;
      this.tryBeginFinalising();
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
      return Object.keys(this._players).length === this._format * 2;
    },
    tryBeginFinalising: function() {
      this._finalising = !this._finalising && this.isFull() ? true : this._finalising;
      this._finaliser = this._finalising && !this._finaliser ? setTimeout(
        this.tryFinishFinalising.bind(
          this, this._postponed, this._starting
        ), this._timeout
      ) : null;
    },
    tryFinishFinalising: function(definalised, finalised) {
      if (!this.isFull()) {
        this._finalising = false;
        this._finaliser = null;
        return definalised();
      }
      return finalised();
    }
  },
  create: function(options) {

    options = options || {};

    if (!('timeout' in options)) {
      options.timeout = 60000;
    }
    if (!('map' in options)) {
      options.map = 'cp_badlands';
    }
    if (!('format' in options)) {
      options.format = 6;
    }
    if (!('players' in options)) {
      options.players = {};
    }
    if (!('starting' in options)) {
      options.starting = function() {};
    }
    if (!('postponed' in options)) {
      options.postponed = function() {};
    }

    options.createdAt = +Date.now();
    options.finalising = false;
    options.finaliser = null;

    return Object.create(
      module.exports.prototype,
      prefixer(options)
    );
  }
};
