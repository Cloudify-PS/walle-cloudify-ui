'use strict';

angular.module('cosmoUi')
    .controller('EventsCtrl', function ($scope/*, RestService*/) {
        $scope.events = [
            {
                'type': 'Workflow started',
                'node': '',
                'task': '',
                'workflow': 'Install',
                'date': new Date().getTime()
            },
            {
                'type': 'Workflow end successfully',
                'node': 'web host',
                'task': 'creat-Nova host plugin',
                'workflow': 'Install',
                'date': new Date().getTime()
            },
            {
                'type': 'Workflow failed',
                'node': '',
                'task': 'creat-Nova host plugin',
                'workflow': 'Install',
                'date': new Date().getTime()
            },
            {
                'type': 'Task sent',
                'node': 'web host',
                'task': 'creat-Nova host plugin',
                'workflow': 'Failed',
                'date': new Date().getTime()
            },
            {
                'type': 'Task started',
                'node': 'web host',
                'task': 'creat-Nova host plugin',
                'workflow': 'Failed',
                'date': new Date().getTime()
            },
            {
                'type': 'Task success',
                'node': 'web host',
                'task': 'creat-Nova host plugin',
                'workflow': 'Failed',
                'date': new Date().getTime()
            },
            {
                'type': 'Task failed',
                'node': '',
                'task': '',
                'workflow': 'Install',
                'date': new Date().getTime()
            },
            {
                'type': 'Policy event success',
                'node': '',
                'task': '',
                'workflow': 'Install',
                'date': new Date().getTime()
            },
            {
                'type': 'Policy event failed',
                'node': 'web host',
                'task': 'creat-Nova host plugin',
                'workflow': 'Install',
                'date': new Date().getTime()
            },
            {
                'type': 'Workflow failed',
                'node': '',
                'task': '',
                'workflow': 'Install',
                'date': new Date().getTime()
            },
            {
                'type': 'Task started',
                'node': 'web host',
                'task': 'creat-Nova host plugin',
                'workflow': 'Failed',
                'date': new Date().getTime()
            },
            {
                'type': 'Task sent',
                'node': 'web host',
                'task': 'creat-Nova host plugin',
                'workflow': 'Install',
                'date': new Date().getTime()
            }
        ];
        //$scope.events = RestService.loadEvents();

        $scope.getEventClass = function(event) {
            var eventClass = 'event-text-green';
            switch (event.type) {
            case 'Workflow started':
            case 'Workflow end successfully':
            case 'Task started':
            case 'Task sent':
            case 'Task success':
            case 'Policy event success':
                eventClass = 'event-text-green';
                break;
            case 'Workflow failed':
            case 'Policy event failed':
            case 'Task failed':
                eventClass = 'event-text-red';
                break;
            }
            return eventClass;
        };

        $scope.getEventIcon = function(event) {
            var iconClass = 'event-icon-workflow-started';
            switch (event.type) {
            case 'Workflow started':
                iconClass = 'event-icon-workflow-started';
                break;
            case 'Workflow end successfully':
                iconClass = 'event-icon-workflow-end-successfully';
                break;
            case 'Workflow failed':
                iconClass = 'event-icon-workflow-failed';
                break;
            case 'Task started':
                iconClass = 'event-icon-task-started';
                break;
            case 'Task sent':
                iconClass = 'event-icon-task-sent';
                break;
            case 'Task failed':
                iconClass = 'event-icon-task-failed';
                break;
            case 'Task success':
                iconClass = 'event-icon-task-success';
                break;
            case 'Policy event success':
                iconClass = 'event-icon-policy-success';
                break;
            case 'Policy event failed':
                iconClass = 'event-icon-policy-failed';
                break;
            }
            return iconClass;
        };
    });
