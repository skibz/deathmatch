
var Store = require('nedb');
var USERS_STORE = process.env.USERS_STORE;
var DB_COMPACTION_INTERVAL = process.env.DB_COMPACTION_INTERVAL;

var common = require('./common');

module.exports = function() {

  var users = new Store({
    filename: USERS_STORE,
    autoload: true
  });

  users.ensureIndex({
    fieldName: 'deathmatch_id',
    unique: true
  });

  users.ensureIndex({
    fieldName: 'steam_id',
    unique: true
  });

  // users.ensureIndex({
  //   fieldName: 'twitch_id',
  //   unique: true
  // });

  // users.ensureIndex({
  //   fieldName: 'email',
  //   unique: true
  // });

  users.ensureIndex({
    fieldName: 'wtfs'
  });

  users.ensureIndex({
    fieldName: 'display_name'
  });

  /*
    users schema
    ------------
    //
    // created_at
    // updated_at
    //
    // type (super, officer, peon)
    // roles
    // deathmatch_id (used for identifying in chat and authorisation)
    //
    // muted
    // blinded
    // banned
    //
    // notifications_enabled
    //
    // duels_accepted
    // duels_declined
    // duels_won
    // duels_lost
    // duels_drawn
    // wtfs
    //
    // email
    // steam_id
    // twitch_id
    // display_name
    // steam_avatar_small
    // steam_avatar_medium
    // steam_avatar_large
    // twitch_avatar
    // deathmatch_avatar
  */

  users.persistence.stopAutocompaction();
  users.persistence.setAutocompactionInterval(DB_COMPACTION_INTERVAL);

  this.set('users.db', users);
  this.set('users.findOrCreate', common.findOrCreate.bind(users));
  this.set('users.findMany', common.findMany.bind(users));
  this.set('users.findOne', common.findOne.bind(users));
  this.set('users.deleteMany', common.deleteMany.bind(users));
  this.set('users.deleteOne', common.deleteOne.bind(users));
  this.set('users.upsertMany', common.upsertMany.bind(users));
  this.set('users.upsertOne', common.upsertOne.bind(users));
  this.set('users.updateOne', common.updateOne.bind(users));
  this.set('users.updateMany', common.updateMany.bind(users));
  this.set('users.all', common.all.bind(users));
  this.set('users.total', common.total.bind(users));
};
