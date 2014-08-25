'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentmonitoringCtrl
 * @description
 * # DeploymentmonitoringCtrl
 * Controller of the cosmoUiAppApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentMonitoringCtrl', function ($scope, $routeParams) {

        $scope.deploymentId = $routeParams.deploymentId;

        $scope.$on('deploymentData', function(event, deploymentData){
            console.log(['deploymentData', deploymentData]);
        });

    });
