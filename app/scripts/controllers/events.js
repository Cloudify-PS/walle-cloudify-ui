'use strict';

angular.module('cosmoUi')
    .controller('EventsCtrl', function ($scope, $cookieStore, RestService) {

        var eventCSSMap = {
            'workflow_started': {text: 'Workflow started', icon: 'event-icon-workflow-started', class: 'event-text-green'},
            'workflow_initializing_policies': {text: 'Workflow initializing policies', icon: 'event-icon-workflow-started', class: 'event-text-green'},
            'workflow_initializing_node': {text: 'Workflow initializing node', icon: 'event-icon-workflow-started', class: 'event-text-green'},
            'workflow_success': {text: 'Workflow end successfully', icon: 'event-icon-workflow-end-successfully', class: 'event-text-green'},
            'workflow_failed': {text: 'Workflow failed', icon: 'event-icon-workflow-failed', class: 'event-text-red'},
            'task_started': {text: 'Task started', icon: 'event-icon-task-started', class: 'event-text-green'},
            'sending_task': {text: 'Task sent', icon: 'event-icon-task-sent', class: 'event-text-green'},
            'task_received': {text: 'Task received', icon: 'event-icon-task-sent', class: 'event-text-green'},
            'task_succeeded': {text: 'Task end successfully', icon: 'event-icon-task-success', class: 'event-text-green'},
            'task_failed': {text: 'Task failed', icon: 'event-icon-task-failed', class: 'event-text-red'},
            'policy_success': {text: 'Policy end successfully started', icon: 'event-icon-policy-success', class: 'event-text-green'},
            'policy_failed': {text: 'Policy failed', icon: 'event-icon-policy-failed', class: 'event-text-red'}
        };

        $scope.events = [];
        var eventsReqObj = {
            id: $cookieStore.get('lastExecutedPlan'),
            from: $cookieStore.get('lastEventLoaded')
        };

        RestService.loadEvents(eventsReqObj)
            .then(function(data) {
                if (data.id !== undefined && data.lastEvent !== undefined) {
                    //$cookieStore.put('lastExecutedPlan', data.id);
                    $cookieStore.put('lastExecutedPlan', data.name);
                    $cookieStore.put('lastEventLoaded', data.lastEvent);

                    $scope.events = $scope.events.concat(data.events);
                    for (var i = 0; i < $scope.events.length; i++) {
                        $scope.events[i] = JSON.parse($scope.events[i]);
                    }
                }
            });

        $scope.getEventClass = function(event) {
            var eventClass = eventCSSMap[getEventMapping(event)].class;

            return eventClass;
        };

        $scope.getEventIcon = function(event) {
            var iconClass = eventCSSMap[getEventMapping(event)].icon;

            return iconClass;
        };

        $scope.getEventText = function(event) {
            var eventText = eventCSSMap[getEventMapping(event)].text;

            return eventText !== undefined ? eventText : event.type;
        };

        function getEventMapping(event) {
            var eventMap = '';

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
    });
