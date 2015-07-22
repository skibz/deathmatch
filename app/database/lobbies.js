
var Store = require('nedb');
var LOBBIES_STORE = process.env.LOBBIES_STORE;
var DB_COMPACTION_INTERVAL = process.env.DB_COMPACTION_INTERVAL;

var common = require('./common');

module.exports = function() {

  lobbies = new Store({
    filename: LOBBIES_STORE,
    autoload: true
  });

  /*
    // lobbies schema
    // --------------
    //
    // created_at
    // updated_at
    //
    // unixtime
    // format
    // players
    // captains
    // map
    // server
  */

  lobbies.persistence.stopAutocompaction();
  lobbies.persistence.setAutocompactionInterval(DB_COMPACTION_INTERVAL);

  this.set('lobbies.db', lobbies);
  this.set('lobbies.findOrCreate', common.findOrCreate.bind(lobbies));
  this.set('lobbies.findMany', common.findMany.bind(lobbies));
  this.set('lobbies.findOne', common.findOne.bind(lobbies));
  this.set('lobbies.deleteMany', common.deleteMany.bind(lobbies));
  this.set('lobbies.deleteOne', common.deleteOne.bind(lobbies));
  this.set('lobbies.upsertMany', common.upsertMany.bind(lobbies));
  this.set('lobbies.upsertOne', common.upsertOne.bind(lobbies));
  this.set('lobbies.updateOne', common.updateOne.bind(lobbies));
  this.set('lobbies.updateMany', common.updateMany.bind(lobbies));
  this.set('lobbies.all', common.all.bind(lobbies));
  this.set('lobbies.total', common.total.bind(lobbies));
};
