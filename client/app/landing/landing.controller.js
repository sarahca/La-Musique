'use strict';


angular.module('lamusiqueApp')
  .controller('LandingCtrl', function ( $scope, $http, socket, $timeout, $rootScope, $location) {
    $rootScope.channel = (Math.floor(Math.random()*100000)).toString();
    console.log('channel ' + $rootScope.channel);
    
    $scope.enter = function() {
      console.log(window);
      $location.path("/" + $rootScope.channel);
      console.log($location.path());
      $scope = $scope || angular.element(document).scope();
      if(!$scope.$$phase) {
        //this will kickstart angular  to notice the change
        $scope.$apply();
      }
    };

    $rootScope.$on("userLoggedIn", function() {
      $scope.enter();
    });
  });
