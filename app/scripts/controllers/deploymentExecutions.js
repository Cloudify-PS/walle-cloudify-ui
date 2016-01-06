'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentExecutionsCtrl
 * @description
 * # DeploymentexecutionsCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentExecutionsCtrl', function ($scope, $stateParams, cloudifyClient, CloudifyService, $log) {

        $scope.deploymentId = $stateParams.deploymentId;
        $scope.executionsList = [];
        $scope.errorMessage = '';

        cloudifyClient.executions.list({deployment_id: $scope.deploymentId})
            .then(function (httpResponse) {
                $scope.executionsList = httpResponse.data.items;
            },
            function (error) {
                $log.error(error);
                if (error.status === 404) {
                    $scope.deploymentNotFound = true;
                } else {
                    $scope.errorMessage = CloudifyService.getErrorMessage(error) || 'deployment.executions.error';
                }
            });
    });
