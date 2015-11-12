'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentExecutionsCtrl
 * @description
 * # DeploymentexecutionsCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentExecutionsCtrl', function ($scope, $routeParams, cloudifyClient , $log) {

        $scope.deploymentId = $routeParams.deploymentId;
        $scope.executionsList = [];

        cloudifyClient.executions.list({deployment_id: $scope.deploymentId})
            .then(function(httpResponse){
                $scope.executionsList = httpResponse.data.items;
            },function(httpResponse){
                $log.error(httpResponse);
            });
    });
