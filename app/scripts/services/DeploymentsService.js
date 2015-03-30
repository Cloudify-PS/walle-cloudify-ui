'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.DeploymentsService
 * @description
 * # DeploymentsService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('DeploymentsService', function Deploymentsservice(RestLoader) {

        function _load(rest, params){
            return RestLoader.load(rest, params);
        }

        function _execute(params) {
            var callParams = {
                url: '/backend/executions/start',
                method: 'POST',
                data: {'deployment_id': params.deployment_id, 'workflow_id': params.workflow_id, parameters: params.inputs}
            };
            return _load('executions/start', callParams);
        }

        function _updateExecutionState(params) {
            var callParams = {
                url: '/backend/executions/update',
                method: 'POST',
                data: {'executionId': params.execution_id, 'state': params.state}
            };
            return _load('executions/update', callParams);
        }

        function _getDeploymentExecutions(params) {
            var callParams = {
                url: '/backend/executions',
                method: 'GET',
                params: {'deployment_id': params}
            };
            return _load('executions', callParams);
        }

        function _getDeploymentById(params) {
            var callParams = {
                url: '/backend/deployments/get',
                method: 'GET',
                params: {'deployment_id': params}
            };
            return _load('deployments/get', callParams);
        }

        function _deleteDeploymentById(params){
            var callParams = {
                url: '/backend/deployments/delete',
                method: 'POST',
                data: params
            };
            return _load('deployments/delete', callParams);
        }

        function _getDeploymentNodes(params) {
            var callParams = {
                url: '/backend/node-instances',
                method: 'GET',
                params: {'deployment_id': params}
            };
            return _load('node-instances', callParams);
        }


        this.execute = _execute;
        this.updateExecutionState = _updateExecutionState;
        this.getDeploymentExecutions = _getDeploymentExecutions;
        this.getDeploymentById = _getDeploymentById;
        this.deleteDeploymentById = _deleteDeploymentById;
        this.getDeploymentNodes = _getDeploymentNodes;

    });
