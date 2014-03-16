'use strict';

angular.module('cosmoUi')
    .directive('eventsWidget', function () {
        return {
            templateUrl: 'views/eventsWidgetTemplate.html',
            restrict: 'EA',
            require: '?ngModel',
            scope: {},
            link: function postLink(scope, element, attrs, ngModel) {

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

                /*function _reverse(array) {
                    var copy = [].concat(array);
                    return copy.reverse();
                }*/

                scope.widgetOpen = true;
                scope.eventsData = [];

                ngModel.$render = function(){
                    var data = ngModel.$viewValue || false;
                    try {
                        //scope.eventsData = _reverse(data);
                        scope.eventsData = data;
                    } catch(e) {}
                };


                scope.isOpen = function() {
                    return scope.widgetOpen;
                };

                scope.toggleWidget = function() {
                    scope.widgetOpen = !scope.widgetOpen;
                };

                scope.getEventIcon = function(event) {
                    if(eventCSSMap.hasOwnProperty(event)) {
                        return eventCSSMap[event].icon;
                    }
                };

                scope.getEventText = function(event) {
                    if(eventCSSMap.hasOwnProperty(event)) {
                        return eventCSSMap[event].text;
                    }
                    return event;
                };

            }
        };
    });
