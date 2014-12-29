var async = require('async');
var getRoom = require('./room.js').getRoom;

function PlayerSocket(socket){
  this.room = null;
  this.nickname = null;
  this.socket = socket;
  this.points = 42;
  this.gems = 0;

  var self = this;

  // player joins a channel ie a room
  this.socket.on('join_channel', function (data) {
    var d = JSON.parse(data);
    var channel = d['channel'];

    console.log('Joining channel ' + channel);
    self.room = getRoom(channel);
    self.room.addPlayer(self);
  });


  // player posts a message- message received in json format and saved as a JS object
  this.socket.on('post_message', function (data) {
    var d = JSON.parse(data);
    console.log('post message ' + data);
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
    if ( d['command'] == 'nickname' )
      self.room.changeNickname(self, d['new_nickname']);
  });
};

// messages are received as an object and sent to front-end in json format
PlayerSocket.prototype.receiveMessage = function (message) {
  var jsonMessage = JSON.stringify(message);
  this.socket.emit('new_message', jsonMessage);
};

PlayerSocket.prototype.getChatHistory = function(){
  var channelKeys = this.room.channel +'-*';
  var lastMessages = this.room.getMessages(this.socket);
  async.each(lastMessages, function(message) {
    this.socket.emit('new_message', message);
  });
};


module.exports = PlayerSocket;