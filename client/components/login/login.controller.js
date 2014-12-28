'use strict';

angular.module('lamusiqueApp')
  .controller('LoginCtrl', function ($scope, $http, socket, $timeout, $rootScope) {

    $scope.login = function(isValid) {
      console.log('trying to submit');
      if (isValid) {
        console.log('login form is valid');
        $http.post('/api/user/login',
         {'email': $scope.user.email,
          'password': $scope.user.password}).
        success(function(data, status, headers, config) {
          console.log(data);
          $rootScope.$broadcast("userLoggedIn", {});
        }).
        error(function(data, status, headers, config) {
          console.log(data.message);
        });
      }
    }
  });