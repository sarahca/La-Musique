'use strict';

function flashMessage(scope) {
  $('.flash')
   .fadeIn(500).delay(3000)
   .fadeOut(500, function() {
   scope.messages.splice(0);
  });
 }

angular.module('lamusiqueApp')
  .controller('LoginCtrl', function ($scope, $http, socket, $timeout, $rootScope, UserService) {

    $scope.errorMessages = [];
    $scope.user = UserService;

    $scope.login = function(isValid) {
      //console.log('trying to submit');
      if (isValid) {
        //console.log('login form is valid');
        $http.post('/api/user/login',
         {'email': $scope.user.email,
          'password': $scope.user.password}).
        success(function(data, status, headers, config) {
          //console.log(data);
          $rootScope.$broadcast("userLoggedIn", data);
        }).
        error(function(data, status, headers, config) {
          $scope.errorMessages.push(data.message);
        });
      }
    }
  });