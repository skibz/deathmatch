
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
}

module.exports = function() {
  this.get('/', ensureAuthenticated, function(req, res) {
    res.render('index', {
      user: req.user
    });
  });

  this.get('/login', function(req, res) {
    res.render('login', {
      user: req.user
    });
  });

  this.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};
