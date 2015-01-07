var async = require('async');
var getRoom = require('./room.js').getRoom;
var request = require('request');
var user = require('./../../api/user/user.controller.js');

var music = require('./../../api/music/music.controller.js');


function PlayerSocket(socket){
  this.room = null;
  this.nickname = null;
  this.socket = socket;
  this.points = 0;
  this.gems = 0;
  this.username;

  var self = this;

  // player joins a channel ie a room
  this.socket.on('join_channel', function (data) {
    var d = JSON.parse(data);
    if (d['username'])
      self.username = d['username'];
    var channel = d['channel'];
    self.room = getRoom(channel);
    self.nickname = d['nickname'];
    self.room.addPlayer(self);
  });


  // player posts a message- message received in json format and saved as a JS object
  this.socket.on('post_message', function (data) {

    var d = JSON.parse(data);
    d['nickname'] = self.nickname;
    d['message_type'] = 'message';
    self.room.saveAndPublishMessage(d);
  });

  // player leaves the channel ie the room
  this.socket.on('disconnect', function () {
    if (self.room)
      self.room.removePlayer(self);
   });


  this.socket.on('command', function (data) {
    var d = JSON.parse(data);
    switch(d['command']) {
      case 'nickname':
        self.room.changeNickname(self, d['new_nickname']);
        break;
      case 'new song request':
        console.log('player requested new song');
        self.room.processNextSongRequestMessage(self, d);
        break;
      case 'submit guess':
        self.room.processGuessTime(self, d);
        break;
      case 'almost right answer':
        self.room.submitFeedback(self, d);
        break;
      case 'answer already submitted':
        self.room.answerAlreadyRegistered(self);
        break;
      case 'guess after end':
        self.room.guessedTooLate(self);
        break;
      case 'invalid nickname':
        self.room.invalidNickname(self);
        break;
    }    

  });
};

// messages are received as an object and sent to front-end in json format
PlayerSocket.prototype.receiveMessage = function (message) {
  var jsonMessage = JSON.stringify(message);
  if (message['message_type'] == 'command') {
    this.socket.emit('command', jsonMessage);
  }
  else
    this.socket.emit('new_message', jsonMessage);
};



PlayerSocket.prototype.getChatHistory = function(){
  var channelKeys = 'message' + this.room.channel +'-*';
  var lastMessages = this.room.getMessages(this.socket);
  async.each(lastMessages, function(message) {
    this.socket.emit('new_message', message);
  });
};

PlayerSocket.prototype.getNextSong = function (genre, callback) {
  music.getRandomSongByGenre(genre, function (err, song ){
    callback(err, song);
  });
};

PlayerSocket.prototype.updatePoints = function(points, callback){
  if (this.username != 'New Player'){
    user.updatePoints(this, points, callback);
  }
};

module.exports = PlayerSocket;