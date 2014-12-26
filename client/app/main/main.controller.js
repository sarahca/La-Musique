'use strict';



angular.module('lamusiqueApp')
  .controller('MainCtrl', function ($scope, $http, socket, $timeout, $rootScope) {
    console.log('in main ctrl');



    // $scope.awesomeThings = [];

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });

    // $scope.answer = 'your answer';
    // $scope.change = function(){
    //   if($scope.answer == "Poker Face"){
    //   $('#answerValidation').html('&#10004;');
    //   }else{
    //     $('#answerValidation').html('&#10008;');
    //   }
    // }
    // console.log(" $scope.answer = " +  $scope.answer);
    
    //Music Player
    // $scope.audioPlaylist = [];
    // $scope.audioPlaylist.push({
    //   src: 'http://d28julafmv4ekl.cloudfront.net/64%2F30%2F245665443_S64.mp3?response-content-type=audio%2Fmpeg&Expires=1418756329&Signature=fwDagSRoJ5jJFEHhr~RPmPngR0RFi5zTc9TRiCemyviFo239hUT8Rp7drLGt3Q896vKhKhTu2VyTZ9T0mSbbquVzCC80igjm2DYPBb2svsmcHdD9mBVk0hDSTZs95NdK1vz9wP1NSOspmzKz-HQAuGL1fRfx~YOf5awtGVAlz74_&Key-Pair-Id=APKAJVZTZLZ7I5XDXGUQ',
    //   type: 'audio/mp3'
    // });
    // $timeout(function () {
    //   $scope.audioPlaylist.unshift({
    //     src: 'http://www.amazon.com/gp/dmusic/get_sample_url.html/ref=dm_dp_trk_B001IXQU3O?ie=UTF8&ASIN=B001IXQU3O&DownloadLocation=WEBSITE',
    //     type: 'audio/ogg'
    //   });
    // }, 5500);
    // $timeout(function () {
    //   $scope.audioPlaylist.push({
    //     src: 'http://demos.w3avenue.com/html5-unleashed-tips-tricks-and-techniques/demo-audio.ogg',
    //     type: 'audio/ogg'
    //   });
    // }, 9500);


  });
