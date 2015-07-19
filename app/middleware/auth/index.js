
'use strict';

var passport = require('passport');
var TwitchStrategy = require('passport-twitchtv').Strategy;
var SteamStrategy = require('passport-steam').Strategy;

var PORT = process.env.PORT;
var SERVER_SOCKET = process.env.SERVER_SOCKET;
var STEAM_API_KEY = process.env.STEAM_API_KEY;
var STEAM_REDIRECT_URI = SERVER_SOCKET + ':' + PORT + process.env.STEAM_REDIRECT_URI;
var TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
var TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
var TWITCH_REDIRECT_URI = SERVER_SOCKET + ':' + PORT + process.env.TWITCH_REDIRECT_URI;

// crypto.createHash()
// hash some id from twitch and/or steam
// to use for deathmatchid in user records
//
// deathmatchid will act as an authorisation
// key

module.exports = function() {

  this.use(passport.initialize());
  this.use(passport.session());

  passport.serializeUser(function(user, done) {
    // do we upsert here?
    //
    // console.log('passport serialise', user);
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    // console.log('passport unserialise', obj);
    done(null, obj);
  });

  passport.use(new SteamStrategy({
    apiKey: STEAM_API_KEY,
    returnURL: STEAM_REDIRECT_URI,
    realm: SERVER_SOCKET
  }, function(id, profile, done) {
    console.log('steam', profile);

    // or here?
    //
    // console.log(
    //   'id', id,
    //   'profile', profile
    // );
    return done(null, profile);
  }));

  passport.use(new TwitchStrategy({
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_CLIENT_SECRET,
    callbackURL: TWITCH_REDIRECT_URI,
    scope: 'user_read'
  }, function(accessToken, refreshToken, profile, done) {
    console.log('twitch', profile);
    // this is where we'll upsert a user into our records
    // console.log(
    //   'accessToken', accessToken,
    //   'refreshToken', refreshToken,
    //   'profile', profile
    // );
    return done(null, profile);
  }));

  // make passport accessible for various routes
  this.set('passport', passport);
};
