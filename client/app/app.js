'use strict';

angular.module('lamusiqueApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'mediaPlayer'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  })

  .service('MediaPlayer', function () {
    return angular.element(document.querySelector('audio')).scope().mediaPlayer;
  })