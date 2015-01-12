'use strict';

angular.module('lamusiqueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: 'app/landing/landing.html',
      });
  });