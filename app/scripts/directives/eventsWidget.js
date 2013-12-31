'use strict';

angular.module('cosmoUi')
    .directive('eventsWidget', function (RestService) {
        return {
            template: '<div class="events-widget">' +
                '<div id="events-widget-closed-tab" ng-show="!isOpen()" ng-click="toggleWidget()">' +
                    '<div id="events-widget-tab-text">Events ({{events.length}})</div>' +
                '</div>' +
                '<div id="events-widget-opened-widget" ng-show="isOpen()">' +
                    '<div id="events-widget-header">' +
                        'Events' +
                        '<div id="events-widget-header-close-button" ng-click="toggleWidget()">X</div>' +
                    '</div>' +
                    '<table id="events-widget-events-list">' +
                        '<tr ng-repeat="event in events">' +
                            '<td>{{event}}</td>' +
                        '</tr>' +
                    '</table>' +
                '</div>' +
                '</div>',
            restrict: 'EA',
            link: function postLink(scope) {
                scope.widgetOpen = false;
                scope.events = [1, 2, 3, 4, 5];

                scope.isOpen = function() {
                    return scope.widgetOpen;
                };

                scope.toggleWidget = function() {
                    scope.widgetOpen = !scope.widgetOpen;
                };

                function loadEvents( ){
                    RestService.loadEvents({ id : id, from: from })
                        .then(null, null, function(data) {
                            if (data.id !== undefined && data.lastEvent !== undefined) {

                                if (data.events && data.events.length > 0) {
                                    $scope.events = $scope.events.concat(data.events);

                                    for (var i = 0; i < $scope.events.length && i < 5; i++) {
                                        if (typeof($scope.events[0]) === 'string') {    // walkaround if the events returned as strings and not JSONs
                                            $scope.events[i] = JSON.parse($scope.events[i]);
                                        }
                                    }
                                }
                            }
                        });
                }

//                loadEvents();
            }
        };
    });
