'use strict';

angular.module('lamusiqueApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.answer = 'please enter your answer';
    $scope.change = function(){
      if($scope.answer == "Poker Face"){
      $('#answerIcon').html('&#10004;');
      }else{
        $('#answerIcon').html('Incorrect');
      }
    }
    console.log(" $scope.answer = " +  $scope.answer);
    

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
