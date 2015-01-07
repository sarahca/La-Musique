'use strict';



angular.module('lamusiqueApp')
  .controller('MainCtrl', function ($scope, $http, socket, $timeout, $rootScope, UserService, $interval) {
    $scope.user = UserService;
    $scope.genreSelected = $scope.nextGenreSelected = $rootScope.genreSelected = "rock";
    $scope.questionSelected = $scope.nextQuestionSelected = $rootScope.questionSelected = "title";
    $scope.genreSelectable = true; // deactivate genre selection
    $scope.questionSelectable = true; // deactivate question category selection
    $scope.roundInProgress = false;
    $scope.gameOnPause = false;

    $scope.updateQuestion = function() {
      $rootScope.questionSelected = $scope.nextQuestionSelected;
    };

    $scope.updateGenre = function() {
      $rootScope.genreSelected = $scope.nextGenreSelected;
    };

    $scope.showCurrentRoundDetails = function(){
      $scope.secondsLeft = -1;
      $scope.roundInProgress = true;
      $scope.genreSelectable = false;
      $scope.questionSelectable = false;
    }; 

    $scope.countdown = function() {
      $scope.secondsLeft = 5;
      $interval(function() {
        $scope.secondsLeft -= 1;
      if ($scope.secondsLeft == 0)
        $scope.showCurrentRoundDetails();
      }, 1000, 5);
    };

    $scope.pauseGame = function() {
      $scope.gameOnPause = $rootScope.gameOnPause = true;
    };

    $scope.restartGame = function() {
      $scope.gameOnPause = $rootScope.gameOnPause = false;
      $rootScope.$emit('game restarted');
    };


    //event sent by mediaPlayer controller when new song received
    $rootScope.$on('start countdown', function(){
      $scope.roundInProgress = false;
      $scope.newPlayer =  false; //not a new player any more
      $scope.countdown();
    });

    // event sent by chat controller when user joins
    $rootScope.$on('new player joined', function(){ 
      $scope.newPlayer = true; //set message in main.html
    });

     //event sent by mediaPlayer controller when requesting the next song
    $rootScope.$on('update round details', function(e, data) {
      $scope.questionSelected = data['question'];
      $scope.genreSelected = data['genre'];
    });

    $rootScope.$on('round ended', function() {
      $scope.roundInProgress = false;
    })

  });
