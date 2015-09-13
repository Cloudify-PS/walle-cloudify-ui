'use strict';

/**
* @ngdoc function
* @name cosmoUiApp.controller:InputsOutputsCtrl
* @description
* # InputsOutputsCtrl
* Controller of the cosmoUiApp
*/
angular.module('cosmoUiApp')
  .controller('InputsOutputsCtrl', function ($scope, $routeParams, cloudifyClient ) {

        $scope.deploymentId = $routeParams.deploymentId;

        //get deployment inputs from deployment's data
        cloudifyClient.deployments.get($scope.deploymentId).then(function (deployment) {
            if(!angular.equals({},deployment.inputs)){
                $scope.inputs = deployment.inputs;
            }
        }, function (result) {
            $scope.inputsError = result.data.info || 'General Error';
        });

        //get deployment outputs
        cloudifyClient.deployments.outputs.get($scope.deploymentId).then(function (httpResponse) {
            if(!angular.equals({},httpResponse.data.outputs)) {
                $scope.outputs = httpResponse.data.outputs;
            }
        }, function (result) {
            $scope.outputsError = result.data.info || 'General Error';
        });
    });
