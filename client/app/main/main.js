'use strict';

angular.module('lamusiqueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/:channel',
        templateUrl: 'app/main/main.html',
        //controller: 'MainCtrl'
      });
  });