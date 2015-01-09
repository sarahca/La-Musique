var mongo = require('mongodb');
//var config = require('../config/environment');
var monk = require('monk');
//var db = monk(config.mongo.uri);
var db = monk('mongodb://localhost/lamusique-dev');
var collection = db.get('musics');
var async = require('async');

var songs = [
  {artist: 'LYNYRD SKYNYRD' , title: 'Sweet Home Alabama', genre: 'rock'},
  {artist: 'the beatles' , title: 'come together', genre: 'rock'},
  {artist: 'Katy Perry' , title: 'Hot N Cold', genre: 'rock'},
  {artist: 'The Verve' , title: 'Bitter Sweet Symphony', genre: 'rock'},
  {artist: 'Garbage' , title: 'Queer', genre: 'rock'},
  {artist: 'Eagles' , title: 'hotel california', genre: 'rock'},
  {artist: 'coldplay' , title: 'clocks', genre: 'rock'},
  {artist: 'radiohead' , title: 'creep', genre: 'rock'},
  {artist: 'garbage' , title: 'stupid girl', genre: 'rock'},
  {artist: 'radiohead' , title: 'paranoid android', genre: 'rock'},
  {artist: 'the cranberries' , title: 'zombie', genre: 'rock'},
  {artist: 'coldplay' , title: 'fix you', genre: 'rock'},
  {artist: 'foreigner' , title: 'hot blooded', genre: 'rock'},
  {artist: 'the beatles' , title: 'yesterday', genre: 'rock'},
  {artist: 'muse' , title: 'new born', genre: 'rock'},
  {artist: 'the killers' , title: 'somebody told me', genre: 'rock'},
  {artist: 'metallica' , title: 'nothing else matters', genre: 'rock'},
  {artist: 'foo fighters' , title: 'everlong', genre: 'rock'},
  {artist: 'foreigner' , title: 'urgent', genre: 'rock'},
  {artist: 'depeche mode' , title: 'enjoy the silence', genre: 'rock'},
  {artist: 'cardigans' , title: 'lovefool', genre: 'rock'},
  {artist: 'radiohead' , title: 'karma police', genre: 'rock'},
  {artist: 'queen' , title: 'radio ga ga', genre: 'rock'}, // pop
  {artist: 'abba' , title: 'dancing queen', genre: 'pop'},
  {artist: 'rihanna' , title: 'umbrella', genre: 'pop'},
  {artist: 'seal' , title: 'crazy', genre: 'pop'},
  {artist: 'no doubt' , title: 'just a girl', genre: 'pop'},
  {artist: 'lady gaga' , title: 'bad romance', genre: 'pop'},
  {artist: 'fugees' , title: 'ready or not', genre: 'pop'},
  {artist: 'ace of base' , title: 'beautiful life', genre: 'pop'},
  {artist: 'michael jackson' , title: 'heal the world', genre: 'pop'},
  {artist: 'ace of base' , title: 'happy nation', genre: 'pop'},
  {artist: 'phils collins' , title: 'two hearts', genre: 'pop'},
  {artist: 'britney spears' , title: 'womanizer', genre: 'pop'},
  {artist: 'gwen stefani' , title: 'the sweet escape', genre: 'pop'},
  {artist: 'adele' , title: 'skyfall', genre: 'pop'},
  {artist: 'fugees' , title: 'killing me softly', genre: 'pop'},
  {artist: 'snow patrol' , title: 'crack the shutters', genre: 'pop'},
  {artist: 'michael jackson' , title: 'black or white', genre: 'pop'},
  {artist: 'spice girls' , title: 'wannabe', genre: 'pop'},
  {artist: 'cher' , title: 'believe', genre: 'pop'},
  {artist: 'lady gaga' , title: 'poker face', genre: 'pop'},
  {artist: 'rihanna' , title: 'diamonds', genre: 'pop'},
  {artist: 'savage garden' , title: 'i want you', genre: 'pop'},
  {artist: 'michael jackson' , title: 'bad', genre: 'pop'},
  {artist: 'Katy Perry' , title: 'roar', genre: 'rock'},
  {artist: 'oasis' , title: 'live forever', genre: 'pop'},
  {artist: 'aqua' , title: 'barbie girl', genre: 'pop'},
  {artist: 'ace of base' , title: 'the sign', genre: 'pop'},
  {artist: 'phil collins' , title: 'sussudio', genre: 'pop'},
  {artist: 'rihanna' , title: 'disturbia', genre: 'pop'},
  {artist: 'coldplay' , title: 'yellow', genre: 'pop'},
  {artist: 'abba' , title: 'mamma mia', genre: 'pop'},
  {artist: 'adele' , title: 'someone like you', genre: 'pop'},
  {artist: 'snow patrol' , title: 'chasing cars', genre: 'pop'}, // aternative
  {artist: 'the white stripes' , title: 'seven nation army', genre: 'alternative'},
  {artist: 'lana del rey' , title: 'young and beautiful', genre: 'alternative'},
  {artist: 'capital cities' , title: 'safe and sound', genre: 'alternative'},
  {artist: 'ace of base' , title: 'cruel summer', genre: 'pop'},
  {artist: 'coldplay' , title: 'miracles', genre: 'alternative'},
  {artist: 'muse' , title: 'unintended', genre: 'alternative'},
  {artist: 'foster the people' , title: 'coming of age', genre: 'alternative'},
  {artist: 'muse' , title: 'feeling good', genre: 'alternative'},
  {artist: 'lana del rey' , title: 'born to die', genre: 'alternative'},
  {artist: 'muse' , title: 'madness', genre: 'alternative'},
  {artist: 'foster the people' , title: 'pumped up kicks', genre: 'alternative'},
  {artist: 'the strokes' , title: 'last nite', genre: 'alternative'},
  {artist: 'franz ferdinand' , title: 'take me out', genre: 'alternative'},
  {artist: 'gnarls barkley' , title: 'crazy', genre: 'alternative'},
  {artist: 'muse' , title: 'plug in baby', genre: 'alternative'},
  {artist: 'gorillaz' , title: 'feel good inc', genre: 'alternative'},
  {artist: 'eminem' , title: 'my name is', genre: 'alternative'},
  {artist: 'kings of leon' , title: 'use somebody', genre: 'alternative'},
  {artist: 'house of pain' , title: 'jump around', genre: 'alternative'},
  {artist: 'muse' , title: 'knights of cydonia', genre: 'alternative'},
  {artist: 'oasis' , title: 'live forever', genre: 'alternative'}, // r-and-b
  {artist: 'stevie wonder' , title: 'pastime paradise', genre: 'r-and-b'},
  {artist: 'beyonce' , title: 'drunk in love', genre: 'r-and-b'},
  {artist: 'alicia keys' , title: 'no one', genre: 'r-and-b'},
  {artist: 'chris brown' , title: 'take you down', genre: 'r-and-b'},
];

function createPlaylist(songs, callback){
  async.each(songs, function (song, callback) {
    collection.insert(
      {
        "title" : song.title.toLowerCase().trim(),
        "artist" : song.artist.toLowerCase().trim(),
        "genre" : song.genre.toLowerCase().trim()
      }, function( err, doc){
        if (err)
          callback('mongo insert error ' + err);
        else
          callback(' new song added');
      });
  });
}

function consoleMessage(text) {
  console.log(text);
}

createPlaylist(songs, consoleMessage);