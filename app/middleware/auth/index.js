
'use strict';

var passport = require('passport');
var TwitchStrategy = require('passport-twitchtv').Strategy;
var SteamStrategy = require('passport-steam').Strategy;

module.exports = function() {

  this.use(passport.initialize());
  this.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('passport serialise', user);
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    console.log('passport unserialise', obj);
    done(null, obj);
  });

  passport.use(new SteamStrategy({
    apiKey: process.env.STEAM_API_KEY,
    returnURL: process.env.SERVER_SOCKET + process.env.STEAM_REDIRECT_URI,
    realm: process.env.SERVER_SOCKET
  }, function(id, profile, done) {
    // this is where we'll upsert a user into our records
    // console.log(
    //   'id', id,
    //   'profile', profile
    // );
    return done(null, profile);
  }));

  passport.use(new TwitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: process.env.SERVER_SOCKET + process.env.TWITCH_REDIRECT_URI,
    scope: 'user_read'
  }, function(accessToken, refreshToken, profile, done) {
    // this is where we'll upsert a user into our records
    // console.log(
    //   'accessToken', accessToken,
    //   'refreshToken', refreshToken,
    //   'profile', profile
    // );
    return done(null, profile);
  }));

  this.set('passport', passport);
};
