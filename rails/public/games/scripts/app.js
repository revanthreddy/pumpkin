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

app.config( ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
        .when('/', {
            templateUrl: 'games/index.html',
            //controller: 'loginCtrl',
            //access: access.visitor
        });
    // .when('/logout', {
    //   templateUrl: 'views/logout.html',
    //   //controller: 'logoutCtrl',
    //   access: access.visitor
    // })

    // .otherwise({
    //   redirectTo: '/'
    // });
}]);



app.run(['$rootScope', '$location', '$http', function($rootScope, $location, $http) {
$.material.init();
$rootScope.socket = io.connect("http://revanthreddy.koding.io:3000/");
$rootScope.firstTime = true;

$rootScope.PUBNUB_demo = PUBNUB.init({
          publish_key: 'pub-c-36c7caed-38c0-4cfc-b283-1e63c8169d1f',
    subscribe_key: 'sub-c-796bc1de-7e48-11e4-baaa-02ee2ddab7fe'
        });

     
}]);