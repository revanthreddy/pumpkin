'use strict';

/**
 * @ngdoc overview
 * @name pumpkinApp
 * @description
 * # pumpkinApp
 *
 * Main module of the application.
 */

 var app = angular
  .module('pumpkinApp', [ 'DragAndDrop', 'ngMaterial', 'timer', 'ngRoute' ]);

app.config( function() {

});

app.run(['$rootScope', '$location', '$http', function($rootScope, $location, $http) {
$.material.init();
$rootScope.socket = io.connect("http://revanthreddy.koding.io:3000/");
$rootScope.firstTime = true;
}]);