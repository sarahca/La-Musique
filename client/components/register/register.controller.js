'use strict';

angular.module('lamusiqueApp')
  .controller('RegisterCtrl', function ($scope, $http, socket, $timeout, $rootScope) {

    $scope.errorMessages = [];

    $scope.registerSubmit = function(isValid) {
      //console.log('trying to submit');
      if (isValid) {
        //console.log('great form');
        $http.post('/api/user/register',
         {'username': $scope.user.registerUsername,
          'email': $scope.user.registerEmail,
          'password': $scope.user.registerPassword}).
        success(function(data, status, headers, config) {
          //console.log(data);
          $rootScope.$broadcast("userLoggedIn", data);
        }).
        error(function(data, status, headers, config) {
          //console.log(data.email);
          for (var x in data){
            $scope.errorMessages.push(data[x].message);
          }         
        });
      }
    }
  })
