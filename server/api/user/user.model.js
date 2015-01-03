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


module.exports = mongoose.model('User', UserSchema);