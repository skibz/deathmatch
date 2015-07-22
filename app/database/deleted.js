
var Store = require('nedb');
var DELETED_STORE = process.env.DELETED_STORE;
var DB_COMPACTION_INTERVAL = process.env.DB_COMPACTION_INTERVAL;

var common = require('./common');

module.exports = function() {

  var deleted = new Store({
    filename: DELETED_STORE,
    autoload: true
  });

  deleted.persistence.stopAutocompaction();
  deleted.persistence.setAutocompactionInterval(DB_COMPACTION_INTERVAL);

  this.set('deleted.db', deleted);
  this.set('deleted.findMany', common.findMany.bind(deleted));
  this.set('deleted.findOne', common.findOne.bind(deleted));
  this.set('deleted.updateOne', common.updateOne.bind(deleted));
  this.set('deleted.updateMany', common.updateMany.bind(deleted));
  this.set('deleted.deleteOne', common.deleteOne.bind(deleted));
  this.set('deleted.all', common.all.bind(deleted));
  this.set('deleted.total', common.total.bind(deleted));

  this.set('deleted.resurrect', function(user, done) {
    var users = this.get('users.db');
    var deleted = this.get('deleted.db');
    deleted.findOne(user, function(err, user) {
      if (err) return done(err);
      user.updated_at = Date.now();
      users.insert(user, function(err, user) {
        if (err) return done(err);
        deleted.remove({deathmatch_id: user.deathmatch_id}, function(err) {

          // i guess we should clean up...?
          // these references look ultra-circular
          deleted = null;
          users = null;
          return done(err, user);
        });
      });
    });
  }.bind(this));
};
