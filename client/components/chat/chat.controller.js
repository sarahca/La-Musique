'use strict';

angular.module('lamusiqueApp')
  .controller('ChatCtrl', function ($scope, $http, socket, $timeout, $rootScope, UserService, MediaPlayer) {

    $scope.socket = socket.socket;
    $scope.users = {};
    $scope.user = UserService;
    $scope.mediaPlayer = MediaPlayer;
    $scope.nickname;
    $scope.currentSong;
    $scope.hasSubmitted = false;
    var controller = this;
    $scope.pathname = window.location.pathname;
    $scope.channelName = $scope.pathname.replace(/\//, '');
    $scope.messages = [];
    $scope.roundInProgress = false;
    $scope.numberOfPlayers = 0;

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
      var el = angular.element('#chat-body');
      el.scrollTop = el.scrollHeight; 
    });

    // player joins the channel
    $scope.joinChannel = function() {     
      var joinMessage = {
        'channel': $scope.channelName,
        'nickname': $scope.nickname,
        'username': $scope.user.getUserUsername()
      } 
      $scope.socket.emit('join_channel', JSON.stringify(joinMessage));

      //set up the channel in the session cookie 
      $http.post('/api/chat/channel', {'channel': $scope.channelName,})
        .success(function(data, status, headers, config) {     
        })
        .error(function(data, status, headers, config) {
          console.log(data);
        });
      // caught by the main controller to set message
      $rootScope.$emit('new player joined'); 
    };

    // update nickname when the player is changing it in contenteditable label
    function onNicknameChange (newNickname) {
      if (newNickname != $scope.nickname) {
        if (newNickname.length < 1 || newNickname.length > 8) {
          var command = {
            'channel': $scope.channelName,
            'message_type': 'command',
            'command': 'invalid nickname',
            'time': Date.now()
          }
          $scope.socket.emit('command', JSON.stringify(command));
          var oldNickname = $scope.nickname;
          var el = angular.element('#nickname');
          el.text(oldNickname);
        }
        else {
          var message = {
            'channel': $scope.channelName,
            'message_type': 'command',
            'command': 'nickname',
            'new_nickname': newNickname,
          };
          $scope.socket.emit('command', JSON.stringify(message));   
        }
      }   
    };

    // listen for changes on contenteditable label
    $timeout( function () {
      var el = angular.element('#nickname');
      el.bind('blur', function () {
        onNicknameChange(el.text());
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
      //console.log('sending message ' + $scope.newMsg.text);
      var text = $scope.newMsg.text;
      if (!checkIfAnswer(text)) {
        var message = {
          'channel': $scope.channelName,
          'text': text,
          'time': Date.now()
        };
        $scope.socket.emit('post_message', JSON.stringify(message));
      }
      $scope.newMsg.text = '';
    };

    function checkIfAnswer(text){
      if ( !$scope.roundInProgress )
        return false;
      var text = text.trim().toLowerCase();
      var expectedAnswer = $scope.currentSong[$scope.currentQuestion];
      var lDist = new Levenshtein(text, expectedAnswer);
      if (text == expectedAnswer)
        sendAnswer(text);
      if ((lDist > 0 ) && (lDist <= 5))
        almostRightAnswerNotice(text)
      return ((text == expectedAnswer) || (lDist <= 5));
    }

    function sendAnswer(text) {
      var time = $scope.mediaPlayer.player().currentTime;
      var data = {
        song: $scope.currentSong,
        guessTime: time,
      };
      if (time < 30){

        $rootScope.$emit('guess-time', data);
      }
      else {
        $rootScope.$emit('good slow guess');
      }
    };

    $rootScope.$on('good slow guess', function(){
       var message = {
        'channel': $scope.channelName,
        'message_type': 'command',
        'command': 'guess after end',
        'nickname': $scope.nickname,
        'time': Date.now(),
      };
      $scope.socket.emit('command', JSON.stringify(message));
    });

    function almostRightAnswerNotice(text){
      var message = {
        'channel': $scope.channelName,
        'message_type': 'command',
        'command': 'almost right answer',
        'nickname': $scope.nickname,
        'answer': text,
        'time': Date.now(),
      };
      $scope.socket.emit('command', JSON.stringify(message));
    }

    $rootScope.$on('song details for chat', function(e, data){
      $scope.currentSong = data.song;
      $scope.currentQuestion = data.question;
    });

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
          if ( !$scope.roundInProgress )
            newSongRequestCommand({'genre': $rootScope.genreSelected, 'question': $rootScope.questionSelected});
          break;
        case 'not admin':
          $scope.user.setUserAdmin(false);
          break;
        case 'refresh leaderboard':
          $rootScope.$emit('refresh leaderboard', command);
          break;
        case 'update points':
          $rootScope.$emit('update points', command);
          break;
        case 'update player number':
          $scope.numberOfPlayers = command['number_players'];
          break;
        case 'pause game':
          $rootScope.$emit('game paused notice');
          break;
        case 'restart game':
          $rootScope.$emit('game restarted notice');
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
          message['nickname'] = 'MusicBot';
          break;
        case 'message':
          var nickname = message['nickname'];
          if ( nickname && !(nickname in $scope.users)) {
            console.log('need a color for new user');
            $scope.users[nickname] = getRandomRolor();
          }
          message['color'] = $scope.users[nickname];
          break;
      }
      $scope.messages.push(message);
      $scope.$digest(); // tells angular to refresh messages
    }

    function songMessage (message) {
      var nextSongToPlay = message.song;
      var question = message.question;
      var genre = message.genre
      $rootScope.$emit('next-song-to-play', {'song': nextSongToPlay, 'question': question, 'genre': genre});
      $scope.hasSubmitted = false;
    };

    $rootScope.$on('round started', function(){
      $scope.roundInProgress = true;
    });

    $rootScope.$on('round ended', function(){
      $scope.roundInProgress = false;
    });

    $rootScope.$on('game paused', function(){
      var message = {
        'channel': $scope.channelName,
        'message_type': 'command',
        'command': 'pause game',
        'time': Date.now(),
      };
      $scope.socket.emit('command', JSON.stringify(message));
    });

    $rootScope.$on('game restarted', function() {
      var message = {
        'channel': $scope.channelName,
        'message_type': 'command',
        'command': 'restart game',
        'time': Date.now(),
      };
      $scope.socket.emit('command', JSON.stringify(message));
    })

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
        'question': data['question'],
        'time': Date.now(),
      };
      $scope.socket.emit('command', JSON.stringify(message));
    };
    //send guess time
    $rootScope.$on('guess-time', function (e, data){
      submitGuessTime(data);
    });

    function submitGuessTime(data) {
      if ($scope.hasSubmitted) {
        var message = {
          'channel': $scope.channelName,
          'message_type': 'command',
          'command': 'answer already submitted',
          'nickname': $scope.nickname,
          'time': Date.now(),
        };
        $scope.socket.emit('command', JSON.stringify(message));
        return;
      }
      var message = {
        'channel': $scope.channelName,
        'message_type': 'command',
        'command': 'submit guess',
        'guess_time': data.guessTime ,
        'song': data.song,
        'nickname': $scope.nickname,
        'time': Date.now(),
      };
      $scope.socket.emit('command', JSON.stringify(message));
      $scope.hasSubmitted = true;
    };

  });

   
