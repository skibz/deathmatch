
'use strict';

var bodyParser = require('body-parser');

module.exports = function() {
  if (process.env.NODE_ENV === 'development') {
    this.use(require('morgan')('dev'));
  }
  this.use(require('method-override')());
  this.use(require('express-session')({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }));
  this.use(bodyParser.json());
  this.use(bodyParser.urlencoded({extended: true}));
};
