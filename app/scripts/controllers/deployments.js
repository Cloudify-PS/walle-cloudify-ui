'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore) {

        var eventCSSMap = {
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

        $scope.events = [];
        $scope.blueprints = $cookieStore.get('blueprints');
        $scope.selectedApp = '';
        $scope.filters = {
            'connections': 'on',
            'modules': 'on',
            'middleware': 'off',
            'compute': 'on',
            'network': 'on'
        };

        function loadDeployments(){
            RestService.loadDeployments()
                .then(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.blueprints[_getBlueprintIndex(data[i].blueprintId)].deployments.push(data[i]);
                    }
                });
        }

        function _getBlueprintIndex(blueprintId) {
            var blueprintIndex = -1;
            for (var j = 0; j < $scope.blueprints.length; j++) {
                if ($scope.blueprints[j].id === blueprintId) {
                    blueprintIndex = j;
                }
            }

            return blueprintIndex;
        }

        function _getCssMapField( event, field ){
            var eventMapping = getEventMapping(event);
            if ( !!eventMapping && eventCSSMap.hasOwnProperty(eventMapping) ){
                return eventCSSMap[eventMapping][field];
            }else{
                console.log([event, 'does not have field', field]);
                return '';
            }
        }

        $scope.showDeployments = function(appName) {
            if (appName === $scope.selectedApp) {
                $scope.selectedApp = '';
            } else {
                $scope.selectedApp = appName;
            }
        };

        $scope.executeDeployment = function(deployment) {
            RestService.executeBlueprint(deployment.id);
            $cookieStore.put('deploymentId', deployment.id);
        };

        loadDeployments();

    });
