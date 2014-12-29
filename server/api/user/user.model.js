'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  points: Number,
  gems: Number
});

UserSchema.index({username: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});


module.exports = mongoose.model('User', UserSchema);