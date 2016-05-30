'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:UpdateDeploymentDialogCtrl
 * @description
 * # UpdateDeploymentDialogCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
  .controller('UpdateDeploymentDialogCtrl', function ($scope, cloudifyClient, ngProgress, $timeout) {
        var deploymentId = $scope.$parent.deployment.id;
        $scope.focusInput = function(){
            $timeout(function(){
                $('.browseTxt:first-child')[0].focus();
            });
        };

        $scope.isUpdateEnabled = function(){
            if($scope.isCustomWorkflow){
                return !!$scope.archive && !!$scope.workflowId;
            }else{
                return !!$scope.archive;
            }
        };

        $scope.updateDeployment = function(){
            $scope.inProcess = true;
            ngProgress.start();
            var executionOptions = {};
            if($scope.isCustomWorkflow){
                executionOptions.workflowId = $scope.workflowId;
            } else{
                executionOptions.skipInstall = !$scope.installAdded;
                executionOptions.skipUninstall = !$scope.uninstallRemoved;
            }
            cloudifyClient.deploymentUpdates.update(deploymentId, $scope.archive, $scope.inputs, $scope.fileName, executionOptions)
                .then(function(){
                    $scope.closeThisDialog();
                },function(updateError){
                    $scope.updateError = updateError.data.message;
                }).finally(function(){
                    $scope.inProcess = false;
                    ngProgress.reset();
                });
        };
    });
