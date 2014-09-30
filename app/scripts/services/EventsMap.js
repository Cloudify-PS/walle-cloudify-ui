'use strict';

angular.module('cosmoUiApp')
    .service('EventsMap', function EventsMap() {

        var eventsMap = {
            'workflow_received': {
                text: 'Workflow received',
                icon: 'event-icon-workflow-stage',
                class: 'event-text-green'
            },
            'workflow_started': {
                text: 'Workflow started',
                icon: 'event-icon-workflow-started',
                class: 'event-text-green'
            },
            'workflow_initializing_policies': {
                text: 'Workflow initializing policies',
                icon: 'event-icon-workflow-stage',
                class: 'event-text-green'
            },
            'workflow_initializing_node': {
                text: 'Workflow initializing node',
                icon: 'event-icon-workflow-stage',
                class: 'event-text-green'
            },
            'workflow_succeeded': {
                text: 'Workflow end successfully',
                icon: 'event-icon-workflow-end-successfully',
                class: 'event-text-green'
            },
            'workflow_failed': {
                text: 'Workflow failed',
                icon: 'event-icon-workflow-failed',
                class: 'event-text-red'
            },
            'workflow_cancelled': {
                text: 'Workflow Cancelled',
                icon: 'event-icon-workflow-cancelled',
                class: 'event-text-red'
            },
            'workflow_stage': {
                text: 'Workflow Stage',
                icon: 'event-icon-workflow-stage',
                class: 'event-text-green'
            },
            'task_started': {
                text: 'Task started',
                icon: 'event-icon-task-started',
                class: 'event-text-green'
            },
            'sending_task': {
                text: 'Task sent',
                icon: 'event-icon-task-sent',
                class: 'event-text-green'
            },
            'task_received': {
                text: 'Task received',
                icon: 'event-icon-task-sent',
                class: 'event-text-green'
            },
            'task_succeeded': {
                text: 'Task end successfully',
                icon: 'event-icon-task-success',
                class: 'event-text-green'
            },
            'task_failed': {
                text: 'Task failed',
                icon: 'event-icon-task-failed',
                class: 'event-text-red'
            },
            'task_retried': {
                text: 'Task Retried',
                icon: 'event-icon-task-retried',
                class: 'event-text-red'
            },
            'policy_success': {
                text: 'Policy end successfully started',
                icon: 'event-icon-policy-success',
                class: 'event-text-green'
            },
            'policy_failed': {
                text: 'Policy failed',
                icon: 'event-icon-policy-failed',
                class: 'event-text-red'
            }
        };

        this.getEvent = function(event) {
            if(eventsMap.hasOwnProperty(event)) {
                return eventsMap[event];
            }
        };

        this.getEventsList = function() {
            return eventsMap;
        };

        this.getEventText = function(event) {
            if(eventsMap.hasOwnProperty(event)) {
                return eventsMap[event].text;
            }
            return event;
        };

        this.getEventIcon = function(event) {
            if(eventsMap.hasOwnProperty(event)) {
                return eventsMap[event].icon;
            }
            return 'gs-icon-logs';
        };

    });
