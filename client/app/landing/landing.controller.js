'use strict';


angular.module('lamusiqueApp')
  .controller('LandingCtrl', function ($scope, $http, socket, $timeout, $rootScope, $location) {
    $rootScope.channel = (Math.floor(Math.random()*100000)).toString();
    console.log('channel ' + $rootScope.channel);
    
    

    $scope.enter = function() {
      console.log(window);
      $location.path("/" + $rootScope.channel);
      console.log($location.path());
      //$scope.$digest();
      // window.history.pushState("channel", "", "/" + $rootScope.channel);
      $scope = $scope || angular.element(document).scope();
      if(!$scope.$$phase) {
        //this will kickstart angular if to notice the change
        console.log('in if');
        $scope.$apply();
      }
    }
  });
