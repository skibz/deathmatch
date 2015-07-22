
var FAVICON = process.env.FAVICON;
var STATIC = process.env.STATIC;

module.exports = function() {

  this.use(this.get('express.static')(STATIC));
  this.use(require('serve-favicon')(FAVICON));
};
