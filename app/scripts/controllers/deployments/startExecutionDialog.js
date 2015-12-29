'use strict';

angular.module('cosmoUiApp')
    .controller('StartExecutionDialogCtrl', function ($scope, cloudifyClient) {

        $scope.executeErrorMessage = null;
        $scope.inputs = {};
        $scope.inputsValid = false;

        // $scope.deployment.workflows --> expected to exist from parent scope
        $scope.workflowsList = _.map($scope.deployment.workflows, function (w) {
            return {label: w.name, value: w.name};
        });

        $scope.workflowName = null;

        $scope.$watch('workflowName', function () {
            if ($scope.workflowName) {
                $scope.workflow = _.find($scope.deployment.workflows, {name: $scope.workflowName.value});
            }
        });

        $scope.setErrorMessage = function (msg) {
            if ($scope.workflow) {
                $scope.executeErrorMessage = msg;
            }
        };

        $scope.isExecuteEnabled = function () {
            return !!$scope.inputsValid && !!$scope.workflow;
        };

        $scope.isParamsVisible = function () {
            return $scope.workflow && $scope.workflow.parameters && !_.isEmpty($scope.workflow.parameters);
        };

        $scope.executeWorkflow = function () {
            $scope.inProcess = true;
            cloudifyClient.executions.start($scope.deployment.id, $scope.workflow.name, JSON.parse($scope.rawString))
                .then(function (result) {
                    var data = result.data;
                    $scope.inProcess = false;
                    if (data.hasOwnProperty('message')) {
                        $scope.setErrorMessage(data.message);
                    } else {
                        $scope.closeThisDialog();
                        $scope.onBegin();
                    }
                }, function (e) {
                    $scope.setErrorMessage(e.data.message);
                    $scope.inProcess = false;
                });
        };

    });
