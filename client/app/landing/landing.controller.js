'use strict';


angular.module('lamusiqueApp')
  .controller('LandingCtrl', function ( $scope, $http, socket, $timeout, $rootScope, $location, UserService) {
  $scope.user = UserService;

    var controller = this;
    controller.saveUserDataOnLogin = $scope.user.saveUserDataOnLogin;
    $rootScope.channel = (Math.floor(Math.random()*100000)).toString();
    console.log('channel ' + $rootScope.channel);

    $timeout(function() {
      $http.get('/api/user/isLoggedIn')
        .success(function(data, status, headers, config) {
          controller.saveUserDataOnLogin(data);
          $http.get('/api/chat/channel')
            .success(function(data, status, headers, config) {
               $scope.redirect(data.channel);
            })
        })
    })

    $scope.redirect = function(channel){
      console.log('==== in redirect to channel =====');
      $location.path("/" + channel);
      console.log($location.path());
      $scope = $scope || angular.element(document).scope();
      if(!$scope.$$phase) {
        //this will kickstart angular  to notice the change
        $scope.$apply();
      }
    }
    
    $scope.enter = function() {
      $scope.redirect($rootScope.channel);
    };

    $rootScope.$on("userLoggedIn", function(e, data) {
      console.log(' ////////  user logged in event ' + JSON.stringify(data));
      controller.saveUserDataOnLogin(data);
      $scope.enter();
    });
  });
