'use strict';


angular.module('lamusiqueApp')
  .controller('LandingCtrl', function ( $scope, $http, socket, $timeout, $rootScope, $location) {
    $rootScope.channel = (Math.floor(Math.random()*100000)).toString();
    console.log('channel ' + $rootScope.channel);

    $timeout(function() {
      $http.get('/api/user/isLoggedIn')
        .success(function() {
          $http.get('/api/chat/channel')
            .success(function(data, status, headers, config) {
              $scope.redirect(data.channel);
            })
        })
    })

    $scope.redirect = function(channel){
      $location.path("/" + channel);
      console.log($location.path());
      $scope = $scope || angular.element(document).scope();
      if(!$scope.$$phase) {
        //this will kickstart angular  to notice the change
        $scope.$apply();
      }
    }
    
    $scope.enter = function() {
      $scope.redirect($rootScope.channel)
    };

    $rootScope.$on("userLoggedIn", function() {
      $scope.enter();
    });
  });
