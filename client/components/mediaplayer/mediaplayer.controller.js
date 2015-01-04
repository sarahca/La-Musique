'use strict';



var playSong = function (scope, rootScope){
      rootScope.$emit('start countdown');
  setTimeout(function(){
    console.log('media player starts playing at ' + Date.now());
    scope.mediaPlayer.play(0);
    var song = scope.audioPlaylist[0].song_details;
    rootScope.$emit('update grid', song); // send song data for the grid
    rootScope.$emit('song details for chat', song);
    rootScope.$emit('clear leaderboard');
    rootScope.$emit('stop countdown');
    rootScope.$emit('reset countdown');
    }, 5000);
}

angular.module('lamusiqueApp')
  .controller('MediaplayerCtrl', function ($scope, $http, socket, $timeout, $rootScope) {

    $scope.getSongPlayerUrl = function (amazonId) {
      return 'http://www.amazon.com/gp/dmusic/get_sample_url.html/ref=dm_dp_trk_' + amazonId + '?ie=UTF8&ASIN=' + amazonId +'&DownloadLocation=WEBSITE'
    };

    $scope.audioPlaylist = [];

    $timeout(function () {

      $rootScope.$on('next-song-to-play', function (e, song) {
        var url = $scope.getSongPlayerUrl(song.amazonId);
        var songToPlay = {
          src: url,
          type: 'audio/mp3',
          song_details: song,
        };
        $scope.audioPlaylist.push(songToPlay);
        if ( !$scope.mediaPlayer.playing ) {
          playSong($scope, $rootScope);
        }
      });

      $scope.mediaPlayer.on('ended', function(){
        $rootScope.$emit('reset countdown');
        $scope.audioPlaylist.shift();
        if ($scope.audioPlaylist.length > 0) { 
          playSong($scope, $rootScope);
        }
        else {
          console.log('requesting new song');
          $rootScope.$emit('request-new-song', {'genre': 'pop'});
        }
      });
    });
  });

