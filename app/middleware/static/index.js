
var path = require('path');
var favicon = require('serve-favicon');

module.exports = function() {
  this.use(this.get('express.static')(path.join(__dirname, '../../../public')));
  this.use(favicon(path.join(__dirname, '../../../public/favicon.ico')));
};
