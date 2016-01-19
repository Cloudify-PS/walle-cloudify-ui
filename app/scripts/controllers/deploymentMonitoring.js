'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:DeploymentmonitoringCtrl
 * @description
 * # DeploymentmonitoringCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentMonitoringCtrl', function ($scope, $stateParams) {

        $scope.deploymentId = $stateParams.deploymentId;

        $scope.grafanaDashboard = '/grafana/#/dashboard/cloudify/' + $scope.deploymentId;

        $scope.showGrafanaLoader = true;

        $scope.grafanaLoad = function () {
            $scope.showGrafanaLoader = false;
        };

    });

