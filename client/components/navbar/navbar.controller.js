'use strict';

angular.module('lamusiqueApp')
  .controller('NavbarCtrl', function ($scope, $http) {

    $scope.logout = function() {
      $http.post('/api/user/logout');
    }
  });