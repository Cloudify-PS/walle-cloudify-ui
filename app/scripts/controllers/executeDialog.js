'use strict';

angular.module('cosmoUiApp')
    .controller('ExecuteDialogCtrl', function ($scope, CloudifyService) {
        $scope.executeErrorMessage = null;
        $scope.inputs = {};
        $scope.inputsValid = false;

        $scope.setErrorMessage = function(msg){
            $scope.executeErrorMessage = msg;
        };

        $scope.isExecuteEnabled = function() {
            return $scope.inputsValid;
        };

        $scope.isParamsVisible = function() {
            return $scope.workflow && $scope.workflow.parameters && !_.isEmpty($scope.workflow.parameters);
        };

        $scope.executeWorkflow = function() {
            var params = {
                deployment_id: $scope.deploymentId,
                workflow_id: $scope.workflow.name,
                inputs:  JSON.parse($scope.rawString)
            };

            if ($scope.isExecuteEnabled()) {
                $scope.inProcess = true;
                CloudifyService.deployments.execute(params)
                    .then(function (data) {
                        $scope.inProcess = false;
                        if (data.hasOwnProperty('message')) {
                            $scope.setErrorMessage(data.message);
                        } else {
                            $scope.$emit('executionStarted', data);
                            $scope.closeThisDialog();
                        }
                    }, function (e) {
                        $scope.setErrorMessage(e.data.message);
                    });
            }
        };

        $scope.cancelWorkflow = function(deployment_id) {
            var execution = $scope.getExecution(deployment_id);
            if ( !execution ){
                return;
            }

            var execution_id = execution.id;
            var callParams = {
                'execution_id': execution_id,
                'state': 'cancel'
            };
            CloudifyService.deployments.updateExecutionState(callParams).then(function (data) {
                if (data.hasOwnProperty('error_code')) {
                    $scope.setErrorMessage(data.message);
                }
                else {
                    $scope.closeThisDialog();
                }
            }, function(e) {
                $scope.setErrorMessage(e.data.message);

            });
        };


    });
