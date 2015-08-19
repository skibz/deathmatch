
'use strict';

module.exports = function() {
  this.use(this.get('express.static')(process.env.STATIC));
  this.use(require('serve-favicon')(process.env.FAVICON));
};
