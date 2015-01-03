'use strict';

angular.module('lamusiqueApp')
  .controller('LeaderboardCtrl', function ($scope, $http, socket, $timeout, $rootScope) {

    var leaders = [];
    $rootScope.$on('refresh leaderboard', function (e, data) {
      var newLeaders = data['leaders'];
    });
  });