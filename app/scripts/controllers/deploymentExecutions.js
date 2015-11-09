'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentExecutionsCtrl
 * @description
 * # DeploymentexecutionsCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentExecutionsCtrl', function ($scope, $routeParams, cloudifyClient, $log) {

        $scope.deploymentId = $routeParams.deploymentId;
        $scope.executionsList = [];
        $scope.errorMessage = '';

        cloudifyClient.executions.list($scope.deploymentId)
            .then(function (httpResponse) {
                $scope.executionsList = httpResponse.data;
            },
            function (error) {
                if (error.status === 404) {
                    $scope.errorMessage = 'deployment.executions.error_404';
                } else {
                    $scope.errorMessage = 'deployment.executions.error';
                }
                $log.error(error);
            });
    });
