

'use strict';

var User = require('./user.model');

exports.register = function (req, res) {
  console.log('in register');
  var newUser = new User();
  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  var controller = this;
  newUser.save(function(err, user){
    if ( err ) {
      console.log('user save ' + JSON.stringify(err.errors));
      //res.send(400,JSON.stringify({ message: 'username and email are already used'}) )
      //console.log('username and email are already used');
      res.send(400, JSON.stringify(err.errors));
    }
    else {
      var data = {
        'message': 'new account successfully created',
        'user-id': user._id,
        'user-username': user.username,
        'user-points': user.points,
        'user-gems': user.gems
      };
      res.send(200, JSON.stringify(data) );
    }
  })
}

exports.updatePoints = function(player, newPoints, callback) {
  var criteria = {'username': player.username};
  User.findOne(criteria, function(err, user){
    if (err)
      console.log("an error occured " + err);
    if (user) {
      user.points += newPoints;
      user.save( function (err, user){
        if (err)
          console.log("couldn't save changes " + err);
        else
          callback(user.points);
      })
    }
    if (!user)
      console.log("couldn't find this user in the db");
  });
}

exports.login = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  console.log('in login');

  var o = { 'email': email, 'password': password}
  var query  = User.where(o);
  query.findOne(function ( err, user) {
    if ( err || !user ){
      console.log('error in login ' + err);
      res.send(404, JSON.stringify({message: "This account doesn't seem to exist. Register?"}));
    }
    else {
      console.log(user);
      req.session.userId = user._id;
      req.session.username = user.username;
      var data = {
        'message': 'loggin successful ',
        'user-username': user.username,
        'user-id': user._id,
        'user.points': user.points,
        'user-gems': user.gems
      };
      res.send(200, JSON.stringify(data));
    }
  })
}

exports.isLoggedIn = function (req, res ) {
  var userId = req.session.userId;
  if ( userId ) {
    var query = User.where({'_id' : userId});
    query.findOne(function (err, user){
      if ( !err && user){
        var data = {
          'message': 'already logged in',
          'user-username': user.username,
          'user-id': userId,
          'user-points': user.points,
          'user-gems': user.gems
        };
        res.send(200, JSON.stringify(data));
      }
    });   
  }
  else
    res.send(401, JSON.stringify({}));
}

exports.logout = function (req, res) {
  req.session = null;
  res.send(200, JSON.stringify({}));
}

function handleError(res, err) {
  return res.send(500, err);
}