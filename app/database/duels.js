
var Store = require('nedb');
var DUELS_STORE = process.env.DUELS_STORE;
var DB_COMPACTION_INTERVAL = process.env.DB_COMPACTION_INTERVAL;

module.exports = function() {

  duels = new Store({
    filename: DUELS_STORE,
    autoload: true
  });

  // lobbies schema
  // --------------
  //
  // created_at
  // updated_at
  // deleted_at
  // active
  //
  // challenger
  // challenger_wtfs
  // challenged
  // challenged_wtfs
  // stakes
  // outcome
  // map
  // expires_at


  duels.persistence.stopAutocompaction();
  duels.persistence.setAutocompactionInterval(DB_COMPACTION_INTERVAL);

  return duels;

};
