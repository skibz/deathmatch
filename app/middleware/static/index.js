
var favicon = require('serve-favicon');

var FAVICON = process.env.FAVICON;
var STATIC = process.env.STATIC;
var PORT = process.env.PORT;

module.exports = function() {

  this.use(this.get('express.static')(STATIC));
  this.use(favicon(FAVICON));
};
