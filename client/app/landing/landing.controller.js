'use strict';


angular.module('lamusiqueApp')
  .controller('LandingCtrl', function ( $scope, $http, socket, $timeout, $rootScope, $location, UserService) {
  $scope.user = UserService;
  $scope.inRegister =  false;

    $('#right-panel-link').panelslider({side: 'right', clickClose: false, duration: 700 });
    $('#right-panel-link').on('click', function(){
      $('.arrow-button').toggleClass("slideLeft");
    });    

    var controller = this;
    controller.saveUserDataOnLogin = $scope.user.saveUserDataOnLogin;
    $rootScope.channel = (Math.floor(Math.random()*100000)).toString();
    console.log('channel ' + $rootScope.channel);

    $timeout(function() {
      $http.get('/api/user/isLoggedIn')
        .success(function(data, status, headers, config) {
          controller.saveUserDataOnLogin(data);
          $http.get('/api/chat/channel')
            .success(function(data, status, headers, config) {
               $scope.redirect(data.channel);
            })
        })
    })

    $scope.redirect = function(channel){
      $location.path("/" + channel);
      console.log($location.path());
      $scope = $scope || angular.element(document).scope();
      if(!$scope.$$phase) {
        //this will kickstart angular  to notice the change
        $scope.$apply();
      }
    }
    
    $scope.enter = function() {
      $scope.redirect($rootScope.channel);
    };

    $scope.register = function() {
      $scope.inRegister =  true;
    }
    $scope.login = function() {
      $scope.inRegister =  false;
    }

    $rootScope.$on("userLoggedIn", function(e, data) {
      controller.saveUserDataOnLogin(data);
      $scope.enter();
    });
  });
