
exports.findMany = function(query, done) {
  return this.find(query, done);
};

exports.findOne = function(query, done) {
  return this.findOne(query, done);
};

/**
 * get or create a record
 *
 * @param  {object} existingUser query properties and values to uniquely identify user
 * @param  {object} newUser      mapping of properties to values
 * @param  {function} done       err res callback
 * @return {function}
 */
exports.findOrCreate = function(existing, create, done) {
  this.findOne(existing, function(err, found) {
    if (err) return done(err);
    if (found) return done(null, found);
    create.created_at = create.updated_at = Date.now();
    return this.insert(create, done);
  }.bind(this));
};

exports.deleteMany = function(query, done) {
  return this.remove(query, {multi: true}, done);
};

exports.deleteOne = function(query, done) {
  return this.remove(query, {}, done);
};

exports.upsertMany = function(query, update, done) {
  return this.update(query, update, {upsert: true, multi: true}, done);
};

exports.upsertOne = function(query, update, done) {
  return this.update(query, update, {upsert: true}, done);
};

exports.updateOne = function(query, update, done) {
  return this.update(query, update, {}, done);
};

exports.updateMany = function(query, update, done) {
  return this.update(query, update, {multi: true}, done);
};

exports.all = function(done) {
  return this.find({}, done);
};

exports.total = function(done) {
  return this.count({}, done);
};
