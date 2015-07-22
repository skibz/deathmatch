

module.exports = function() {

  this.put('/user/:userid', function(req, res) {
    this.get('users.findOne', {
      deathmatch_id: req.body.deathmatch
    }, function(err, user) {
      if (err) throw err; // res.status 500 and json error object
      if (user._id === req.params.userid) {
        this.get('users.updateOne')({
          _id: req.params.userid
        }, {
          email: req.body.email,
          display_name: req.body.displayname
        }, function(err, user) {
          if (err) throw err; // res.status 500 and json error
          res.status(200).json({
            error: false
          });
        });
      }
    }.bind(this));

  }.bind(this));

  this.delete('/user/:userid', function(req, res) {
    this.get('users.findOne', {
      deathmatch_id: req.body.deathmatch
    }, function(err, user) {
      if (err) throw err; // res.status 500 and json error object
      if (user._id === req.params.userid) {
        this.get('users.deleteOne')({
          _id: req.params.userid
        }, function(err, user) {
          if (err) throw err; // res.status 500 and json error
          res.status(200).json({
            error: false
          });
        });
      }
    }.bind(this));
  }.bind(this));

};
