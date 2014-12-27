'use strict';

angular.module('lamusiqueApp')
  .controller('ChatCtrl', function ($scope, $http, socket, $timeout, $rootScope) {

    // var server = new ServerChannel('http://localhost:9000')
    console.log('in chat ctlr');

    $scope.pathname = window.location.pathname;
    $scope.channelName = $scope.pathname.replace(/\//, '');
    $scope.messages = ['test from ctrl'];

    // socket.emit('join_channel', JSON.stringify({'channel': $scope.channelName}));
    console.log(socket);

    $scope.sendMessage = function() {
      console.log('in send message');
      console.log($scope.newMsg);
      console.log($scope);
      // $scope.messages.push($scope.newMsg.text);
      // console.log($scope.newMsg.text);
      // var text = $scope.newMsg.text;
      // message = {
      //   'channel': $scope.channelName,
      //   'text': text,
      // };
      // socket.emit('post_message', JSON.stringify(message));
      //$scope.newMsg.text = '';
    };

    // socket.on('new_message', function(data){
    //   var message = JSON.parse(data);
    //   $scope.messages.push(message);
    //   $scope.$digest(); // tells angular to refresh messages
    // });

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });

    // server.onConnect(function () {
    //     server.joinNgChat();
    // });

    


  });
