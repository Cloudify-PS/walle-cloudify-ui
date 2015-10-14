'use strict';

angular.module('cosmoUiApp')
    .service('EventsMap', function EventsMap($filter) {

        var eventsMap = {
            'workflow_received': {
                text: 'Workflow received',
                icon: 'icon-gs-workflow-stage',
                class: 'event-text-green'
            },
            'workflow_started': {
                text: 'Workflow started',
                icon: 'icon-gs-workflow-started',
                class: 'event-text-green'
            },
            'workflow_initializing_policies': {
                text: 'Workflow initializing policies',
                icon: 'icon-gs-workflow-stage',
                class: 'event-text-green'
            },
            'workflow_initializing_node': {
                text: 'Workflow initializing node',
                icon: 'icon-gs-workflow-stage',
                class: 'event-text-green'
            },
            'workflow_succeeded': {
                text: 'Workflow ended successfully',
                icon: 'icon-gs-workflow-success',
                class: 'event-text-green'
            },
            'workflow_failed': {
                text: 'Workflow failed',
                icon: 'icon-gs-workflow-failed',
                class: 'event-text-red'
            },
            'workflow_cancelled': {
                text: 'Workflow Cancelled',
                icon: 'icon-gs-workflow-cancelled',
                class: 'event-text-red'
            },
            'workflow_stage': {
                text: 'Workflow staged',
                icon: 'icon-gs-workflow-stage',
                class: 'event-text-green'
            },
            'task_started': {
                text: 'Task started',
                icon: 'icon-gs-task-started',
                class: 'event-text-green'
            },
            'sending_task': {
                text: 'Task sent',
                icon: 'icon-gs-task-sent',
                class: 'event-text-green'
            },
            'task_received': {
                text: 'Task received',
                icon: 'icon-gs-task-recieved',
                class: 'event-text-green'
            },
            'task_succeeded': {
                text: 'Task ended successfully',
                icon: 'icon-gs-task-success',
                class: 'event-text-green'
            },
            'task_failed': {
                text: 'Task failed',
                icon: 'icon-gs-task-failed',
                class: 'event-text-red'
            },
            'task_rescheduled': {
                text: 'Task rescheduled',
                icon: 'icon-gs-task-retry',
                class: 'event-text-red'
            },
            'task_retried': {
                text: 'Task retried',
                icon: 'icon-gs-task-retried',
                class: 'event-text-red'
            },
            'policy_success': {
                text: 'Policy end successfully started',
                icon: 'icon-gs-policy-success',
                class: 'event-text-green'
            },
            'policy_failed': {
                text: 'Policy failed',
                icon: 'icon-gs-policy-failed',
                class: 'event-text-red'
            }
        };

        var getFailedTaskIcon = function(event) {
            // todo: CFY-2437
            // this is a hack fix for 3.2 and should be refactored properly when the core can provide more info on the task context so there
            // won't be the need to search the message text.
            if (event._source.message.text.indexOf('NonRecoverable') !== -1) {
                // this is a non recoverable failed task - return the default task_failed icon
                return eventsMap.task_failed.icon;
            }

            // if we got here, this is a recoverable failed task so we need to check it's context for retries
            if (event._source.context.task_total_retries === -1 || event._source.context.task_total_retries - event._source.context.task_current_retries > 0) {
                // task will be retried, return the task_retried icon
                return eventsMap.task_retried.icon;
            } else {
                // task retry count was maxed out - return task_failed icon
                return eventsMap.task_failed.icon;
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
            if (!event) {
                return 'gs-icon-logs';
            }

            var eventType = event._source.event_type;

            if(eventsMap.hasOwnProperty(eventType)) {
                if (eventType === 'task_failed') {
                    return getFailedTaskIcon(event);
                } else {
                    return eventsMap[eventType].icon;
                }
            }

            return 'gs-icon-logs';
        };

        this.getFormattedTimestamp = function(timestamp){
            return  $filter('dateFormat')(timestamp, 'yyyy-MM-dd HH:mm:ss');
        };
    });
