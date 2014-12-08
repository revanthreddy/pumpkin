'use strict';

/**
 * @ngdoc function
 * @name pumpkinApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pumpkinApp
 */
app.controller('MainCtrl', [
    '$scope', '$http', '$timeout', '$routeParams', '$rootScope',
    function($scope, $http, $timeout, $routeParams, $rootScope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        if ($rootScope.firstTime == true) {
            $rootScope.firstTime = false;
            $timeout(function() {
                alert('you finished!');
            }, 61000);
        }


        // GET GAME STATE FROM REVANTH
        function pub() {
            $rootScope.PUBNUB_demo.publish({
                channel: 'start_game',
                message: {
                    "game_id": $routeParams.game_id,
                    "players": $routeParams.players
                }
            });
        }

        $rootScope.PUBNUB_demo.subscribe({
            channel: $routeParams.game_id,
            callback: function(m) {
                alert(m);
                // $location.path('/');
            },
            connect: pub
        });

       

        console.log($routeParams.game_id);
        // socket.on('', function(data) {
        //     alert(data.game_id);
        // });

        // SEND EVENT DATA

        // LISTEN FOR GAME START FROM REVANTH

        // HARDCODE
        $scope.testInfo = {
            "_id": 1237287234848,
            "quiz": {
                "id": 1234,
                "title": "Disney Animals and Owners",
                "terms": [{
                    "id": 2005281693,
                    "term": "Abu",
                    "definition": "Monkey",
                    "image": {
                        "url": "https://farm8.staticflickr.com/7054/6930602973_91256bf5fd_m.jpg",
                        "width": 240,
                        "height": 160
                    },
                    "easy": true,
                    "medium": false,
                    "hard": false
                }, {
                    "id": 2005280218,
                    "term": "Pluto",
                    "definition": "Dog",
                    "image": "https://farm8.staticflickr.com/7054/6930602973_91256bf5fd_m.jpg",
                    "easy": false,
                    "medium": false,
                    "hard": true
                }]
            },
            "game_id": 1237287234848,
            "players": [{
                "id": 1234,
                "name": "Milan"
            }, {
                "id": 1234,
                "name": "Revanth"
            }]
        };

        $scope.setDifficulty = function() {
            console.log('made it');
            return "";
        };

        $scope.questions = $scope.testInfo.quiz.terms;
        //console.log($scope.questions);
        // HARDCODE

        this.name = 'Angularjs Drag&Drop';

        // this.persons = [{
        //     name: 'Ciul',
        //     job: 'developer'
        // }, {
        //     name: 'Jose',
        //     job: 'designer'
        // }, {
        //     name: 'Carlos',
        //     job: 'sales'
        // }];

        this.animals = [{
            name: 'Hercules',
            type: 'dog'
        }, {
            name: 'Jimmy',
            type: 'parrot'
        }, {
            name: 'Missy',
            type: 'cat'
        }];

        this.status = 'awaiting for something to be dragged :]';

        /**
         * onDrag
         */
        this.onDragStart = angular.bind(this, function(ev) {
            this.status = 'drag started!';
        });

        /**
         * onDragEnter
         */
        this.onDragEnter = angular.bind(this, function(ev) {
            var target = angular.element(ev.target);
            target.removeClass('drop');
            target.addClass('over');
        });

        /**
         * onDragLeave
         */
        this.onDragLeave = angular.bind(this, function(ev) {
            var target = angular.element(ev.target);
            target.removeClass('over');
            target.removeClass('drop');
        });

        /**
         * onDrop
         */
        this.onDrop = angular.bind(this, function(data, ev) {
            this.status = 'dropped';
            this.dropped = data;
            var target = angular.element(ev.target);
            target.removeClass('over');
            console.log("this is where the magic happens");
            target.addClass('drop');
            console.log(target);
            if (target.context.children.length == 0) {
                //console.log('just the image');
                target.parent().addClass('drop');
                $timeout(function() {
                    target.parent().addClass('animated');
                    target.parent().addClass('zoomOut');
                }, 300);
            } else {
                //console.log('WHOLE TOMATO');
                $timeout(function() {
                    target.addClass('animated');
                    target.addClass('zoomOut');
                }, 300);

            }
            // $timeout(function() {
            //     target.addClass('animated');
            //     target.addClass('zoomOut');
            // }, 300);

            //target.detach();
        });
    }
]);
