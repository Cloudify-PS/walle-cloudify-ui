'use strict';

angular.module('cosmoUiApp')
    .controller('CancelExecutionDialogCtrl', function ($scope, cloudifyClient) {
        $scope.executeErrorMessage = null;

        $scope.setErrorMessage = function (msg) {
            $scope.executeErrorMessage = msg;
        };

        $scope.cancelWorkflow = function (force) {

            var execution = $scope.currentExecution;
            if (!execution) {
                return;
            }


            cloudifyClient.executions.cancel(execution.id, !!force).then(function (result) {
                var data = result.data;
                if (data.hasOwnProperty('error_code')) {
                    $scope.setErrorMessage(data.message);
                }
                else {
                    $scope.closeThisDialog();
                }
            }, function (e) {
                $scope.setErrorMessage(e.data.message);

            });
        };


    });
