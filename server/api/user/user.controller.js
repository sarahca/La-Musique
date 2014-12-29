

'use strict';

var User = require('./user.model');

exports.register = function (req, res) {
  console.log('in register');
  var newUser = new User();
  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  var controller = this;
  newUser.save(function(err){
    if ( err ) {
      res.send(400,{ message: 'username and email are already used'} )
      console.log('username and email are already used');
    }
    else {
      res.send(200, {message: 'new account successfully created'});
    }
  })
}

exports.login = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  console.log('in login');

  var o = { 'email': email, 'password': password}
  var query  = User.where(o);
  query.findOne(function ( err, user) {
    if ( err || !user )
      res.send(404, {message: "this account doesn't seem to exist. Register? " });
    else {
      console.log(user);
      req.session.userId = user._id;
      res.send(200, {message: 'loggin successful '});
    }
  })
}

exports.isLoggedIn = function (req, res ) {
  var userId = req.session.userId;
  if ( userId )
    res.send(200, {});
  else
    res.send(401, {});
}

exports.logout = function (req, res) {
  req.session = null;
  res.send(200, {});
}

function handleError(res, err) {
  return res.send(500, err);
}