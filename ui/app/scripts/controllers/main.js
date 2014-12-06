'use strict';

/**
 * @ngdoc function
 * @name pumpkinApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pumpkinApp
 */
angular.module( 'pumpkinApp', [ 'ngMaterial' ] )
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
