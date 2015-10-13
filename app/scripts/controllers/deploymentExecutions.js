'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentExecutionsCtrl
 * @description
 * # DeploymentexecutionsCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentExecutionsCtrl', function ($scope, $routeParams, cloudifyClient) {

        $scope.deploymentId = $routeParams.deploymentId;
        $scope.executionsList = [];

        cloudifyClient.executions.list($scope.deploymentId)
            .then(function(httpResponse){
                $scope.executionsList = httpResponse.data;
            },function(httpResponse){
                console.error(httpResponse);
            });
    });
