var config = require('../config/environment');

var genres = ['country-songs', 'pop-songs', 'rock-songs', 'alternative-songs', 'r-and-b-songs'];
var extraGenres = ['dance-electronic-songs', 'latin-songs', 'latin-pop-songs', 'hot-holiday-songs', 'jazz-songs'];
var albumsGenres = ['Different Shades Of Blue'];

// class of the span for songs are 'chart_position position-static'
// vs for albums 'chart_position position-static position-greatest-gains'

var baseUrl = 'http://www.billboard.com';
var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var async = require('async');

// connect to Mongo database
var mongo = require('mongodb');
var monk = require('monk');
//var db = monk('localhost:27017/music');
//var db = monk('mongodb://localhost/lamusique-dev');
var db = monk(config.mongo.uri);
var collection = db.get('musics');


function severalWeeksOfCharts(numberWeeks, genre, done){

  var getNextWeek = function (week) {
    if (numberWeeks--) {
      console.log('new week: ' + week);
      var weekUrl = baseUrl + week;
      getData2(weekUrl, genre, getNextWeek);
    }
    else {
      done();
    }
  };
  getData2(baseUrl + '/charts/' + genre, genre, getNextWeek);
}

function getData2(url, genre, done) {
  request(url, function(err, res, body) {
    if (err || res.statusCode != 200)
      done();

    $ = cheerio.load(body);

    var previousDate = $('.prev a').attr('href');
    var songs = $(".listing.chart_listing article.song_review header");

    var songsCount = songs.length;
    var eachSongCallBack = function () {
      if (!--songsCount) {
        done(previousDate);
      }
    };
    songs.each(function(i,elem) {
      var song = $(elem);
      var title = song.children("h1").first().text().trim().toLowerCase();
      var artist = song.find(".chart_info a").first().text().trim().toLowerCase();     
      //console.log(title + '-' + artist);
      title = removeFeaturing(title);
      artist = removeFeaturing(artist);
      // take only title/artist of max 3 words
      if (countWords(title) && countWords(artist))
        addSongToPlaylist(title, artist, genre, eachSongCallBack);
      else
        eachSongCallBack();
    });
  });
}

function addSongToPlaylist(title, artist, genre, done) {
  async.series([
    function (callback) {
      if ( !validData(title, artist) )
        callback('invalid data', null);
      else
        callback(null, null);
    },
    function (callback) {
      collection.findOne({"title": title, "artist": artist},
        function (err, result) {
          if (err)
            callback('mongo findOne error' + err, null);
          else if ( result )
            callback(title + ' already exists', null);
          else
            callback(null, null);
        }
      );
    },
    function (callback) {
      collection.insert(
        {
          "title" : title.trim(),
          "artist" : artist.trim(),
          "genre" : genre.trim()
        },
        function (err, doc) {
          if (err)
            callback('mongo insert error ' + err);
          else
            callback(null, null);
        }
      );
    }
  ], function (err, results) {
    if (err)
      console.log(artist + ' - ' + title + ': ' + err);
    done();
  });
}

//filters complicated titles or authors
// returns FALSE if data is NOT VALID
function validData(title, artist) { 
  var goodRegex = /^[a-zA-Z ]+$/;
  //var badRegex = /(featuring|DJ)/;
  var badRegex = /dj/;

  return (goodRegex.test(title) && goodRegex.test(artist) &&
    !badRegex.test(title) && !badRegex.test(artist));
}

function countWords(string){
  var wordsArray = string.split(" ");
  return ((wordsArray.length <= 3) && validLengthWordArray(wordsArray));
}

function removeFeaturing(string) {
  var featuringIndex = string.indexOf('featuring');
  if (featuringIndex != -1)
    return string.substring(0, featuringIndex).trim();
  else {
    return string;
  }
}

function validLengthWordArray(wordsArray){
  for (var x in wordsArray) {
    if (wordsArray[x].length > 9){
      console.log ("====== " + wordsArray[x] + ' is too long');
      return false;
    }
  }
  return true;
}


// MAIN method
async.each(genres, function (genre, callback) {
  severalWeeksOfCharts(100, genre, callback);
}, function (err) {
  db.close();
});