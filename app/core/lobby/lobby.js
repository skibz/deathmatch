
'use strict';

var objectry = require('../objectry');

module.exports = {
  prototype: {
    add: function(player) {
      if (this.isAdded(player) || this.isFull()) return;
      this._players[player] = player;
      this.tryBeginStarting();
    },
    rem: function(player) {
      if (this.isAdded(player)) delete this._players[player];
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
    tryBeginStarting: function() {
      this._starting = !this._starting && this.isFull() ? true : this._starting;
      this._starter = this._starting && !this._starter ? setTimeout(
        this.tryStart.bind(
          this, this._postponed, this._started
        ), this._timeout
      ) : null;
    },
    tryStart: function(postponed, started) {
      if (!this.isFull()) {
        this._starting = false;
        this._starter = null;
        return postponed();
      }

      // reset the object for posterity
      this._players = {};
      this._starting = false;
      this._starter = null;

      return started();
    }
  },
  create: function(options) {

    options = options || {};

    if (!('timeout' in options)) options.timeout = 60000;
    if (!('map' in options)) options.map = 'cp_badlands';
    if (!('format' in options)) options.format = 6;
    if (!('players' in options)) options.players = {};
    if (!('started' in options)) options.started = function() {};
    if (!('postponed' in options)) options.postponed = function() {};

    options.starting = false;
    options.starter = null;

    return Object.create(
      module.exports.prototype,
      objectry(options)
    );
  }
};
