'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MusicSchema = new Schema({
  title: String,
  artist: String,
  genre: String
});

MusicSchema.index({title: 1, artist: 1}, {unique: true});

module.exports = mongoose.model('Music', MusicSchema);