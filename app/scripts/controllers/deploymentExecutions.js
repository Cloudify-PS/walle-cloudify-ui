'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentExecutionsCtrl
 * @description
 * # DeploymentexecutionsCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentExecutionsCtrl', function ($scope, $routeParams) {

        $scope.deploymentId = $routeParams.deploymentId;
        $scope.executionsList = [];

        $scope.$on('deploymentExecution', function(event, deploymentExecution){
            $scope.executionsList = deploymentExecution.executionsList;
        });

    });
