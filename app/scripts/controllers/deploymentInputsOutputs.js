'use strict';

/**
* @ngdoc function
* @name cosmoUiApp.controller:InputsOutputsCtrl
* @description
* # InputsOutputsCtrl
* Controller of the cosmoUiApp
*/
angular.module('cosmoUiApp')
  .controller('InputsOutputsCtrl', function ($scope,$routeParams,CloudifyService) {

        $scope.deploymentId = $routeParams.deploymentId;

        //get deployment inputs from deployment's data
        CloudifyService.deployments.getDeploymentById($scope.deploymentId).then(function (deployment) {
            if(!angular.equals({},deployment.inputs)){
                $scope.inputs = deployment.inputs;
            }
        }, function (result) {
            $scope.inputsError = result.data.info || 'General Error';
        });

        //get deployment outputs
        CloudifyService.deployments.getOutputs($scope.deploymentId).then(function (httpResponse) {
            if(!angular.equals({},httpResponse.data.outputs)) {
                $scope.outputs = httpResponse.data.outputs;
            }
        }, function (result) {
            $scope.outputsError = result.data.info || 'General Error';
        });
    });
