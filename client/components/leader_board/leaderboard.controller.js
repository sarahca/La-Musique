'use strict';

angular.module('lamusiqueApp')
  .controller('LeaderboardCtrl', function ($scope, $http, socket, $timeout, $rootScope, MediaPlayer) {

    $scope.leaders = [];
    $scope.mediaPlayer = MediaPlayer;
    $rootScope.$on('refresh leaderboard', function (e, data) {
      if ($scope.mediaPlayer.player().playing){
        console.log('playing ');
        $scope.leaders = data['leaders'];
        console.log('nb leaders ' + $scope.leaders.length);
      }
    });

    $rootScope.$on('clear leaderboard', function() {
      //console.log('leaderboard received clear leaders event');
      $scope.leaders = [];
    })
  });