'use strict';

angular.module('lamusiqueApp')
  .controller('ChatCtrl', function ($scope, $http, socket, $timeout, $rootScope, UserService) {

    $scope.socket = socket.socket;
    $scope.users = {};
    $scope.user = UserService;
    $scope.nickname;
    var controller = this;
    $scope.pathname = window.location.pathname;
    $scope.channelName = $scope.pathname.replace(/\//, '');
    $scope.messages = [];

    $timeout(function() {
      $http.get('/api/user/isLoggedIn')
        .success(function(data, status, headers, config) {
          $scope.user.saveUserDataOnLogin(data);
          $scope.nickname = $scope.user.getUserUsername();
          $scope.joinChannel();
        })
        .error(function(data, status, headers, config) {
          $scope.joinChannel();
        });     
    });

    // player joins the channel
    $scope.joinChannel = function() {     
      var join_msg = JSON.stringify({'channel': $scope.channelName, 'nickname': $scope.nickname});
      $scope.socket.emit('join_channel', join_msg);

      //set up the channel in the session cookie 
      $http.post('/api/chat/channel', {'channel': $scope.channelName,})
        .success(function(data, status, headers, config) {
          newSongRequestCommand({'genre': 'pop'});
        })
        .error(function(data, status, headers, config) {
          console.log(data);
        });
    }
    

    // update nickname when the player is changing it in contenteditable label
    function onNicknameChange (el) {
      if (el.text() != $scope.nickname) {
        var message = {
        'channel': $scope.channelName,
        'message_type': 'command',
        'command': 'nickname',
        'new_nickname': el.text(),
      }
      $scope.socket.emit('command', JSON.stringify(message));
      }    
    };

    // listen for changes on contenteditable label
    $timeout( function () {
      var el = angular.element('#nickname');
      el.bind('blur', function () {
        onNicknameChange(el);
      });
      el.bind('keydown keypress', function (event) {
        if (event.which == 13) { // ENTER
          event.preventDefault();
          el.blur();
        }
      });
    });

    // post a new message
    $scope.sendMessage = function() {
      var text = $scope.newMsg.text;
      var message = {
        'channel': $scope.channelName,
        'text': text,
        'time': Date.now()
      };
      $scope.socket.emit('post_message', JSON.stringify(message));
      $scope.newMsg.text = '';
    };

    // helper method to set our nickname
    function setOwnNickname (message) {
        $scope.nickname = message['player_nickname'];
        $scope.users[$scope.nickname] = getRandomRolor();
    }

    $scope.socket.on('new_message', function (data){
      var message = JSON.parse(data);
      setMessageColorAndSave(message);
    });

    function changeAdminStatus(admin) {
      $scope.user.setUserAdmin(admin);
    }

    $scope.socket.on('command', function (data){
      var command = JSON.parse(data);
      switch(command['command']) {
        case 'next song to play':
          songMessage(command);
          break;
        case 'nickname update feedback':
          processNicknameFeedback(command);
          break;
        case 'nickname set up':
          setOwnNickname(command);
          break;
        case 'is admin':
          changeAdminStatus(true);
          break;
        case 'not admin':
          $scope.user.setUserAdmin(false);
          break;
        case 'refresh leaderboard':
          $rootScope.$emit('refresh leaderboard', command);
          break;
    }    

    });

    // methods which processes the feedback coming from the backend when trying to change nickname
    function processNicknameFeedback (message) {
      var oldNickname = $scope.nickname;
      if (message['nickname_feedback'] == 'not_updated') {
        var el = angular.element('#nickname');
        el.text(oldNickname);
      }
      else {
        $scope.nickname = message['new_nickname'];
        $scope.users[$scope.nickname] = $scope.users[oldNickname];
        delete $scope.users[oldNickname];
      }
      message['message_type'] = 'bot';
      setMessageColorAndSave(message);    
    };

    // gives messages a color depending on their type and content
    function setMessageColorAndSave (message) {
        switch(message['message_type']) {
        case 'notification':
          message['color'] =  'grey';
          break;
        case 'bot':
          message['color'] =  'black'; 
          break;
        case 'message':
          var nickname = message['nickname'];
          if ( nickname && !(nickname in $scope.users)) {
            console.log('need a color for new user');
            $scope.users[nickname] = getRandomRolor();
          }
          message['color'] = $scope.users[nickname];
          console.log('in scope.users ' + $scope.users[nickname]);
          break;
      }
      $scope.messages.push(message);
      $scope.$digest(); // tells angular to refresh messages
    }

    function songMessage (message) {
      var nextSongToPlay = message.song;
      $rootScope.$emit('next-song-to-play', nextSongToPlay);
    }

    // return a random color
    function getRandomRolor() {
      var letters = '0123456789'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 10)];
      }
      return color;
    }

    // request new song if player has finished playing
    $rootScope.$on('request-new-song', function (e, data) {
      newSongRequestCommand(data);
    });

    //send message to reqyest new song
    function newSongRequestCommand(data) {
      var message = {
        'channel': $scope.channelName,
        'message_type': 'command',
        'command': 'new song request',
        'nickname': $scope.nickname,
        'song_genre': data['genre'],
        'time': Date.now(),
      };
      $scope.socket.emit('command', JSON.stringify(message));
    };


    //send guess time

    $rootScope.$on('guess-time', function (e, data){
      submitGuessTime(data);

    });

    function submitGuessTime() {
      var message = {
        'channel': $scope.channelName,
        'message_type': 'command',
        'command': 'submit guess',
        'guess_time': 0,
        'song_id': '_id',
        'nickname': $scope.nickname,
        'time': Date.now(),
      };
      $scope.socket.emit('command', JSON.stringify(message));
    }


  });

   
