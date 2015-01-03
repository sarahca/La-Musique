'use strict';

var Music = require('./music.model');
var amazon_scraper = require('../../components/amazon_scraper/amazon_scraper.js'); // require amazon scraper function
//var events = require('../../components/events/events.js');

//var sendNextSongEmitter = new EventEmitter();

 function getRandomSongByGenre(genre, callback) {
   var query = {genre: {$regex: ".*" + genre + ".*"}};

  Music.find(query).count(function(err, count) {
    if ( err ) {
      console.log(err);
      callback({message: err}, null);
    }
    else {
      var skip = Math.floor(Math.random() * count);
      Music.findOne(query).skip(skip).exec(function (err, song) {
        if ( err )
          callback({message: err}, null);
        if (song) {
          amazon_scraper(song.artist, song.title, function(songID) {
            var outSong = JSON.parse(JSON.stringify(song));
            outSong.amazonId = songID;
            callback(null, outSong);
          });
        }
      })
    }
  }); 
}
exports.getRandomSongByGenre = getRandomSongByGenre;

// events.on("get-next-song", function (data) {
//   console.log("  =====>   get-next-song event received for data " + data.genre);
//   getRandomSongByGenre(data.genre, function(err, song) {
//     if (!err)
//       console.log("  =====>   " + JSON.stringify(song));
//   });
// });

function processHttpGetRandomSongByGenre(req, res) {
  console.log('getting song by Genre');
  var genre = req.params.genre;
  getRandomSongByGenre(genre, function (err, song) {
    if (err)
      res.send(500, err);
    else
      res.send(200, song);
  }); 
}
exports.processHttpGetRandomSongByGenre = processHttpGetRandomSongByGenre