'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentExecutionsCtrl
 * @description
 * # DeploymentexecutionsCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentExecutionsCtrl', function ($scope, $routeParams, cloudifyClient, CloudifyService, $log) {

        $scope.deploymentId = $routeParams.deploymentId;
        $scope.executionsList = [];
        $scope.errorMessage = '';

        cloudifyClient.executions.list($scope.deploymentId)
            .then(function (httpResponse) {
                $scope.executionsList = httpResponse.data;
            },
            function (error) {
                $log.error(error);
                if (error.status === 404) {
                    $scope.deploymentNotFound = true;
                } else {
                    $scope.errorMessage = CloudifyService.getErrorMessage(error) ||  'deployment.executions.error';
                }
            });
    });
