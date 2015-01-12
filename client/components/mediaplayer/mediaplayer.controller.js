'use strict';



var playSong = function (scope, rootScope){
  //console.log('number of songs in playlist ' + scope.audioPlaylist.length);
  rootScope.$emit('start countdown'); // for main controller
  var song = scope.audioPlaylist[0].song_details;
  var questionType = scope.audioPlaylist[0].question;
  var musicGenre = scope.audioPlaylist[0].genre;
  var nextRoundData = {'genre': musicGenre, 'question': questionType};
  rootScope.$emit('update round details', nextRoundData); // for main controller
  setTimeout(function(){
    rootScope.$emit('round started');
    //console.log('media player starts playing at ' + Date.now());
    scope.mediaPlayer.play(0);
    rootScope.$emit('update grid', {'song': song, 'question': questionType}); // send song data to the grid
    rootScope.$emit('song details for chat', {'song': song, 'question': questionType});
    rootScope.$emit('clear leaderboard'); // for leaderboard
  }, 5000);
}


angular.module('lamusiqueApp')
  .controller('MediaplayerCtrl', function ($scope, $http, socket, $timeout, $rootScope) {


    $scope.getSongPlayerUrl = function (amazonId) {
      //console.log("******AMAZON ID = " + amazonId);
      return 'http://www.amazon.com/gp/dmusic/get_sample_url.html/ref=dm_dp_trk_' + amazonId + '?ie=UTF8&ASIN=' + amazonId +'&DownloadLocation=WEBSITE'
    };

    $scope.getNextSong = function() {
      //console.log('requesting new song');
      var nextGenre = $rootScope.genreSelected;
      var nextQuestion = $rootScope.questionSelected;
      var nextRoundRequest = {'genre': nextGenre, 'question': nextQuestion};
      $rootScope.$emit('request-new-song', nextRoundRequest); // for chat
    }

    $scope.audioPlaylist = [];

    $timeout(function () {

      $rootScope.$on('next-song-to-play', function (e, data) {
        var url = $scope.getSongPlayerUrl(data.song.amazonId);
        var songToPlay = {
          src: url,
          type: 'audio/mp3',
          song_details: data.song,
          question: data.question,
          genre: data.genre
        };
        $scope.audioPlaylist.push(songToPlay);
        if ( !$scope.mediaPlayer.playing && !$rootScope.gameOnPause) {
          playSong($scope, $rootScope);
        }
      });

      $scope.mediaPlayer.on('ended', function(){
        $rootScope.$emit('round ended');
        $rootScope.$emit('reset countdown');
        $scope.audioPlaylist.shift();
        if ($scope.audioPlaylist.length > 0 && !$rootScope.gameOnPause) { 
          playSong($scope, $rootScope);
        }
        else {
          $scope.getNextSong(); 
        }         
      });


      $rootScope.$on('game restarted notice', function() {
        //console.log('player got game restarted notice');
        //$scope.getNextSong(); 
        if (!$scope.mediaPlayer.playing && $scope.audioPlaylist.length > 0)
          playSong($scope, $rootScope);
      });



    });
  });
