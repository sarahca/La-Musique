'use strict';

angular.module('lamusiqueApp')
  .controller('RegisterCtrl', function ($scope, $http, socket, $timeout, $rootScope) {

    $scope.registerSubmit = function(isValid) {
      console.log('trying to submit');
      if (isValid) {
        console.log('great form');
        $http.post('/api/user/register',
         {'username': $scope.user.username,
          'email': $scope.user.email,
          'password': $scope.user.password}).
        success(function(data, status, headers, config) {
          console.log(data);
          $rootScope.$broadcast("userLoggedIn", data);
        }).
        error(function(data, status, headers, config) {
          console.log(data.message);
        });
      }
    }
  })

  // .directive('repeatPassword', function() {
  //   return {
  //     require: 'ngModel',
  //     link: function(scope, elem, attrs, ctrl) {
  //       console.log(elem);
  //       var otherInput = elem.inheritedData("$formController")[repeatPassword];

  //       ctrl.$parsers.push(function(value) {
  //         if (value === otherInput.$viewValue) {
  //           ctrl.$setValidity('repeat', true);
  //           return value;
  //         }
  //         ctrl.$setValidity('repeat', false);
  //         console.log('not the same');
  //       });

  //       otherInput.$parsers.push(function(value) {
  //         ctrl.$setValidity('repeat', value === ctrl.$viewValue);
  //         return value;
  //       });
  //     }
  //   };
  // });

  // .directive('compareTo',function() {
  //   return {
  //       require: "ngModel",
  //       scope: {
  //           otherModelValue: "=compareTo"
  //       },
  //       link: function(scope, element, attributes, ngModel) { 
  //           element.bind('blur', function () {
  //              ngModel.$validators.compareTo = function(modelValue) {
  //               return modelValue == scope.otherModelValue;
  //           };
  //         });           
  //           scope.$watch("otherModelValue", function() {
  //               ngModel.$validate();
  //           });
  //       }
  //   };
  // });

  // $timeout( function () {
  //     var confirmPassword = angular.element('#confirmPassword');
  //     var password = angular.element('#password');
  //     el.bind('blur', function () {
        
  //     });
  // });

 
//module.directive("compareTo", compareTo);