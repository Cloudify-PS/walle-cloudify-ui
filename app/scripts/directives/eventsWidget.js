'use strict';

angular.module('cosmoUi')
    .directive('eventsWidget', function () {
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
                            '<td>' +
                                '<div id="event-icon"></div>' +
                                '<div id="event-type">{{event.type}}</div>' +
                                '<div id="event-workflow">{{event.workflow}}</div>' +
                            '</td>' +
                        '</tr>' +
                    '</table>' +
                '</div>' +
                '</div>',
            restrict: 'EA',
            scope: {
                events: '@'
            },
            link: function postLink(scope) {

                scope.widgetOpen = false;
                scope.events = [
                    {
                        icon: '',
                        type: '1',
                        node: '1',
                        task: '1',
                        workflow: '1'
                    },
                    {
                        icon: '',
                        type: '2',
                        node: '2',
                        task: '2',
                        workflow: '2'
                    },
                    {
                        icon: '',
                        type: '3',
                        node: '3',
                        task: '3',
                        workflow: '3'
                    },
                    {
                        icon: '',
                        type: '4',
                        node: '4',
                        task: '4',
                        workflow: '4'
                    },
                    {
                        icon: '',
                        type: '5',
                        node: '5',
                        task: '5',
                        workflow: '5'
                    }
                ];

                scope.isOpen = function() {
                    return scope.widgetOpen;
                };

                scope.toggleWidget = function() {
                    scope.widgetOpen = !scope.widgetOpen;
                };
            }
        };
    });
