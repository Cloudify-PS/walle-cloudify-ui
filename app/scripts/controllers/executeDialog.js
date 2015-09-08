'use strict';

angular.module('cosmoUiApp')
    .controller('ExecuteDialogCtrl', function ($scope, CloudifyService, DIALOG_EVENTS) {

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
            return $scope.confirmationType !== 'cancel' && $scope.workflow && $scope.workflow.parameters && !_.isEmpty($scope.workflow.parameters);
        };

        $scope.executeWorkflow = function () {
            var params = {
                deployment_id: $scope.deploymentId,
                workflow_id: $scope.workflow.name,
                inputs: JSON.parse($scope.rawString)
            };

            $scope.inProcess = true;
            CloudifyService.deployments.execute(params)
                .then(function (data) {
                    $scope.inProcess = false;
                    if (data.hasOwnProperty('message')) {
                        $scope.setErrorMessage(data.message);
                    } else {
                        $scope.$emit(DIALOG_EVENTS.EXECUTION_STARTED);
                        $scope.closeThisDialog();
                    }
                }, function (e) {
                    $scope.setErrorMessage(e.data.message);
                    $scope.inProcess = false;
                });
        };

        $scope.cancelWorkflow = function() {
            var execution = $scope.currentExecution;
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
                    $scope.$emit(DIALOG_EVENTS.EXECUTION_CANCELED);
                    $scope.closeThisDialog();
                }
            }, function(e) {
                $scope.setErrorMessage(e.data.message);

            });
        };


    });
