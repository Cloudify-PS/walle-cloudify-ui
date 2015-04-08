'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:dialogs/DeploymentDetailsCtrl
 * @description
 * # dialogs/DeploymentDetailsCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
  .controller('DeploymentDetailsCtrl', function ($scope, CloudifyService, $log) {
        $log.info('fetching outputs for ', $scope.deployment.id);
        CloudifyService.deployments.getOutputs( $scope.deployment.id).then(function( result ){
            $scope.outputs = result.data;
        },function(){
            $scope.error = result.data.message || 'Unknown error';
        });
  });
