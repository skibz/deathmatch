
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');

var SESSION_SECRET = process.env.SESSION_SECRET;

module.exports = function() {
  this.use(logger('dev'));
  this.use(methodOverride());
  this.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET
  }));
  this.use(bodyParser.json());
  this.use(bodyParser.urlencoded({extended: true}));
  this.use(multer());
};
