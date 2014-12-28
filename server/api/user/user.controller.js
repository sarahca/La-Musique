/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var User = require('./user.model');

// Get list of things
// exports.index = function(req, res) {
//   Thing.find(function (err, things) {
//     if(err) { return handleError(res, err); }
//     return res.json(200, things);
//   });
// };

// // Get a single thing
// exports.show = function(req, res) {
//   Thing.findById(req.params.id, function (err, thing) {
//     if(err) { return handleError(res, err); }
//     if(!thing) { return res.send(404); }
//     return res.json(thing);
//   });
// };

// // Creates a new thing in the DB.
// exports.create = function(req, res) {
//   Thing.create(req.body, function(err, thing) {
//     if(err) { return handleError(res, err); }
//     return res.json(201, thing);
//   });
// };

// // Updates an existing thing in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Thing.findById(req.params.id, function (err, thing) {
//     if (err) { return handleError(res, err); }
//     if(!thing) { return res.send(404); }
//     var updated = _.merge(thing, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.json(200, thing);
//     });
//   });
// };

// // Deletes a thing from the DB.
// exports.destroy = function(req, res) {
//   Thing.findById(req.params.id, function (err, thing) {
//     if(err) { return handleError(res, err); }
//     if(!thing) { return res.send(404); }
//     thing.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.send(204);
//     });
//   });
// };

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
  var password = req.body.email;
  console.log('in login');
  var query  = User.where({ 'email': email, 'password': password});
  query.findOne(function ( err, user) {
    if ( err )
      res.send(404, {message: "this account doesn't seem to exist. Register?"});
    else
      res.send(200, {message: 'loggin successful'});
  })
}

function handleError(res, err) {
  return res.send(500, err);
}