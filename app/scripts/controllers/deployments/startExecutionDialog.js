'use strict';

angular.module('cosmoUiApp')
    .controller('StartExecutionDialogCtrl', function ($scope, cloudifyClient) {

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

        $scope.executeWorkflow = function ( force ) {
            $scope.inProcess = true;
            cloudifyClient.executions.start( $scope.deploymentId, $scope.workflow.name, JSON.parse($scope.rawString), false, force )
                .then(function (result) {
                    var data = result.data;
                    $scope.inProcess = false;
                    if (data.hasOwnProperty('message')) {
                        $scope.setErrorMessage(data.message);
                    } else {
                        $scope.closeThisDialog();
                    }
                }, function (e) {
                    $scope.setErrorMessage(e.data.message);
                    $scope.inProcess = false;
                });
        };



    });
