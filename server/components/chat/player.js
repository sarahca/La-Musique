var async = require('async');
var getRoom = require('./room.js').getRoom;
var request = require('request');
//var events = require('../events/events.js');

var music = require('./../../api/music/music.controller.js');


function PlayerSocket(socket){
  this.room = null;
  this.nickname = null;
  this.socket = socket;
  this.points = 0;
  this.gems = 0;

  var self = this;

  // player joins a channel ie a room
  this.socket.on('join_channel', function (data) {
    var d = JSON.parse(data);
    var channel = d['channel'];
    console.log('Joining channel ' + channel + ' by ' + d['nickname']);
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
        self.room.processNextSongRequestMessage(self, d);
        break;
      case 'submit guess':
        self.room.processGuessTime(self, d);
        break;
    }    
  });
};

// messages are received as an object and sent to front-end in json format
PlayerSocket.prototype.receiveMessage = function (message) {
  var jsonMessage = JSON.stringify(message);
  if (message['message_type'] == 'command') {
    console.log('emitting nnew command ' + message['command']);
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
}

module.exports = PlayerSocket;