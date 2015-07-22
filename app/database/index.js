
module.exports = function() {
  require('./users').call(this);
  require('./lobbies').call(this);
  require('./deleted').call(this);
};
