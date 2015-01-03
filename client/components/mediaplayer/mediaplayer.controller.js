'use strict';

angular.module('lamusiqueApp')
  .controller('MediaplayerCtrl', function ($scope, $http, socket, $timeout, $rootScope) {
    //Music Player
    $scope.audioPlaylist = [];
    $scope.audioPlaylist.push({
      src: 'http://www.amazon.com/gp/dmusic/get_sample_url.html/ref=dm_dp_trk_B001IXQU3O?ie=UTF8&ASIN=B001IXQU3O&DownloadLocation=WEBSITE',
      type: 'audio/mp3'
    });
    $timeout(function () {
      $scope.audioPlaylist.unshift({
        src: 'http://www.amazon.com/gp/dmusic/get_sample_url.html/ref=dm_dp_trk_B00K9FRA8Q?ie=UTF8&ASIN=B00K9FRA8Q&DownloadLocation=WEBSITE',
        type: 'audio/mp3'
      });
    }, 5500);
    $timeout(function () {
      $scope.audioPlaylist.push({
        src: 'http://demos.w3avenue.com/html5-unleashed-tips-tricks-and-techniques/demo-audio.oggs',
        type: 'audio/ogg'
      });
    }, 9500);

    
 
  });