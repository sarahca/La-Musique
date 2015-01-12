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
  .config(function ($provide, $stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $provide.factory("UserService", function() {
      var user = {
        points: 0,
        gems: 0,
        loggedIn: false,
        admin: false,
        username: 'New Player',

        getUserUsername: function() {
          return this.username;
        },
        getUserPoints: function() {
          return this.points;
        },
        getUserGems: function() {
          return this.gems;
        },
        getUserLoggedIn: function() {
          return this.loggedIn;
        },
        getUserAdmin: function() {
          return this.admin;
        },
        setUserUsername: function(username) {
          this.username = username ;
        },
        setUserPoints: function(points) {
          this.points = points;
        },
        setUserGems: function(gems) {
          this.gems = gems;
        },
        setUserLoggedIn: function(loggedin){
          this.loggedIn = loggedin;
        },
        setUserAdmin: function(admin) {
          this.admin = admin;
        },
        saveUserDataOnLogin: function(data) {
          user.setUserLoggedIn(true);
          user.setUserUsername(data['user-username']);
          user.setUserPoints(data['user-points']);
          user.setUserGems(data['user-gems']);
        },
      }
      return user;
    });
  })
  .service('MediaPlayer', function () {
    return {
      player: function () {
        return angular.element(document.querySelector('audio')).scope().mediaPlayer;
      }
    };
  });

  

