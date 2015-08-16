
'use strict';

var passport = require('passport');
var TwitchStrategy = require('passport-twitchtv').Strategy;
var SteamStrategy = require('passport-steam').Strategy;

var NODE_ENV = process.env.NODE_ENV;
var PORT = process.env.PORT;
var HOST = process.env.HOST;

// in production mode, nginx will be reverse-proxying
// our app, so we'll point all requests to port 80 instead.
var STEAM_REDIRECT_URI = NODE_ENV === 'development' ?
  HOST + ':' + PORT + process.env.STEAM_REDIRECT_URI :
  HOST + process.env.STEAM_REDIRECT_URI;
var TWITCH_REDIRECT_URI = NODE_ENV === 'development' ?
  HOST + ':' + PORT + process.env.TWITCH_REDIRECT_URI :
  HOST + process.env.TWITCH_REDIRECT_URI;

var STEAM_API_KEY = process.env.STEAM_API_KEY;
var TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
var TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

module.exports = function() {

  this.use(passport.initialize());
  this.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('serialiseUser', user);
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    console.log('deserialiseUser', obj);
    done(null, obj);
  });

  passport.use(new SteamStrategy({
    apiKey: STEAM_API_KEY,
    returnURL: STEAM_REDIRECT_URI,
    realm: HOST
  }, function(id, profile, done) {
    return done(null, {
      email: null,
      steam_id: profile.id,
      twitch_id: null,
      display_name: profile.displayName,
      steam_avatar_small: profile.photos[0].value,
      steam_avatar_medium: profile.photos[1].value,
      steam_avatar_large: profile.photos[2].value,
      twitch_avatar: null
    });
  }));

  passport.use(new TwitchStrategy({
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_CLIENT_SECRET,
    callbackURL: TWITCH_REDIRECT_URI,
    scope: 'user_read'
  }, function(accessToken, refreshToken, profile, done) {
    return done(null, {
      email: profile.email,
      steam_id: null,
      twitch_id: profile.id,
      display_name: profile.displayName,
      steam_avatar_small: null,
      steam_avatar_medium: null,
      steam_avatar_large: null,
      twitch_avatar: profile._json.logo
    });
  }));

  // make passport accessible for various routes
  this.set('passport', passport);
};
