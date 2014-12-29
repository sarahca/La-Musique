'use strict';

var Music = require('./music.model');
var amazon_scraper = require('../../components/amazon_scraper/amazon_scraper.js'); // require amazon scraper function

exports.getRandomSongByGenre = function (req, res) {
  console.log('getting song by Genre');
  var genre = req.params.genre;
  console.log(genre);
  var query = {genre: {$regex: ".*" + genre + ".*"}};

  Music.find(query).count(function(err, count) {
    if ( err ) {
      console.log(err);
      res.send(500, {message: err});
    }
    else {
      var skip = Math.floor(Math.random() * count);
      Music.findOne(query).skip(skip).exec(function (err, song) {
        if ( err )
          res.send(500, {message: err});
        else {
          amazon_scraper(song.artist, song.title, function(songID) {
            var outSong = JSON.parse(JSON.stringify(song));
            outSong.amazonId = songID;
            res.send(200, outSong);
          });
        }
      })
    }
  });  
}