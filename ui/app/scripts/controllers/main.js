'use strict';

/**
 * @ngdoc function
 * @name pumpkinApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pumpkinApp
 */
app.controller('MainCtrl', [
        '$scope',
        function($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            this.name = 'Angularjs Drag&Drop';

            this.persons = [{
                name: 'Ciul',
                job: 'developer'
            }, {
                name: 'Jose',
                job: 'designer'
            }, {
                name: 'Carlos',
                job: 'sales'
            }];

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
                target.addClass('drop');
            });
        }
    ]);
