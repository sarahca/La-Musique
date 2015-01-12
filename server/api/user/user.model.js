'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String},
  email: {type: String},
  password: {type: String},
  points: {type: Number, default: 0},
  gems: {type: Number, default: 0}
});

UserSchema.index({username: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});

UserSchema.path('email').validate(function(value, fn) {
  var UserModel = mongoose.model('User');
  UserModel.find({'email': value.toLowerCase()}, function (err, emails) {
    fn(err || emails.length === 0);
  });
}, 'This email is already associated with an account. Sign in?');

UserSchema.path('username').validate(function(value, fn) {
  var UserModel = mongoose.model('User');
  UserModel.find({'username': value.toLowerCase()}, function (err, emails) {
    fn(err || emails.length === 0);
  });
}, 'Sorry, this username has already been used');


module.exports = mongoose.model('User', UserSchema);