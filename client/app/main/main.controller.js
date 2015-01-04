'use strict';



angular.module('lamusiqueApp')
  .controller('MainCtrl', function ($scope, $http, socket, $timeout, $rootScope, UserService, $interval) {
    $scope.user = UserService;

    $scope.countdown = function() {
      $scope.secondsLeft = 5;
      $interval(function() {
        $scope.secondsLeft -= 1;
      }, 1000, 5);
    }
    //event sent by mediaPlayer controller when new song received
    $rootScope.$on('start countdown', function(){
      $scope.newPlayer =  false; //not a new player any more
      $scope.countdown();
    });

    // event sent by chat controller when user joins
    $rootScope.$on('new player joined', function(){ 
      $scope.newPlayer = true; //set message in main.html
    });

  });
