
'use strict';

function newDeathmatchId(id) {
  return Math.floor(
    Math.random() * (2015 - 1991) + 1991
  ) * id;
}

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

  var findOrCreate = this.get('users.findOrCreate');

  this.use(passport.initialize());
  this.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new SteamStrategy({
    apiKey: STEAM_API_KEY,
    returnURL: STEAM_REDIRECT_URI,
    realm: HOST
  }, function(id, profile, done) {
    findOrCreate({
      steam_id: profile.id
    }, {
      type: 'peon',
      roles: null,
      deathmatch_id: newDeathmatchId(profile.id),
      muted: false,
      blinded: false,
      banned: false,
      notifications_enabled: false,
      duels_accepted: 0,
      duels_declined: 0,
      duels_lost: 0,
      duels_drawn: 0,
      wtfs: 1000,
      email: null,
      steam_id: profile.id,
      // twitch_id: null,
      display_name: profile.displayName,
      steam_avatar_small: profile.photos[0].value,
      steam_avatar_medium: profile.photos[1].value,
      steam_avatar_large: profile.photos[2].value,
      // twitch_avatar: null,
      // deathmatch_avatar: null
    }, function(err, user) {
      return done(err, user);
    });
  }));

  // passport.use(new TwitchStrategy({
  //   clientID: TWITCH_CLIENT_ID,
  //   clientSecret: TWITCH_CLIENT_SECRET,
  //   callbackURL: TWITCH_REDIRECT_URI,
  //   scope: 'user_read'
  // }, function(accessToken, refreshToken, profile, done) {
  //   var now = Date.now();

  //   findOrCreate({
  //     twitch_id: profile.id
  //   }, {
  //     created_at: now,
  //     updated_at: now,
  //     type: 'peon',
  //     roles: null,
  //     deathmatch_id: now + profile.id,
  //     muted: false,
  //     blinded: false,
  //     banned: false,
  //     duels_accepted: 0,
  //     duels_declined: 0,
  //     wtfs: 1000,
  //     email: profile.email,
  //     steam_id: null,
  //     twitch_id: profile.id,
  //     display_name: profile.displayName,
  //     steam_avatar: null,
  //     twitch_avatar: profile._json.logo,
  //     deathmatch_avatar: null
  //   }, function(err, user) {
  //     if (err) {
  //       console.error('db error', err);
  //       return done(err);
  //     }
  //     console.log('found or created user', user);
  //     return done(null, user);
  //   });
  // }));

  // make passport accessible for various routes
  this.set('passport', passport);
};
