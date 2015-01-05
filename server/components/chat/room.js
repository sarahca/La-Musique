var redisLib = require("redis");
var async = require('async');
var config = require('../../config/environment');

var rooms = {}; // keep list of all channels on this server
var room; // keep a reference of the Room object


function getRoom(channel) {
  if (!(channel in rooms))
    rooms[channel] = new Room(channel);
  return rooms[channel];
}

function Room(channel) {
  this.channel = channel;
  this.players = [];
  this.redisSub = redisLib.createClient(6379, config.redis.hostname);
  this.redisPub = redisLib.createClient(6379, config.redis.hostname);
  this.redisSub.subscribe(this.channel);

  this.redisSub.on('message', function(channel, data) {
    var message = JSON.parse(data);
    console.log('From redis: ' + data);
    room.broadcast(message);
  });
  console.log('Room ' + channel + ' created');
  room = this; // keep a reference to the Room object
}

Room.prototype.addPlayer = function(player){  
  if ( player.nickname ) {
    room.redisPub.sadd('users-' + room.channel, player.nickname, function(err, inserted) {
      console.log(player.nickname + ' inserted ' + inserted + ' err ' + err);
      if (inserted == 0) {
        room.getRandomNickname(player, player.nickname);
      }
      else {
        room.redisPub.set('user-' + room.channel + '-' + player.nickname, Date.now(), function(err, inserted){
          if (!err && inserted) {
            room.newPlayerSetUp(player);
          }
        });
      }
    });
  }
  else {
    room.getRandomNickname(player, 'Player');
  }
}

Room.prototype.getRandomNickname = function(player, nickname) {

  async.timesSeries(20, function (n, next) {
    var potentialNickname = nickname + ' ' + (n + 1);
    //in redis, save set of users in the room- gives default nickname to new player
    room.redisPub.sadd('users-' + room.channel, potentialNickname, function(err, inserted) {
      if (inserted == 1)
        next(potentialNickname, null);
      else
        next(null, null);
    });

    }, function (nicknameFound, vals) {
      if (!nicknameFound)
        console.log('Too many players in this channel ({0})'.format(room.channel));    
      else {
        //keep track of players on the channel and time they joined
        room.redisPub.set('user-' + room.channel + '-' + nicknameFound, Date.now(), function(err, inserted){
          if (!err && inserted) {
            player.nickname = nicknameFound;
            room.newPlayerSetUp(player);
          }
        });     
      }
    }
  );
}
    

// helper method for new players
Room.prototype.newPlayerSetUp = function (player) {
  room.welcomeNewPlayer(player);
  room.players.push(player);
  room.joinNoticeMessage(player);
  room.redisPub.get('admin-' + room.channel, function(err, res){
    if ( err ){
      console.log("couldn't get current admin");
    }
    if (res == null) {
      console.log('no admin yet');
      room.redisPub.set('admin-' + room.channel, player.nickname, function(err, res){
        if ( err ){
          console.log("couldn't set new admin");
        }
        else {
          console.log('channel admin was updated');
          room.adminPlayerGreeting(player);
        }
      });
    }
  });
};

// helper method: get player from players based on nickname
Room.prototype.getPlayerFromPlayersList = function (nickname ) {
  return room.players.filter(function (player) {
    return (player.nickname == nickname);
  });
}


// set owner of the room ie admin player = first person to join the channel
Room.prototype.setAdminPlayer = function() {
  var keys, keysValues, keyValueObject, adminNickname;
  room.redisPub.keys('user-' + room.channel + '-*', function(err, replies) {
    console.log(replies);
    if ( !err && replies) {
      keys = replies;
      room.redisPub.mget(replies, function(err, values){
        if ( !err && values) {
          console.log(values);
          keysValues = values;

          keyValueObject = new Object(); // create an object to store key/value pairs as ppty/value
          for (var i = 0; i < keysValues.length; i++)
            keyValueObject[keys[i]] = keysValues[i];

          // sort keys to find out which player joined first
          var keysSorted = Object.keys(keyValueObject).sort(function(a,b){ return keyValueObject[a] - keyValueObject[b]});
          var adminKey = keysSorted[0];
          var regexExp = /user-(.*)-(.*)/g;
          var match = regexExp.exec(adminKey);
          adminNickname =  match[2];
          //save admin in redis
          room.redisPub.set('admin-' + room.channel, adminNickname, function(err, res){
            if ( err ){
              console.log("couldn't set new admin");
            }
            else {
              console.log('channel admin was updated');
            }
          });
          // inform admin
          room.redisPub.get('admin-' + room.channel, function(err, res){
            if ( !err && res ){
              var adminPlayerInRoom = room.getPlayerFromPlayersList(res); // check if admin is in this room
              if ( adminPlayerInRoom ) {
                console.log('admin player is in this room');
                room.adminPlayerGreeting(adminPlayerInRoom[0]);
              }
            }
          });          
        }
      });
    }         
  });
}

//Room broadcasts next song
Room.prototype.broadcastNextSong = function(song, questionType, questionGenre) {
  var message = {
    'message_type': 'command',
    'command': 'next song to play',
    'song': song,
    'question': questionType,
    'genre': questionGenre,
    'time': Date.now(),
  };
  room.redisPub.publish(room.channel, JSON.stringify(message));
  room.redisPub.set('song-' + room.channel, song._id, function(err, res){
    if ( err ){
      console.log("couldn't set song id");
    }
    else {
      console.log('song id was updated');
    }
  });
};

Room.prototype.processNextSongRequestMessage =  function(player, message) {

  room.redisPub.get('admin-' + room.channel, function(err, res){
    if (!err && (res == player.nickname)) {
      player.getNextSong(message['song_genre'], function(err, song){
        room.broadcastNextSong(song, message['question'], message['song_genre']);
      });
      room.redisPub.del('leaders-' + room.channel, function(err, res) {
        if ( err ){
          console.log( "couldn't delete the list of leaders for channel " + room.channel);
        }
        else {
          console.log(' deleted list of leaders before new song');
        }
      })
    }
    else
      console.log('an error might have occured or the request wasnt coming from the game admin');
  });
};

Room.prototype.submitFeedback = function (player, message) {
  var feedbackMessage = {
    'message_type': 'bot',
    'text': "You submitted " + message['answer'] + ", it's pretty close to the right answer, try again!",
    'player_nickname': player.nickname,
    'time' : Date.now(),
  };
  player.receiveMessage(feedbackMessage);
}

Room.prototype.processGuessTime = function (player, data) {
  var songId;
  room.redisPub.get("song-" + room.channel, function (err, reply){
    if (! err && reply){
      songId = reply;
      if (data.song._id != songId) {
        console.log('wrong song id');
        return;
      }
      else {
        var points = Math.floor(30 - data['guess_time']);
        var playerData = {
          'nickname': player.nickname,
          'points': points,
        };
        room.redisPub.lrange('leaders-' + room.channel, 0, -1, function (err, reply){
          if ( !err && reply ){
            var currentLeaders = reply;
            var alreadySubmitted = currentLeaders.filter(function (p) {
              var currentPlayer = JSON.parse(p);
              return (currentPlayer.nickname == player.nickname);
            });
            if (alreadySubmitted.length < 1){
              room.redisPub.rpush('leaders-' + room.channel, JSON.stringify(playerData), function(err, inserted) {
                if (! err && inserted) {
                  if (player.username != 'New Player') {
                    player.updatePoints(points, function(updatedPoints){
                      room.sendPointsUpdate(player, updatedPoints, points);
                    });
                  }
                  else {
                    var updatedPoints = player.points + points;
                    room.sendPointsUpdate(player, updatedPoints, points);
                  }

                  room.orderPlayersAndNotify(data['song_id']);
                }
              });
            }
            else {
              room.AnswerAlreadyRegistered(player);
            }
          }
        });
      }
    };
  });
}

Room.prototype.sendPointsUpdate = function (player, updatedPoints, newPoints) {
  player.points = updatedPoints;
  var command = {
    'message_type': 'command',
    'command': 'update points',
    'time': Date.now(),
    'points': updatedPoints,
    'player_nickname': player.nickname,
  };
  player.receiveMessage(command);

  var message = {
    'message_type': 'bot',
    'text': "Well done, you just got " + newPoints + " points",
    'player_nickname': player.nickname,
    'time' : Date.now(),
  };
  player.receiveMessage(message);
}

Room.prototype.AnswerAlreadyRegistered = function(player){
  var message = {
    'message_type': 'bot',
    'text': player.nickname + ', your answer has already been registered for this song',
    'player_nickname': player.nickname,
    'time' : Date.now(),
  };
  player.receiveMessage(message);
}

Room.prototype.orderPlayersAndNotify = function (songId) {
  room.redisPub.lrange('leaders-' + room.channel, 0, -1, function (err, reply){
    if ( !err && reply ){
      console.log('reply ' + reply);
      var players = reply.map(function (p){
        var player = JSON.parse(p);
        console.log('before json parse ' + p);
        return playerObject = {
          nickname: player.nickname,
          points: player.points
        };
      });
      var sortedPlayers = players.sort(room.comparePlayersPoints);
      var message = {
        'message_type': 'command',
        'command': 'refresh leaderboard',
        'song_id': songId,
        'time': Date.now(),
        'leaders': sortedPlayers.slice(0,5)
      };
      console.log('to redis refresh leaderboard' + message.leaders + ' - nb leaders ' + message.leaders.length);
      room.redisPub.publish(room.channel, JSON.stringify(message));
    }
  }); 
}

Room.prototype.comparePlayersPoints = function(player1, player2){
  return (player2.points - player1.points);
}


// handle front end request to change nickname
Room.prototype.changeNickname = function (player, newNickname) {
  var oldNickname = player.nickname;
  room.redisPub.sadd('users-' + room.channel, newNickname, function(err, inserted) {
    if ( inserted == 1 ) {
      room.redisPub.srem('users-' + room.channel, oldNickname, function(err, removed) {
        if ( removed == 1) {
          player.nickname = newNickname;
          room.changeNicknameFeedback(player, newNickname, 1);
          room.nicknameChangeNotice(oldNickname, newNickname);
          room.renameUserKey(oldNickname, newNickname);
          //update room owner if necessary

          room.redisPub.get('admin-' + room.channel, function(err, res){
            if (!err && res) {
              if (res == oldNickname) {
                room.redisPub.set('admin-' + room.channel, newNickname, function(err, res){
                  if (!err && res ){
                    console.log('room admin was updated');
                  }
                });
              }
            }
          });
        }  
      });
    }
    else {
      console.log('sorry, this nickname is already being used');
      room.changeNicknameFeedback(player, newNickname, 0);
    }

  });
}

// rename player key after nickname has been updated
Room.prototype.renameUserKey = function(oldNickname, newNickname) {
  var keyBase = 'user-' + room.channel + '-';
  room.redisPub.rename(keyBase + oldNickname, keyBase + newNickname, function(err, res) {
    if ( err )
      console.log("couldn't rename key for " + oldNickname + ' -> ' + err);
    else
      console.log("key renamed for " + oldNickname + " to " + newNickname + " -> " + res);
  });
}

// inform the user if their nickname has been changed or not
Room.prototype.changeNicknameFeedback = function (player, newNickname, inserted) {
   var message = {
    'message_type': 'command',
    'command': 'nickname update feedback',
    'time' : Date.now(),
    'new_nickname': newNickname,
  };
  if ( inserted == 1 ) {
    message['text'] = 'Your nickname has been successfully updated, you are now ' + newNickname;
    message['nickname_feedback'] = 'updated';
  }
  else if ( inserted == 0) {
    message['text'] = 'Sorry, ' + newNickname + ' is already being used as a nickname';
    message['nickname_feedback'] = 'not_updated';
  }
  player.receiveMessage(message);
}

// inform users that someone changed their nickname
Room.prototype.nicknameChangeNotice = function (oldNickname, newNickname) {
  var message = {
    'message_type': 'notification',
    'text': oldNickname + ' will now be called ' + newNickname,
    'exclude_users': [ newNickname ],
    'time': Date.now(),
  };
  this.saveAndPublishMessage(message);
}

//greet new player
Room.prototype.welcomeNewPlayer = function(player) {
  var message = {
    'message_type': 'bot',
    'text': 'Welcome ' + player.nickname,
    'player_nickname': player.nickname,
    'time' : Date.now(),
  };

  var command = {
    'message_type': 'command',
    'command': 'nickname set up',
    'time': Date.now(),
    'player_nickname': player.nickname,
  };
  player.receiveMessage(message);
  player.receiveMessage(command);
}

// inform player they are the admin of the game
Room.prototype.adminPlayerGreeting = function(player) {
  var message = {
    'message_type': 'bot',
    'text': 'Hey ' + player.nickname + ', you are now the game admin',
    'player_nickname': player.nickname,
    'time' : Date.now(),
  };
  player.receiveMessage(message);
  var command = {
    'message_type': 'command',
    'command': 'is admin',
    'time': Date.now(),
    'player_nickname': player.nickname,
  };
  player.receiveMessage(command);
  var notAdminCommand = {
    'message_type': 'command',
    'command': 'not admin',
    'time': Date.now(),
    'exclude_users': [player.nickname],
  };
  room.broadcast(notAdminCommand);
}

// broadcast message to everyone except player when someone joined the room
Room.prototype.joinNoticeMessage = function(player) {
  var message = {
    'message_type': 'notification',
    'text': player.nickname + ' joined the room',
    'exclude_users': [ player.nickname ],
    'time' : Date.now(),
  };
  this.saveAndPublishMessage(message);
}

//broadcast message to everyone (except player) when someone leaves the room
Room.prototype.leaveNoticeMessage = function(player){
  var message = {
    'message_type': 'notification',
    'text': player.nickname + ' left the room.',
    'exclude_users': [ player.nickname ],
    'time' : Date.now(),
  }
  this.saveAndPublishMessage(message);
}


//add method to redisClient to save message in a DB- data is a JS object
Room.prototype.saveAndPublishMessage = function(data) {
  var jsonData = JSON.stringify(data);
  var timestamp = Date.now();
  var key = 'message-' + this.channel + '-' + timestamp;

  room.redisPub.set(key , jsonData, function(err, res){
    if ( err ){
      console.log("couldn't add message to redis database");
    }
    else {
      room.redisPub.publish(room.channel, jsonData);
    }
  });
};

Room.prototype.broadcast = function (message) {
  async.each(this.players, function (player) {
    if (!('exclude_users' in message) ||
      message['exclude_users'].indexOf(player.nickname) == -1)
      player.receiveMessage(message);
  });
};

Room.prototype.removePlayer = function(player) {
  console.log('removing player ' + player.nickname);
  for ( var i = 0; i < room.players.length; i++ ) {
    if (player.room.players[i].nickname === player.nickname ) {
      room.players.splice(i, 1);
      console.log('room removed 1 player');
      room.redisPub.srem('users-' + room.channel, player.nickname, function(err, res){
        if ( !err ) {
          // player was removed 
          room.leaveNoticeMessage(player);
          room.isEmpty(); // check if room is empty
          console.log('Player was successfully removed from the room');
          // delete player key
          room.redisPub.del('user-' + room.channel + '-' + player.nickname, function (err, res) {
            if (err)
              console.log(err)
            else {
              console.log( 'user-' + room.channel + '-' + player.nickname + ' was deleted from redis' + '--> ' + res);
              room.redisPub.get('admin-' + room.channel, function(err, res){
                if (!err && res) {
                  if (res == player.nickname){
                    console.log(player.nickname + ' was the admin, need a new one');
                    room.redisPub.del('admin-' + room.channel, function(err, res){
                      if (!err ){
                        console.log('admin deleted in redis');
                      }
                    });
                    room.setAdminPlayer();
                  }
                }
              });
            }
          })
        }
      });
    }
  }
}

Room.prototype.getMessages = function(socket) {
  var messages = [];
  redisClient.keys('message-' + this.channel + '-*', function(err, keys){
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
  this.redisPub.scard('users-' + this.channel, function(err, res) {
    if ( !err  && ( res == 0) ) {
      console.log('room is empty');
      room.redisPub.keys('message-' + room.channel + '-*', function(err, keys){
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