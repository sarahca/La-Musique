var redisLib = require("redis");
var async = require('async');

//connection to Redis database
// var credentials = {"host": "127.0.0.1", "port": 6379 };
// var redisClient = redis_lib.createClient(credentials.port, credentials.host);

var rooms = {};

function getRoom(channel) {
  if (!(channel in rooms))
    rooms[channel] = new Room(channel, null);
  return rooms[channel];
}

function Room(channel, owner) {
  this.channel = channel;
  this.owner = owner;
  this.players = [];
  this.colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
  this.redisSub = redisLib.createClient();
  this.redisPub = redisLib.createClient();
  this.redisSub.subscribe(this.channel);

  var room = this;
  // redis
  this.redisSub.on('message', function(channel, data) {
    var message = JSON.parse(data);
    console.log('From redis: ' + message['text']);
    room.broadcast(message);
  });

  console.log('Room ' + channel + ' created');
}

Room.prototype.addPlayer = function(player){
  if ( this.owner === null ) {
    this.owner = player;
  }
  var room = this;

  async.timesSeries(20, function (n, next) {
    var nickname = 'Player ' + (n + 1);
    //in redis, save set of users in the room
    room.redisPub.sadd('users-' + room.channel, nickname, function(err, inserted) {
      console.log(nickname + ' inserted ' + inserted + ' err ' + err);
      if (inserted == 1)
        next(nickname, null);
      else
        next(null, null);
    });

  }, function (nickname, vals) {
    if (!nickname)
      console.log('Too many players in this channel ({0})'.format(room.channel));    
    else {
      player.nickname = nickname;
      room.welcomeNewPlayer(player);
      room.players.push(player);
      room.joinNoticeMessage(player);
    }
  });
}

//greet new player
Room.prototype.welcomeNewPlayer = function(player) {
  var message = {
    text: 'Welcome ' + player.nickname
  };
  player.receiveMessage(message);
}

// broadcast message to everyone except player when someone joined the room
Room.prototype.joinNoticeMessage = function(player) {
  console.log('in join notice message');
  var message = {
    'text': player.nickname + ' joined the room',
    'exclude_users': [ player.nickname ]
  };
  this.saveAndPublishMessage(message);
}

//broadcast message to everyone (except player) when someone leaves the room
Room.prototype.leaveNoticeMessage = function(player){
  var message = {
    'text': player.nickname + ' left the room.',
    'exclude_users': [ player.nickname ]
  }
  this.saveAndPublishMessage(message);
}


//add method to redisClient to save message in a DB- data is a JS object
Room.prototype.saveAndPublishMessage = function(data) {
  var jsonData = JSON.stringify(data);
  var timestamp = Date.now();
  var key = this.channel + '-' + timestamp;
  var room = this;

  room.redisPub.set(key , jsonData, function(err, res){
    if ( err ){
      console.log("couldn't add message to redis database");
    }
    else {
      console.log('record was created');
      console.log('To redis: ' + room.redisPub.get(key));
      room.redisPub.publish(room.channel, jsonData);
    }
  });
};

Room.prototype.broadcast = function (message) {
  async.each(this.players, function (player) {
    if (message['exclude_users'].indexOf(player.nickname) == -1)
      player.receiveMessage(message);
  });
};

Room.prototype.removePlayer = function(player) {
  var room = this;
  console.log('=======  in room.removePlayer method ====');
  console.log(room.channel);
  room.redisPub.scard('users-' + room.channel, function(err, res) {
    if ( ! err ) {
      console.log('room currently has ' + res + ' players.');
    }
  });
  for ( var i = 0; i < room.players.length; i++ ) {
    if (player.room.players[i].nickname === player.nickname ) {
      room.players.splice(i, 1);
      console.log('room removed 1 player');
      room.redisPub.srem('users-' + room.channel, player.nickname, function(err, res){
        if ( ! err ) {
          room.leaveNoticeMessage(player);
          room.isEmpty();
          console.log('Player was successfully removed from the room');
          room.redisPub.scard('users-' + room.channel, function(err, res) {
            if ( !err )
              console.log('room now has ' + res + ' players.');
          });
        }
      });
    }
  }
}

Room.prototype.getMessages = function(socket) {
  var messages = [];
  redisClient.keys(this.channel + '-*', function(err, keys){
    console.log('getting history from redis');
    console.log('nb of keys in history ' + keys.length);
    console.log('before sort ' + keys);
    keys = keys.sort();
    async.each(keys, function (x) {
      console.log('history key ' + x);
      redisClient.get(x, function (err, value) {
        if ( err )
          console.log('err while getting history from redis');
        else {
          messages.push(value);
          console.log(' -> ' + value);
          // socket.emit('new_message', value);         
        }
      });
    });
  });
  return messages;
}


Room.prototype.isEmpty = function() {
  var room = this;
  this.redisPub.scard('users-' + this.channel, function(err, res) {
    if ( !err  && ( res == 0) ) {
      console.log('room is empty');
      room.redisPub.keys(room.channel + '-*', function(err, keys){
        async.each(keys, function (key) {
          room.redisPub.del(key, function(err, res) {
            if ( err ) 
              console.log('error while trying to delete message ' + key);
            else
              console.log('successfully deleted key ' + key);
          });
        });
      });
    }
  });
}

exports.getRoom = getRoom;