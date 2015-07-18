
var failureRedirect = {
  failureRedirect: '/login'
};

module.exports = function() {

  var passport = this.get('passport');

  this.get('/auth/steam', passport.authenticate('steam'));

  this.get('/auth/twitch', passport.authenticate('twitchtv', {
    scope: ['user_read']
  }));

  this.get('/auth/steam/callback', passport.authenticate(
    'steam', failureRedirect
  ), function(req, res) {
    res.redirect('/');
  });

  this.get('/auth/twitch/callback', passport.authenticate(
    'twitchtv', failureRedirect
  ), function(req, res) {
    res.redirect('/');
  });
};
