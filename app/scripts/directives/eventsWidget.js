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
                        '<div id="event-widget-header-text">Events</div>' +
                        '<div id="events-widget-header-close-button" ng-click="toggleWidget()"></div>' +
                    '</div>' +
                    '<div id="events-widget-list-container">' +
                        '<table id="events-widget-events-list">' +
                            '<tr ng-repeat="event in events">' +
                                '<td>' +
                                    '<div id="event-icon" ng-class="getEventIcon(event)"></div>' +
                                    '<div id="event-type">{{getEventText(event)}}</div>' +
                                    '<div id="event-time">{{event.timestamp}}</div>' +
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
                '</div>',
            restrict: 'EA',
            scope: {
                events: '@'
            },
            link: function postLink(scope) {

                var eventCSSMap = {
                    'workflow_received': {text: 'Workflow received', icon: 'event-icon-workflow-started', class: 'event-text-green'},
                    'workflow_started': {text: 'Workflow started', icon: 'event-icon-workflow-started', class: 'event-text-green'},
                    'workflow_initializing_policies': {text: 'Workflow initializing policies', icon: 'event-icon-workflow-started', class: 'event-text-green'},
                    'workflow_initializing_node': {text: 'Workflow initializing node', icon: 'event-icon-workflow-started', class: 'event-text-green'},
                    'workflow_success': {text: 'Workflow end successfully', icon: 'event-icon-workflow-end-successfully', class: 'event-text-green'},
                    'workflow_failed': {text: 'Workflow failed', icon: 'event-icon-workflow-failed', class: 'event-text-red'},
                    'workflow_stage': {text: 'Workflow Stage', icon: 'event-icon-task-sent', class: 'event-text-green'},
                    'task_started': {text: 'Task started', icon: 'event-icon-task-started', class: 'event-text-green'},
                    'sending_task': {text: 'Task sent', icon: 'event-icon-task-sent', class: 'event-text-green'},
                    'task_received': {text: 'Task received', icon: 'event-icon-task-sent', class: 'event-text-green'},
                    'task_succeeded': {text: 'Task end successfully', icon: 'event-icon-task-success', class: 'event-text-green'},
                    'task_failed': {text: 'Task failed', icon: 'event-icon-task-failed', class: 'event-text-red'},
                    'policy_success': {text: 'Policy end successfully started', icon: 'event-icon-policy-success', class: 'event-text-green'},
                    'policy_failed': {text: 'Policy failed', icon: 'event-icon-policy-failed', class: 'event-text-red'}
                };

                scope.widgetOpen = false;

                scope.$watch('events', function(data) {
                    if(data !== '[]') {
                        scope.events = JSON.parse(data);
                    }
                });

                scope.isOpen = function() {
                    return scope.widgetOpen;
                };

                scope.toggleWidget = function() {
                    scope.widgetOpen = !scope.widgetOpen;
                };

                scope.getEventIcon = function(event) {
                    return _getCssMapField( event, 'icon');
                };

                scope.getEventText = function(event) {
                    return _getCssMapField( event, 'text') || event.type;
                };

                function _getCssMapField( event, field ){
                    var eventMapping = getEventMapping(event);
                    if ( !!eventMapping && eventCSSMap.hasOwnProperty(eventMapping) ){
                        return eventCSSMap[eventMapping][field];
                    }else{
                        console.log([event, 'does not have field', field]);
                        return '';
                    }
                }

                function getEventMapping(event) {
                    var eventMap;

                    if (event.type === 'policy') {
                        if (event.policy === 'start_detection_policy') {
                            eventMap = 'policy_success';
                        } else if (event.policy === 'failed_detection_policy') {
                            eventMap = 'policy_failed';
                        }
                    } else if (event.type === 'workflow_stage') {
                        if (event.stage.indexOf('Loading blueprint') !== -1) {
                            eventMap = 'workflow_started';
                        } else if (event.stage.indexOf('executed successfully') !== -1) {
                            eventMap = 'workflow_success';
                        } else if (event.stage.indexOf('Initializing monitoring policies') !== -1) {
                            eventMap = 'workflow_initializing_policies';
                        } else if (event.stage.indexOf('Initializing node') !== -1) {
                            eventMap = 'workflow_initializing_node';
                        }
                    } else if (eventCSSMap[event.type] !== undefined) {
                        eventMap = event.type;
                    }

                    return eventMap !== undefined ? eventMap : event.type;
                }
            }
        };
    });
