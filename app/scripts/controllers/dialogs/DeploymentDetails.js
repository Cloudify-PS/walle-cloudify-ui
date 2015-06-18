'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:dialogs/DeploymentDetailsCtrl
 * @description
 * # dialogs/DeploymentDetailsCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentDetailsCtrl', function ($scope, CloudifyService, $log, $filter) {
        $log.info('fetching outputs for ', $scope.deployment.id);

        $scope.load = function () {
            CloudifyService.deployments.getOutputs($scope.deployment.id).then(function (result) {
                $scope.outputs = result.data;
            }, function (result) {
                $scope.error = result.data.message || $filter('translate')('general.unknownError');
            });
        };

        $scope.load();
    });
