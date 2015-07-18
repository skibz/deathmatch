
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');

module.exports = function() {
  this.use(logger('dev'));
  this.use(methodOverride());
  this.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || 'keyboard cat'
  }));
  this.use(bodyParser.json());
  this.use(bodyParser.urlencoded({extended: true}));
  this.use(multer());
};
