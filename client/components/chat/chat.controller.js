'use strict';

angular.module('lamusiqueApp')
  .controller('ChatCtrl', function ($scope, $http, socket, $timeout, $rootScope) {

    // var server = new ServerChannel('http://localhost:9000')
    console.log('in chat ctlr');
    $scope.socket = socket.socket;
    $scope.users = {};
    $scope.nickname;

    var controller = this;

    $scope.pathname = window.location.pathname;
    $scope.channelName = $scope.pathname.replace(/\//, '');
    $scope.messages = [];

    // player joins the channel
    var join_msg = JSON.stringify({'channel': $scope.channelName});
    console.log(join_msg);
    $scope.socket.emit('join_channel', join_msg);

    // update nickname when the player is changing it in contenteditable label
    this.onNicknameChange = function(el) {
      console.log('->   ' + el.text());
      var message = {
        'channel': $scope.channelName,
        'message_type': 'command',
        'command': 'nickname',
        'new_nickname': el.text(),
      }
      $scope.socket.emit('command', JSON.stringify(message));
    };

    // listen for changes on contenteditable label
    $timeout( function () {
      var el = angular.element('#nickname');
      el.bind('blur', function () {
        controller.onNicknameChange(el);
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
      console.log('in send message');
      console.log($scope.newMsg.text);
      var text = $scope.newMsg.text;
      var message = {
        'channel': $scope.channelName,
        'text': text,
        'time': Date.now()
      };
      $scope.socket.emit('post_message', JSON.stringify(message));
      $scope.newMsg.text = '';
    };

    // helper method called when receiving a new message to determine the nickname associated with our own client
    this.getOwnNickname = function(message) {
      if (message['message_type'] == 'bot' && message['player_nickname']) {
        $scope.nickname = message['player_nickname'];
        //$scope.users[$scope.nickname] = controller.getUserColor();
        $scope.users[$scope.nickname] = getRandomRolor();
        console.log($scope.users);
      }
        
    }

    // when a message is received from back-end, it is added to the array of messages
    $scope.socket.on('new_message', function(data){
      var message = JSON.parse(data);
      
      //if $scope has no nickname, get one
      if ( !$scope.nickname )
        controller.getOwnNickname(message);
      controller.setMessageColor(message);
      $scope.messages.push(message);
      $scope.$digest(); // tells angular to refresh messages
      console.log($scope.users);
    });

    // methods which processes the feedback coming from the backend when trying to change nickname
    this.processNicknameFeedback = function (message) {
      console.log($scope.nickname);
      if (message['nickname_feedback'] == 'not_updated') {
        var el = angular.element('#nickname');
        el.text($scope.nickname);
      }
      else {
        $scope.nickname = message['new_nickname'];
      }
      
    };

    // processes messages depending on their type and content
    this.setMessageColor = function (message) {
      if (message['message_type'] == 'notification') {
        message['color'] =  'grey';
        return;
      }
      if (message['message_type'] == 'bot') {
        message['color'] =  'black';
        if (message['nickname_feedback'] )
          this.processNicknameFeedback(message);
        return;
      }
      if ( message['nickname'] && !(message['nickname'] in $scope.users)) {
        console.log('need a color for new user');
        //$scope.users[message['nickname']] = controller.getUserColor();
        $scope.users[message['nickname']] = getRandomRolor();
      }
      message['color'] = $scope.users[message['nickname']];
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
  });
