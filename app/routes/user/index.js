

module.exports = function() {

  this.put('/user/:userid', function(req, res) {
    this.get('users.findOne')({
      _id: req.params.userid
    }, function(err, user) {
      if (err) return res.status(500).json(err);
      if (user.deathmatch_id !== parseInt(req.body.deathmatch, 10)) {
        return res.status(401).json({
          error: true,
          message: 'unauthorised'
        });
      }
      this.get('users.updateOne')({
        _id: req.params.userid
      }, {
        $set: {
          email: req.body.email,
          display_name: req.body.displayname
        }
      }, function(err, user) {
        if (err) return res.status(500).json(err);
        res.status(200).json({
          error: false,
          user: user
        });
      });
    }.bind(this));
  }.bind(this));

  this.delete('/user/:userid', function(req, res) {
    this.get('users.findOne')({
      _id: req.params.userid
    }, function(err, user) {
      if (err) res.status(500).json(err);
      if (user.deathmatch_id !== parseInt(req.body.deathmatch, 10)) {
        return res.status(401).json({
          error: true,
          message: 'unauthorised'
        });
      }
      this.get('users.deleteOne')({
        _id: req.params.userid
      }, function(err, user) {
        if (err) res.status(500).json(err);
        res.status(200).json({
          error: false
        });
      });
    }.bind(this));
  }.bind(this));
};
