
var failureRedirect = {
  failureRedirect: '/login'
};

var TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
var STEAM_REDIRECT_URI = process.env.STEAM_REDIRECT_URI;

module.exports = function() {

  var passport = this.get('passport');

  this.get('/auth/steam', passport.authenticate('steam'));

  this.get('/auth/twitch', passport.authenticate('twitchtv', {
    scope: ['user_read']
  }));

  this.get(
    process.env.STEAM_REDIRECT_URI,
    passport.authenticate('steam', failureRedirect),
    function(req, res) {
      res.redirect('/');
    }
  );

  this.get(
    process.env.TWITCH_REDIRECT_URI,
    passport.authenticate('twitchtv', failureRedirect),
    function(req, res) {
      res.redirect('/');
    }
  );
};
